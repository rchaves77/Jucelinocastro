import React from 'react';
import { Appointment } from '../../../types';
import { AppointmentCard } from './AppointmentCard';
import { ViewMode } from '../hooks/useAgendaState';
import { Calendar, Clock, Plus, Zap, UserCheck, Sun, Moon } from 'lucide-react';

interface AgendaGridProps {
  appointments: Appointment[];
  viewMode: ViewMode;
  selectedDate: string;
  onEdit: (app: Appointment) => void;
  onNewAtSlot?: (timeSlot: string, isEncaixe: boolean) => void;
  onStartAttendance?: (id: string) => void;
  onCancel: (id: string) => void;
  onAbsence?: (id: string) => void;
  onComplete: (id: string) => void;
  onGenerateCertificate?: (app: Appointment) => void;
  onViewPatientRecord?: (patientId: string) => void;
}

const timeSlotsMorning = [
  '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'
];

const timeSlotsAfternoon = [
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export const AgendaGrid: React.FC<AgendaGridProps> = ({
  appointments,
  viewMode,
  selectedDate,
  onEdit,
  onNewAtSlot,
  onStartAttendance,
  onCancel,
  onAbsence,
  onComplete,
  onGenerateCertificate,
  onViewPatientRecord,
}) => {
  const handleCreateAtSlot = (timeSlot: string, isEncaixe: boolean) => {
    if (onNewAtSlot) {
      onNewAtSlot(timeSlot, isEncaixe);
    } else {
      onEdit({
        id: '',
        patientId: '',
        patientName: '',
        patientPhone: '',
        physioId: 'u2',
        physioName: 'Dr. Jucelino Castro',
        date: selectedDate,
        timeSlot,
        type: 'Sessão',
        room: 'Quiropraxia - Sala 01',
        status: 'confirmed',
        price: 180,
        isEncaixe,
      } as Appointment);
    }
  };

  // Render a specific Shift Table (Morning or Afternoon) with columns: [Horário | Agendamento Titular | Encaixe]
  const renderShiftTable = (
    title: string,
    badgeText: string,
    icon: React.ReactNode,
    slots: string[],
    themeColor: 'amber' | 'cyan'
  ) => {
    const shiftAppointments = appointments.filter((a) => slots.includes(a.timeSlot));
    const totalTitulares = shiftAppointments.filter((a) => !a.isEncaixe).length;
    const totalEncaixes = shiftAppointments.filter((a) => a.isEncaixe).length;

    return (
      <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        {/* Table Header / Turno Banner */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                themeColor === 'amber'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              }`}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-wide flex items-center gap-2">
                {title}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {badgeText} • Dr. Jucelino Castro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-xl text-[11px] font-semibold">
              📅 {totalTitulares} titular(es)
            </span>
            {totalEncaixes > 0 && (
              <span className="bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1">
                <Zap className="h-3 w-3 fill-amber-400" />
                {totalEncaixes} encaixe(s)
              </span>
            )}
          </div>
        </div>

        {/* Tabular Header Columns */}
        <div className="grid grid-cols-12 gap-2 bg-slate-950 px-4 py-2.5 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <div className="col-span-2 sm:col-span-2 flex items-center gap-1 text-slate-300">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            Horário
          </div>
          <div className="col-span-5 sm:col-span-5 flex items-center gap-1 text-emerald-400">
            <UserCheck className="h-3.5 w-3.5" />
            Agendamento Titular
          </div>
          <div className="col-span-5 sm:col-span-5 flex items-center gap-1 text-amber-400">
            <Zap className="h-3.5 w-3.5 fill-amber-400" />
            Encaixe
          </div>
        </div>

        {/* Table Rows per Time Slot */}
        <div className="divide-y divide-slate-800/80 bg-slate-900/40">
          {slots.map((slot) => {
            const slotApps = appointments.filter((a) => a.timeSlot === slot);
            const titularApps = slotApps.filter((a) => !a.isEncaixe);
            const encaixeApps = slotApps.filter((a) => a.isEncaixe);

            const hasTitular = titularApps.length > 0;
            const hasEncaixe = encaixeApps.length > 0;

            return (
              <div
                key={slot}
                className="grid grid-cols-12 gap-2 p-2.5 sm:p-3 items-stretch hover:bg-slate-800/30 transition-colors"
              >
                {/* 1. Horário Column */}
                <div className="col-span-2 sm:col-span-2 flex flex-col justify-center items-start">
                  <div
                    className={`inline-flex items-center gap-1 font-mono font-black text-xs sm:text-sm px-2 py-1 rounded-xl border ${
                      themeColor === 'amber'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                        : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                    }`}
                  >
                    {slot}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 hidden sm:inline">30 min</span>
                </div>

                {/* 2. Agendamento Titular Column */}
                <div className="col-span-5 sm:col-span-5 flex flex-col justify-center">
                  {hasTitular ? (
                    <div className="space-y-2">
                      {titularApps.map((app) => (
                        <AppointmentCard
                          key={app.id}
                          appointment={app}
                          onEdit={onEdit}
                          onStartAttendance={onStartAttendance}
                          onCancel={onCancel}
                          onAbsence={onAbsence}
                          onComplete={onComplete}
                          onGenerateCertificate={onGenerateCertificate}
                          onViewPatientRecord={onViewPatientRecord}
                        />
                      ))}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCreateAtSlot(slot, false)}
                      className="w-full h-full min-h-[58px] flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all cursor-pointer group"
                      title={`Agendar paciente titular para às ${slot}`}
                    >
                      <Plus className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400" />
                      <span className="truncate">+ Agendar</span>
                    </button>
                  )}
                </div>

                {/* 3. Encaixe Column */}
                <div className="col-span-5 sm:col-span-5 flex flex-col justify-center">
                  {hasEncaixe ? (
                    <div className="space-y-2">
                      {encaixeApps.map((app) => (
                        <AppointmentCard
                          key={app.id}
                          appointment={app}
                          onEdit={onEdit}
                          onStartAttendance={onStartAttendance}
                          onCancel={onCancel}
                          onAbsence={onAbsence}
                          onComplete={onComplete}
                          onGenerateCertificate={onGenerateCertificate}
                          onViewPatientRecord={onViewPatientRecord}
                        />
                      ))}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCreateAtSlot(slot, true)}
                      className="w-full h-full min-h-[58px] flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-amber-500/20 bg-amber-500/[0.02] px-3 py-2 text-xs font-bold text-amber-400/70 hover:text-amber-300 hover:border-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer group"
                      title={`Adicionar encaixe para às ${slot}`}
                    >
                      <Zap className="h-3.5 w-3.5 text-amber-500/60 group-hover:text-amber-300 fill-amber-500/60 group-hover:fill-amber-300" />
                      <span className="truncate">+ Encaixe</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // DAILY VIEW (Default)
  if (viewMode === 'day') {
    return (
      <div className="space-y-6">
        {/* Banner Explanatory Helper */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-4 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="h-5 w-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Diário da Agenda: Duas Tabelas (Manhã & Tarde)
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Dr. Jucelino Castro
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Tabelas partidas por turno com colunas dedicadas para <strong>Agendamento Titular</strong> e <strong>Encaixe</strong> no mesmo horário.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Titular
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
              <Zap className="h-3 w-3 fill-amber-400" />
              Encaixe
            </span>
          </div>
        </div>

        {/* 2 Shift Tables (Morning & Afternoon) - Side by Side on Large Screens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* Tabela 1: Turno Manhã (07:30 - 11:30) */}
          {renderShiftTable(
            'Turno da Manhã',
            '07:30 às 11:30',
            <Sun className="h-4 w-4" />,
            timeSlotsMorning,
            'amber'
          )}

          {/* Tabela 2: Turno da Tarde (13:30 - 18:00) */}
          {renderShiftTable(
            'Turno da Tarde',
            '13:30 às 17:30',
            <Moon className="h-4 w-4" />,
            timeSlotsAfternoon,
            'cyan'
          )}
        </div>
      </div>
    );
  }

  // MONTHLY OR WEEKLY SECONDARY VIEW
  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between text-slate-200 font-semibold text-xs border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-emerald-400" />
          <span>Visão {viewMode === 'week' ? 'Semanal' : 'Mensal'} Resumida</span>
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          Total: {appointments.length} agendamentos
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {appointments.map((app) => (
          <AppointmentCard
            key={app.id}
            appointment={app}
            onEdit={onEdit}
            onStartAttendance={onStartAttendance}
            onCancel={onCancel}
            onAbsence={onAbsence}
            onComplete={onComplete}
            onGenerateCertificate={onGenerateCertificate}
            onViewPatientRecord={onViewPatientRecord}
          />
        ))}
        {appointments.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-slate-500">
            Nenhum agendamento encontrado para o período selecionado.
          </div>
        )}
      </div>
    </div>
  );
};
