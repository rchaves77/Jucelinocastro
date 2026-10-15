import React, { useState } from 'react';
import { AuditLog, User } from '../../../types';
import { Shield, X, Search, Filter, History, Lock, AlertTriangle, FileSpreadsheet, Trash2, UserCheck, Clock } from 'lucide-react';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  logs: AuditLog[];
  onClearLogs?: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  logs,
  onClearLogs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('all');

  if (!isOpen) return null;

  const isAdmin = currentUser.role === 'admin';

  // Filter logs based on search and module
  const filteredLogs = logs.filter((log) => {
    if (moduleFilter !== 'all' && log.module !== moduleFilter) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term) ||
      log.authorName.toLowerCase().includes(term) ||
      (log.targetPatientName && log.targetPatientName.toLowerCase().includes(term))
    );
  });

  const getModuleBadgeColor = (module: string) => {
    switch (module) {
      case 'Atendimento/Recepção':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Prontuário':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'Templates':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Equipe':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'ADM';
      case 'physio':
        return 'Fisioterapeuta';
      case 'secretary':
        return 'Recepção';
      default:
        return 'Usuário';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-5 relative max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Shield className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Trilha de Auditoria & Segurança do Sistema
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  Exclusivo ADM
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Registro histórico imutável de confirmações de presença, evoluções, templates e alterações de prontuário
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Permission Guard */}
        {!isAdmin ? (
          <div className="py-12 text-center space-y-3 my-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Lock className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Acesso Restrito ao Administrador</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Apenas perfis com privilégio de <strong>Administrador (ADM)</strong> podem consultar os registros detalhados da trilha de auditoria do sistema.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Voltar ao Sistema
            </button>
          </div>
        ) : (
          <>
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              {/* Search bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por ação, responsável, paciente ou detalhe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Module Filter dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  className="w-full sm:w-auto rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-emerald-400 focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">Todos os Módulos</option>
                  <option value="Atendimento/Recepção">Atendimento / Recepção</option>
                  <option value="Prontuário">Prontuário & Evoluções</option>
                  <option value="Templates">Templates Clínicos</option>
                  <option value="Equipe">Gestão de Equipe & Permissões</option>
                  <option value="Agenda">Agendamentos</option>
                </select>
              </div>
            </div>

            {/* Logs List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[300px]">
              {filteredLogs.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <History className="h-8 w-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Nenhum registro encontrado para este filtro.</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getModuleBadgeColor(log.module)}`}>
                          {log.module}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100">{log.action}</h4>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed">
                      {log.details}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Realizado por:</span>
                        <strong className="text-emerald-400 font-semibold">{log.authorName}</strong>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                          {getRoleLabel(log.authorRole)}
                        </span>
                      </div>

                      {log.targetPatientName && (
                        <div className="text-[10px] text-slate-400">
                          Paciente: <strong className="text-slate-200">{log.targetPatientName}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span>
                Total de <strong>{filteredLogs.length}</strong> registro(s) auditado(s)
              </span>

              {onClearLogs && logs.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Deseja limpar o histórico visual da auditoria?')) {
                      onClearLogs();
                    }
                  }}
                  className="flex items-center gap-1 text-rose-400 hover:text-rose-300 text-xs font-semibold"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Limpar Registros
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
