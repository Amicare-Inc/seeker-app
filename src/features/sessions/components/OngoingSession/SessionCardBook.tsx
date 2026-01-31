import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, PanResponder, LayoutAnimation, Platform, UIManager, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { EnrichedSession } from '@/types/EnrichedSession';
import { formatTimeRange, formatDate } from '@/lib/datetimes/datetimeHelpers';
import { router } from 'expo-router';
import { useBookCandidateSession, useRejectSession } from '@/features/sessions/api/queries';
import SessionChecklistBox from './SessionChecklistBox';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { acceptTimeChange, rejectTimeChange } from '@/features/sessions/api/sessionApi';
import { useStripe } from '@stripe/stripe-react-native';
import { PaymentService } from '@/services/stripe/payment-service';
const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type SessionCardSeekerProps = EnrichedSession & { candidateUserId?: string };

const SessionCardSeeker = (enrichedSession: SessionCardSeekerProps) => {
    const [expanded, setExpanded] = React.useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const expandedRef = useRef(expanded);

    const bookSessionMutation = useBookCandidateSession();
    const rejectSessionMutation = useRejectSession();
    const currentUser = useSelector((state: RootState) => state.user.userData);
    const stripe = useStripe();

    React.useEffect(() => {
        expandedRef.current = expanded;
    }, [expanded]);

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
    
    console.log('enrichedSession.candidateUserId', enrichedSession.candidateUserId);
    const handleBook = async () => {
        if (!currentUser?.id) return;

        // Initiate Stripe payment first
        if (!stripe) {
            Alert.alert('Error', 'Payment system not available. Please try again.');
            return;
        }

        setIsProcessingPayment(true);
        try {
            const paymentService = PaymentService.getInstance();
            const paymentSuccess = await paymentService.initiatePayment(enrichedSession, stripe);

            if (!paymentSuccess) {
                setIsProcessingPayment(false);
                return;
            }

            // Payment successful, proceed with booking
            if (enrichedSession.timeChangeRequest?.proposedBy === enrichedSession.candidateUserId) {
                await acceptTimeChange(enrichedSession.id);
            }

            await bookSessionMutation.mutateAsync({
                sessionId: enrichedSession.id,
                currentUserId: currentUser.id,
                candidateUserId: enrichedSession.candidateUserId ?? ''
            });

            Alert.alert(
                'Success',
                'Session booked successfully!',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (err) {
            console.error('Error booking session:', err);
            Alert.alert('Error', 'Failed to book session. Please try again.');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleReject = async () => {
        try {
            await rejectSessionMutation.mutateAsync(enrichedSession.id);
            router.back();
        } catch (err) {
            console.error('Error rejecting session:', err);
        }
    };

    const note = enrichedSession.note ?? 'Appointment';
    const dateLabel = enrichedSession.startTime ? formatDate(enrichedSession.startTime) : 'Invalid Date';
    const timeRange = enrichedSession.startTime && enrichedSession.endTime
        ? formatTimeRange(enrichedSession.startTime, enrichedSession.endTime)
        : 'Invalid Time';
    const toIsoString = (value: any): string | null => {
        if (!value) return null;
        if (typeof value === 'string') {
            const d = new Date(value);
            return isNaN(d.getTime()) ? null : d.toISOString();
        }
        if (typeof value === 'number') {
            const ms = value < 10000000000 ? value * 1000 : value;
            const d = new Date(ms);
            return isNaN(d.getTime()) ? null : d.toISOString();
        }
        const seconds = (value as any).seconds ?? (value as any)._seconds;
        const nanoseconds = (value as any).nanoseconds ?? (value as any)._nanoseconds ?? 0;
        if (typeof seconds === 'number') {
            const d = new Date(seconds * 1000 + nanoseconds / 1e6);
            return isNaN(d.getTime()) ? null : d.toISOString();
        }
        return null;
    };
    const proposedStartIso = toIsoString(enrichedSession.timeChangeRequest?.proposedStartTime);
    const proposedEndIso = toIsoString(enrichedSession.timeChangeRequest?.proposedEndTime);
    const requestedTimeRange = proposedStartIso && proposedEndIso
        ? formatTimeRange(proposedStartIso, proposedEndIso)
        : null;
    const startDate = enrichedSession.startTime ? new Date(enrichedSession.startTime) : null;
    const endDate = enrichedSession.endTime ? new Date(enrichedSession.endTime) : null;
    const isNextDay = startDate && endDate ? endDate.getDate() !== startDate.getDate() : false;
    console.log('timeRange', enrichedSession.startTime);
    console.log('requestedTimeRange',  enrichedSession.timeChangeRequest?.proposedStartTime );
    const handleToggle = () => {
        LayoutAnimation.easeInEaseOut();
        setExpanded((prev) => !prev);
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
                colors={['#05549e', '#0c7ae2', '#399cf9']}
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

                <TouchableOpacity onPress={handleToggle} activeOpacity={1} className="flex-row items-center">
                    <View className="flex-col px-5 pb-7 pt-3 flex-1">
                        <Text className="text-white text-lg font-bold">
                            Care Type:{' '}
                            <Text className="font-normal">
                                {note && note.length > 12 ? `${note.slice(0, 23)}...` : note}
                            </Text>
                        </Text>
                        {!expanded && (
                            <View className="flex-row items-center">
                                <Text className="text-white text-base">{dateLabel}</Text>
                                <Text className="text-xs text-green-400 ml-2">{`${isNextDay ? '+1' : ''}`}</Text>
                            </View>
                        )}
                    </View>
                   
                    
                    <Ionicons name="calendar-outline" size={32} color="#fff" style={{ position: 'absolute', right: 25, top: 15 }} />
                </TouchableOpacity>

                {expanded && (
                    <>
                        <View className="flex-row justify-between items-center bg-transparent rounded-full border border-white px-6 py-2.5 mb-4 mx-5 mt-2">
                            <View className="flex-row items-center">
                                <Ionicons name="calendar-outline" size={24} color="#fff" />
                                <Text className="text-white ml-2 text-[17px] font-medium">{dateLabel}</Text>
                                <Text className="text-xs text-green-400 ml-2">{`${isNextDay ? '+1' : ''}`}</Text>
                            </View>
                            <View style={{ width: 1, height: 28 }} className="bg-neutral-100" />
                            <View className="flex-row items-center">
                            {enrichedSession.timeChangeRequest?.proposedBy === enrichedSession.candidateUserId && (
                                <>
                                    <Ionicons name="alert-circle" size={20} color="#f59e0b" />
                                </>
                                )}
                                <Ionicons name="time-outline" size={24} color="#fff" />
                                {requestedTimeRange ? (
                                    <Text className="text-white ml-2 text-[17px] font-medium">{requestedTimeRange}</Text>
                                ) : (
                                <Text className="text-white ml-2 text-[17px] font-medium">{timeRange}</Text>
                                )}
                            </View>
                        </View>

                        <SessionChecklistBox checklist={enrichedSession.checklist ?? []} editable={false} />

                        <View className="flex-row items-center mb-4 px-5">
                            <Text className="text-white ml-1.5 text-[14px] font-semibold">Book to unlock chat</Text>
                            <View className="flex-1" />
                            <Text className="text-white text-[14px] font-semibold">
                                Total Cost: <Text className="font-bold">${enrichedSession.billingDetails?.total.toFixed(2)}</Text>
                            </Text>
                        </View>

                        <View className="flex-row gap-3 mb-2 px-5">
                            <TouchableOpacity
                                onPress={handleBook}
                                className="flex-1 bg-white py-2 rounded-lg items-center"
                                disabled={isProcessingPayment || bookSessionMutation.isPending}
                            >
                                <Text className="text-black text-base font-medium">
                                    {isProcessingPayment ? 'Processing...' : bookSessionMutation.isPending ? 'Booking...' : 'Book'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleReject}
                                className="flex-1 bg-black py-2 rounded-lg items-center"
                                disabled={isProcessingPayment || rejectSessionMutation.isPending}
                            >
                                <Text className="text-white text-base font-medium">
                                    {rejectSessionMutation.isPending ? 'Rejecting...' : 'Reject'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </LinearGradient>
        </View>
    );
};

export default SessionCardSeeker;


