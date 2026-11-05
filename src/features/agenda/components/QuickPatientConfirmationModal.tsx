import React, { useState } from 'react';
import { Appointment } from '../../../types';
import {
  X,
  CheckCircle2,
  Clock,
  PhoneCall,
  UserCheck,
  AlertTriangle,
  Send,
  Calendar,
  CheckCheck,
  Sparkles,
  Search,
} from 'lucide-react';
import { formatAppointmentConfirmationMessage, openWhatsApp } from '../../../utils/whatsappMessages';

interface QuickPatientConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onConfirmAttendance: (app: Appointment) => void;
  onNavigateToAgenda?: () => void;
}

export const QuickPatientConfirmationModal: React.FC<QuickPatientConfirmationModalProps> = ({
  isOpen,
  onClose,
  appointments,
  onConfirmAttendance,
  onNavigateToAgenda,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'pending' | 'all'>('pending');

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  const pendingAppointments = todayAppointments.filter(
    (a) => a.status !== 'confirmed' && a.status !== 'completed'
  );

  const confirmedAppointments = todayAppointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'completed'
  );

  const displayedAppointments = (filterType === 'pending' ? pendingAppointments : todayAppointments)
    .filter(
      (a) =>
        a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.physioName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.timeSlot.includes(searchTerm)
    )
    .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  const handleConfirmAllPending = () => {
    pendingAppointments.forEach((app) => {
      onConfirmAttendance(app);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Confirmação de Pacientes (Hoje)</h3>
                {pendingAppointments.length > 0 ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black bg-red-500 text-white animate-pulse">
                    {pendingAppointments.length} pendente{pendingAppointments.length > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" /> Todos confirmados
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar & Filter */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800/80 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'pending'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Pendentes ({pendingAppointments.length})
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todos de Hoje ({todayAppointments.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar paciente ou hora..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {pendingAppointments.length > 1 && (
              <button
                onClick={handleConfirmAllPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
                title="Confirmar presença de todos os pacientes pendentes"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Confirmar Todos ({pendingAppointments.length})
              </button>
            )}
          </div>
        </div>

        {/* Patients List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          {displayedAppointments.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm">
                  {filterType === 'pending'
                    ? 'Nenhum paciente pendente de confirmação hoje!'
                    : 'Nenhum agendamento encontrado para hoje.'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {filterType === 'pending'
                    ? 'Todos os pacientes agendados para hoje já estão confirmados ou atendidos.'
                    : 'Verifique a agenda completa para outros dias.'}
                </p>
              </div>
              {onNavigateToAgenda && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToAgenda();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:underline"
                >
                  <Calendar className="h-3.5 w-3.5" /> Abrir Agenda Completa
                </button>
              )}
            </div>
          ) : (
            displayedAppointments.map((app) => {
              const isConfirmed = app.status === 'confirmed' || app.status === 'completed';
              return (
                <div
                  key={app.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isConfirmed
                      ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                      : 'bg-slate-800/80 border-slate-700/80 shadow-md text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`px-3 py-1.5 rounded-xl font-mono text-sm font-bold border ${
                        isConfirmed
                          ? 'bg-slate-950/60 text-slate-400 border-slate-800'
                          : 'bg-slate-900 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {app.timeSlot}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                          {app.patientName}
                          {app.isEncaixe && (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 text-[9px] font-black uppercase">
                              <AlertTriangle className="h-2.5 w-2.5 text-amber-400" /> Encaixe
                            </span>
                          )}
                        </h4>
                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" /> Confirmado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        <strong className="text-slate-300">{app.physioName}</strong> • {app.room} ({app.type})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
                      title="Enviar mensagem formatada no WhatsApp do paciente"
                    >
                      <PhoneCall className="h-3.5 w-3.5" /> WhatsApp
                    </button>

                    {!isConfirmed ? (
                      <button
                        onClick={() => onConfirmAttendance(app)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
                        title="Confirmar presença e gerar declaração"
                      >
                        <UserCheck className="h-3.5 w-3.5 stroke-[2.5]" /> Confirmar Presença
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 flex items-center gap-1 px-2 py-1 bg-slate-950 rounded-lg">
                        <CheckCheck className="h-3.5 w-3.5 text-emerald-400" /> Presença Confirmada
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>A confirmação gera automaticamente rascunho de evolução clínica no prontuário.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
