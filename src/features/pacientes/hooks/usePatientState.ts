import { useState, useEffect } from 'react';
import { Patient, Evolution, ExamAttachment } from '../../../types';
import { mockPatients } from '../../../db/mockDb';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

export function usePatientState() {
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem('jc_patients');
      return saved ? JSON.parse(saved) : mockPatients;
    } catch {
      return mockPatients;
    }
  });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Initial fetch from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    async function fetchCloudPatients() {
      try {
        const { data, error } = await supabase!.from('pacientes').select('*');
        if (!error && data && data.length > 0) {
          const mapped: Patient[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            cpf: item.cpf,
            phone: item.phone,
            email: item.email,
            birthDate: item.birth_date,
            gender: item.gender,
            address: item.address,
            photoUrl: item.photo_url,
            status: item.status || 'Ativo',
            assignedPhysioId: item.assigned_physio_id || 'u2',
            assignedPhysioName: item.assigned_physio_name || 'Dr. Jucelino Castro',
            mainComplaint: item.main_complaint || 'Sem queixa informada.',
            createdAt: item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : '2026-01-01',
            anamnesis: item.anamnesis || {
              mainComplaint: item.main_complaint || '',
              illnessHistory: '',
              painScale: 5,
              physicalExam: '',
              postureAnalysis: '',
              treatmentPlan: '',
              goals: '',
              clinicalObs: '',
              lastUpdated: '2026-01-01',
            },
            evolutions: [],
            exams: [],
          }));
          setPatients(mapped);
        }
      } catch (err) {
        console.warn('Supabase fetch failed, fallback to local state:', err);
      }
    }

    fetchCloudPatients();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('jc_patients', JSON.stringify(patients));
    } catch (err) {
      console.error('Failed to save patients to localStorage:', err);
    }
  }, [patients]);

  const filteredPatients = patients.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cpf.includes(searchQuery) ||
      p.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleSavePatient = (patientData: Partial<Patient>) => {
    let updatedOrNewPatient: Patient;

    if (editingPatient) {
      updatedOrNewPatient = { ...editingPatient, ...patientData } as Patient;
      setPatients((prev) =>
        prev.map((p) => (p.id === editingPatient.id ? updatedOrNewPatient : p))
      );
      if (selectedPatient?.id === editingPatient.id) {
        setSelectedPatient(updatedOrNewPatient);
      }
    } else {
      updatedOrNewPatient = {
        id: `p_${Date.now()}`,
        name: patientData.name || 'Novo Paciente',
        cpf: patientData.cpf || '000.000.000-00',
        phone: patientData.phone || '(11) 90000-0000',
        email: patientData.email || 'paciente@email.com',
        birthDate: patientData.birthDate || '1990-01-01',
        gender: patientData.gender || 'Feminino',
        address: patientData.address || 'São Paulo - SP',
        photoUrl: patientData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        status: 'Ativo',
        assignedPhysioId: patientData.assignedPhysioId || 'u2',
        assignedPhysioName: patientData.assignedPhysioName || 'Dr. Jucelino Castro',
        mainComplaint: patientData.mainComplaint || 'Sem queixa informada.',
        createdAt: new Date().toISOString().split('T')[0],
        anamnesis: {
          mainComplaint: patientData.mainComplaint || '',
          illnessHistory: '',
          painScale: 5,
          physicalExam: '',
          postureAnalysis: '',
          treatmentPlan: '',
          goals: '',
          clinicalObs: '',
          lastUpdated: new Date().toISOString().split('T')[0],
        },
        evolutions: [],
        exams: [],
      };
      setPatients((prev) => [updatedOrNewPatient, ...prev]);
    }

    // Async sync to Supabase Cloud
    if (isSupabaseConfigured && supabase) {
      supabase.from('pacientes').upsert({
        id: updatedOrNewPatient.id,
        name: updatedOrNewPatient.name,
        cpf: updatedOrNewPatient.cpf,
        phone: updatedOrNewPatient.phone,
        email: updatedOrNewPatient.email,
        birth_date: updatedOrNewPatient.birthDate,
        gender: updatedOrNewPatient.gender,
        address: updatedOrNewPatient.address,
        photo_url: updatedOrNewPatient.photoUrl,
        assigned_physio_id: updatedOrNewPatient.assignedPhysioId,
        assigned_physio_name: updatedOrNewPatient.assignedPhysioName,
        main_complaint: updatedOrNewPatient.mainComplaint,
        status: updatedOrNewPatient.status,
        anamnesis: updatedOrNewPatient.anamnesis,
      }).then(({ error }) => {
        if (error) console.error('Supabase patient sync error:', error.message);
      });
    }

    setIsPatientModalOpen(false);
    setEditingPatient(null);
  };

  const handleAddEvolution = (patientId: string, evolution: Omit<Evolution, 'id'>) => {
    const newEvo: Evolution = { ...evolution, id: `evo_${Date.now()}` };
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, evolutions: [newEvo, ...p.evolutions] } : p))
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) => (prev ? { ...prev, evolutions: [newEvo, ...prev.evolutions] } : null));
    }
  };

  const handleUpdateEvolution = (patientId: string, evolutionId: string, updatedEvo: Partial<Evolution>) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const newEvos = p.evolutions.map((e) => (e.id === evolutionId ? { ...e, ...updatedEvo } : e));
        return { ...p, evolutions: newEvos };
      })
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) => {
        if (!prev) return null;
        const newEvos = prev.evolutions.map((e) => (e.id === evolutionId ? { ...e, ...updatedEvo } : e));
        return { ...prev, evolutions: newEvos };
      });
    }
  };

  const handleDeleteEvolution = (patientId: string, evolutionId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return { ...p, evolutions: p.evolutions.filter((e) => e.id !== evolutionId) };
      })
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) => {
        if (!prev) return null;
        return { ...prev, evolutions: prev.evolutions.filter((e) => e.id !== evolutionId) };
      });
    }
  };

  const handleConfirmPatientAttendance = (
    patientId: string,
    appointmentDetails: { timeSlot?: string; type?: string; physioName?: string }
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const draftEvo: Evolution = {
      id: `evo_auto_${Date.now()}`,
      date: today,
      physioName: appointmentDetails.physioName || 'Dr. Jucelino Castro',
      description: `[PRESENÇA CONFIRMADA NA RECEPÇÃO - ${appointmentDetails.timeSlot || 'Atendimento'}]\nPaciente recepcionado(a) sem intercorrências na clínica para atendimento de ${
        appointmentDetails.type || 'Sessão'
      }.\n\n👉 Considerações Clínicas do Fisioterapeuta: (Aguardando preenchimento do profissional...)`,
      painScaleBefore: 5,
      painScaleAfter: 2,
      procedures: ['Recepcionado em Clínica', appointmentDetails.type || 'Atendimento'],
      nextSessionGoals: 'Definir condutas pós-atendimento.',
      isDraft: true,
      receptionAutoGenerated: true,
    };

    handleAddEvolution(patientId, draftEvo);
  };

  const handleLogPatientCancellation = (
    patientId: string,
    details: { date: string; timeSlot: string; physioName: string; reason?: string }
  ) => {
    const cancelEvo: Evolution = {
      id: `evo_cancel_${Date.now()}`,
      date: details.date || new Date().toISOString().split('T')[0],
      physioName: details.physioName || 'Recepção / Gestão',
      description: `⚠️ REGISTRO DE DESMARCAÇÃO / CANCELAMENTO DE CONSULTA:\nO(A) paciente desmarcou a consulta agendada para o dia ${details.date} às ${details.timeSlot} com ${details.physioName}.${
        details.reason ? `\n\nMotivo / Observação: ${details.reason}` : ''
      }`,
      painScaleBefore: 0,
      painScaleAfter: 0,
      procedures: ['Desmarcou Atendimento', 'Aviso Prévio de Cancelamento'],
      nextSessionGoals: 'Aguardando contato do paciente para reagendamento de novo horário.',
      receptionAutoGenerated: true,
    };

    handleAddEvolution(patientId, cancelEvo);
  };

  const handleLogPatientAbsence = (
    patientId: string,
    details: { date: string; timeSlot: string; physioName: string; reason?: string }
  ) => {
    const absenceEvo: Evolution = {
      id: `evo_falta_${Date.now()}`,
      date: details.date || new Date().toISOString().split('T')[0],
      physioName: details.physioName || 'Recepção / Gestão',
      description: `❌ REGISTRO DE FALTA / NÃO COMPARECIMENTO:\nO(A) paciente faltou ao atendimento agendado para o dia ${details.date} às ${details.timeSlot} com ${details.physioName} sem aviso prévio.${
        details.reason ? `\n\nObservação da Recepção: ${details.reason}` : ''
      }`,
      painScaleBefore: 0,
      painScaleAfter: 0,
      procedures: ['Falta Registrada', 'Não Comparecimento Sem Aviso'],
      nextSessionGoals: 'Entrar em contato via WhatsApp/Telefone para confirmar bem-estar e reagendamento.',
      receptionAutoGenerated: true,
    };

    handleAddEvolution(patientId, absenceEvo);
  };

  const handleAddExam = (patientId: string, exam: Omit<ExamAttachment, 'id'>) => {
    const newExam: ExamAttachment = { ...exam, id: `ex_${Date.now()}` };
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, exams: [newExam, ...p.exams] } : p))
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) => (prev ? { ...prev, exams: [newExam, ...prev.exams] } : null));
    }
  };

  return {
    patients: filteredPatients,
    allPatients: patients,
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
    handleConfirmPatientAttendance,
    handleLogPatientCancellation,
    handleLogPatientAbsence,
    handleAddExam,
  };
}

