import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Modal, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { EnrichedSession } from '@/types/EnrichedSession';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getSessionDisplayInfo } from '@/features/sessions/utils/sessionDisplayUtils';
import { formatTimeRange } from '@/lib/datetimes/datetimeHelpers';
import { getAuthHeaders } from '@/lib/auth';
import { acceptTimeChange, rejectTimeChange } from '@/features/sessions/api/sessionApi';
import { useQueryClient } from '@tanstack/react-query';
import { useDistanceToPsw } from '@/features/sessions/hooks/useDistanceToPsw';
import { useCancelSession } from '@/features/sessions/api/queries';
interface SeekerRequestCardProps {
    session: EnrichedSession;
    onSelectPSW?: (pswId: string, applicant: any) => void;
}

const DistanceText: React.FC<{ origin?: string; destination?: string }> = ({ origin, destination }) => {
    const { data } = useDistanceToPsw(origin, destination);
    if (!origin || !destination || !data?.distance?.text) return null;
    return (
        <Text className="text-xs text-gray-500 mt-0.5">
            {data.distance.text} away
        </Text>
    );
};

const SeekerRequestCard: React.FC<SeekerRequestCardProps> = ({ session, onSelectPSW}) => {
    const currentUser = useSelector((state: RootState) => state.user.userData);
    const queryClient = useQueryClient();
    const cancelSessionMutation = useCancelSession();
    const isVerified = currentUser?.idManualVerified ?? false;
    const [applications, setApplications] = useState<any[]>([]);
    const [applicationsLoading, setApplicationsLoading] = useState<boolean>(true);
    // When PSW applies, session status / applicants / updatedAt change on the server but session.id does not.
    // Re-fetch candidates whenever those change so the list is not stuck on the initial empty load.
    const applicantsSignal = [
        session.updatedAt,
        session.status,
        Array.isArray((session as any).applicants) ? (session as any).applicants.join(',') : '',
    ].join('|');
    // For interested sessions, the PSW (otherUser) is the "interested" party - show them as selectable
    const displayApplicants = session.status === 'interested' && session.otherUser
        ? [session.otherUser]
        : applications;
    const [showTimeChangeModal, setShowTimeChangeModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    useEffect(() => {
        let isMounted = true;
        const fetchApplicants = async () => {
            try {

                console.log('fetching applicants for session:', session.id);
                setApplicationsLoading(true);
                const headers = await getAuthHeaders();
                const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${session.id}/candidates`, {
                    method: 'GET',
                    headers,
                });
                if (res.status === 404) {
                    if (isMounted) setApplications([]);
                    return;
                }
                if (!res.ok) {
                    // Swallow errors and show empty for robustness
                    if (isMounted) setApplications([]);
                    return;
                }
                const data = await res.json();
               
                if (isMounted) setApplications(Array.isArray(data) ? data : []);
            } catch {
                if (isMounted) setApplications([]);
            } finally {
                if (isMounted) setApplicationsLoading(false);
            }
        };
        fetchApplicants();
        return () => { isMounted = false; };
    }, [session.id, applicantsSignal]);
    const displayInfo = getSessionDisplayInfo(session, currentUser!);
    const [isExpanded, setIsExpanded] = useState(false);
    const isInterestedSession = session.status === 'interested';

    const startDate = session.startTime;
    const endDate = session.endTime;
    const date = startDate ? new Date(startDate) : undefined;
    const weekday = startDate
        ? new Date(startDate).toLocaleDateString('en-US', { weekday: 'short' })
        : undefined;
    const timeRange = startDate && endDate ? formatTimeRange(startDate, endDate) : undefined;
    const dateNumber = date ? date.getDate() : undefined;
    const dayTimeDisplay =
        weekday && typeof dateNumber === 'number' && timeRange
            ? `${weekday} ${dateNumber}. ${timeRange}`
            : weekday && timeRange
                ? `${weekday}. ${timeRange}`
                : 'Time TBD';

    // For interested sessions: show PSW who expressed interest. For newRequest (seeker's own): show "Your request" + address.
    const isOwnRequest = session.senderId === currentUser?.id;
    const displayName = isInterestedSession && session.otherUser
        ? `${session.otherUser.firstName} ${session.otherUser.lastName}`
        : isOwnRequest
            ? 'Your request'
            : `${session.careRecipientData?.firstName || session.careRecipient?.firstName} ${session.careRecipientData?.lastName || session.careRecipient?.lastName}`;
    const displayAddress = (isInterestedSession ? session.otherUser?.address : session.careRecipientData?.address || session.careRecipient?.address)?.street;
    const subtitle = displayName + (displayAddress ? `, ${displayAddress}` : '');

    // Check if there's a time change request
    const hasTimeChangeRequest = !!session.timeChangeRequest;

    // Prefer care recipient address when present, otherwise other user's address
    const address = session.careRecipient?.address || session.otherUser?.address;
    

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleTimeChangeClick = () => {
        setShowTimeChangeModal(true);
    };

    const handleAcceptTimeChange = async () => {
        try {
            setIsProcessing(true);
            await acceptTimeChange(session.id);
            await queryClient.invalidateQueries({ queryKey: ['enrichedSessions'] });
            setShowTimeChangeModal(false);
            alert('Time change accepted! Session time has been updated.');
        } catch (error) {
            console.error('Error accepting time change:', error);
            alert('Failed to accept time change. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRejectTimeChange = async () => {
        try {
            setIsProcessing(true);
            await rejectTimeChange(session.id);
            await queryClient.invalidateQueries({ queryKey: ['enrichedSessions'] });
            setShowTimeChangeModal(false);
            alert('Time change request declined.');
        } catch (error) {
            console.error('Error rejecting time change:', error);
            alert('Failed to reject time change. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancelRequest = () => {
        Alert.alert(
            'Cancel Session Request',
            'Are you sure you want to cancel this session request? No caregivers have applied yet.',
            [
                { text: 'Keep Request', style: 'cancel' },
                {
                    text: 'Cancel Request',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsProcessing(true);
                            await cancelSessionMutation.mutateAsync(session.id);
                            setIsExpanded(false);
                        } catch (error) {
                            console.error('Error cancelling session request:', error);
                            Alert.alert('Error', 'Failed to cancel session request. Please try again.');
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                },
            ]
        );
    };

    const canCancelRequest = isOwnRequest && (!displayApplicants || displayApplicants.length === 0);

    return (
        <View className="mb-6">
            {/* Session Info Card - Always Visible */}
            <TouchableOpacity
                onPress={toggleExpanded}
                className="bg-white rounded-xl p-4"
                style={{ marginBottom: isExpanded ? 4 : 0 }}
            >
                {/* Top Row: Session Title and Profile Pictures */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900">
                            {dayTimeDisplay}
                        </Text>
                       
                        <View className="flex-row items-center mt-1">
                            <Text className="text-sm text-gray-600">
                              {subtitle}
                            </Text>
                            <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color="#1A8BF8"
                                style={{ marginLeft: 4 }}
                            />
                        </View>
                    </View>

                    {/* Profile Pictures Preview - Top Right */}
                    {displayApplicants && displayApplicants.length > 0 && (
                        <View className="flex-row ml-4">
                            {displayApplicants
                                .slice(0, 3)
                                .map((applicant: any, index: number) => (
                                    // console.log('applicant', applicant),
                                    <Image
                                        key={applicant.id || index}
                                        source={
                                            applicant.profilePhotoUrl
                                                ? { uri: applicant.profilePhotoUrl}
                                                : require('@/assets/default-profile.png')
                                        }
                                        className="w-8 h-8 rounded-full border-2 border-white"
                                        style={{
                                            marginLeft: index > 0 ? -8 : 0,
                                            zIndex: (displayApplicants.length - index) as any,
                                        }}
                                    />
                                ))}
                            {displayApplicants.length > 3 && (
                                <View
                                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white items-center justify-center"
                                    style={{ marginLeft: -8, zIndex: 0 }}
                                >
                                    <Text className="text-xs text-gray-600 font-semibold">
                                        +{displayApplicants.length - 3}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Separator Line */}
                {hasTimeChangeRequest && (
                    <TouchableOpacity 
                        onPress={handleTimeChangeClick}
                        className="border-t border-orange-200 mt-3 pt-3 bg-orange-50 -mx-4 px-4 -mb-4 pb-4 rounded-b-xl active:bg-orange-100"
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <View className="flex-row items-center">
                                    <Ionicons name="time-outline" size={20} color="#f97316" style={{ marginRight: 8 }} />
                                    <Text className="text-sm font-semibold text-orange-600 mr-2">
                                        Time Change Requested
                                    </Text>
                                </View>
                                <Text className="text-xs text-orange-700 mt-1">
                                    A caregiver has proposed an alternate time
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#f97316" />
                        </View>
                    </TouchableOpacity>
                )}

                {displayApplicants && displayApplicants.length > 0 && !hasTimeChangeRequest && (
                    <View className="border-t border-gray-200 mt-3 pt-3">
                        <View className="flex-row items-center">
                            <Text className="text-sm text-gray-600 mr-2">
                                {isInterestedSession ? 'Caregiver interested' : 'New Responses'}
                            </Text>
                            <View className="bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                                <Text className="text-white text-xs font-bold">
                                    {displayApplicants.length}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                {/* Verified badge */}
                {!isVerified && (
                    <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={16} color="#1A8BF8" />
                        <Text className="text-sm text-gray-600 ml-2">
                            Request not sent, waiting for approval
                        </Text>
                    </View>
                )}

                {/* No applicants case */}
                {(!displayApplicants || displayApplicants.length === 0) && !applicationsLoading && !hasTimeChangeRequest && (
                    <View className="border-t border-gray-200 mt-3 pt-3">
                        <Text className="text-sm text-gray-500">
                            No applicants yet
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* PSW Applicants List - Expanded View */}
            {isExpanded && (
                <View className="bg-white rounded-xl overflow-hidden">
                    {applicationsLoading && !isInterestedSession ? (
                        <View className="p-4 items-center">
                            <ActivityIndicator size="small" color="#1A8BF8" />
                        </View>
                    ) : displayApplicants && displayApplicants.length > 0 ? (
                        <>
                            {displayApplicants.map((applicant: any, index: number) => (
                                // console.log('applicant', applicant),
                                // console.log('applicant.userId', applicant.id),
                                <TouchableOpacity
                                    key={applicant.id || index}
                                    onPress={() =>
                                        onSelectPSW?.(applicant.id, applicant)
                                    }
                                    className={`flex-row items-center px-4 py-3 ${
                                        index < displayApplicants.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                                >
                                    <Image
                                        source={
                                            applicant.profilePhotoUrl
                                                ? { uri: applicant.profilePhotoUrl }
                                                : require('@/assets/default-profile.png')
                                        }
                                        className="w-12 h-12 rounded-full mr-3"
                                    />
                                    <View className="flex-1">
                                        <Text className="text-base font-semibold text-gray-900">
                                            {applicant.firstName}{' '}
                                            {applicant.lastName?.charAt(0)}. {' '}
                                            {session?.timeChangeRequest?.proposedBy === applicant.id && (
                                             <Ionicons name="alert-circle" size={16} color="#f59e0b" />
                                        )}
                                        </Text>
                                        {applicant.careType && applicant.careType.length > 0 && (
                                            <Text className="text-sm text-gray-600 mt-0.5">
                                                {applicant.careType.join(', ')}
                                            </Text>
                                        )}
                                        {applicant.address && (
                                            <DistanceText
                                                origin={currentUser?.address?.fullAddress}
                                                destination={applicant.address.fullAddress}
                                            />
                                        )}
                                       
                                    </View>
                                    <View className="items-end">
                                        {applicant.hourlyRate && (
                                            <Text className="text-sm font-semibold text-gray-900">
                                                ${applicant.hourlyRate}/hr
                                            </Text>
                                        )}
                                        <Ionicons
                                            name="chevron-forward"
                                            size={20}
                                            color="#999"
                                            style={{ marginTop: 2 }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>
                    ) : (
                        <View className="p-6">
                            <View className="items-center mb-4">
                                <Ionicons name="people-outline" size={48} color="#D1D5DB" />
                                <Text className="text-gray-500 mt-3">No applicants yet</Text>
                            </View>
                            {/* Session details - view more info */}
                            {(session.careRecipientData?.address?.fullAddress || session.careRecipient?.address?.fullAddress) && (
                                <View className="mb-3">
                                    <Text className="text-xs font-medium text-gray-500 mb-1">Location</Text>
                                    <Text className="text-sm text-gray-800">
                                        {session.careRecipientData?.address?.fullAddress || session.careRecipient?.address?.fullAddress}
                                    </Text>
                                </View>
                            )}
                            {session.checklist && session.checklist.length > 0 && (
                                <View className="mb-3">
                                    <Text className="text-xs font-medium text-gray-500 mb-1">Tasks</Text>
                                    {session.checklist.map((item, idx) => (
                                        <Text key={item.id || idx} className="text-sm text-gray-800">
                                            • {item.task}
                                        </Text>
                                    ))}
                                </View>
                            )}
                            {session.note && (
                                <View className="mb-4">
                                    <Text className="text-xs font-medium text-gray-500 mb-1">Note</Text>
                                    <Text className="text-sm text-gray-800">{session.note}</Text>
                                </View>
                            )}
                            {canCancelRequest && (
                                <TouchableOpacity
                                    onPress={handleCancelRequest}
                                    disabled={isProcessing}
                                    className="mt-2 py-3 rounded-lg border border-red-300 bg-red-50 items-center"
                                >
                                    {isProcessing ? (
                                        <ActivityIndicator size="small" color="#DC2626" />
                                    ) : (
                                        <View className="flex-row items-center">
                                            <Ionicons name="close-circle-outline" size={20} color="#DC2626" style={{ marginRight: 6 }} />
                                            <Text className="text-red-600 font-semibold">Cancel Request</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            )}
            
            
        </View>
    );
};

export default SeekerRequestCard;


