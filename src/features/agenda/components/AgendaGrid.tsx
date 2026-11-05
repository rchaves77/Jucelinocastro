import React from 'react';
import { Appointment } from '../../../types';
import { AppointmentCard } from './AppointmentCard';
import { ViewMode } from '../hooks/useAgendaState';
import { Calendar, Clock, Plus, Zap, UserCheck, Sun, Moon, Lock } from 'lucide-react';
import { getSlotConfig } from '../../../config/contact';

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
  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  const slotConfig = getSlotConfig(selectedDate);
  const { morning: timeSlotsMorning, afternoon: timeSlotsAfternoon } = slotConfig;

  const dayOfWeek = new Date(`${selectedDate}T00:00:00`).getDay();
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0;

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

  // Renderiza uma tabela de turno com colunas: [Horário | Titular | Encaixe]
  const renderShiftTable = (
    title: string,
    badgeText: string,
    icon: React.ReactNode,
    slots: string[],
    themeColor: 'amber' | 'cyan',
    allowTitular: boolean = true
  ) => {
    const shiftAppointments = safeAppointments.filter((a) => slots.includes(a.timeSlot));
    const totalTitulares = shiftAppointments.filter((a) => !a.isEncaixe).length;
    const totalEncaixes = shiftAppointments.filter((a) => a.isEncaixe).length;

    return (
      <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        {/* Banner do Turno */}
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

        {/* Cabeçalho das Colunas */}
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

        {/* Linhas por Horário */}
        <div className="divide-y divide-slate-800/80 bg-slate-900/40">
          {slots.map((slot) => {
            const slotApps = safeAppointments.filter((a) => a.timeSlot === slot);
            const titularApps = slotApps.filter((a) => !a.isEncaixe);
            const encaixeApps = slotApps.filter((a) => a.isEncaixe);

            const hasTitular = titularApps.length > 0;
            const hasEncaixe = encaixeApps.length > 0;

            return (
              <div
                key={slot}
                className="grid grid-cols-12 gap-2 p-2.5 sm:p-3 items-stretch hover:bg-slate-800/30 transition-colors"
              >
                {/* 1. Horário */}
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

                {/* 2. Titular */}
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
                  ) : allowTitular ? (
                    <button
                      type="button"
                      onClick={() => handleCreateAtSlot(slot, false)}
                      className="w-full h-full min-h-[58px] flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all cursor-pointer group"
                      title={`Agendar paciente titular às ${slot}`}
                    >
                      <Plus className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400" />
                      <span className="truncate">+ Agendar</span>
                    </button>
                  ) : (
                    <div
                      className="w-full h-full min-h-[58px] flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-[11px] font-semibold text-slate-500"
                      title="Sábado à tarde: apenas encaixes"
                    >
                      <Lock className="h-3 w-3" />
                      <span className="truncate">Só encaixe</span>
                    </div>
                  )}
                </div>

                {/* 3. Encaixe */}
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
                  ) : slotConfig.allowEncaixe ? (
                    <button
                      type="button"
                      onClick={() => handleCreateAtSlot(slot, true)}
                      className="w-full h-full min-h-[58px] flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs font-semibold text-amber-400/80 hover:text-amber-300 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all cursor-pointer group"
                      title={`Agendar encaixe às ${slot}`}
                    >
                      <Zap className="h-3.5 w-3.5 fill-amber-400/60 group-hover:fill-amber-400" />
                      <span className="truncate">+ Encaixe</span>
                    </button>
                  ) : (
                    <div className="w-full h-full min-h-[58px] flex items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-[11px] font-semibold text-slate-500">
                      Indisponível
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Domingo: clínica fechada
  if (isSunday) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-10 text-center space-y-3">
        <Calendar className="h-10 w-10 text-slate-600 mx-auto" />
        <h3 className="text-lg font-black text-slate-200">Clínica fechada aos domingos</h3>
        <p className="text-sm text-slate-400">
          Selecione uma data de segunda a sábado para visualizar a agenda.
        </p>
      </div>
    );
  }

  // Modo Lista
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Calendar className="h-4 w-4 text-emerald-400" />
            Agenda do dia
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-300 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <UserCheck className="h-3 w-3" />
              Titular
            </span>
            <span className="flex items-center gap-1.5 text-amber-300 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
              <Zap className="h-3 w-3 fill-amber-400" />
              Encaixe
            </span>
          </div>
        </div>

        {safeAppointments.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-sm text-slate-400">
            Nenhum agendamento para esta data.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {safeAppointments.map((app) => (
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
        )}
      </div>
    );
  }

  // Modo Grade (padrão)
  return (
    <div className="space-y-4">
      {/* Legenda */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <Calendar className="h-4 w-4 text-emerald-400" />
          Grade de Horários
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-300 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            <UserCheck className="h-3 w-3" />
            Titular
          </span>
          <span className="flex items-center gap-1.5 text-amber-300 font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
            <Zap className="h-3 w-3 fill-amber-400" />
            Encaixe
          </span>
        </div>
      </div>

      {/* Aviso de sábado */}
      {slotConfig.notice && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-semibold text-amber-300">
          {slotConfig.notice}
        </div>
      )}

      {/* Duas tabelas de turno */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {renderShiftTable(
          'Turno da Manhã',
          '07:30 às 11:00',
          <Sun className="h-4 w-4" />,
          timeSlotsMorning,
          'amber',
          slotConfig.allowTitular
        )}

        {renderShiftTable(
          'Turno da Tarde',
          isSaturday ? '13:30 às 17:30 • apenas encaixes' : '13:30 às 17:30',
          <Moon className="h-4 w-4" />,
          timeSlotsAfternoon,
          'cyan',
          isSaturday ? false : slotConfig.allowTitular
        )}
      </div>
    </div>
  );
};
