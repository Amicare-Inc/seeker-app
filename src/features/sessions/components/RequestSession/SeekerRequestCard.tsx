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

interface SeekerRequestCardProps {
    session: EnrichedSession;
    onSelectPSW?: (pswId: string, applicant: any) => void;
}

const SeekerRequestCard: React.FC<SeekerRequestCardProps> = ({ session, onSelectPSW }) => {
    const currentUser = useSelector((state: RootState) => state.user.userData);
    const queryClient = useQueryClient();
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

    const weekday = startDate
        ? new Date(startDate).toLocaleDateString('en-US', { weekday: 'short' })
        : undefined;
    const timeRange = startDate && endDate ? formatTimeRange(startDate, endDate) : undefined;
    const dayTimeDisplay = weekday && timeRange ? `${weekday}. ${timeRange}` : 'Time TBD';

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
                                {displayInfo.primaryName},{' '}
                                {session.careRecipient?.address?.city ||
                                    session.otherUser?.address?.city ||
                                    'Toronto'}
                                ,{' '}
                                {session.careRecipient?.address?.province ||
                                    session.otherUser?.address?.province ||
                                    'ON'}
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
                                            {applicant.lastName?.charAt(0)}.
                                        </Text>
                                        {applicant.specialties && applicant.specialties.length > 0 && (
                                            <Text className="text-sm text-gray-600 mt-0.5">
                                                {applicant.specialties.join(', ')}
                                            </Text>
                                        )}
                                        {applicant.distance && (
                                            <Text className="text-xs text-gray-500 mt-0.5">
                                                {applicant.distance}
                                            </Text>
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
            
            {/* Time Change Request Modal */}
            <Modal
                visible={showTimeChangeModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowTimeChangeModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 pb-10">
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-xl font-bold text-gray-900">
                                Time Change Request
                            </Text>
                            <TouchableOpacity onPress={() => setShowTimeChangeModal(false)}>
                                <Ionicons name="close" size={28} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {session.timeChangeRequest && (
                            <>
                                {/* Debug logging */}
                                {console.log('Time Change Request Data:', {
                                    proposedStartTime: session.timeChangeRequest.proposedStartTime,
                                    proposedEndTime: session.timeChangeRequest.proposedEndTime,
                                    proposedStartType: typeof session.timeChangeRequest.proposedStartTime,
                                    proposedEndType: typeof session.timeChangeRequest.proposedEndTime
                                })}
                                
                                {/* Current Time */}
                                <View className="mb-6">
                                    <Text className="text-sm font-semibold text-gray-500 mb-2">
                                        Current Session Time
                                    </Text>
                                    <View className="bg-gray-50 p-4 rounded-xl">
                                        <Text className="text-base text-gray-900">
                                            {dayTimeDisplay}
                                        </Text>
                                    </View>
                                </View>

                                {/* Proposed Time */}
                                <View className="mb-6">
                                    <Text className="text-sm font-semibold text-orange-600 mb-2">
                                        Proposed New Time
                                    </Text>
                                    <View className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                                        <Text className="text-base font-semibold text-gray-900">
                                            {(() => {
                                                try {
                                                    const proposedStartTime = session.timeChangeRequest.proposedStartTime;
                                                    const proposedEndTime = session.timeChangeRequest.proposedEndTime;
                                                    
                                                    console.log('Raw timestamps:', { proposedStartTime, proposedEndTime });
                                                    
                                                    let proposedStart: Date;
                                                    let proposedEnd: Date;
                                                    
                                                    // Handle different timestamp formats
                                                    if (typeof proposedStartTime === 'string') {
                                                        // ISO string
                                                        proposedStart = new Date(proposedStartTime);
                                                    } else if (typeof proposedStartTime === 'number') {
                                                        // Unix timestamp - could be seconds or milliseconds
                                                        // If less than year 2100 in seconds, it's in seconds
                                                        proposedStart = proposedStartTime < 10000000000 
                                                            ? new Date(proposedStartTime * 1000) 
                                                            : new Date(proposedStartTime);
                                                    } else if (proposedStartTime && typeof proposedStartTime === 'object') {
                                                        // Firestore Timestamp object with seconds/nanoseconds or _seconds/_nanoseconds
                                                        const seconds = (proposedStartTime as any).seconds || (proposedStartTime as any)._seconds;
                                                        const nanoseconds = (proposedStartTime as any).nanoseconds || (proposedStartTime as any)._nanoseconds || 0;
                                                        proposedStart = new Date(seconds * 1000 + nanoseconds / 1000000);
                                                    } else {
                                                        proposedStart = new Date(proposedStartTime);
                                                    }
                                                    
                                                    if (typeof proposedEndTime === 'string') {
                                                        proposedEnd = new Date(proposedEndTime);
                                                    } else if (typeof proposedEndTime === 'number') {
                                                        proposedEnd = proposedEndTime < 10000000000 
                                                            ? new Date(proposedEndTime * 1000) 
                                                            : new Date(proposedEndTime);
                                                    } else if (proposedEndTime && typeof proposedEndTime === 'object') {
                                                        const seconds = (proposedEndTime as any).seconds || (proposedEndTime as any)._seconds;
                                                        const nanoseconds = (proposedEndTime as any).nanoseconds || (proposedEndTime as any)._nanoseconds || 0;
                                                        proposedEnd = new Date(seconds * 1000 + nanoseconds / 1000000);
                                                    } else {
                                                        proposedEnd = new Date(proposedEndTime);
                                                    }
                                                    
                                                    console.log('Parsed dates:', { 
                                                        proposedStart: proposedStart.toISOString(), 
                                                        proposedEnd: proposedEnd.toISOString()
                                                    });
                                                    
                                                    // Check if dates are valid
                                                    if (isNaN(proposedStart.getTime()) || isNaN(proposedEnd.getTime())) {
                                                        console.error('Invalid dates after parsing');
                                                        return `Invalid date (start: ${proposedStartTime}, end: ${proposedEndTime})`;
                                                    }
                                                    
                                                    const weekday = proposedStart.toLocaleDateString('en-US', { weekday: 'short' });
                                                    const timeRange = formatTimeRange(
                                                        proposedStart.toISOString(),
                                                        proposedEnd.toISOString()
                                                    );
                                                    return `${weekday}. ${timeRange}`;
                                                } catch (error) {
                                                    console.error('Error formatting proposed time:', error);
                                                    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
                                                }
                                            })()}
                                        </Text>
                                        {session.timeChangeRequest.note && (
                                            <Text className="text-sm text-gray-600 mt-2">
                                                Note: {session.timeChangeRequest.note}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Action Buttons */}
                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        onPress={handleRejectTimeChange}
                                        disabled={isProcessing}
                                        className="flex-1 bg-gray-200 rounded-xl py-4 items-center"
                                    >
                                        <Text className="text-gray-800 font-semibold text-base">
                                            Decline
                                        </Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity
                                        onPress={handleAcceptTimeChange}
                                        disabled={isProcessing}
                                        className={`flex-1 bg-brand-blue rounded-xl py-4 items-center ${isProcessing ? 'opacity-50' : ''}`}
                                    >
                                        <Text className="text-white font-semibold text-base">
                                            {isProcessing ? 'Processing...' : 'Accept'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SeekerRequestCard;


