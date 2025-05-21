import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, PanResponder, LayoutAnimation, Platform, UIManager, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const checklistData = [
  { id: '1', text: 'Drive Jane to Medical Appointment', time: '10:17 am', checked: true },
  { id: '2', text: 'Wait with Jane at Appointment', time: '11:30 am', checked: true },
  { id: '3', text: 'Drop Jane back at home', time: '', checked: false },
  { id: '4', text: 'Make Jane a meal', time: '', checked: false },
];

const SESSION_DURATION_SECONDS = 1 * 60 * 60 + 30 * 60; // 1 hour 30 minutes = 5400 seconds

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h, m, s].map(n => n.toString().padStart(2, '0')).join(':');
}

const SessionCardChecklist = () => {
  const [expanded, setExpanded] = useState(true);
  const [checklist, setChecklist] = useState(checklistData);
  const [newItem, setNewItem] = useState('');
  const [comments, setComments] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [checklistSaved, setChecklistSaved] = useState(false);
  const [timer, setTimer] = useState(0);
  const expandedRef = useRef(expanded);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  // Timer effect
  useEffect(() => {
    if (timer < SESSION_DURATION_SECONDS) {
      timerRef.current = setTimeout(() => setTimer(t => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timer]);

  // PanResponder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (!expandedRef.current && gestureState.dy < -60) {
          LayoutAnimation.easeInEaseOut();
          setExpanded(true);
        } else if (expandedRef.current && gestureState.dy > 60) {
          LayoutAnimation.easeInEaseOut();
          setExpanded(false);
        }
      },
    })
  ).current;

  const handleToggle = () => {
    LayoutAnimation.easeInEaseOut();
    setExpanded((prev) => !prev);
  };

  const handleCheck = (id: string) => {
    setChecklist(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    // Find the item and if it is being checked, remove after 0.5s
    const item = checklist.find(i => i.id === id);
    if (item && !item.checked) {
      setTimeout(() => {
        LayoutAnimation.easeInEaseOut();
        setChecklist(items => items.filter(i => i.id !== id));
      }, 500);
    }
  };

  const handleAddItem = () => {
    if (newItem.trim() === '') return;
    setChecklist(items => [
      ...items,
      { id: Date.now().toString(), text: newItem, time: '', checked: false },
    ]);
    setNewItem('');
  };

  const handleAddComments = () => {
    LayoutAnimation.easeInEaseOut();
    setShowComments(true);
    setChecklistSaved(true);
    setTimeout(() => setChecklistSaved(false), 1000); // (saved) disappears after 2s
  };

  const handleBackToChecklist = () => {
    LayoutAnimation.easeInEaseOut();
    setShowComments(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width, zIndex: 50 }}
      pointerEvents="box-none"
    >
      <View
        {...panResponder.panHandlers}
        style={{ width: '100%' }}
      >
        <LinearGradient
          colors={['#75D87F', '#ACE5B2']}
          locations={[0, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            borderTopLeftRadius: expanded ? 24 : 0,
            borderTopRightRadius: expanded ? 24 : 0,
            paddingTop: expanded ? 16 : 8,
            paddingBottom: expanded ? 16 : 8,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
        {/* Handle Bar */}
        {expanded && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 0,
              right: 0,
              alignItems: 'center',
              zIndex: 10,
            }}
            pointerEvents="none"
          >
            <View
              style={{
                width: 56,
                height: 3,
                borderRadius: 3,
                backgroundColor: 'rgba(0,0,0,0.35)',
              }}
            />
          </View>
        )}

          {/* Header */}
          <TouchableOpacity onPress={handleToggle} activeOpacity={1} className="flex-row items-center justify-center pl-5 pr-7 pt-2 pb-2">
            <View className="flex-row items-center flex-1">
              <View className="w-14 h-14 rounded-full bg-white mr-3" />
              <View className="flex-col gap-1">
                <Text className="text-[#1a3b1a] text-[20px] font-extrabold">Medical Appt.</Text>
                <Text className="text-[#1a3b1a] text-[15px] font-medium">with Jane</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-[#1a3b1a] text-[20px] font-bold">
                {formatTime(timer)}
              </Text>
              <Text className="text-[#1a3b1a] text-[16px]">1 hr, 30 min</Text>
            </View>
          </TouchableOpacity>

          {/* Expanded Content */}
          {expanded && (
            <>
              {/* Checklist */}
              {!showComments && (
                <View className="bg-white/90 rounded-xl mx-5 mt-4 mb-3 px-4 py-3">
                  <View className="flex-row items-center mb-5 mt-2">
                    <Text className="text-black font-bold text-[17px] flex-1">Session Checklist</Text>
                  </View>
                  {checklist.map(item => (
                    <View key={item.id} className="flex-row items-center mb-1.5">
                      <TouchableOpacity
                        onPress={() => handleCheck(item.id)}
                        className="mr-2"
                      >
                        {item.checked ? (
                          <Ionicons name="checkmark-circle" size={24} color="#4ade80" />
                        ) : (
                          <Ionicons name="ellipse-outline" size={24} color="#bdbdbd" />
                        )}
                      </TouchableOpacity>
                      <Text
                        className={`flex-1 text-[16px] ${item.checked ? 'text-black/80 line-through' : 'text-black'}`}
                        numberOfLines={1}
                      >
                        {item.text}
                      </Text>
                      <Text className="text-gray-500 text-xs ml-2" style={{ minWidth: 60 }}>
                        {item.time}
                      </Text>
                    </View>
                  ))}
                  {/* Add new item */}
                  <View className="flex-row items-center mt-1 mb-3">
                    <TouchableOpacity onPress={handleAddItem} className="mr-2">
                      <Ionicons name="add-circle-outline" size={24} color="#bdbdbd" />
                    </TouchableOpacity>
                    <TextInput
                      className="flex-1 text-[16px] text-black"
                      placeholder="Add checklist item"
                      placeholderTextColor="#888"
                      value={newItem}
                      onChangeText={setNewItem}
                      onSubmitEditing={handleAddItem}
                      blurOnSubmit={false}
                      returnKeyType="done"
                    />
                  </View>
                  <TouchableOpacity onPress={handleAddComments}>
                    <Text className="text-black font-bold text-base my-2 w-full border border-l-0 border-b-0 border-r-0 pt-4" style={{ borderColor: '#bfbfc3' }}>
                      Add Comments
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Comments Area */}
              {showComments && (
                <View className="bg-white/90 rounded-xl mx-5 mt-4 mb-3 px-4 py-3">
                  <View className="flex-row items-center mb-2 mt-2">
                    <TouchableOpacity onPress={handleBackToChecklist} activeOpacity={0.7}>
                      <Text className="text-black font-bold text-[17px] flex-1">
                        Session Checklist
                      </Text>
                    </TouchableOpacity>
                    <Text className="text-black text-[16px] ml-2">(Saved)</Text>
                  </View>
                  {/* Comments input */}
                  <Text className="text-black font-bold text-base mb-2  border border-l-0 border-b-0 border-r-0 border-[#bfbfc3] mt-3 pt-3">Comments</Text>
                  <TextInput
                    className="w-full text-[16px] text-black  rounded-lg min-h-[120px]"
                    placeholder="Type your comments here..."
                    placeholderTextColor="#888"
                    value={comments}
                    onChangeText={setComments}
                    multiline
                  />
                </View>
              )}

              {/* Save Button */}
              <TouchableOpacity className="bg-black py-3.5 rounded-xl items-center mx-5 mt-2">
                <Text className="text-white text-xl font-medium">Save</Text>
              </TouchableOpacity>
            </>
          )}
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SessionCardChecklist;