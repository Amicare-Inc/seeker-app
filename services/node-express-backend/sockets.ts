import { io, Socket } from 'socket.io-client';
import 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase.config';

let socket: Socket | null = null;

export const connectSocket = async (userId: string) => {
  const user = FIREBASE_AUTH.currentUser;
// TODO: ADD AUTHENTICATION AND HTTPS
//   if (!user) {
//     console.log('No authenticated user, cannot connect to socket.');
//     // Handle the case where there is no authenticated user
//     return;
//   }

  try {
    // const token = await user!.getIdToken();
    // console.log('Fetching ID token for socket connection:', token);

    // Establish socket connection with token in auth option
    socket = io(process.env.EXPO_PUBLIC_BACKEND_BASE_URL, {
    //   auth: {
    //     token: token,
    //   },
        query: { // Sending userId in query as planned for temporary auth skip
            userId: userId,
        },
       // For React Native, you might need:
       transports: ['websocket'],
       // Add other options as needed
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Event listeners are now registered elsewhere via useSocketListeners hook.

  } catch (error: any) {
    console.error('Error getting ID token or connecting socket:', error.message);
  }
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.off('session:update');
    socket.off('chat:newMessage');
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected manually.');
  }
};

