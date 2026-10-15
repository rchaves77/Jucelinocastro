import { useState, useEffect } from 'react';
import { Appointment, AppointmentStatus, AppointmentType } from '../../../types';
import { mockAppointments } from '../../../db/mockDb';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

export type ViewMode = 'day' | 'week' | 'month';

export function useAgendaState() {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('jc_appointments');
      return saved ? JSON.parse(saved) : mockAppointments;
    } catch {
      return mockAppointments;
    }
  });
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedPhysioId, setSelectedPhysioId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  // Initial fetch from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    async function fetchCloudAppointments() {
      try {
        const { data, error } = await supabase!.from('agendamentos').select('*');
        if (!error && data && data.length > 0) {
          const mapped: Appointment[] = data.map((item) => ({
            id: item.id,
            patientId: item.patient_id || 'p1',
            patientName: item.patient_name,
            patientPhone: item.patient_phone || '(11) 99999-9999',
            physioId: item.physio_id || 'u2',
            physioName: item.physio_name || 'Dr. Jucelino Castro',
            date: item.date,
            timeSlot: item.time_slot,
            status: item.status as AppointmentStatus,
            type: item.type as AppointmentType,
            room: item.room || 'Quiropraxia - Sala 01',
            price: Number(item.price) || 180,
            notes: item.notes,
            isEncaixe: Boolean(item.is_encaixe || item.isEncaixe),
          }));
          setAppointments(mapped);
        }
      } catch (err) {
        console.warn('Supabase agendamentos fetch failed, fallback to local state:', err);
      }
    }

    fetchCloudAppointments();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('jc_appointments', JSON.stringify(appointments));
    } catch (err) {
      console.error('Failed to save appointments to localStorage:', err);
    }
  }, [appointments]);

  // Auto-transition in_progress appointments to completed after 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setAppointments((prev) =>
        prev.map((app) => {
          if (app.status === 'in_progress' && app.inProgressAt) {
            const startTime = new Date(app.inProgressAt).getTime();
            if (now - startTime >= 30 * 60 * 1000) {
              // 30 minutes passed -> auto set to completed
              return { ...app, status: 'completed' };
            }
          }
          return app;
        })
      );
    }, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  const filteredAppointments = appointments.filter((app) => {
    if (selectedPhysioId !== 'all' && app.physioId !== selectedPhysioId) return false;
    
    // Default 'all' filter shows active appointments (confirmed, in_progress, completed, pending)
    // and hides desmarcou/canceled & faltou/no_show unless specifically selected in filter
    if (statusFilter === 'all') {
      if (app.status === 'canceled' || app.status === 'no_show') return false;
    } else if (app.status !== statusFilter) {
      return false;
    }

    if (viewMode === 'day' && app.date !== selectedDate) return false;
    return true;
  });

  const handleCreateOrUpdate = (appointmentData: Partial<Appointment>): boolean => {
    let targetApp: Appointment;

    const isEditingId = editingAppointment ? editingAppointment.id : (appointmentData.id || null);
    const date = appointmentData.date || editingAppointment?.date || selectedDate;
    const timeSlot = appointmentData.timeSlot || editingAppointment?.timeSlot || '09:00';
    const physioId = appointmentData.physioId || editingAppointment?.physioId || 'u2';
    const physioName = appointmentData.physioName || editingAppointment?.physioName || 'Dr. Jucelino Castro';
    const room = appointmentData.room || editingAppointment?.room || 'Quiropraxia - Sala 01';
    const status = (appointmentData.status || editingAppointment?.status || 'confirmed') as AppointmentStatus;
    const isEncaixe = appointmentData.isEncaixe !== undefined ? Boolean(appointmentData.isEncaixe) : Boolean(editingAppointment?.isEncaixe);

    // Rule: Allow 1 Regular Appointment + 1 Encaixe Appointment per time slot for Dr. Jucelino Castro / Sala 01
    if (status !== 'canceled' && status !== 'no_show' && (status as string) !== 'Cancelado') {
      const conflict = appointments.find((app) => {
        if (app.id === isEditingId) return false;
        if (app.status === 'canceled' || app.status === 'no_show' || (app.status as string) === 'Cancelado') return false;

        const sameDateTime = app.date === date && app.timeSlot === timeSlot;
        if (!sameDateTime) return false;
        
        const isTargetJucelinoRoom1 =
          (physioId === 'u2' || physioName.includes('Jucelino')) &&
          (room.toLowerCase().includes('quiropraxia') || room.toLowerCase().includes('sala 01'));

        const isAppJucelinoRoom1 =
          (app.physioId === 'u2' || app.physioName.includes('Jucelino')) &&
          (app.room.toLowerCase().includes('quiropraxia') || app.room.toLowerCase().includes('sala 01'));

        // Check category conflict: only conflict if both are Regular OR both are Encaixe
        const appIsEncaixe = Boolean(app.isEncaixe);
        if (isTargetJucelinoRoom1 && isAppJucelinoRoom1) {
          return appIsEncaixe === isEncaixe;
        }

        const sameRoom = app.room.toLowerCase().trim() === room.toLowerCase().trim();
        const samePhysio = app.physioId === physioId;
        return (sameRoom || samePhysio) && appIsEncaixe === isEncaixe;
      });

      if (conflict) {
        alert(
          `🚨 BLOQUEIO DE AGENDAMENTO!\n\nJá existe um ${isEncaixe ? 'ENCAIXE' : 'AGENDAMENTO NORMAL'} para ${conflict.patientName} no dia ${date} às ${timeSlot}.\n\nCada horário permite no máximo 1 Agendamento Titular e 1 Encaixe.`
        );
        return false;
      }
    }

    if (editingAppointment) {
      targetApp = { ...editingAppointment, ...appointmentData, isEncaixe } as Appointment;
      setAppointments((prev) =>
        prev.map((app) => (app.id === editingAppointment.id ? targetApp : app))
      );
    } else {
      targetApp = {
        id: `app_${Date.now()}`,
        patientId: appointmentData.patientId || 'p1',
        patientName: appointmentData.patientName || 'Novo Paciente',
        patientPhone: appointmentData.patientPhone || '(11) 99999-9999',
        physioId,
        physioName,
        date,
        timeSlot,
        status,
        type: (appointmentData.type as AppointmentType) || 'Sessão',
        room,
        price: appointmentData.price || 180,
        notes: appointmentData.notes,
        isEncaixe,
      };
      setAppointments((prev) => [...prev, targetApp]);
    }

    if (isSupabaseConfigured && supabase) {
      supabase.from('agendamentos').upsert({
        id: targetApp.id,
        patient_id: targetApp.patientId,
        patient_name: targetApp.patientName,
        patient_phone: targetApp.patientPhone,
        physio_id: targetApp.physioId,
        physio_name: targetApp.physioName,
        date: targetApp.date,
        time_slot: targetApp.timeSlot,
        type: targetApp.type,
        room: targetApp.room,
        status: targetApp.status,
        price: targetApp.price,
        notes: targetApp.notes,
      }).then(({ error }) => {
        if (error) console.error('Supabase agendamento sync error:', error.message);
      });
    }

    setIsModalOpen(false);
    setEditingAppointment(null);
    return true;
  };

  const handleStartAttendance = (id: string) => {
    const nowIso = new Date().toISOString();
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'in_progress', inProgressAt: nowIso } : app))
    );
    if (isSupabaseConfigured && supabase) {
      supabase.from('agendamentos').update({ status: 'in_progress' }).eq('id', id);
    }
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'canceled' } : app))
    );
    if (isSupabaseConfigured && supabase) {
      supabase.from('agendamentos').update({ status: 'canceled' }).eq('id', id);
    }
  };

  const handleAbsenceAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'no_show' } : app))
    );
    if (isSupabaseConfigured && supabase) {
      supabase.from('agendamentos').update({ status: 'no_show' }).eq('id', id);
    }
  };

  const handleCompleteAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'completed' } : app))
    );
    if (isSupabaseConfigured && supabase) {
      supabase.from('agendamentos').update({ status: 'completed' }).eq('id', id);
    }
  };

  return {
    appointments: filteredAppointments,
    allAppointments: appointments,
    setAppointments,
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
  };
}

