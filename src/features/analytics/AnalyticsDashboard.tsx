import React from 'react';
import { Patient, Appointment } from '../../types';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface AnalyticsDashboardProps {
  patients?: Patient[];
  appointments?: Appointment[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  patients = [],
  appointments = [],
}) => {
  const COLORS = ['#10B981', '#06B6D4', '#6366F1', '#F59E0B'];

  const totalRevenue = appointments
    .filter((a) => a.status !== 'canceled')
    .reduce((sum, a) => sum + (a.price || 0), 0);

  const completedApps = appointments.filter((a) => a.status === 'completed' || a.status === 'confirmed');
  const avgTicket = completedApps.length > 0 ? Math.round(totalRevenue / completedApps.length) : 0;

  // Breakdown of procedure types
  const treatmentCounts: Record<string, number> = {};
  appointments.forEach((a) => {
    treatmentCounts[a.type] = (treatmentCounts[a.type] || 0) + 1;
  });

  const treatmentsData = Object.keys(treatmentCounts).map((type) => ({
    name: type,
    count: treatmentCounts[type],
  }));

  const chartData = [
    { month: 'Este Mês', receita: totalRevenue },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Banner */}
      <div className="rounded-3xl bg-slate-900 p-6 text-slate-100 border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider mb-1">
            Métricas & Indicadores de Desempenho
          </span>
          <h1 className="text-xl font-bold">Relatório Analítico da Clínica Jucelino Castro Fisioterapia</h1>
          <p className="text-xs text-slate-400 mt-1">Análise estratégica de faturamento, novos pacientes e tratamentos.</p>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <span className="text-xs text-slate-400 font-medium uppercase">Faturamento Total</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            R$ {totalRevenue.toLocaleString('pt-BR')}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">{appointments.length} agendamentos no sistema</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <span className="text-xs text-slate-400 font-medium uppercase">Ticket Médio por Sessão</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">R$ {avgTicket.toLocaleString('pt-BR')}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Calculado sobre sessões ativas</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <span className="text-xs text-slate-400 font-medium uppercase">Total de Pacientes Cadastrados</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{patients.length}</div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Prontuários no sistema</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Bar Chart */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <h3 className="font-bold text-slate-100 text-sm mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-400" /> Receita de Atendimentos
          </h3>
          {appointments.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                    formatter={(val: number) => [`R$ ${val.toLocaleString('pt-BR')}`, 'Receita']}
                  />
                  <Bar dataKey="receita" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500">
              <Activity className="h-8 w-8 mb-2 stroke-1" />
              <p className="text-xs">Nenhum dado de receita registrado ainda.</p>
            </div>
          )}
        </div>

        {/* Top Treatments Pie Chart */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
          <h3 className="font-bold text-slate-100 text-sm mb-4 flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-emerald-400" /> Distribuição de Procedimentos
          </h3>
          {treatmentsData.length > 0 ? (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={treatmentsData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {treatmentsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-2xl p-6 text-center text-slate-500">
              <PieChartIcon className="h-8 w-8 mb-2 stroke-1" />
              <p className="text-xs">Aguardando agendamentos para gerar estatísticas de procedimentos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

