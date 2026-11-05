import { useState, useEffect } from 'react';
import { Patient, Evolution, ExamAttachment } from '../../../types';
import { mockPatients } from '../../../db/mockDb';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

export function usePatientState() {
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem('jc_patients');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : mockPatients;
    } catch {
      return mockPatients;
    }
  });

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    async function fetchCloudPatients() {
      try {
        const { data, error } = await supabase!.from('pacientes').select('*');
        if (!error && Array.isArray(data) && data.length > 0) {
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
            createdAt: item.created_at
              ? new Date(item.created_at).toISOString().split('T')[0]
              : '2026-01-01',
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
        console.warn('Supabase fetch falhou, usando estado local:', err);
      }
    }

    fetchCloudPatients();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('jc_patients', JSON.stringify(patients));
    } catch (err) {
      console.error('Falha ao salvar pacientes no localStorage:', err);
    }
  }, [patients]);

  const filteredPatients = (patients || []).filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.cpf?.includes(searchQuery) ||
      p.phone?.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleSavePatient = (patientData: Partial<Patient>) => {
    let updatedOrNewPatient: Patient;

    if (editingPatient) {
      updatedOrNewPatient = { ...editingPatient, ...patientData } as Patient;
      setPatients((prev) =>
        (prev || []).map((p) => (p.id === editingPatient.id ? updatedOrNewPatient : p))
      );
      if (selectedPatient?.id === editingPatient.id) {
        setSelectedPatient(updatedOrNewPatient);
      }
    } else {
      updatedOrNewPatient = {
        id: patientData.id || `p_${Date.now()}`,
        name: patientData.name || 'Paciente sem nome',
        cpf: patientData.cpf || '000.000.000-00',
        phone: patientData.phone || '(68) 99999-9999',
        email: patientData.email || '',
        birthDate: patientData.birthDate || '1990-01-01',
        gender: patientData.gender || 'Outro',
        address: patientData.address || 'Rio Branco - AC',
        photoUrl:
          patientData.photoUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        status: patientData.status || 'Ativo',
        assignedPhysioId: patientData.assignedPhysioId || 'u2',
        assignedPhysioName: patientData.assignedPhysioName || 'Dr. Jucelino Castro',
        mainComplaint: patientData.mainComplaint || 'Sem queixa informada.',
        createdAt: new Date().toISOString().split('T')[0],
        anamnesis: patientData.anamnesis || {
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
        evolutions: patientData.evolutions || [],
        exams: patientData.exams || [],
      };
      setPatients((prev) => [updatedOrNewPatient, ...(prev || [])]);
    }

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('pacientes')
        .upsert({
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
        })
        .then(({ error }) => {
          if (error) console.error('Supabase patient sync error:', error.message);
        });
    }

    setIsPatientModalOpen(false);
    setEditingPatient(null);
  };

  const handleDeletePatient = (patientId: string) => {
    setPatients((prev) => (prev || []).filter((p) => p.id !== patientId));

    if (selectedPatient?.id === patientId) {
      setSelectedPatient(null);
    }

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('pacientes')
        .delete()
        .eq('id', patientId)
        .then(({ error }) => {
          if (error) console.error('Supabase patient delete error:', error.message);
        });
    }
  };

  const handleAddEvolution = (patientId: string, evolution: Omit<Evolution, 'id'>) => {
    const newEvo: Evolution = { ...evolution, id: `evo_${Date.now()}` };
    setPatients((prev) =>
      (prev || []).map((p) =>
        p.id === patientId ? { ...p, evolutions: [newEvo, ...(p.evolutions || [])] } : p
      )
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) =>
        prev ? { ...prev, evolutions: [newEvo, ...(prev.evolutions || [])] } : null
      );
    }
  };

  const handleUpdateEvolution = (
    patientId: string,
    evolutionId: string,
    updatedEvo: Partial<Evolution>
  ) => {
    setPatients((prev) =>
      (prev || []).map((p) => {
        if (p.id !== patientId) return p;
        const newEvos = (p.evolutions || []).map((e) =>
          e.id === evolutionId ? { ...e, ...updatedEvo } : e
        );
        return { ...p, evolutions: newEvos };
      })
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) => {
        if (!prev) return null;
        const newEvos = (prev.evolutions || []).map((e) =>
          e.id === evolutionId ? { ...e, ...updatedEvo } : e
        );
        return { ...prev, evolutions: newEvos };
      });
    }
  };

  const handleDeleteEvolution = (patientId: string, evolutionId: string) => {
    setPatients((prev) =>
      (prev || []).map((p) => {
        if (p.id !== patientId) return p;
        return { ...p, evolutions: (p.evolutions || []).filter((e) => e.id !== evolutionId) };
      })
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) => {
        if (!prev) return null;
        return { ...prev, evolutions: (prev.evolutions || []).filter((e) => e.id !== evolutionId) };
      });
    }
  };

  const handleConfirmPatientAttendance = (
    patientId: string,
    appointmentDetails: { timeSlot?: string; type?: string; physioName?: string }
  ) => {
    const newEvo: Evolution = {
      id: `evo_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timeSlot: appointmentDetails.timeSlot || '',
      type: appointmentDetails.type || 'Sessão',
      physioName: appointmentDetails.physioName || 'Dr. Jucelino Castro',
      description: `Presença confirmada na recepção. Atendimento de ${appointmentDetails.type || 'Sessão'} às ${appointmentDetails.timeSlot || '--:--'}.`,
      procedures: [],
      observations: 'Registro automático gerado pela confirmação de presença.',
    };

    setPatients((prev) =>
      (prev || []).map((p) =>
        p.id === patientId ? { ...p, evolutions: [newEvo, ...(p.evolutions || [])] } : p
      )
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) =>
        prev ? { ...prev, evolutions: [newEvo, ...(prev.evolutions || [])] } : null
      );
    }
  };

  const handleLogPatientCancellation = (
    patientId: string,
    details: { date?: string; timeSlot?: string; physioName?: string }
  ) => {
    const newEvo: Evolution = {
      id: `evo_${Date.now()}`,
      date: details.date || new Date().toISOString().split('T')[0],
      timeSlot: details.timeSlot || '',
      type: 'Cancelamento',
      physioName: details.physioName || 'Dr. Jucelino Castro',
      description: `Agendamento cancelado — ${details.date || ''} às ${details.timeSlot || '--:--'}.`,
      procedures: [],
      observations: 'Registro automático gerado pelo cancelamento na agenda.',
    };

    setPatients((prev) =>
      (prev || []).map((p) =>
        p.id === patientId ? { ...p, evolutions: [newEvo, ...(p.evolutions || [])] } : p
      )
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) =>
        prev ? { ...prev, evolutions: [newEvo, ...(prev.evolutions || [])] } : null
      );
    }
  };

  const handleLogPatientAbsence = (
    patientId: string,
    details: { date?: string; timeSlot?: string; physioName?: string }
  ) => {
    const newEvo: Evolution = {
      id: `evo_${Date.now()}`,
      date: details.date || new Date().toISOString().split('T')[0],
      timeSlot: details.timeSlot || '',
      type: 'Falta',
      physioName: details.physioName || 'Dr. Jucelino Castro',
      description: `Falta registrada — ${details.date || ''} às ${details.timeSlot || '--:--'}.`,
      procedures: [],
      observations: 'Registro automático gerado pela marcação de falta na agenda.',
    };

    setPatients((prev) =>
      (prev || []).map((p) =>
        p.id === patientId ? { ...p, evolutions: [newEvo, ...(p.evolutions || [])] } : p
      )
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) =>
        prev ? { ...prev, evolutions: [newEvo, ...(prev.evolutions || [])] } : null
      );
    }
  };

  const handleAddExam = (patientId: string, exam: Omit<ExamAttachment, 'id'>) => {
    const newExam: ExamAttachment = { ...exam, id: `ex_${Date.now()}` };
    setPatients((prev) =>
      (prev || []).map((p) =>
        p.id === patientId ? { ...p, exams: [newExam, ...(p.exams || [])] } : p
      )
    );
    if (selectedPatient?.id === patientId) {
      setSelectedPatient((prev) =>
        prev ? { ...prev, exams: [newExam, ...(prev.exams || [])] } : null
      );
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
    handleDeletePatient,
    handleAddEvolution,
    handleUpdateEvolution,
    handleDeleteEvolution,
    handleConfirmPatientAttendance,
    handleLogPatientCancellation,
    handleLogPatientAbsence,
    handleAddExam,
  };
}
