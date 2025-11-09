import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import AmicareCircle from '@/features/sessions/components/AmicareCircle';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { EnrichedSession } from '@/types/EnrichedSession';
import { getSessionDisplayInfo } from '@/features/sessions/utils/sessionDisplayUtils';
import { useUnreadBadge } from '@/features/chat/unread/useUnread';

const AvatarWithUnread: React.FC<{ uri?: string; borderColor: string; sessionId: string; enableUnread?: boolean }> = ({ uri, borderColor, sessionId, enableUnread = true }) => {
    const { unread } = useUnreadBadge(sessionId);
    return (
        <View style={{ position: 'relative', overflow: 'visible' }}>
            <Image
                source={uri ? { uri } : require('@/assets/default-profile.png')}
                className="w-[78px] h-[78px] rounded-full border-4"
                style={{ borderColor }}
            />
            {enableUnread && unread ? (
                <View
                    style={{
                        position: 'absolute',
                        right: 4,
                        top: 4,
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: '#FF3B30',
                        zIndex: 10,
                        elevation: 3,
                    }}
                />
            ) : null}
        </View>
    );
};

interface AppliedSessionsProps {
    sessions: EnrichedSession[];
    onSessionPress: (session: EnrichedSession) => void;
    title?: string;
    isPending?: boolean;
    isinProgress?: boolean;
}

const AppliedSessions: React.FC<AppliedSessionsProps> = ({ sessions, onSessionPress, title, isPending, isinProgress }) => {
    const currentUser = useSelector((state: RootState) => state.user.userData);

    // Decide a border color (fallback similar to SessionList)
    let borderColor = '#797979';
    if (title === 'Pending' || isPending) {
        borderColor = '#1A8BF8';
    }

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4, marginTop: 6 }}
        >
            {/* Always show Amicare as the first avatar */}
            <View className="items-center mr-6">
                <AmicareCircle firstName="Amicare" />
            </View>
            {sessions.length > 0
                ? sessions.map((item) => {
                      if (!item.otherUser || !currentUser) return null;

                      const displayInfo = getSessionDisplayInfo(item, currentUser);
                      const isPendingItem = item.status === 'pending' || item.status === 'newRequest';
                      const enableUnread = item.status === 'confirmed' || item.status === 'inProgress';
                      const avatarBorder = isPendingItem ? '#D4D4D8' : borderColor;
                      const labelColor = isPendingItem ? '#9CA3AF' : '#00000099';

                      return (
                          <TouchableOpacity
                              key={item.id}
                              onPress={() => onSessionPress(item)}
                              className="items-center mr-6"
                              style={{ opacity: isPendingItem ? 0.5 : 1 }}
                          >
                              <AvatarWithUnread uri={displayInfo.primaryPhoto} borderColor={avatarBorder} sessionId={item.id} enableUnread={enableUnread} />
                              <Text className="text-sm font-medium mb-[20px] mt-[5px]" style={{ color: labelColor }}>
                                  {displayInfo.primaryName.split(' ')[0]}
                              </Text>
                          </TouchableOpacity>
                      );
                  })
                : null}
        </ScrollView>
    );
};

export default AppliedSessions;
