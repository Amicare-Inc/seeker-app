import React from 'react';
import {  View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAvailableUsersWithDistance } from '@/features/userDirectory';
import { useAuth } from '@/features/auth'; // or however you get currentUserId
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';
import type { MapUser } from '@/types/MapUser';

const SeekerSessionsTab = () => {
  const { user } = useAuth(); // assuming you have a logged-in user
  const { data: users, isLoading, error } = useAvailableUsersWithDistance('seeker', user?.id);

  const initialRegion = {
    latitude: 43.6532,
    longitude: -79.3832,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text>Loading nearby users...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text>Error loading users: {`${error}`}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: '#F2F2F7',
        paddingTop: LAYOUT_CONSTANTS.SCREEN_TOP_PADDING,
      }}
    >
      <View className="flex-row items-center px-[15px] border-b border-[#79797966] pb-4 mb-[10px]">
        <Text className="text-xl text-black font-medium">Nearby PSWs</Text>
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
      >
        {users?.map((u: MapUser) => (
          <Marker
            key={u.id}
            coordinate={{ latitude: u.latitude, longitude: u.longitude }}
            title={`${u.firstName} ${u.lastName}`}
          >
            <Callout>
              <View>
                <Text>{u.firstName} {u.lastName}</Text>
                {u.distanceInfo?.distance && (
                  <Text>{u.distanceInfo.distance} away</Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </SafeAreaView>
  );
};

export default SeekerSessionsTab;

