import React, { createContext, useContext } from 'react';
import { usePatientState } from '../hooks/usePatientState';

type PatientStateValue = ReturnType<typeof usePatientState>;

const PatientContext = createContext<PatientStateValue | null>(null);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = usePatientState();
  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
};

export function usePatients(): PatientStateValue {
  const ctx = useContext(PatientContext);
  if (!ctx) {
    throw new Error('usePatients deve ser usado dentro de <PatientProvider>.');
  }
  return ctx;
}
