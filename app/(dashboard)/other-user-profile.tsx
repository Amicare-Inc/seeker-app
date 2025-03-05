import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ProfileScreen from '@/components/Profile/ProfileScreen';
import { User } from '@/types/User';

const OtherUserProfileScreen = () => {
  const activeProfile = useSelector((state: RootState) => state.activeProfile.activeUser);
  return <ProfileScreen user={activeProfile as User} isMyProfile={false} />;
};

export default OtherUserProfileScreen;