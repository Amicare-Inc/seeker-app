// @/components/Profile/OptionsDropdown.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OptionsDropdownProps {
  label: string;
  options: string[];
  initialValue?: string; // comma-separated string
  onChange: (selected: string) => void;
}

const OptionsDropdown: React.FC<OptionsDropdownProps> = ({
  label,
  options,
  initialValue = "",
  onChange,
}) => {
  // Initialize only once from the initialValue.
  const [selectedOptions, setSelectedOptions] = useState<string[]>(() => {
    return initialValue ? initialValue.split(",").map(opt => opt.trim()) : [];
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Whenever selectedOptions changes, call onChange.
  useEffect(() => {
    onChange(selectedOptions.join(", "));
    // Note: We intentionally do not include onChange in the dependency array
    // to avoid triggering the effect repeatedly if onChange is recreated.
  }, [selectedOptions]);

  const toggleOption = (option: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(o => o !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold mb-1">{label}</Text>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className="p-3 border border-gray-300 rounded-lg"
      >
        <Text className="text-base text-gray-700">
          {selectedOptions.length > 0 ? selectedOptions.join(", ") : "Select options"}
        </Text>
      </TouchableOpacity>
      {isOpen && (
        <View className="mt-2 border border-gray-300 rounded-lg">
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            scrollEnabled={false} 
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  toggleOption(item);
                  setIsOpen(false); // close dropdown immediately after selecting
                }}
                className="p-3 border-b border-gray-200 flex-row items-center justify-between"
              >
                <Text className="text-base">{item}</Text>
                {selectedOptions.includes(item) && (
                  <Ionicons name="checkmark" size={20} color="green" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default OptionsDropdown;