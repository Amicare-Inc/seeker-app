import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { User } from '@/types/User';
import { EnrichedSession } from '@/types/EnrichedSession';
import { useSocketRoom } from '../hooks/useSocketRoom';
import { setActiveProfile } from '@/redux/activeProfileSlice';
import { formatDate, formatTimeRange } from '@/lib/datetimes/datetimeHelpers';
import { SessionStatus, LiveStatus } from '@/shared/constants/enums';
import { useEnrichedSessions } from '@/features/sessions/api/queries';

interface UseChatHeaderProps {
  session: EnrichedSession;
  user: User;
}

export const useChatHeader = ({ session, user }: UseChatHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const { data: allSessions = [] } = useEnrichedSessions(currentUser?.id);
  const currentSession =
    allSessions.find((s) => s.id === session.id) || session;

  // Join / leave socket room.
  useSocketRoom(session.id);

  const isConfirmed = currentSession.status === SessionStatus.Confirmed;
  const isUserConfirmed = !!currentUser?.id && currentSession.confirmedBy?.includes(currentUser.id);

  // Address subtitle logic - show session location, not user's personal address
  const sessionAddress = currentSession.careRecipientData?.address;
  const cityProvince = sessionAddress?.city && sessionAddress?.province
    ? `${sessionAddress.city}, ${sessionAddress.province}`
    : sessionAddress?.fullAddress || 'No Address';

  const subTitle = cityProvince;

  // Navigation helpers -------------------------------------------------
  const navigateToSessionConfirmation = (action: 'book' | 'cancel' | 'change') => {
    if (!user.id) return;
    router.replace({
      pathname: '/session-confirmation',
      params: {
        sessionId: currentSession.id,
        action,
        otherUserId: user.id,
      },
    });
  };

  const handleBookSession = () => navigateToSessionConfirmation('book');
  const handleCancelSession = () => navigateToSessionConfirmation('cancel');
  const handleChangeSession = () => navigateToSessionConfirmation('change');

  const handleNavigateToRequestSession = () => {
    if (currentSession.status === 'confirmed') {
      handleChangeSession();
    } else {
      if (!user.id) return;
      console.log('🔍 useChatHeader - Navigating to request-sessions with currentSession:', currentSession);
      console.log('🔍 useChatHeader - currentSession.checklist:', currentSession.checklist);
      dispatch(setActiveProfile(user));
      router.push({
        pathname: '/request-sessions',
        params: {
          otherUserId: user.id,
          sessionObj: JSON.stringify(currentSession),
        },
      });
    }
  };

  const handleNavigateToUserProfile = () => {
    dispatch(setActiveProfile(user));
    router.push('/other-user-profile');
  };

  // Misc labels ---------------------------------------------------------
  const isDisabled = !isConfirmed && isUserConfirmed;
  const bookText = isConfirmed ? 'Change' : isUserConfirmed ? 'Waiting...' : 'Book';

  const formattedDate = formatDate(currentSession.startTime || '');
  const formattedTimeRange = formatTimeRange(
    currentSession.startTime || '',
    currentSession.endTime || '',
  );

  const startDateObj = currentSession.startTime ? new Date(currentSession.startTime) : null;
  const endDateObj = currentSession.endTime ? new Date(currentSession.endTime) : null;
  const isNextDay =
    startDateObj && endDateObj ? endDateObj.getDate() !== startDateObj.getDate() : false;

  const totalCost = currentSession.billingDetails?.total ?? 0;
  const costLabel = `${totalCost.toFixed(2)}`;

  return {
    currentSession,
    isConfirmed,
    isUserConfirmed,
    isDisabled,
    bookText,
    subTitle,
    formattedDate,
    formattedTimeRange,
    isNextDay,
    costLabel,
    handleBookSession,
    handleCancelSession,
    handleNavigateToRequestSession,
    handleNavigateToUserProfile,
  };
}; 