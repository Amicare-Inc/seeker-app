import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const FamilyScreen = () => {
  const handleBackPress = () => {
    router.back();
  };

  const familyMembers = [
    {
      icon: "person" as keyof typeof Ionicons.glyphMap,
      name: "John Doe",
      number: "(234) 567-890",
      relationship: "Primary Contact",
      country: "USA",
      city: "New York",
      email: "john.doe@example.com",
      isPrimary: true,
    },
    {
      icon: "person" as keyof typeof Ionicons.glyphMap,
      name: "Susan Doe",
      number: "(987) 654-321",
      relationship: "Other",
      country: "Canada",
      city: "Toronto",
      email: "susan.doe@example.com",
      isPrimary: false,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Family</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white rounded-lg mx-4 mt-6">
          {familyMembers.map((member, index) => (
            <FamilyListItem
              key={index}
              icon={member.icon}
              name={member.name}
              number={member.number}
              relationship={member.relationship}
              onPress={() => {
                router.push({
                  pathname: '/(profile)/family/edit',
                  // params: { member }, // Pass the entire member object
                });
              }}
              isPrimary={member.isPrimary}
            />
          ))}

          {/* Add New Member Button */}
          <FamilyListItem
            icon={"add" as keyof typeof Ionicons.glyphMap} // Use the Ionicons "add" icon
            name="Add New Member"
            number=""
            relationship=""
            onPress={() => {
              router.push('/(profile)/family/add');
            }}
            isPrimary={false} // Not styled as primary
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface FamilyListItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  number: string;
  relationship: string;
  onPress: () => void;
  isPrimary?: boolean; // New optional prop
}

const FamilyListItem: React.FC<FamilyListItemProps> = ({
  icon,
  name,
  number,
  relationship,
  onPress,
  isPrimary = false, // Default to false
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      className={`flex-row items-center p-4 gap-3`}
    >
      <View className="h-[70px] w-[70px] bg-[#f2f2f7] rounded-full items-center justify-center">
        <Ionicons name={icon} size={20} color="#aeaeb2" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-grey-80">{name}</Text>
        {number ? <Text className="text-base text-grey-49">{number}</Text> : null}
        {relationship ? (
          <Text className={`text-base ${isPrimary ? 'text-brand-blue font-semibold' : 'text-grey-49'}`}>
            {relationship}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#bfbfc3" />
    </TouchableOpacity>
  );
};

export default FamilyScreen;