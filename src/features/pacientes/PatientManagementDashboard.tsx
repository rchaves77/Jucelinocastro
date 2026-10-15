import React, { useEffect } from 'react';
import { usePatientState } from './hooks/usePatientState';
import { PatientHeader } from './components/PatientHeader';
import { PatientTable } from './components/PatientTable';
import { PatientMedicalRecord } from './components/PatientMedicalRecord';
import { PatientModal } from './components/PatientModal';
import { User, EvolutionTemplate } from '../../types';

interface PatientManagementDashboardProps {
  onZoomImage: (title: string, url: string, category?: string, date?: string, notes?: string) => void;
  selectedPatientIdParam?: string | null;
  externalOpenModal?: boolean;
  onCloseExternalModal?: () => void;
  currentUser?: User;
  templates?: EvolutionTemplate[];
  onAddTemplate?: (tpl: Omit<EvolutionTemplate, 'id' | 'createdAt'>) => void;
  onUpdateTemplate?: (id: string, tpl: Partial<EvolutionTemplate>) => void;
  onDeleteTemplate?: (id: string) => void;
  onAddAuditLog?: (log: any) => void;
}

export const PatientManagementDashboard: React.FC<PatientManagementDashboardProps> = ({
  onZoomImage,
  selectedPatientIdParam,
  externalOpenModal,
  onCloseExternalModal,
  currentUser,
  templates = [],
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onAddAuditLog,
}) => {
  const {
    patients,
    selectedPatient,
    setSelectedPatient,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isPatientModalOpen,
    setIsPatientModalOpen,
    editingPatient,
    setEditingPatient,
    handleSavePatient,
    handleAddEvolution,
    handleUpdateEvolution,
    handleDeleteEvolution,
    handleAddExam,
  } = usePatientState();

  useEffect(() => {
    if (selectedPatientIdParam) {
      const match = patients.find((p) => p.id === selectedPatientIdParam);
      if (match) setSelectedPatient(match);
    }
  }, [selectedPatientIdParam, patients]);

  const isModalVisible = isPatientModalOpen || Boolean(externalOpenModal);

  const handleCloseModal = () => {
    setIsPatientModalOpen(false);
    setEditingPatient(null);
    if (onCloseExternalModal) onCloseExternalModal();
  };

  if (selectedPatient) {
    return (
      <PatientMedicalRecord
        patient={selectedPatient}
        onBack={() => setSelectedPatient(null)}
        onAddEvolution={handleAddEvolution}
        onUpdateEvolution={handleUpdateEvolution}
        onDeleteEvolution={handleDeleteEvolution}
        onAddExam={handleAddExam}
        onZoomImage={onZoomImage}
        currentUser={currentUser}
        templates={templates}
        onAddTemplate={onAddTemplate}
        onUpdateTemplate={onUpdateTemplate}
        onDeleteTemplate={onDeleteTemplate}
        onAddAuditLog={onAddAuditLog}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PatientHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenNewPatientModal={() => setIsPatientModalOpen(true)}
        totalCount={patients.length}
      />

      <PatientTable
        patients={patients}
        onSelectPatient={(p) => setSelectedPatient(p)}
        onEditPatient={(p) => {
          setEditingPatient(p);
          setIsPatientModalOpen(true);
        }}
        onZoomImage={onZoomImage}
      />

      <PatientModal
        isOpen={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSavePatient}
        initialData={editingPatient}
      />
    </div>
  );
};
