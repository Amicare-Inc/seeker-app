import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useStripe } from '@stripe/stripe-react-native';
import { RootState } from '@/redux/store';
import { useEnrichedSessions, useBookSession, useCancelSession, useDeclineSession } from '../api/queries';
import { PaymentService } from '@/services/stripe/payment-service';
import { EnrichedSession } from '@/types/EnrichedSession';

export const useSessionConfirmation = (sessionId: string | string[] | undefined, action: string | string[] | null | undefined) => {
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();

  // React Query hooks - always called consistently
  const sessionsQuery = useEnrichedSessions(currentUser?.id);
  const bookSessionMutation = useBookSession();
  const cancelSessionMutation = useCancelSession();
  const declineSessionMutation = useDeclineSession();

  // Derived state - computed after hooks
  const sessionIdStr = Array.isArray(sessionId) ? sessionId[0] : sessionId;
  const actionStr = Array.isArray(action) ? action[0] : action;
  const activeSession = sessionsQuery.data?.find((s: EnrichedSession) => s.id === sessionIdStr) || null;
  const isReady = !!currentUser && !!sessionIdStr && !!activeSession && !!activeSession.otherUser;
  const isLoading = sessionsQuery.isLoading || processing;

  // Action handlers
  const handleBookSession = async () => {
    if (!activeSession || !currentUser) return;
    
    setProcessing(true);
    try {
      if (!currentUser.isPsw) {
        if (!stripe) {
          console.error('Stripe not initialized');
          Alert.alert('Error', 'Payment system not available. Please try again.');
          setProcessing(false);
          return;
        }
        
        const paymentService = PaymentService.getInstance();
        const paymentSuccess = await paymentService.initiatePayment(activeSession, stripe);
        if (!paymentSuccess) {
          setProcessing(false);
          return;
        }
      }

      await bookSessionMutation.mutateAsync({
        sessionId: activeSession.id,
        currentUserId: currentUser.id!
      });
      
      Alert.alert(
        'Success',
        'Session booked successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error booking session:', error);
      Alert.alert('Error', 'Failed to book session. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSession = async () => {
    if (!activeSession) return;
    
    setProcessing(true);
    try {
      if (activeSession.status === 'pending') {
        await declineSessionMutation.mutateAsync(activeSession.id);
      } else if (activeSession.status === 'confirmed') {
        await cancelSessionMutation.mutateAsync(activeSession.id);
      }
      router.back();
    } catch (error) {
      console.error('Error cancelling session:', error);
      Alert.alert('Error', 'Failed to cancel session');
    } finally {
      setProcessing(false);
    }
  };

  const handleChangeSession = () => {
    if (!activeSession?.otherUser) return;
    
    router.push({
      pathname: '/request-sessions',
      params: {
        otherUserId: activeSession.otherUser.id,
        sessionObj: JSON.stringify(activeSession),
      },
    });
  };

  // UI content calculation
  const getUIContent = () => {
    if (!activeSession?.otherUser) return null;

    const otherUser = activeSession.otherUser;
    const timeDiff = activeSession.startTime
      ? (new Date(activeSession.startTime).getTime() - new Date().getTime()) / (1000 * 60 * 60)
      : null;

    let headerText = '';
    let messageText = '';
    let primaryButtonText = '';
    let primaryButtonColor = '';
    let onPrimaryPress: () => void = () => {};

    if (actionStr === 'book') {
      headerText = 'Confirm Booking';
      messageText = "By clicking “Confirm Session” you agree to the";
      primaryButtonText = 'Confirm Session';
      primaryButtonColor = '#000';
      onPrimaryPress = handleBookSession;
    } else if (actionStr === 'cancel') {
      headerText = 'Confirm Cancellation';
      if (activeSession.status === 'pending') {
        messageText = "Cancelling now will end your chat and you'll need to send a new session request.";
      } else if (activeSession.status === 'confirmed') {
        if (timeDiff !== null && timeDiff >= 2) {
          messageText = 'Cancelling now will hurt your rating. Are you sure you want to cancel?';
        } else {
          messageText = 'Cancellation is non-refundable.';
        }
      }
      primaryButtonText = 'Cancel Session';
      primaryButtonColor = '#DC2626';
      onPrimaryPress = handleCancelSession;
    } else if (actionStr === 'change') {
      headerText = 'Confirm Change';
      if (activeSession.status === 'pending') {
        messageText = 'Changing the time will send you to the session request page to update your request.';
        primaryButtonText = 'Change Time';
        primaryButtonColor = '#008DF4';
      } else if (activeSession.status === 'confirmed') {
        if (timeDiff !== null && timeDiff >= 2) {
          messageText = 'Your session needs to be rebooked. Please update your session details. (This may affect your rating.)';
        } else {
          messageText = 'Session change is non-refundable.';
        }
        primaryButtonText = 'Change Session';
        primaryButtonColor = '#DC2626';
      }
      onPrimaryPress = handleChangeSession;
    }

    return {
      headerText,
      messageText,
      primaryButtonText,
      primaryButtonColor,
      onPrimaryPress,
      otherUser,
    };
  };

  return {
    isReady,
    isLoading,
    activeSession,
    uiContent: getUIContent(),
  };
}; 