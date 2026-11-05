import React from 'react';
import { Appointment } from '../../types';
import { UserPlus, Calendar, PhoneCall, Clock, CheckCircle2, UserCheck, AlertTriangle, Send } from 'lucide-react';
import { formatAppointmentConfirmationMessage, openWhatsApp } from '../../utils/whatsappMessages';

interface SecretaryDashboardProps {
  appointments: Appointment[];
  onNavigateToAgenda: () => void;
  onNavigateToPatients: () => void;
  onNavigateToTasks?: () => void;
  onOpenNewAppointment: () => void;
  onOpenNewPatient: () => void;
  onConfirmAttendance?: (app: Appointment) => void;
  onOpenWhatsAppDispatch?: () => void;
  userName?: string;
}

export const SecretaryDashboard: React.FC<SecretaryDashboardProps> = ({
  appointments,
  onNavigateToAgenda,
  onNavigateToPatients,
  onNavigateToTasks,
  onOpenNewAppointment,
  onOpenNewPatient,
  onConfirmAttendance,
  userName = 'Katiuscia Braga Castro',
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayApps = appointments.filter((a) => a.date === todayStr);

  return (
    <div className="space-y-6">
      {/* Top Secretary Banner */}
      <div className="rounded-3xl bg-slate-900 p-6 text-slate-100 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider mb-1">
            Recepção & Atendimento
          </span>
          <h1 className="text-xl font-bold text-slate-100">Painel da Recepção - {userName}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Ao confirmar a presença de um paciente, o sistema gera automaticamente um rascunho de evolução no prontuário.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onNavigateToTasks && (
            <button
              onClick={onNavigateToTasks}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors shadow-sm cursor-pointer"
            >
              📋 Minhas Tarefas
            </button>
          )}
          <button
            onClick={onOpenNewPatient}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md cursor-pointer"
          >
            <UserPlus className="h-4 w-4 stroke-[2.5]" /> Cadastrar Paciente
          </button>
          <button
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-slate-400" /> Novo Agendamento
          </button>
        </div>
      </div>

      {/* Reception Queue */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" /> Fluxo de Chegada da Recepção (Hoje)
          </h3>
          <button onClick={onNavigateToAgenda} className="text-xs text-emerald-400 font-semibold hover:underline">
            Ver Agenda Completa
          </button>
        </div>

        {todayApps.length > 0 ? (
          <div className="space-y-3">
            {todayApps.map((app) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-800 bg-slate-800/60 p-4 text-xs gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-emerald-400 text-sm bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 font-mono">
                    {app.timeSlot}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                      <span>{app.patientName}</span>
                      {app.isEncaixe && (
                        <span
                          title="Encaixe de Horário"
                          className="inline-flex items-center gap-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider"
                        >
                          <AlertTriangle className="h-3 w-3 text-amber-400 fill-amber-400/20" />
                          Encaixe
                        </span>
                      )}
                    </h4>
                    <p className="text-slate-400 text-[11px]">{app.physioName} • {app.room} ({app.type})</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const text = formatAppointmentConfirmationMessage({
                        patientName: app.patientName,
                        date: app.date,
                        timeSlot: app.timeSlot,
                        physioName: app.physioName,
                        room: app.room,
                        isEncaixe: app.isEncaixe,
                      });
                      openWhatsApp({
                        phone: app.patientPhone || '5561999998888',
                        text,
                      });
                    }}
                    className="flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                    title="Enviar confirmação formatada via WhatsApp"
                  >
                    <PhoneCall className="h-3.5 w-3.5" /> WhatsApp
                  </button>

                  {app.status !== 'confirmed' && app.status !== 'completed' ? (
                    <button
                      onClick={() => {
                        if (onConfirmAttendance) {
                          onConfirmAttendance(app);
                        }
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md"
                    >
                      <UserCheck className="h-4 w-4 stroke-[2.5]" /> Confirmar Presença
                    </button>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Presença Confirmada (Evolução Criada)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center space-y-3 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
            <Calendar className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">Nenhum agendamento na recepção para hoje.</p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={onOpenNewPatient}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Cadastrar Paciente
              </button>
              <button
                onClick={onOpenNewAppointment}
                className="rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                Novo Agendamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

