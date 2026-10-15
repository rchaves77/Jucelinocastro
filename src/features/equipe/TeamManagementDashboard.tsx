import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { useUserState } from './hooks/useUserState';
import { TeamMemberModal } from './components/TeamMemberModal';
import {
  Users,
  Shield,
  UserPlus,
  Edit,
  Trash2,
  Stethoscope,
  Key,
  CheckCircle2,
  LogIn,
  Camera,
  Award,
} from 'lucide-react';

interface TeamManagementDashboardProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
}

export const TeamManagementDashboard: React.FC<TeamManagementDashboardProps> = ({
  currentUser,
  onSwitchUser,
}) => {
  const { users, addUser, updateUser, deleteUser } = useUserState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);

  const handleOpenAddModal = () => {
    setSelectedUserForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUserForEdit(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (userData: Omit<User, 'id'> | Partial<User>, id?: string) => {
    if (id) {
      updateUser(id, userData as Partial<User>);
    } else {
      addUser(userData as Omit<User, 'id'>);
    }
  };

  const handleDelete = (user: User) => {
    if (confirm(`Tem certeza que deseja remover ${user.name} da equipe?`)) {
      deleteUser(user.id);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Shield className="h-3 w-3" /> Administrador (ADM)
          </span>
        );
      case 'physio':
        return (
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
            <Stethoscope className="h-3 w-3" /> Fisioterapeuta
          </span>
        );
      case 'secretary':
        return (
          <span className="rounded-full bg-purple-500/20 px-3 py-1 text-[10px] font-bold text-purple-400 border border-purple-500/30 flex items-center gap-1">
            <Users className="h-3 w-3" /> Secretária / Recepção
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-bold text-slate-400 border border-slate-700">
            Paciente
          </span>
        );
    }
  };

  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalPhysios = users.filter((u) => u.role === 'physio').length;
  const totalSecretaries = users.filter((u) => u.role === 'secretary').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 p-6 text-slate-100 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider mb-1">
            Controle de Acessos & Equipe
          </span>
          <h1 className="text-xl sm:text-2xl font-bold">Gestão de Perfil & Membros da Equipe</h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre novos fisioterapeutas, atualize fotos de perfil e altere permissões de acesso da clínica Jucelino Castro Fisioterapia.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shrink-0 shadow-lg"
        >
          <UserPlus className="h-4 w-4 stroke-[2.5]" />
          <span>Cadastrar Novo Membro</span>
        </button>
      </div>

      {/* Team Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Total da Equipe</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{users.length}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Profissionais ativos no sistema</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Administradores</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{totalAdmins}</div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Rômulo Chaves & Gestores</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Fisioterapeutas</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{totalPhysios}</div>
          <span className="text-[10px] text-cyan-400 font-semibold mt-1 block">Dr. Jucelino & Dra. Aline</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Recepção</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">{totalSecretaries}</div>
          <span className="text-[10px] text-purple-400 font-semibold mt-1 block">Katiuscia Braga Castro</span>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-400" /> Membros Cadastrados no Sistema ({users.length})
          </h2>
          <span className="text-xs text-slate-400">Clique em 'Editar Foto & Acesso' para alterar permissões</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {users.map((user) => {
            const isSelf = currentUser.id === user.id;

            return (
              <div
                key={user.id}
                className={`rounded-3xl border p-5 shadow-sm transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelf
                    ? 'border-emerald-500/60 bg-slate-900 ring-1 ring-emerald-500/40'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }`}
              >
                {isSelf && (
                  <span className="absolute top-3 right-3 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                    Sua Sessão Atual
                  </span>
                )}

                <div className="flex items-start gap-4">
                  <div className="relative group">
                    <img
                      src={user.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
                      alt={user.name}
                      className="h-16 w-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md group-hover:border-emerald-500 transition-colors"
                    />
                    <button
                      onClick={() => handleOpenEditModal(user)}
                      className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-md hover:bg-emerald-400 transition-colors"
                      title="Alterar Foto"
                    >
                      <Camera className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-100 text-sm truncate">{user.name}</h3>
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    {user.crefito && (
                      <div className="text-[11px] font-mono font-semibold text-emerald-400 flex items-center gap-1">
                        <Award className="h-3 w-3 text-emerald-400" /> {user.crefito}
                      </div>
                    )}
                    <p className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700 inline-block mt-1">
                      {user.specialty || 'Profissional da Clínica'}
                    </p>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => onSwitchUser(user)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <LogIn className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Logar como Perfil</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(user)}
                      className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                      title="Editar foto e tipo de acesso"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Editar</span>
                    </button>

                    {!isSelf && users.length > 1 && (
                      <button
                        onClick={() => handleDelete(user)}
                        className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Remover da equipe"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Member Modal */}
      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        initialData={selectedUserForEdit}
      />
    </div>
  );
};
