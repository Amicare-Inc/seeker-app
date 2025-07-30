import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EnrichedSession } from '@/types/EnrichedSession';

interface SessionCompletionContextType {
  completedSession: EnrichedSession | null;
  setCompletedSession: (session: EnrichedSession | null) => void;
  clearCompletedSession: () => void;
}

const SessionCompletionContext = createContext<SessionCompletionContextType>({
  completedSession: null,
  setCompletedSession: () => {},
  clearCompletedSession: () => {},
});

interface SessionCompletionProviderProps {
  children: ReactNode;
}

export const SessionCompletionProvider: React.FC<SessionCompletionProviderProps> = ({ children }) => {
  const [completedSession, setCompletedSessionState] = useState<EnrichedSession | null>(null);

  const setCompletedSession = (session: EnrichedSession | null) => {
    setCompletedSessionState(session);
  };

  const clearCompletedSession = () => {
    setCompletedSessionState(null);
  };

  return (
    <SessionCompletionContext.Provider 
      value={{ 
        completedSession, 
        setCompletedSession, 
        clearCompletedSession 
      }}
    >
      {children}
    </SessionCompletionContext.Provider>
  );
};

export const useSessionCompletion = () => {
  const context = useContext(SessionCompletionContext);
  if (!context) {
    throw new Error('useSessionCompletion must be used within a SessionCompletionProvider');
  }
  return context;
}; 