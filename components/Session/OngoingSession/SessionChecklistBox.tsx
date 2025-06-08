import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  time: string;
}

interface SessionChecklistBoxProps {
  checklist: ChecklistItem[];
  editable?: boolean;
}

const SessionChecklistBox: React.FC<SessionChecklistBoxProps> = ({
  checklist,
  editable = false,
}) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(checklist);
  const [newItem, setNewItem] = useState('');
  const newItemInputRef = useRef<TextInput>(null);

  const getCurrentTimeString = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleCheck = (id: string) => {
    if (!editable) return;
    setChecklistItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              checked: !item.checked,
              time: !item.checked ? getCurrentTimeString() : '',
            }
          : item
      )
    );
  };

  const handleAddItem = () => {
    if (!editable || newItem.trim() === '') {
      handleCancelAddItem();
      return;
    }

    setChecklistItems((items) => [
      ...items,
      { id: Date.now().toString(), text: newItem, time: '', checked: false },
    ]);

    setNewItem('');
    newItemInputRef.current?.blur();
  };

  const handleCancelAddItem = () => {
    setNewItem('');
    newItemInputRef.current?.blur();
  };

  return (
    <View className="bg-white/80 rounded-xl mx-5 mt-2 mb-4 px-4 py-3">
      <View className="flex-row items-center mb-5 mt-2">
        <Text className="text-black font-bold text-[17px] flex-1">Session Checklist</Text>
      </View>

      {checklistItems.map((item) => (
        <View key={item.id} className="flex-row items-center mb-1.5">
          <TouchableOpacity
            onPress={() => handleCheck(item.id)}
            className="mr-2"
            disabled={!editable}
          >
            {item.checked ? (
              <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
            ) : (
              <Ionicons name="ellipse-outline" size={24} color="#bdbdbd" />
            )}
          </TouchableOpacity>
          <Text className="flex-1 text-[16px] text-black" numberOfLines={1}>
            {item.text}
          </Text>
          <Text className="text-gray-500 text-xs ml-2" style={{ minWidth: 60 }}>
            {item.checked && item.time ? item.time : ''}
          </Text>
        </View>
      ))}

      {editable && (
        <View className="flex-row items-center mt-3 mb-3">
          <TouchableOpacity onPress={handleCancelAddItem} className="mr-2">
            <Ionicons name="ellipse-outline" size={24} color="#bdbdbd" />
          </TouchableOpacity>
          <TextInput
            ref={newItemInputRef}
            className="flex-1 text-[16px] text-black"
            placeholder="Add checklist item"
            placeholderTextColor="#888"
            value={newItem}
            onChangeText={setNewItem}
            onSubmitEditing={handleAddItem}
            blurOnSubmit={true}
            returnKeyType="done"
            editable={editable}
          />
        </View>
      )}
    </View>
  );
};

export default SessionChecklistBox;
