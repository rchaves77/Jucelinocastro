import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { ClinicLogo } from '../../components/common/ClinicLogo';
import { formatPhone } from '../../utils/masks';
import {
  Lock,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  UserPlus,
  ShieldCheck,
  AlertCircle,
  Phone,
  Mail,
  KeyRound,
  X,
  ChevronLeft,
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
  const [loginStep, setLoginStep] = useState<'select' | 'password'>('select');

  const activeUsers = users.filter((u) => u.status !== 'pending' && u.status !== 'rejected');

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

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

  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

  const handleSelectUser = (user: User) => {
    setSelectedUserId(user.id);
    setPassword('');
    setLoginError('');
    setLoginStep('password');
  };

  const handleBackToSelect = () => {
    setLoginStep('select');
    setPassword('');
    setLoginError('');
    setSelectedUserId('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!selectedUser) {
      setLoginError('Selecione um perfil para continuar.');
      return;
    }

    const expectedPassword = selectedUser.password || '123';
    if (password !== expectedPassword) {
      setLoginError('Senha incorreta. Verifique e tente novamente.');
      return;
    }

    onLoginSuccess(selectedUser);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      return;
    }

    onRegisterUser({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone,
      role: regRole,
      crefito: regCrefito,
      specialty: regSpecialty,
      photoUrl: regAvatarUrl,
      password: regPassword,
    });

    setRegisterSuccessMsg(true);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'physio':
        return 'Fisioterapeuta';
      case 'secretary':
        return 'Recepção';
      default:
        return 'Paciente';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center border-b border-slate-800">
            <div className="flex justify-center mb-4">
              <ClinicLogo variant="header" />
            </div>

            {activeTab === 'login' && loginStep === 'select' && (
              <>
                <h2 className="text-lg font-bold text-white">Acesse sua conta</h2>
                <p className="text-xs text-slate-400 mt-1">Selecione seu perfil para continuar</p>
              </>
            )}

            {activeTab === 'login' && loginStep === 'password' && (
              <>
                <h2 className="text-lg font-bold text-white">Bem-vindo de volta</h2>
                <p className="text-xs text-slate-400 mt-1">{selectedUser?.name}</p>
              </>
            )}

            {activeTab === 'register' && (
              <>
                <h2 className="text-lg font-bold text-white">Solicitar acesso</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Seu cadastro será analisado pelo administrador
                </p>
              </>
            )}
          </div>

          <div className="p-8">
            {activeTab === 'login' && loginStep === 'select' && (
              <div className="space-y-2">
                {activeUsers.length === 0 ? (
                  <div className="rounded-2xl bg-slate-800 border border-slate-700 p-6 text-center">
                    <AlertCircle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-300">Nenhum usuário ativo cadastrado.</p>
                  </div>
                ) : (
                  activeUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 p-3 text-left hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group"
                    >
                      <img
                        src={
                          user.photoUrl ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
                        }
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-emerald-500 transition-colors shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400">{getRoleLabel(user.role)}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))
                )}

                <div className="pt-4 border-t border-slate-800 mt-4">
                  <button
                    onClick={() => setActiveTab('register')}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4" />
                    Solicitar novo acesso
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'login' && loginStep === 'password' && selectedUser && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-800 border border-slate-700 p-3">
                  <img
                    src={
                      selectedUser.photoUrl ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
                    }
                    alt={selectedUser.name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{selectedUser.name}</p>
                    <p className="text-[11px] text-slate-400">{getRoleLabel(selectedUser.role)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackToSelect}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Trocar perfil"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Senha de acesso
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError('');
                      }}
                      placeholder="Digite sua senha"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="flex items-start gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3">
                    <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-300 font-medium leading-relaxed">{loginError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Lock className="h-4 w-4" />
                  Entrar no Sistema
                </button>

                <button
                  type="button"
                  onClick={handleBackToSelect}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Voltar para seleção de perfil
                </button>
              </form>
            )}

            {activeTab === 'register' && (
              <>
                {registerSuccessMsg ? (
                  <div className="text-center space-y-4 py-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
                      <CheckCircle2 className="h-9 w-9 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Solicitação enviada</h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        Seu cadastro foi encaminhado para aprovação do administrador. Você receberá
                        acesso após a liberação.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setRegisterSuccessMsg(false);
                        setActiveTab('login');
                        setLoginStep('select');
                      }}
                      className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
                    >
                      Voltar ao login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        E-mail *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="seu@email.com"
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Telefone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={regPhone}
                            onChange={(e) => setRegPhone(formatPhone(e.target.value))}
                            placeholder="(68) 99999-9999"
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Perfil
                        </label>
                        <select
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value as UserRole)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-2 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                          <option value="physio">Fisioterapeuta</option>
                          <option value="secretary">Recepção</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Senha *
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Crie uma senha"
                          className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer mt-2"
                    >
                      <UserCheck className="h-4 w-4" />
                      Enviar Solicitação
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Voltar ao login
                    </button>
                  </form>
                )}
              </>
            )}
          </div>

          <div className="px-8 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <p className="text-[10px] text-slate-400 font-medium">
              Acesso protegido • Dados criptografados
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 mx-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Fechar
          </button>
        )}
      </div>
    </div>
  );
};

