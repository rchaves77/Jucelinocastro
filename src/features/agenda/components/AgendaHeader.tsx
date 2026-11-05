import React from 'react';
import { ViewMode } from '../hooks/useAgendaState';
import { User } from '../../../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  MessageSquare,
  RotateCcw,
  Sun,
  CalendarDays,
  CalendarRange,
} from 'lucide-react';
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
  totalAppointments?: number;
}

const toISO = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseISO = (iso: string) => new Date(`${iso}T00:00:00`);

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
  physios = [],
  totalAppointments,
}) => {
  const dateObj = parseISO(selectedDate);
  const todayISO = toISO(new Date());

  const formattedDate = dateObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isToday = selectedDate === todayISO;
  const dayOfWeek = dateObj.getDay();
  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;

  const step = viewMode === 'day' ? 1 : viewMode === 'week' ? 7 : 30;

  const handlePrev = () => {
    const d = parseISO(selectedDate);
    d.setDate(d.getDate() - step);
    onDateChange(toISO(d));
  };

  const handleNext = () => {
    const d = parseISO(selectedDate);
    d.setDate(d.getDate() + step);
    onDateChange(toISO(d));
  };

  const handleToday = () => onDateChange(todayISO);

  const handleNextBusinessDay = () => {
    const d = parseISO(selectedDate);
    do {
      d.setDate(d.getDate() + 1);
    } while (d.getDay() === 0);
    onDateChange(toISO(d));
  };

  const suggestedTarget = getSuggestedConfirmationTargetDate();

  return (
    <div className="flex flex-col gap-4 bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-sm">

      {/* Linha 1: Navegação de data + modos de visualização + ações */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">

        {/* Navegação de data */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 p-1">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors cursor-pointer"
              aria-label="Período anterior"
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
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors cursor-pointer"
              aria-label="Próximo período"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleToday}
            disabled={isToday}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
              isToday
                ? 'bg-slate-800 text-slate-500 cursor-default'
                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 cursor-pointer'
            }`}
            title="Ir para hoje"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Hoje
          </button>

          <button
            onClick={handleNextBusinessDay}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors cursor-pointer"
            title="Próximo dia com atendimento"
          >
            <Sun className="h-3.5 w-3.5" />
            Próximo dia útil
          </button>

          <span className="text-xs font-semibold capitalize text-slate-300 hidden lg:inline">
            {formattedDate}
          </span>
        </div>

        {/* Modos de visualização */}
        <div className="inline-flex rounded-xl bg-slate-800 border border-slate-700/80 p-1 text-xs self-start">
          <button
            onClick={() => onViewModeChange('day')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'day'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            Dia
          </button>

          <button
            onClick={() => onViewModeChange('week')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'week'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Semana
          </button>

          <button
            onClick={() => onViewModeChange('month')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'month'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <CalendarRange className="h-3.5 w-3.5" />
            Mês
          </button>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenWhatsAppConfirmations && (
            <button
              onClick={onOpenWhatsAppConfirmations}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              title={`Sugestão: ${suggestedTarget}`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Confirmar WhatsApp</span>
            </button>
          )}

          <button
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Agendar Consulta</span>
          </button>
        </div>
      </div>

      {/* Linha 2: Filtros */}
      <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <Filter className="h-3.5 w-3.5 text-slate-500" />
          <span>Filtros:</span>
        </div>

        <select
          value={selectedPhysioId}
          onChange={(e) => onPhysioChange(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="all" className="bg-slate-900 text-slate-200">
            Todos os Fisioterapeutas
          </option>
          {physios.length > 0 ? (
            physios.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                {p.name}
              </option>
            ))
          ) : (
            <>
              <option value="u2" className="bg-slate-900 text-slate-200">
                Dr. Jucelino Castro
              </option>
              <option value="u3" className="bg-slate-900 text-slate-200">
                Dra. Aline Castro
              </option>
            </>
          )}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="all" className="bg-slate-900 text-slate-200">
            Todos os Status
          </option>
          <option value="confirmed" className="bg-slate-900 text-slate-200">
            Confirmados
          </option>
          <option value="pending" className="bg-slate-900 text-slate-200">
            Pendentes
          </option>
          <option value="in_progress" className="bg-slate-900 text-slate-200">
            Em Atendimento
          </option>
          <option value="completed" className="bg-slate-900 text-slate-200">
            Concluídos
          </option>
          <option value="no_show" className="bg-slate-900 text-slate-200">
            Faltou
          </option>
          <option value="canceled" className="bg-slate-900 text-slate-200">
            Cancelados
          </option>
        </select>

        {typeof totalAppointments === 'number' && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-[11px] font-bold text-slate-300">
            {totalAppointments} agendamento{totalAppointments === 1 ? '' : 's'}
          </span>
        )}

        {isSunday && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-[11px] font-bold text-rose-300">
            Domingo — clínica fechada
          </span>
        )}

        {isSaturday && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-bold text-amber-300">
            Sábado — só manhã
          </span>
        )}
      </div>
    </div>
  );
};
