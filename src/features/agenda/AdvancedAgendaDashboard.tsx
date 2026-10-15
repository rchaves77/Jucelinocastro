import React from 'react';
import { Appointment } from '../../types';
import { useAgendaState } from './hooks/useAgendaState';
import { usePatientState } from '../pacientes/hooks/usePatientState';
import { AgendaHeader } from './components/AgendaHeader';
import { AgendaGrid } from './components/AgendaGrid';
import { AppointmentModal } from './components/AppointmentModal';

interface AdvancedAgendaDashboardProps {
  onViewPatientRecord?: (patientId: string) => void;
  externalOpenModal?: boolean;
  onCloseExternalModal?: () => void;
  physios?: any[];
  onGenerateCertificate?: (app: Appointment) => void;
  onOpenWhatsAppConfirmations?: () => void;
}

export const AdvancedAgendaDashboard: React.FC<AdvancedAgendaDashboardProps> = ({
  onViewPatientRecord,
  externalOpenModal,
  onCloseExternalModal,
  physios = [],
  onGenerateCertificate,
  onOpenWhatsAppConfirmations,
}) => {
  const {
    patients,
    handleSavePatient,
    handleLogPatientCancellation,
    handleLogPatientAbsence,
  } = usePatientState();

  const {
    appointments,
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    selectedPhysioId,
    setSelectedPhysioId,
    statusFilter,
    setStatusFilter,
    isModalOpen,
    setIsModalOpen,
    editingAppointment,
    setEditingAppointment,
    handleCreateOrUpdate,
    handleStartAttendance,
    handleCancelAppointment,
    handleAbsenceAppointment,
    handleCompleteAppointment,
  } = useAgendaState();

  const isModalVisible = isModalOpen || Boolean(externalOpenModal);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    if (onCloseExternalModal) onCloseExternalModal();
  };

  const handleSaveAppointment = (data: any) => {
    let finalPatientId = data.patientId;
    let finalPatientName = data.patientName;
    let finalPatientPhone = data.patientPhone;

    // Fast Registration Mode
    if (data.isNewPatient && data.newPatientData) {
      const generatedId = `p_${Date.now()}`;
      finalPatientId = generatedId;
      finalPatientName = data.newPatientData.name;
      finalPatientPhone = data.newPatientData.phone;

      handleSavePatient({
        id: generatedId,
        name: data.newPatientData.name,
        cpf: data.newPatientData.cpf || '000.000.000-00',
        phone: data.newPatientData.phone,
        email: `${data.newPatientData.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        birthDate: '1990-01-01',
        gender: 'Outro',
        address: 'Endereço a atualizar',
        assignedPhysioId: data.physioId || 'u2',
        assignedPhysioName: data.physioName || 'Dr. Jucelino Castro',
        mainComplaint: data.notes || `Procedimento: ${data.newPatientData.procedureType || 'Consulta Inicial'}`,
        anamnesis: {
          mainComplaint: data.notes || `Recepção: ${data.newPatientData.procedureType || 'Consulta Inicial'}`,
          illnessHistory: 'Cadastro rápido realizado pela recepção durante o agendamento.',
          painScale: 0,
          physicalExam: 'Pendente de avaliação física presencial.',
          postureAnalysis: 'Pendente de avaliação postural.',
          treatmentPlan: `Plano inicial de ${data.newPatientData.procedureType || 'Atendimento'}.`,
          goals: 'Realizar avaliação clínica inicial.',
          clinicalObs: 'Prontuário gerado automaticamente na recepção.',
          lastUpdated: new Date().toISOString().split('T')[0],
        },
      });
    } else if (data.patientName && !patients.some((p) => p.name.toLowerCase() === data.patientName?.toLowerCase())) {
      // Fallback auto-create patient if name not found in database
      const generatedId = `p_${Date.now()}`;
      finalPatientId = generatedId;

      handleSavePatient({
        id: generatedId,
        name: data.patientName,
        cpf: '000.000.000-00',
        phone: data.patientPhone || '(11) 99999-9999',
        email: `${data.patientName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        birthDate: '1990-01-01',
        gender: 'Outro',
        address: 'Endereço a atualizar',
        assignedPhysioId: data.physioId || 'u2',
        assignedPhysioName: data.physioName || 'Dr. Jucelino Castro',
        mainComplaint: data.notes || 'Consulta Inicial / Agendamento Direto',
        anamnesis: {
          mainComplaint: data.notes || 'Consulta cadastrada pela recepção/agenda',
          illnessHistory: 'Agendamento direto realizado pela recepção.',
          painScale: 0,
          physicalExam: 'Pendente avaliação presencial.',
          postureAnalysis: 'Pendente avaliação postural.',
          treatmentPlan: 'Plano de tratamento em elaboração.',
          goals: 'Fazer avaliação e alívio de sintomas.',
          clinicalObs: 'Cadastrado automaticamente via agendamento de consulta.',
          lastUpdated: new Date().toISOString().split('T')[0],
        },
      });
    }

    handleCreateOrUpdate({
      ...data,
      patientId: finalPatientId,
      patientName: finalPatientName,
      patientPhone: finalPatientPhone,
    });
  };

  // Wrapper for cancellation with Prontuário Evolution logging
  const handleCancelWithLog = (appointmentId: string) => {
    const targetApp = appointments.find((a) => a.id === appointmentId);
    if (targetApp) {
      handleLogPatientCancellation(targetApp.patientId, {
        date: targetApp.date,
        timeSlot: targetApp.timeSlot,
        physioName: targetApp.physioName,
      });
    }
    handleCancelAppointment(appointmentId);
  };

  // Wrapper for absence/no-show with Prontuário Evolution logging
  const handleAbsenceWithLog = (appointmentId: string) => {
    const targetApp = appointments.find((a) => a.id === appointmentId);
    if (targetApp) {
      handleLogPatientAbsence(targetApp.patientId, {
        date: targetApp.date,
        timeSlot: targetApp.timeSlot,
        physioName: targetApp.physioName,
      });
    }
    handleAbsenceAppointment(appointmentId);
  };

  // Wrapper for completion (Atendido) with auto-certificate generation!
  const handleCompleteWithCertificate = (appointmentId: string) => {
    handleCompleteAppointment(appointmentId);
    const targetApp = appointments.find((a) => a.id === appointmentId);
    if (targetApp && onGenerateCertificate) {
      onGenerateCertificate({ ...targetApp, status: 'completed' });
    }
  };

  // Handler for creating directly from a specific slot (titular or encaixe)
  const handleNewAtSlot = (timeSlot: string, isEncaixe: boolean) => {
    setEditingAppointment({
      id: '',
      patientId: '',
      patientName: '',
      patientPhone: '',
      physioId: selectedPhysioId !== 'all' ? selectedPhysioId : 'u2',
      physioName: 'Dr. Jucelino Castro',
      date: selectedDate,
      timeSlot,
      type: 'Sessão',
      room: 'Quiropraxia - Sala 01',
      status: 'confirmed',
      price: 180,
      isEncaixe,
    } as Appointment);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header controls & filters */}
      <AgendaHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedPhysioId={selectedPhysioId}
        onPhysioChange={setSelectedPhysioId}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenWhatsAppConfirmations={onOpenWhatsAppConfirmations}
        onOpenNewModal={() => {
          setEditingAppointment(null);
          setIsModalOpen(true);
        }}
      />

      {/* Agenda grid / calendar */}
      <AgendaGrid
        appointments={appointments}
        viewMode={viewMode}
        selectedDate={selectedDate}
        onEdit={(app) => {
          setEditingAppointment(app);
          setIsModalOpen(true);
        }}
        onNewAtSlot={handleNewAtSlot}
        onStartAttendance={handleStartAttendance}
        onCancel={handleCancelWithLog}
        onAbsence={handleAbsenceWithLog}
        onComplete={handleCompleteWithCertificate}
        onGenerateCertificate={onGenerateCertificate}
        onViewPatientRecord={onViewPatientRecord}
      />

      {/* Appointment Create/Edit Modal */}
      <AppointmentModal
        isOpen={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveAppointment}
        initialData={editingAppointment}
        defaultDate={selectedDate}
        patients={patients}
        physios={physios}
        existingAppointments={appointments}
      />
    </div>
  );
};


