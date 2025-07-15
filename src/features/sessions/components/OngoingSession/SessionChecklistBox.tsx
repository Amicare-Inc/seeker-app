import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChecklistItem, SessionComment } from '@/types/Sessions';

interface SessionChecklistBoxProps {
  checklist: ChecklistItem[];
  comments?: SessionComment[];
  editable?: boolean;
  showComment?: boolean;
  currentUserId?: string;
  onChecklistUpdate?: (checklist: ChecklistItem[]) => void;
  onCommentAdd?: (comment: string) => void;
}

const SessionChecklistBox: React.FC<SessionChecklistBoxProps> = ({
  checklist,
  comments = [],
  editable = false,
  showComment = false,
  currentUserId,
  onChecklistUpdate,
  onCommentAdd,
}) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(checklist);
  const [newItem, setNewItem] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const newItemInputRef = useRef<TextInput>(null);
  const commentInputRef = useRef<TextInput>(null);

  // Update local state when props change (for real-time updates)
  React.useEffect(() => {
    setChecklistItems(checklist);
  }, [checklist]);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

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
    if (!editable || !currentUserId) return;
    
    const updatedItems = checklistItems.map((item) =>
      item.id === id
        ? {
            ...item,
            checked: !item.checked,
            time: !item.checked ? getCurrentTimeString() : '',
            checkedBy: !item.checked ? currentUserId : undefined,
          }
        : item
    );
    
    setChecklistItems(updatedItems);
    onChecklistUpdate?.(updatedItems);
  };

  const handleAddItem = () => {
    if (!editable || newItem.trim() === '') {
      handleCancelAddItem();
      return;
    }

    const newChecklistItem: ChecklistItem = {
      id: Date.now().toString(),
      task: newItem,
      time: '',
      checked: false,
      completed: false,
    };

    const updatedItems = [...checklistItems, newChecklistItem];
    setChecklistItems(updatedItems);
    onChecklistUpdate?.(updatedItems);

    setNewItem('');
    newItemInputRef.current?.blur();
  };

  const handleCancelAddItem = () => {
    setNewItem('');
    newItemInputRef.current?.blur();
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    onCommentAdd?.(newComment);
    setNewComment('');
    commentInputRef.current?.blur();
  };

  const handleShowComments = () => {
    setShowComments(true);
  };

  const handleBackToChecklist = () => {
    setShowComments(false);
  };

  // Format comments for display
  const formatCommentsForDisplay = () => {
    return comments.map(comment => `${comment.timestamp}: ${comment.text}`).join('\n');
  };

  return (
    <View className="bg-white/80 rounded-xl mx-5 mt-2 mb-4 px-4 py-3">
      <View className="flex-row items-center mb-5 mt-2">
        <TouchableOpacity onPress={handleBackToChecklist} activeOpacity={0.7} className="flex-1">
          <Text className="text-black font-bold text-[17px]">
            Session Checklist{showComments ? ' (Saved)' : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {!showComments ? (
        <>
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
                {item.task}
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

          {showComment && (
            <TouchableOpacity onPress={handleShowComments}>
              <Text className="text-black font-bold text-base my-2 w-full border border-l-0 border-b-0 border-r-0 pt-4" style={{ borderColor: '#bfbfc3' }}>
                Add Comments
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View className="mt-2">
          <Text className="text-black font-bold text-base mb-2 border border-l-0 border-b-0 border-r-0 border-[#bfbfc3] mt-3 pt-3">
            Comments
          </Text>
          
          {comments.length > 0 && (
            <ScrollView className="max-h-32 mb-3 p-3 bg-gray-50 rounded-lg" showsVerticalScrollIndicator={false}>
              <Text className="text-[14px] text-black" style={{ lineHeight: 20 }}>
                {formatCommentsForDisplay()}
              </Text>
            </ScrollView>
          )}

          <TextInput
            ref={commentInputRef}
            className="w-full text-[16px] text-black rounded-lg min-h-[120px] p-3 border border-gray-200"
            placeholder="Type your comments here..."
            placeholderTextColor="#888"
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          
          {editable && newComment.trim() && (
            <TouchableOpacity 
              onPress={handleAddComment}
              className="bg-blue-500 rounded-lg px-4 py-2 mt-2 self-end"
            >
              <Text className="text-white font-medium">Add Comment</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default SessionChecklistBox;
