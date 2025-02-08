// services/googleMaps.ts
import axios from 'axios';

// DO NOT FORGET TO CLEAR KEY BEFORE COMMITTING
// PATCH: NEED TO DYNAMICALLY ADD KEYS AT RUNTIME AND NOT WORKING CAUSE NOT SETUP
const GOOGLE_API_KEY = 'AIzaSyCLcad5x6iwpusu2V98ez2YwC-kjDROiHQ'; // Replace with your API key

export const verifyAddress = async (address: string) => {
  console.log('Verifying address:', address);
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
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