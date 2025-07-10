import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateUserFields } from '@/redux/userSlice';
import { searchAddressSuggestions, validateAddressFromPlaceId, type PlacePrediction, type AddressComponents } from '@/services/google/googlePlacesService';
interface RegionValidatedAddressInputProps {
  onAddressSelected?: (addressData: AddressComponents) => void;
  onValidationResult?: (isValid: boolean, error?: string) => void;
  placeholder?: string;
  initialValue?: string;
  otherStyles?: string;
}

const RegionValidatedAddressInput: React.FC<RegionValidatedAddressInputProps> = ({
  onAddressSelected,
  onValidationResult,
  placeholder = "Address",
  initialValue = "",
  otherStyles,
}) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Debounced search for address suggestions
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (inputValue.length >= 3) {
      debounceTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await searchAddressSuggestions(inputValue);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [inputValue, validationError]);

  const handleSuggestionSelect = async (suggestion: PlacePrediction) => {
    setInputValue(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
    setValidationError(null);

    try {
      const validationResult = await validateAddressFromPlaceId(suggestion.place_id);
      
      if (validationResult.isValid && validationResult.addressData) {
        // Address is valid and in supported region
        dispatch(updateUserFields({
          address: {
            fullAddress: validationResult.addressData.fullAddress,
            street: validationResult.addressData.street,
            city: validationResult.addressData.city,
            province: validationResult.addressData.province,
            country: validationResult.addressData.country,
            postalCode: validationResult.addressData.postalCode,
          }
        }));

        // Call callbacks
        onAddressSelected?.(validationResult.addressData);
        onValidationResult?.(true);
      } else {
        // Address not in supported region - show error
        setValidationError(validationResult.error || 'Address validation failed');
        onValidationResult?.(false, validationResult.error);
      }
    } catch (error) {
      console.error('Error validating address:', error);
      const errorMessage = 'Unable to validate address. Please try again.';
      setValidationError(errorMessage);
      onValidationResult?.(false, errorMessage);
    }
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setValidationError(null);
  };

  return (
    <View className={otherStyles}>
      {/* Main Input Container */}
      <TouchableOpacity
        className="w-full h-12 px-4 bg-gray-100 rounded-lg flex flex-row items-center"
        activeOpacity={1}
      >
        <TextInput
          ref={inputRef}
          className="flex-1 text-black font-medium text-base"
          value={inputValue}
          onChangeText={handleInputChange}
          placeholder={placeholder}
          placeholderTextColor="#9D9DA1"
          autoComplete="street-address"
          autoCorrect={false}
        />
        
        {/* Only show loading indicator */}
        {isLoading && (
          <ActivityIndicator size="small" color="#9D9DA1" />
        )}
      </TouchableOpacity>

      {/* Error message - only show if there's an error */}
      {validationError && (
        <Text className="text-red-500 text-xs mt-2 px-1">{validationError}</Text>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <View className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-48 z-50 shadow-lg">
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {suggestions.map((item) => (
              <TouchableOpacity
                key={item.place_id}
                className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                onPress={() => handleSuggestionSelect(item)}
              >
                <Text className="text-black font-medium text-base">
                  {item.structured_formatting.main_text}
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  {item.structured_formatting.secondary_text}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default RegionValidatedAddressInput; 