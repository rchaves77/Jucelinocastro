import React from 'react';
import { Appointment } from '../../types';
import { useAgenda } from './context/AgendaContext';
import { usePatients } from '../pacientes/context/PatientContext';
import { AgendaHeader } from './components/AgendaHeader';
import { AgendaGrid } from './components/AgendaGrid';
import { AppointmentModal } from './components/AppointmentModal';
import { useToast } from '../../components/common/Toast';

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
  const { showToast } = useToast();

  // Usa o PatientProvider — mesma instância do App, sem duplicar estado
  const {
    allPatients,
    handleSavePatient,
    handleLogPatientCancellation,
    handleLogPatientAbsence,
  } = usePatients();

  const {
    appointments,
    allAppointments,
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
  } = useAgenda();

  const isModalVisible = isModalOpen || Boolean(externalOpenModal);
  const validationSource = Array.isArray(allAppointments) ? allAppointments : [];
  const patientSource = Array.isArray(allPatients) ? allPatients : [];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
    if (onCloseExternalModal) onCloseExternalModal();
  };

  const handleSaveAppointment = (data: any): boolean => {
    // Validação de capacidade: 1 titular + 1 encaixe por horário
    const sameSlot = validationSource.filter(
      (a) =>
        a.date === data.date &&
        a.timeSlot === data.timeSlot &&
        a.id !== data.id &&
        a.status !== 'canceled' &&
        a.status !== 'no_show'
    );

    const titulares = sameSlot.filter((a) => !a.isEncaixe).length;
    const encaixes = sameSlot.filter((a) => a.isEncaixe).length;

    if (!data.isEncaixe && titulares >= 1) {
      showToast(
        'error',
        'Horário já ocupado',
        `As ${data.timeSlot} já têm um paciente titular. Use a vaga de encaixe ou escolha outro horário.`
      );
      return false;
    }

    if (data.isEncaixe && encaixes >= 1) {
      showToast(
        'error',
        'Encaixe já ocupado',
        `As ${data.timeSlot} já têm um encaixe. Cada horário aceita 1 titular e 1 encaixe.`
      );
      return false;
    }

    // Validação de domingo
    const dayOfWeek = new Date(`${data.date}T00:00:00`).getDay();
    if (dayOfWeek === 0) {
      showToast('error', 'Domingo fechado', 'A clínica não abre aos domingos.');
      return false;
    }

    let finalPatientId = data.patientId;
    let finalPatientName = data.patientName;
    let finalPatientPhone = data.patientPhone;

    // Cadastro rápido de paciente novo
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
        mainComplaint:
          data.notes || `Procedimento: ${data.newPatientData.procedureType || 'Consulta Inicial'}`,
        anamnesis: {
          mainComplaint:
            data.notes || `Recepção: ${data.newPatientData.procedureType || 'Consulta Inicial'}`,
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
    } else if (
      data.patientName &&
      !patientSource.some((p) => p.name?.toLowerCase() === data.patientName?.toLowerCase())
    ) {
      // Fallback: cria paciente se o nome não existir na base completa
      const generatedId = `p_${Date.now()}`;
      finalPatientId = generatedId;

      handleSavePatient({
        id: generatedId,
        name: data.patientName,
        cpf: '000.000.000-00',
        phone: data.patientPhone || '(68) 99999-9999',
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

    const saved = handleCreateOrUpdate({
      ...data,
      patientId: finalPatientId,
      patientName: finalPatientName,
      patientPhone: finalPatientPhone,
    });

    if (saved === false) {
      showToast('error', 'Não foi possível salvar', 'Verifique o horário e tente novamente.');
      return false;
    }

    showToast(
      'success',
      data.isEncaixe ? 'Encaixe agendado' : 'Agendamento criado',
      `${finalPatientName} — ${data.date} às ${data.timeSlot}`
    );

    return true;
  };

  const handleCancelWithLog = (appointmentId: string) => {
    const targetApp = validationSource.find((a) => a.id === appointmentId);
    if (targetApp) {
      handleLogPatientCancellation(targetApp.patientId, {
        date: targetApp.date,
        timeSlot: targetApp.timeSlot,
        physioName: targetApp.physioName,
      });
    }
    handleCancelAppointment(appointmentId);
    showToast('info', 'Agendamento cancelado', targetApp?.patientName);
  };

  const handleAbsenceWithLog = (appointmentId: string) => {
    const targetApp = validationSource.find((a) => a.id === appointmentId);
    if (targetApp) {
      handleLogPatientAbsence(targetApp.patientId, {
        date: targetApp.date,
        timeSlot: targetApp.timeSlot,
        physioName: targetApp.physioName,
      });
    }
    handleAbsenceAppointment(appointmentId);
    showToast('warning', 'Falta registrada', targetApp?.patientName);
  };

  const handleCompleteWithCertificate = (appointmentId: string) => {
    handleCompleteAppointment(appointmentId);
    const targetApp = validationSource.find((a) => a.id === appointmentId);
    if (targetApp && onGenerateCertificate) {
      onGenerateCertificate({ ...targetApp, status: 'completed' });
    }
    showToast('success', 'Atendimento concluído', targetApp?.patientName);
  };

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
        physios={physios}
        totalAppointments={appointments.length}
      />

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

      <AppointmentModal
        isOpen={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveAppointment}
        initialData={editingAppointment}
        defaultDate={selectedDate}
        patients={patientSource}
        physios={physios}
        existingAppointments={validationSource}
      />
    </div>
  );
};
