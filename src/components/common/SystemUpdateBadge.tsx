import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, ChevronUp, ChevronDown, CheckCircle2, UserCheck, Clock } from 'lucide-react';

interface SystemUpdateBadgeProps {
  className?: string;
}

export const SystemUpdateBadge: React.FC<SystemUpdateBadgeProps> = ({ className = '' }) => {
  const [isMinimized, setIsMinimized] = useState(() => {
    return localStorage.getItem('jc_update_badge_minimized') === 'true';
  });

  const [lastUpdate, setLastUpdate] = useState(() => {
    return (
      localStorage.getItem('jc_last_system_update') ||
      '15/10/2026 às 15:50'
    );
  });

  const author = 'Rômulo Chaves - @ClienteBox';

  const toggleMinimize = () => {
    const nextState = !isMinimized;
    setIsMinimized(nextState);
    localStorage.setItem('jc_update_badge_minimized', String(nextState));
  };

  const handleManualRefresh = () => {
    const now = new Date();
    const formatted = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
    setLastUpdate(formatted);
    localStorage.setItem('jc_last_system_update', formatted);
  };

  return (
    <div
      className={`fixed bottom-3 left-3 z-40 select-none print:hidden transition-all duration-300 ease-in-out ${className}`}
      title="Status da Última Atualização do Sistema - Jucelino Castro Fisioterapia"
    >
      {isMinimized ? (
        // Minimized compact pill
        <button
          onClick={toggleMinimize}
          className="group flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-950/90 px-3 py-1.5 text-xs text-slate-300 shadow-2xl backdrop-blur-md hover:border-emerald-500/60 hover:bg-slate-900 transition-all cursor-pointer"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-[11px] text-slate-200">
            Atualizado: {lastUpdate}
          </span>
          <ChevronUp className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
        </button>
      ) : (
        // Full expanded informative card
        <div className="w-72 sm:w-80 rounded-2xl border border-slate-700/80 bg-slate-950/95 p-3.5 shadow-2xl backdrop-blur-md text-slate-200 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-bold tracking-wide uppercase text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Sistema Atualizado
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleManualRefresh}
                className="rounded-lg p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
                title="Sincronizar data e hora com o momento atual"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={toggleMinimize}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors cursor-pointer"
                title="Minimizar indicador"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Última Atualização:</span>
                <span className="font-semibold text-slate-100 font-mono text-[11px]">{lastUpdate}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-300">
              <UserCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Responsável / Feito por:</span>
                <span className="font-bold text-emerald-300 text-[11px]">{author}</span>
              </div>
            </div>
          </div>

          {/* Footer Subtitle */}
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span className="truncate">Jucelino Castro Fisioterapia</span>
            <span className="inline-flex items-center gap-1 text-emerald-400/90 font-semibold shrink-0">
              <CheckCircle2 className="h-3 w-3" /> Online
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
