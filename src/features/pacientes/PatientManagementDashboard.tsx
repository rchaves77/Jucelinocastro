import React, { useEffect, useState } from 'react';
import { usePatients } from './context/PatientContext';
import { PatientHeader } from './components/PatientHeader';
import { PatientTable } from './components/PatientTable';
import { PatientMedicalRecord } from './components/PatientMedicalRecord';
import { PatientModal } from './components/PatientModal';
import { User, EvolutionTemplate, Patient } from '../../types';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

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
  const { showToast } = useToast();

  const {
    patients,
    allPatients,
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
    handleDeletePatient,
    handleAddEvolution,
    handleUpdateEvolution,
    handleDeleteEvolution,
    handleAddExam,
  } = usePatients();

  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  useEffect(() => {
    if (selectedPatientIdParam) {
      const match = (allPatients || []).find((p) => p.id === selectedPatientIdParam);
      if (match) setSelectedPatient(match);
    }
  }, [selectedPatientIdParam, allPatients]);

  const isModalVisible = isPatientModalOpen || Boolean(externalOpenModal);

  const handleCloseModal = () => {
    setIsPatientModalOpen(false);
    setEditingPatient(null);
    if (onCloseExternalModal) onCloseExternalModal();
  };

  const confirmDelete = () => {
    if (!patientToDelete) return;

    handleDeletePatient(patientToDelete.id);

    if (onAddAuditLog) {
      onAddAuditLog({
        action: 'DELETE_PATIENT',
        target: patientToDelete.name,
        user: currentUser?.name || 'Sistema',
        timestamp: new Date().toISOString(),
      });
    }

    showToast('success', 'Prontuário excluído', patientToDelete.name);
    setPatientToDelete(null);
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
        onDeletePatient={(p) => setPatientToDelete(p)}
        onZoomImage={onZoomImage}
      />

      <PatientModal
        isOpen={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSavePatient}
        initialData={editingPatient}
      />

      {patientToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 shrink-0">
                <AlertTriangle className="h-6 w-6 text-rose-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white">Excluir prontuário?</h3>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  O prontuário de <strong className="text-white">{patientToDelete.name}</strong> será
                  removido permanentemente, incluindo evoluções e exames.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-slate-300 space-y-1">
              <p>
                <strong className="text-slate-200">CPF:</strong> {patientToDelete.cpf}
              </p>
              <p>
                <strong className="text-slate-200">Telefone:</strong> {patientToDelete.phone}
              </p>
              <p>
                <strong className="text-slate-200">Evoluções:</strong>{' '}
                {patientToDelete.evolutions?.length || 0}
              </p>
            </div>

            <p className="text-xs text-rose-300 font-semibold">
              Esta ação não pode ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setPatientToDelete(null)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white hover:bg-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
