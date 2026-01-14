import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native';
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
    const isVerified = currentUser?.idManualVerified ?? false;
    const [applications, setApplications] = useState<any[]>([]);
    const [applicationsLoading, setApplicationsLoading] = useState<boolean>(true);
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
    }, [session.id]);
    const displayInfo = getSessionDisplayInfo(session, currentUser!);
    const [isExpanded, setIsExpanded] = useState(false);

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
                              {session.careRecipientData?.firstName} {session.careRecipientData?.lastName}, {session.careRecipientData?.address?.street}
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
                    {applications && applications.length > 0 && (
                        <View className="flex-row ml-4">
                            {applications
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
                                            zIndex: (applications.length - index) as any,
                                        }}
                                    />
                                ))}
                            {applications.length > 3 && (
                                <View
                                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white items-center justify-center"
                                    style={{ marginLeft: -8, zIndex: 0 }}
                                >
                                    <Text className="text-xs text-gray-600 font-semibold">
                                        +{applications.length - 3}
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

                {applications && applications.length > 0 && !hasTimeChangeRequest && (
                    <View className="border-t border-gray-200 mt-3 pt-3">
                        <View className="flex-row items-center">
                            <Text className="text-sm text-gray-600 mr-2">
                                New Responses
                            </Text>
                            <View className="bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                                <Text className="text-white text-xs font-bold">
                                    {applications.length}
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
                {(!applications || applications.length === 0) && !applicationsLoading && !hasTimeChangeRequest && (
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
                    {applicationsLoading ? (
                        <View className="p-4 items-center">
                            <ActivityIndicator size="small" color="#1A8BF8" />
                        </View>
                    ) : applications && applications.length > 0 ? (
                        <>
                            {applications.map((applicant: any, index: number) => (
                                // console.log('applicant', applicant),
                                // console.log('applicant.userId', applicant.id),
                                <TouchableOpacity
                                    key={applicant.id || index}
                                    onPress={() =>
                                        onSelectPSW?.(applicant.id, applicant)
                                    }
                                    className={`flex-row items-center px-4 py-3 ${
                                        index < applications.length - 1 ? 'border-b border-gray-100' : ''
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
                        <View className="p-6 items-center">
                            <Ionicons name="people-outline" size={48} color="#D1D5DB" />
                            <Text className="text-gray-500 mt-3">No applicants yet</Text>
                        </View>
                    )}
                </View>
            )}
            
            
        </View>
    );
};

export default SeekerRequestCard;


