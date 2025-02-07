// hooks/useSessionsTab.ts
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { listenToUserSessions } from '@/services/firebase/fireStoreListeners';
import { updateSessionStatus } from '@/services/firebase/firestore';
import { AppDispatch, RootState } from '@/redux/store';
import { Session } from '@/types/Sessions';
import { User } from '@/types/User';

/**
 * A custom hook that centralizes session-listening, expansion, and status update logic.
 * @param role - 'psw' or 'seeker' (in case you need role-specific logic)
 */
export function useSessionsTab(role: 'psw' | 'seeker') {
  const dispatch = useDispatch<AppDispatch>();

  // Track which session is "expanded" for the modal
  const [expandedSession, setExpandedSession] = useState<Session | null>(null);

  // Grab session data and loading/error states from Redux
  const {
    notConfirmedSessions,
    confirmedSessions,
    bookedSessions,
    pendingMap,
    acceptedMap,
    bookedMap,
    loading,
    error,
  } = useSelector((state: RootState) => state.sessions);

  /**
   * Listen for session updates from Firestore whenever this hook mounts.
   * The 'role' param is available if you want to do role-based logic later.
   */
  useEffect(() => {
    console.log(`Subscribing to Firestore listener for sessions... (role = ${role})`);
    listenToUserSessions(dispatch);
    // You do not necessarily need to unsubscribe here unless you want to stop listening on unmount.
  }, [dispatch, role]);

  /**
   * When a user taps on a session:
   * - If it’s accepted or booked, open the chat screen.
   * - Otherwise, open the modal for accept/reject/book actions.
   */
  const handleExpandSession = (session: Session, requester: User) => {
    if (session.status === 'accepted' || session.status === 'booked') {
      // navigate to chat
      router.push({
        pathname: '/(chat)/[sessionId]',
        params: {
          sessionId: session.id,
          sessionObj: JSON.stringify(session),
          user: JSON.stringify(requester),
        },
      });
    } else {
      // open modal
      setExpandedSession(session);
    }
  };

  /** Close the modal */
  const handleCloseModal = () => {
    setExpandedSession(null);
  };

  /**
   * Handle accept/reject/book actions triggered in the modal
   */
  const handleAction = async (action: string) => {
    if (!expandedSession) return;

    if (action === 'accept_pending') {
      await updateSessionStatus(expandedSession.id, 'accepted');
    } else if (action === 'reject_pending') {
      await updateSessionStatus(expandedSession.id, 'rejected_pending');
    } else if (action === 'accept_confirmed') {
      await updateSessionStatus(expandedSession.id, 'booked');
    } else if (action === 'reject_confirmed') {
      await updateSessionStatus(expandedSession.id, 'rejected_confirmed');
    }
    handleCloseModal(); // close modal afterwards
  };

  /** Find which user object (from the user maps) to show in the modal */
  const getUserForExpandedSession = (): User | null => {
    if (!expandedSession) return null;

    switch (expandedSession.status) {
      case 'pending':
        return pendingMap[expandedSession.requesterId] || null;
      case 'accepted':
        return (
          acceptedMap[expandedSession.targetUserId] ||
          acceptedMap[expandedSession.requesterId] ||
          null
        );
      case 'booked':
        return (
          bookedMap[expandedSession.targetUserId] ||
          bookedMap[expandedSession.requesterId] ||
          null
        );
      default:
        return null;
    }
  };

  // If you want to do role-specific filtering or behavior, you can add it here.
  // For now, we return everything from Redux.

  return {
    // Redux data
    notConfirmedSessions,
    confirmedSessions,
    bookedSessions,
    pendingMap,
    acceptedMap,
    bookedMap,
    loading,
    error,

    // Local state & handlers
    expandedSession,
    handleExpandSession,
    handleCloseModal,
    handleAction,
    getUserForExpandedSession,
  };
}