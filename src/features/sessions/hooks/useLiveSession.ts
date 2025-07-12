import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEnrichedSessions } from "@/features/sessions/api/queries";

export const useLiveSession = () => {
    const userId = useSelector((state: RootState) => state.user.userData?.id);
    const { data: sessions = [] } = useEnrichedSessions(userId);
    
    // Find single active session based on existing fields
    const activeLiveSession = useMemo(() => 
      sessions.find(session => 
        // Already in progress
        (session.status === 'inProgress') ||
        // Or confirmed and within time window
        (session.status === 'confirmed' && 
         session.liveStatus === 'upcoming' || 
         session.liveStatus === 'ready')
      )
    , [sessions]);
  
    return activeLiveSession;
  };