import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, PanResponder, LayoutAnimation, Platform, UIManager, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setActiveProfile } from '@/redux/activeProfileSlice';
import { EnrichedSession } from '@/types/EnrichedSession';
import { useRejectSession, useUpdateSession } from '@/features/sessions/api/queries';
import { useQueryClient } from '@tanstack/react-query';
import { sessionKeys } from '@/features/sessions/api/queries';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface InterestedCardProps {
    session: EnrichedSession;
    onClose?: () => void;
}

const InterestedCard: React.FC<InterestedCardProps> = ({ session, onClose }) => {
    const [expanded, setExpanded] = React.useState(false);
    const expandedRef = useRef(expanded);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const rejectSessionMutation = useRejectSession();
    const updateSessionMutation = useUpdateSession();
    
    // PSW is the sender (otherUser) in interested sessions
    const psw = session.otherUser;
    const careRecipient = session.careRecipient;
    const isForFamilyMember = session.isForFamilyMember;

    if (!psw) {
        return null;
    }

    // Keep ref in sync with state
    React.useEffect(() => {
        expandedRef.current = expanded;
    }, [expanded]);

    // PanResponder for swipe gestures (same as SessionCard)
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
            onPanResponderRelease: (_, gestureState) => {
                if (!expandedRef.current && gestureState.dy < -60) {
                    LayoutAnimation.easeInEaseOut();
                    setExpanded(true);
                } else if (expandedRef.current && gestureState.dy > 60) {
                    LayoutAnimation.easeInEaseOut();
                    setExpanded(false);
                }
            },
        })
    ).current;

    const handleRequestSession = async () => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        try {
            // Mark the interested session as requested (it's being converted to a new request)
            await updateSessionMutation.mutateAsync({
                sessionId: session.id,
                data: { status: 'requested' }
            });
            
            // Set the PSW as active profile for the request session flow
            dispatch(setActiveProfile(psw));
            
            // Navigate to request sessions page to create a completely new session
            // No sessionObj parameter - this will create a fresh session
            router.push({
                pathname: '/(dashboard)/request-sessions',
                params: {
                    otherUserId: psw.id
                }
            });
            
            // Force refresh sessions to ensure real-time updates
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
            }, 1000);
        } catch (error) {
            console.error('Error processing interested session:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (isRejecting) return;
        
        setIsRejecting(true);
        try {
            await rejectSessionMutation.mutateAsync(session.id);
            router.back();
        } catch (error) {
            console.error('Error rejecting interested session:', error);
        } finally {
            setIsRejecting(false);
        }
    };

    const handleToggle = () => {
        LayoutAnimation.easeInEaseOut();
        setExpanded((prev) => !prev);
    };

    const formatProfileImage = (imageUrl?: string) => {
        if (!imageUrl) {
            return require('@/assets/default-profile.png');
        }
        return { uri: imageUrl };
    };

    return (
        <View
            className="absolute left-0 right-0 bottom-0"
            style={{
                width,
                zIndex: 50,
            }}
            {...panResponder.panHandlers}
        >
            <LinearGradient
                colors={['#05549e', '#0c7ae2', '#399cf9']} // Same blue gradient as SessionCard
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                    borderTopLeftRadius: expanded ? 24 : 0,
                    borderTopRightRadius: expanded ? 24 : 0,
                    paddingTop: expanded ? 16 : 8,
                    paddingBottom: expanded ? 16 : 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 10,
                }}
            >
                {/* Handle Bar */}
                {expanded && (
                    <View
                        style={{
                            position: 'absolute',
                            top: 8,
                            left: 0,
                            right: 0,
                            alignItems: 'center',
                            zIndex: 10,
                        }}
                        pointerEvents="none"
                    >
                        <View
                            style={{
                                width: 56,
                                height: 3,
                                borderRadius: 3,
                                backgroundColor: 'rgba(0,0,0,0.35)',
                            }}
                        />
                    </View>
                )}

                {/* Header (Touchable) */}
                <TouchableOpacity onPress={handleToggle} activeOpacity={1}>
                    <View className="flex-col px-5 pb-7 pt-3 flex-1">
                        <Text className="text-white text-lg font-bold">
                            Interest from:{" "}
                            <Text className="font-normal">
                                {psw.firstName} {psw.lastName}
                            </Text>
                        </Text>
                        {!expanded && (
                            <View className="flex-row items-center">
                                <Text className="text-white text-base">Wants to provide care</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Expanded Content */}
                {expanded && (
                    <>
                        {/* PSW Name Section */}
                        <View className="px-5 mb-4">
                            <Text className="text-white text-lg font-bold text-center">
                                {psw.firstName} {psw.lastName}
                            </Text>
                            <Text className="text-white text-sm opacity-90 text-center">
                                Wants to provide care
                            </Text>
                        </View>

                        {/* Family member info if applicable */}
                        {isForFamilyMember && careRecipient && (
                            <View className="bg-white bg-opacity-20 rounded-lg p-3 mx-5 mb-4">
                                <Text className="text-white text-sm opacity-90 mb-1">
                                    Interested in caring for:
                                </Text>
                                <Text className="text-white text-base font-medium">
                                    {careRecipient.firstName} {careRecipient.lastName}
                                    {careRecipient.relationshipToUser && (
                                        <Text className="opacity-90"> ({careRecipient.relationshipToUser})</Text>
                                    )}
                                </Text>
                            </View>
                        )}

                        {/* Action buttons */}
                        <View className="flex-row gap-3 px-5">
                            <TouchableOpacity
                                onPress={handleRequestSession}
                                disabled={isProcessing}
                                className="flex-1 bg-white py-3 rounded-lg items-center"
                            >
                                <Text className="text-blue-600 font-bold text-base">
                                    {isProcessing ? 'Processing...' : 'Request'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleReject}
                                disabled={isRejecting}
                                className="flex-1 bg-black py-3 rounded-lg items-center"
                            >
                                <Text className="text-white font-bold text-base">
                                    {isRejecting ? 'Rejecting...' : 'Reject'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </LinearGradient>
        </View>
    );
};

export default InterestedCard; 