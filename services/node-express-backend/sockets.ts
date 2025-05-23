import { io, Socket } from 'socket.io-client';
import 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase.config';
import { EnrichedSession } from '@/types/EnrichedSession';
import { setSessions } from '@/redux/sessionSlice';
import { AppDispatch } from '@/redux/store'; // Import the dispatch function from your store
import { Message } from '@/types/Message';
import { addMessage } from '@/redux/chatSlice';

const SOCKET_SERVER_URL = 'https://f964-184-147-249-113.ngrok-free.app'
// const SOCKET_SERVER_URL = 'http://localhost:3000'// process.env.EXPO_PUBLIC_API_URL; // Make sure you have this environment variable set up
// const SOCKET_SERVER_URL = 'http://172.20.10.3:3000'// process.env.EXPO_PUBLIC_API_URL; // Make sure you have this environment variable set up

let socket: Socket | null = null;

export const connectSocket = async (userId: string, dispatch: AppDispatch) => {
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
    socket = io(SOCKET_SERVER_URL, {
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

    socket.on('session:update', (enrichedSessions: EnrichedSession[]) => { // Assuming backend sends EnrichedSession[]
        dispatch(setSessions(enrichedSessions)); // Ensure dispatch is passed as a parameter
    });

    socket.on('chat:newMessage', (message: Message) => { // Assuming backend sends Message object
        console.log('Received new message:', message);
        // Dispatch Redux action to add the new message to state
        // Assuming addMessage is an action creator from your chat slice
        dispatch(addMessage(message)); 
    });

    // Add listeners for custom events from the backend here later
    // Example:
    // socket.on('session:update', (data) => {
    //   console.log('Received session update:', data);
    //   // Dispatch Redux action to update sessions state
    // });

  } catch (error: any) {
    console.error('Error getting ID token or connecting socket:', error.message);
    // Handle errors
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

