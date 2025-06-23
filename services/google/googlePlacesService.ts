import axios from 'axios';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

if (!GOOGLE_API_KEY) {
  console.warn('Google Places API key not found. Please set EXPO_PUBLIC_GOOGLE_PLACES_API_KEY in your environment variables.');
}

// Supported regions configuration
export const SUPPORTED_REGIONS = {
  CA: ['ON', 'BC', 'AB', 'QC', 'NS', 'NB', 'MB', 'SK'], // Canada provinces
  US: ['NY', 'CA', 'FL', 'TX', 'WA', 'IL'], // US states
};

export const SUPPORTED_COUNTRIES = Object.keys(SUPPORTED_REGIONS);

// Types for address data
export interface AddressComponents {
  fullAddress: string;
  street: string;
  city: string;
  province: string;
  country: string;
  countryCode: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

export interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  addressData?: AddressComponents;
}

/**
 * Search for address suggestions using Google Places Autocomplete API
 * @param input - The text input from user
 * @param countryRestriction - Array of country codes to restrict search (e.g., ['ca', 'us'])
 * @returns Array of place predictions
 */
export const searchAddressSuggestions = async (
  input: string,
  countryRestriction: string[] = ['ca', 'us']
): Promise<PlacePrediction[]> => {
  if (!GOOGLE_API_KEY) {
    console.error('Google Places API key not configured');
    return [];
  }

  if (input.length < 3) {
    return [];
  }

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input: input.trim(),
          key: GOOGLE_API_KEY,
          components: countryRestriction.map(country => `country:${country}`).join('|'),
          types: 'address',
          language: 'en',
        },
      }
    );

    if (response.data.status === 'OK') {
      return response.data.predictions || [];
    } else if (response.data.status === 'ZERO_RESULTS') {
      return [];
    } else {
      console.error('Places Autocomplete API error:', response.data.status, response.data.error_message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    return [];
  }
};

/**
 * Get detailed place information using Place Details API
 * @param placeId - The place_id from autocomplete results
 * @returns Detailed place information
 */
export const getPlaceDetails = async (placeId: string): Promise<AddressComponents | null> => {
  if (!GOOGLE_API_KEY) {
    console.error('Google Places API key not configured');
    return null;
  }

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          key: GOOGLE_API_KEY,
          fields: 'address_components,formatted_address,geometry',
        },
      }
    );

    if (response.data.status === 'OK' && response.data.result) {
      return extractAddressComponents(response.data.result);
    } else {
      console.error('Place Details API error:', response.data.status, response.data.error_message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

/**
 * Extract and format address components from Google Places API response
 * @param placeResult - The result object from Place Details API
 * @returns Formatted address components
 */
export const extractAddressComponents = (placeResult: any): AddressComponents => {
  const components = placeResult.address_components || [];
  let street = '';
  let streetNumber = '';
  let route = '';
  let city = '';
  let province = '';
  let country = '';
  let countryCode = '';
  let postalCode = '';

  // Extract components based on Google's address component types
  components.forEach((component: any) => {
    const types = component.types;
    
    if (types.includes('street_number')) {
      streetNumber = component.long_name;
    }
    if (types.includes('route')) {
      route = component.long_name;
    }
    if (types.includes('locality') || types.includes('administrative_area_level_3')) {
      city = component.long_name;
    }
    if (types.includes('administrative_area_level_1')) {
      province = component.short_name; // Use short name for province codes (e.g., ON, BC)
    }
    if (types.includes('country')) {
      country = component.long_name;
      countryCode = component.short_name;
    }
    if (types.includes('postal_code')) {
      postalCode = component.long_name;
    }
  });

  // Combine street number and route
  street = [streetNumber, route].filter(Boolean).join(' ').trim();

  // Get coordinates if available
  const geometry = placeResult.geometry;
  const latitude = geometry?.location?.lat;
  const longitude = geometry?.location?.lng;

  return {
    fullAddress: placeResult.formatted_address || '',
    street,
    city,
    province,
    country,
    countryCode,
    postalCode,
    latitude,
    longitude,
  };
};

/**
 * Validate if an address is in a supported service region
 * @param addressData - The address components to validate
 * @returns Validation result with error message if not supported
 */
export const validateServiceRegion = (addressData: AddressComponents): ValidationResult => {
  // Check if country is supported
  if (!SUPPORTED_COUNTRIES.includes(addressData.countryCode)) {
    return {
      isValid: false,
      error: `Sorry, we don't currently serve ${addressData.country}. We're available in Canada and the United States.`,
    };
  }

  // Check if province/state is supported
  const supportedProvinces = SUPPORTED_REGIONS[addressData.countryCode as keyof typeof SUPPORTED_REGIONS];
  if (!supportedProvinces || !supportedProvinces.includes(addressData.province)) {
    const countryName = addressData.countryCode === 'CA' ? 'Canada' : 'United States';
    return {
      isValid: false,
      error: `Sorry, we don't currently serve ${addressData.province}, ${addressData.country}. ` +
             `We're available in these ${countryName} regions: ${supportedProvinces?.join(', ') || 'none'}.`,
    };
  }

  return {
    isValid: true,
    addressData,
  };
};

/**
 * Complete address validation flow: get place details and validate region
 * @param placeId - The place_id from autocomplete selection
 * @returns Complete validation result
 */
export const validateAddressFromPlaceId = async (placeId: string): Promise<ValidationResult> => {
  try {
    const addressData = await getPlaceDetails(placeId);
    
    if (!addressData) {
      return {
        isValid: false,
        error: 'Unable to validate this address. Please try selecting a different address.',
      };
    }

    return validateServiceRegion(addressData);
  } catch (error) {
    console.error('Error validating address:', error);
    return {
      isValid: false,
      error: 'Address validation failed. Please try again.',
    };
  }
};

/**
 * Legacy function for backward compatibility - verifies address using Geocoding API
 * @param address - Address string to verify
 * @deprecated Use searchAddressSuggestions and getPlaceDetails instead
 */
export const verifyAddress = async (address: string) => {
  console.log('Verifying address:', address);
  
  if (!GOOGLE_API_KEY) {
    return { valid: false, message: 'API key not configured' };
  }

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address,
          key: GOOGLE_API_KEY,
        },
      }
    );

    const data = response.data;
    console.log('Address verification response:', data);
    
    if (data.status === 'OK' && data.results.length > 0) {
      return {
        valid: true,
        formattedAddress: data.results[0].formatted_address,
        location: data.results[0].geometry.location,
      };
    } else {
      return { valid: false, message: 'Invalid address' };
    }
  } catch (error) {
    console.error('Address verification error:', error);
    return { valid: false, message: 'Verification failed' };
  }
};

/**
 * Add or remove supported regions dynamically
 */
export const updateSupportedRegions = (countryCode: string, provinces: string[]) => {
  SUPPORTED_REGIONS[countryCode as keyof typeof SUPPORTED_REGIONS] = provinces;
};

/**
 * Check if a specific region is supported
 */
export const isRegionSupported = (countryCode: string, province: string): boolean => {
  const supportedProvinces = SUPPORTED_REGIONS[countryCode as keyof typeof SUPPORTED_REGIONS];
  return supportedProvinces ? supportedProvinces.includes(province) : false;
};

/**
 * Get all supported regions formatted for display
 */
export const getSupportedRegionsDisplay = (): string => {
  const regions = Object.entries(SUPPORTED_REGIONS).map(([country, provinces]) => {
    const countryName = country === 'CA' ? 'Canada' : 'United States';
    return `${countryName}: ${provinces.join(', ')}`;
  });
  return regions.join(' | ');
}; 