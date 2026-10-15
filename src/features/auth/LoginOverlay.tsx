import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { ImageUploader } from '../../components/common/ImageUploader';
import { ClinicLogo } from '../../components/common/ClinicLogo';
import { formatPhone } from '../../utils/masks';
import {
  Activity,
  Lock,
  UserCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  UserPlus,
  Clock,
  ShieldCheck,
  AlertCircle,
  Phone,
  Mail,
  Key,
  KeyRound,
  X,
  Globe,
} from 'lucide-react';

interface LoginOverlayProps {
  isOpen: boolean;
  users: User[];
  onLoginSuccess: (user: User) => void;
  onRegisterUser: (userData: Omit<User, 'id' | 'status'> & { requestedRole?: UserRole }) => void;
  pendingCount?: number;
  onClose?: () => void;
}

export const LoginOverlay: React.FC<LoginOverlayProps> = ({
  isOpen,
  users,
  onLoginSuccess,
  onRegisterUser,
  pendingCount = 0,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const activeUsers = users.filter((u) => u.status !== 'pending' && u.status !== 'rejected');
  const [selectedUserId, setSelectedUserId] = useState<string>(activeUsers[0]?.id || users[0]?.id || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('physio');
  const [regCrefito, setRegCrefito] = useState('');
  const [regSpecialty, setRegSpecialty] = useState('');
  const [regAvatarUrl, setRegAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
  );
  const [regPassword, setRegPassword] = useState('');
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const selectedUser = users.find((u) => u.id === selectedUserId) || activeUsers[0] || users[0];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setLoginError('Por favor, selecione um usuário cadastrado.');
      return;
    }

    if (selectedUser.status === 'pending') {
      setLoginError('Sua conta ainda está AGUARDANDO LIBERAÇÃO do Administrador. Tente em instantes!');
      return;
    }

    // Password verification check
    const expectedPassword = selectedUser.password || '123';
    if (password !== expectedPassword) {
      setLoginError(`Senha incorreta para ${selectedUser.name}. (Fale com o administrador do sistema)`);
      return;
    }

    onLoginSuccess(selectedUser);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      alert('Por favor, informe seu Nome e E-mail.');
      return;
    }

    onRegisterUser({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      role: regRole,
      requestedRole: regRole,
      crefito: regCrefito.trim() || undefined,
      specialty: regSpecialty.trim() || 'Fisioterapia Integrada',
      avatarUrl: regAvatarUrl,
    });

    setRegisterSuccessMsg(true);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador (ADM)';
      case 'physio':
        return 'Fisioterapeuta';
      case 'secretary':
        return 'Recepção / Secretária';
      default:
        return 'Paciente';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 relative overflow-hidden my-auto">
        {/* Top Header Return Button */}
        {onClose && (
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl bg-teal-950/60 hover:bg-teal-900/80 text-teal-300 border border-teal-500/30 py-2 px-3 text-xs font-bold transition-all shadow-sm"
              title="Voltar para a Página Inicial da Clínica"
            >
              <Globe className="h-3.5 w-3.5 text-teal-400" />
              <span>← Voltar ao Site Principal</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Fechar Login"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Glow Accent */}
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-3 relative z-10 flex flex-col items-center justify-center">
          <ClinicLogo variant="login" />
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Sistema de Gestão Clínico, Prontuários & Agendamentos
          </p>
        </div>

        {/* Tab Switcher (Login vs Autocadastro) */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setRegisterSuccessMsg(false);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#0f3e8f] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Fazer Login</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#0f3e8f] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Solicitar Acesso</span>
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Selecione seu Usuário Aprovado</span>
                <span className="text-[10px] text-blue-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-red-400" /> Acesso Protegido
                </span>
              </label>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {users.map((user) => {
                  const isSelected = selectedUserId === user.id;
                  const isPending = user.status === 'pending';

                  return (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setLoginError('');
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? isPending
                            ? 'border-amber-500 bg-amber-500/10 text-slate-100 ring-1 ring-amber-500/40'
                            : 'border-[#0f3e8f] bg-[#0f3e8f]/20 text-slate-100 ring-1 ring-blue-500/40'
                          : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <img
                        src={
                          user.avatarUrl ||
                          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'
                        }
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-200 truncate flex items-center justify-between">
                          <span>{user.name}</span>
                          {isPending ? (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Pendente
                            </span>
                          ) : (
                            isSelected && <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {getRoleBadge(user.role)} • {user.email}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Password input */}
            {selectedUser && (
              <div className="space-y-1 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                  <span>
                    Entrando como: <strong className="text-blue-400">{selectedUser.name}</strong>
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="Senha ou Código de Acesso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-[#0f3e8f] focus:outline-none"
                />
              </div>
            )}

            {loginError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0f3e8f] py-3 text-xs font-bold text-white hover:bg-[#0c2f6d] transition-colors shadow-lg shadow-blue-900/40 cursor-pointer"
            >
              <span>Entrar no Sistema</span>
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </button>
          </form>
        )}

        {/* TAB 2: AUTOCADASTRO */}
        {activeTab === 'register' && (
          <div>
            {registerSuccessMsg ? (
              <div className="py-6 text-center space-y-4 animate-fade-in">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-100">Solicitação Enviada!</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Seu cadastro foi registrado com sucesso. O administrador (<strong>Rômulo Chaves</strong>) foi notificado para definir seu perfil e aprovar seu acesso.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setRegisterSuccessMsg(false);
                    setActiveTab('login');
                  }}
                  className="rounded-2xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md"
                >
                  Voltar para o Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 text-xs text-emerald-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Cadastre seus dados. O acesso será liberado após aprovação do Administrador.</span>
                </div>

                {/* Photo Upload for Profile */}
                <ImageUploader
                  label="Sua Foto de Perfil"
                  currentImageUrl={regAvatarUrl}
                  onImageChange={(url) => setRegAvatarUrl(url)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dra. Mariana Costa"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="seu.email@exemplo.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Telefone (Máscara (DD) 9 XXXX-XXXX)
                    </label>
                    <input
                      type="text"
                      placeholder="(61) 9 9999-8888"
                      value={regPhone}
                      onChange={(e) => setRegPhone(formatPhone(e.target.value))}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Perfil Solicitado
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="physio">Fisioterapeuta</option>
                      <option value="secretary">Recepção / Secretária</option>
                      <option value="admin">Administrador (ADM)</option>
                    </select>
                  </div>
                </div>

                {regRole === 'physio' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        CREFITO (opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: CREFITO-3/12345-F"
                        value={regCrefito}
                        onChange={(e) => setRegCrefito(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Especialidade principal
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Ortopedia, RPG, Pilates"
                        value={regSpecialty}
                        onChange={(e) => setRegSpecialty(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Crie uma Senha
                  </label>
                  <input
                    type="password"
                    placeholder="Sua senha secreta"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg cursor-pointer"
                >
                  <UserPlus className="h-4 w-4 stroke-[2.5]" />
                  <span>Solicitar Cadastro e Enviar para Aprovação</span>
                </button>
              </form>
            )}
          </div>
        )}

        <div className="text-center pt-2 border-t border-slate-800 space-y-0.5">
          <p className="text-[10px] text-slate-400">
            Jucelino Castro Fisioterapia • Todos os direitos reservados © 2026
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold">
            Desenvolvimento do Sistema por Rômulo Chaves - ClienteBox
          </p>
        </div>
      </div>
    </div>
  );
};
