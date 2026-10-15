import React from 'react';
import { Patient, Appointment } from '../../types';
import { Users, Calendar, DollarSign, TrendingUp, CheckCircle2, ArrowUpRight, Plus, UserPlus, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AdminDashboardProps {
  patients: Patient[];
  appointments: Appointment[];
  onNavigateToAgenda: () => void;
  onNavigateToPatients: () => void;
  onNavigateToAnalytics: () => void;
  onOpenNewAppointment?: () => void;
  onOpenNewPatient?: () => void;
  userName?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  patients,
  appointments,
  onNavigateToAgenda,
  onNavigateToPatients,
  onNavigateToAnalytics,
  onOpenNewAppointment,
  onOpenNewPatient,
  userName = 'Rômulo Chaves',
}) => {
  const activePatientsCount = patients.filter((p) => p.status === 'Ativo').length;
  const monthlyAppointmentsCount = appointments.length;
  const completedCount = appointments.filter((a) => a.status === 'completed' || a.status === 'confirmed').length;
  const attendanceRate = monthlyAppointmentsCount > 0
    ? Math.round((completedCount / monthlyAppointmentsCount) * 100)
    : 100;

  const monthlyRevenue = appointments
    .filter((a) => a.status !== 'canceled')
    .reduce((sum, a) => sum + (a.price || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  const daysMap: Record<string, number> = { Seg: 0, Ter: 0, Qua: 0, Qui: 0, Sex: 0, Sáb: 0 };
  const chartData = [
    { day: 'Seg', atendimentos: daysMap.Seg },
    { day: 'Ter', atendimentos: daysMap.Ter },
    { day: 'Qua', atendimentos: daysMap.Qua },
    { day: 'Qui', atendimentos: daysMap.Qui },
    { day: 'Sex', atendimentos: daysMap.Sex },
    { day: 'Sáb', atendimentos: daysMap.Sáb },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-slate-900 p-6 text-slate-100 border border-slate-800 shadow-xl">
        <div>
          <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider mb-2">
            Visão Geral do Administrador
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100">Painel Clínico - {userName}</h1>
          <p className="text-xs text-slate-400 mt-1">Resumo em tempo real das atividades da clínica Jucelino Castro Fisioterapia.</p>
        </div>
        <div className="flex items-center gap-2">
          {onOpenNewPatient && (
            <button
              onClick={onOpenNewPatient}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <UserPlus className="h-4 w-4 text-emerald-400" /> Cadastrar Paciente
            </button>
          )}
          {onOpenNewAppointment && (
            <button
              onClick={onOpenNewAppointment}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md"
            >
              <Plus className="h-4 w-4 stroke-[3]" /> Agendar
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            <span>Pacientes Ativos</span>
            <Users className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{activePatientsCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Total: {patients.length} cadastrados</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            <span>Atendimentos Registrados</span>
            <Calendar className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{monthlyAppointmentsCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Sessões registradas no sistema</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            <span>Taxa de Presença</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{attendanceRate}%</div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Presença confirmada</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold uppercase">
            <span>Faturamento Total</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            R$ {monthlyRevenue.toLocaleString('pt-BR')}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Valor acumulado</span>
        </div>
      </div>

      {/* Chart & Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-100 text-sm">Volume de Atendimentos por Dia</h3>
            <button onClick={onNavigateToAnalytics} className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1">
              <span>Relatórios</span> <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Bar dataKey="atendimentos" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Agenda */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-100 text-sm">Próximos de Hoje</h3>
            <button onClick={onNavigateToAgenda} className="text-xs text-emerald-400 font-semibold hover:underline">
              Ver Agenda
            </button>
          </div>

          {todayAppointments.length > 0 ? (
            <div className="space-y-2.5">
              {todayAppointments.slice(0, 4).map((app) => (
                <div key={app.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
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
                    </div>
                    <div className="text-[11px] text-slate-400">{app.timeSlot} - {app.type}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full">{app.room}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center space-y-3 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
              <Calendar className="h-8 w-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">Nenhum atendimento agendado para hoje.</p>
              {onOpenNewAppointment && (
                <button
                  onClick={onOpenNewAppointment}
                  className="rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  Novo Agendamento
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

