import React from 'react';
import { ViewMode } from '../hooks/useAgendaState';
import { User } from '../../../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, MessageSquare } from 'lucide-react';
import { getSuggestedConfirmationTargetDate } from '../../../utils/whatsappMessages';

interface AgendaHeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedPhysioId: string;
  onPhysioChange: (id: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onOpenNewModal: () => void;
  onOpenWhatsAppConfirmations?: () => void;
  physios?: User[];
}

export const AgendaHeader: React.FC<AgendaHeaderProps> = ({
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  selectedPhysioId,
  onPhysioChange,
  statusFilter,
  onStatusFilterChange,
  onOpenNewModal,
  onOpenWhatsAppConfirmations,
  physios,
}) => {
  // Format formatted display date
  const dateObj = new Date(selectedDate + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const suggestedTarget = getSuggestedConfirmationTargetDate();

  const handlePrevDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  return (
    <div className="flex flex-col gap-4 bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Date Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 p-1">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer px-1"
            />
            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <span className="text-xs font-semibold capitalize text-slate-300 hidden lg:inline">
            {formattedDate}
          </span>
        </div>

        {/* View Mode Buttons (Daily as Default, Monthly secondary per spec rule) */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-800 border border-slate-700/80 p-1 text-xs">
            <button
              id="view-mode-day"
              onClick={() => onViewModeChange('day')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'day'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Visão Diária
            </button>
            <button
              id="view-mode-week"
              onClick={() => onViewModeChange('week')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'week'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Semanal
            </button>
            <button
              id="view-mode-month"
              onClick={() => onViewModeChange('month')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'month'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Mensal
            </button>
          </div>

          {onOpenWhatsAppConfirmations && (
            <button
              onClick={onOpenWhatsAppConfirmations}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors shrink-0 cursor-pointer shadow-xs"
              title={`Disparar confirmações via WhatsApp para ${suggestedTarget.dayLabel} (${suggestedTarget.formattedTargetDate})`}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:inline">
                {suggestedTarget.isMonday || suggestedTarget.isSaturday
                  ? 'Confirmar Segunda (07:30)'
                  : 'Confirmar Amanhã (WA)'}
              </span>
              <span className="md:hidden">Confirmar WA</span>
            </button>
          )}

          <button
            onClick={onOpenNewModal}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span className="hidden sm:inline">Agendar Consulta</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span>Filtros:</span>
        </div>

        <select
          value={selectedPhysioId}
          onChange={(e) => onPhysioChange(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all" className="bg-slate-900 text-slate-200">Todos os Fisioterapeutas</option>
          {physios && physios.length > 0 ? (
            physios.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                {p.name}
              </option>
            ))
          ) : (
            <>
              <option value="u2" className="bg-slate-900 text-slate-200">Dr. Jucelino Castro</option>
              <option value="u3" className="bg-slate-900 text-slate-200">Dra. Aline Castro</option>
            </>
          )}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all" className="bg-slate-900 text-slate-200">Todos os Status</option>
          <option value="confirmed" className="bg-slate-900 text-slate-200">Confirmados</option>
          <option value="pending" className="bg-slate-900 text-slate-200">Pendente</option>
          <option value="completed" className="bg-slate-900 text-slate-200">Concluídos</option>
          <option value="canceled" className="bg-slate-900 text-slate-200">Cancelados</option>
        </select>
      </div>
    </div>
  );
};
