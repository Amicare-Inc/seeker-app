// src/hooks/useSessionsTab.ts
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { AppDispatch, RootState } from '@/redux/store';
import { updateSessionStatus, setActiveEnrichedSession } from '@/redux/sessionSlice';
import { EnrichedSession } from '@/types/EnrichedSession';
import { setActiveProfile } from '@/redux/activeProfileSlice';

export function useSessionsTab(role: 'psw' | 'seeker') {
  const dispatch = useDispatch<AppDispatch>();

  // This tracks the session displayed in the modal
  const [expandedSession, setExpandedSession] = useState<EnrichedSession | null>(null);

  // Redux state from your session slice
  const { newRequests, pending, confirmed, loading, error } = useSelector(
    (state: RootState) => state.sessions
  );
  console.log('Sessions in useSessionsTab:', newRequests, pending, confirmed);
  const userId = useSelector((state: RootState) => state.user.userData?.id);

  /**
   * If a session is 'confirmed' or 'pending', navigate to chat.
   * Otherwise, open the other user profile
   */
  const handleExpandSession = (session: EnrichedSession) => {
    dispatch(setActiveEnrichedSession(session));
    if (session.status === 'confirmed' || session.status === 'pending') {
      router.push({
        pathname: '/(chat)/[sessionId]',
        params: {sessionId: session.id}
      });
    } else if (session.status === 'newRequest') {
        router.push('/other-user-profile');
    } else {
      setExpandedSession(session);
    }
  };

  const handleCloseModal = () => {
    setExpandedSession(null);
  };

  const handleAction = async (action: 'accept' | 'reject') => {
    if (!expandedSession) return;
  
    let newStatus = '';
    if (expandedSession.status === 'newRequest') {
      newStatus = action === 'accept' ? 'pending' : 'rejected';
    } 
    
    try {
      await dispatch(updateSessionStatus({ sessionId: expandedSession.id, newStatus }));
      setExpandedSession(null);
    } catch (err) {
      console.error('Error updating session status:', err);
    }
  };

  // If you want to fetch user details for the modal, you can do so here. For now, returning null.
  const getUserForExpandedSession = () => {
    return null;
  };

  return {
    newRequests,
    pending,
    confirmed,
    loading,
    error,
    expandedSession,
    handleExpandSession,
    handleCloseModal,
    handleAction,
    getUserForExpandedSession,
  };
}