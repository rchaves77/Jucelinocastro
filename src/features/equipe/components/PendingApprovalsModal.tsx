import React, { useState } from 'react';
import { User, UserRole } from '../../../types';
import { X, UserCheck, UserX, Shield, Clock, Check, AlertCircle, Sparkles } from 'lucide-react';

interface PendingApprovalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingUsers: User[];
  onApproveUser: (userId: string, assignedRole: UserRole) => void;
  onRejectUser: (userId: string) => void;
}

export const PendingApprovalsModal: React.FC<PendingApprovalsModalProps> = ({
  isOpen,
  onClose,
  pendingUsers,
  onApproveUser,
  onRejectUser,
}) => {
  // Store selected role for each pending user ID
  const [roleMap, setRoleMap] = useState<Record<string, UserRole>>({});

  if (!isOpen) return null;

  const handleRoleChange = (userId: string, role: UserRole) => {
    setRoleMap((prev) => ({ ...prev, [userId]: role }));
  };

  const getRoleForUser = (user: User): UserRole => {
    return roleMap[user.id] || user.role || 'physio';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-5 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Solicitações de Autocadastro
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
                  {pendingUsers.length} Pendente{pendingUsers.length !== 1 ? 's' : ''}
                </span>
              </h2>
              <p className="text-xs text-slate-400">Defina o perfil de acesso e libere a entrada no sistema da clínica</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List of Pending Registrations */}
        {pendingUsers.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-emerald-400">
              <Check className="h-6 w-6 stroke-[3]" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">Nenhum cadastro pendente</h3>
            <p className="text-xs text-slate-400">Todas as solicitações de acesso já foram revisadas e liberadas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingUsers.map((user) => {
              const currentSelectedRole = getRoleForUser(user);

              return (
                <div
                  key={user.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.avatarUrl ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
                        }
                        alt={user.name}
                        className="h-12 w-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                          {user.name}
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                            Solicitado em {user.createdAt || 'Hoje'}
                          </span>
                        </h4>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {user.email} {user.phone && `• ${user.phone}`}
                        </div>
                        {user.crefito && (
                          <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                            CREFITO: {user.crefito}
                          </div>
                        )}
                        {user.specialty && (
                          <div className="text-[11px] text-slate-400 italic mt-0.5">
                            Especialidade: {user.specialty}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Role Selector */}
                    <div className="space-y-1 sm:text-right shrink-0">
                      <label className="block text-[11px] font-semibold text-slate-400">
                        Perfil a Conceder:
                      </label>
                      <select
                        value={currentSelectedRole}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none cursor-pointer"
                      >
                        <option value="physio">Fisioterapeuta</option>
                        <option value="secretary">Recepção / Secretária</option>
                        <option value="admin">Administrador (ADM)</option>
                        <option value="patient">Paciente (Portal)</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => onRejectUser(user.id)}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors"
                    >
                      <UserX className="h-3.5 w-3.5" />
                      <span>Recusar</span>
                    </button>

                    <button
                      onClick={() => onApproveUser(user.id, currentSelectedRole)}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md"
                    >
                      <UserCheck className="h-3.5 w-3.5 fill-slate-950" />
                      <span>Aprovar & Liberar Acesso</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            Controle seguro e sem custos adicionais
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 underline font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
