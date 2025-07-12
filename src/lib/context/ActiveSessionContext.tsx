import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EnrichedSession } from '@/types/EnrichedSession';

interface ActiveSessionContextType {
  activeEnrichedSession: EnrichedSession | null;
  setActiveEnrichedSession: (session: EnrichedSession | null) => void;
}

const ActiveSessionContext = createContext<ActiveSessionContextType | undefined>(undefined);

export function ActiveSessionProvider({ children }: { children: ReactNode }) {
  const [activeEnrichedSession, setActiveEnrichedSession] = useState<EnrichedSession | null>(null);

  return (
    <ActiveSessionContext.Provider value={{ activeEnrichedSession, setActiveEnrichedSession }}>
      {children}
    </ActiveSessionContext.Provider>
  );
}

export function useActiveSession() {
  const context = useContext(ActiveSessionContext);
  if (context === undefined) {
    throw new Error('useActiveSession must be used within an ActiveSessionProvider');
  }
  return context;
} 