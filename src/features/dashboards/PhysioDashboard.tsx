import React from 'react';
import { Patient, Appointment } from '../../types';
import { Clock, User, FilePlus, ChevronRight, Calendar, UserPlus, AlertTriangle } from 'lucide-react';

interface PhysioDashboardProps {
  patients: Patient[];
  appointments: Appointment[];
  onNavigateToAgenda: () => void;
  onNavigateToPatients: () => void;
  onSelectPatient: (patientId: string) => void;
  onOpenNewPatient?: () => void;
}

export const PhysioDashboard: React.FC<PhysioDashboardProps> = ({
  patients,
  appointments,
  onNavigateToAgenda,
  onNavigateToPatients,
  onSelectPatient,
  onOpenNewPatient,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayApps = appointments.filter((a) => a.date === todayStr);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6 text-slate-100 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider mb-1">
            Painel do Fisioterapeuta
          </span>
          <h1 className="text-xl font-bold text-slate-100">Atendimentos do Dia</h1>
          <p className="text-xs text-slate-400 mt-1">Foco na evolução clínica e atendimento humanizado.</p>
        </div>
        <div className="flex items-center gap-2">
          {onOpenNewPatient && (
            <button
              onClick={onOpenNewPatient}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="h-4 w-4 text-emerald-400" /> Cadastrar Paciente
            </button>
          )}
          <button
            onClick={onNavigateToAgenda}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md"
          >
            Minha Agenda
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Schedule for Physio */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" /> Pacientes para Atendimento Hoje
          </h3>
          {todayApps.length > 0 ? (
            <div className="space-y-3">
              {todayApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
                      {app.timeSlot}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span>{app.patientName}</span>
                        {app.isEncaixe && (
                          <span
                            title="Encaixe de Horário"
                            className="inline-flex items-center gap-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider"
                          >
                            <AlertTriangle className="h-3 w-3 text-amber-400 fill-amber-400/20" />
                            Encaixe
                          </span>
                        )}
                      </h4>
                      <span className="text-slate-400 text-[11px]">{app.type} • {app.room}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectPatient(app.patientId)}
                    className="flex items-center gap-1 text-emerald-400 font-semibold hover:underline"
                  >
                    <FilePlus className="h-3.5 w-3.5" /> Evoluir
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center space-y-3 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
              <Calendar className="h-8 w-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">Nenhum paciente agendado para o dia de hoje.</p>
            </div>
          )}
        </div>

        {/* Quick Access Patients */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-400" /> Pacientes em Acompanhamento
            </h3>
            <button onClick={onNavigateToPatients} className="text-xs text-emerald-400 font-semibold hover:underline">
              Ver Todos ({patients.length})
            </button>
          </div>

          {patients.length > 0 ? (
            <div className="space-y-3">
              {patients.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectPatient(p.id)}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-xs cursor-pointer hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.photoUrl} alt={p.name} className="h-9 w-9 rounded-full object-cover border border-slate-700" />
                    <div>
                      <h4 className="font-bold text-slate-200">{p.name}</h4>
                      <span className="text-slate-400 text-[11px] truncate max-w-[200px] block">{p.mainComplaint || 'Sem queixa'}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center space-y-3 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
              <User className="h-8 w-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">Nenhum paciente cadastrado até o momento.</p>
              {onOpenNewPatient && (
                <button
                  onClick={onOpenNewPatient}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  Cadastrar Primeiro Paciente
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

