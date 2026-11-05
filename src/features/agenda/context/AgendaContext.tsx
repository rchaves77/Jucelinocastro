import React, { createContext, useContext } from 'react';
import { useAgendaState, ViewMode } from '../hooks/useAgendaState';
import { Appointment } from '../../../types';

type AgendaStateValue = ReturnType<typeof useAgendaState>;

const AgendaContext = createContext<AgendaStateValue | null>(null);

export const AgendaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useAgendaState();
  return <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>;
};

export function useAgenda(): AgendaStateValue {
  const ctx = useContext(AgendaContext);
  if (!ctx) {
    throw new Error('useAgenda deve ser usado dentro de <AgendaProvider>.');
  }
  return ctx;
}

export type { ViewMode, Appointment };
