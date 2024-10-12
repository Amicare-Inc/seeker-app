import { SafeAreaView, View, Text, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { updateSessionStatus } from '@/services/firebase/firestore';

const Convo = () => {
    const { sessionId, confirmedSessions, setConfirmedSessions, bookedSessions, setBookedSessions, bookedMap, setBookedMap } = useLocalSearchParams();
    const router = useRouter();

  // If sessionId is an array, take the first element
  const actualSessionId = Array.isArray(sessionId) ? sessionId[0] : sessionId;

  const handleBooked = async () => {
    if (actualSessionId) {
      try {
        await updateSessionStatus(actualSessionId, 'booked'); // Use actualSessionId
        alert('Session successfully updated to booked!');
        
        // router.back(); // Navigate back after booking
      } catch (error) {
        console.error('Error updating session to booked:', error);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Chat</Text>
        <Button title="Booked" onPress={handleBooked} />
      </View>
    </SafeAreaView>
  );
};

export default Convo;