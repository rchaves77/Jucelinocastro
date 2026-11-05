import React from 'react';
import { Search, Plus, Filter, UserCheck } from 'lucide-react';

interface PatientHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onOpenNewPatientModal: () => void;
  totalCount: number;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenNewPatientModal,
  totalCount,
}) => {
  return (
    <div className="flex flex-col gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Search and Filters */}
      <div className="flex flex-1 items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, CPF ou telefone..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all" className="bg-slate-900 text-slate-200">Todos os Pacientes</option>
          <option value="Ativo" className="bg-slate-900 text-slate-200">Ativos</option>
          <option value="Em Pausa" className="bg-slate-900 text-slate-200">Em Pausa</option>
          <option value="Alta" className="bg-slate-900 text-slate-200">Alta Médica</option>
        </select>
      </div>

      {/* Counter & Action */}
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <span className="text-xs text-slate-400 font-medium">
          Total: <strong className="text-slate-100 font-bold">{totalCount}</strong> cadastrados
        </span>
        <button
          onClick={onOpenNewPatientModal}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Cadastrar Paciente</span>
        </button>
      </div>
    </div>
  );
};
