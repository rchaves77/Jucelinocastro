import React, { useState } from 'react';
import { X, User as UserIcon, Lock, KeyRound, Check, Shield, Save, Phone, Mail } from 'lucide-react';
import { User } from '../../../types';
import { formatPhone } from '../../../utils/masks';
import { ClinicLogo } from '../../../components/common/ClinicLogo';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateProfile: (updated: Partial<User>) => void;
  onAddAuditLog?: (log: any) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onAddAuditLog,
}) => {
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(formatPhone(currentUser.phone || ''));
  const [crefito, setCrefito] = useState(currentUser.crefito || '');
  const [specialty, setSpecialty] = useState(currentUser.specialty || '');

  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();

    onUpdateProfile({
      name,
      email,
      phone,
      crefito,
      specialty,
    });

    if (onAddAuditLog) {
      onAddAuditLog({
        authorName: currentUser.name,
        authorRole: currentUser.role,
        action: 'Atualização de Perfil',
        details: `Atualizou dados cadastrais de perfil (${name}, ${email}).`,
        module: 'Equipe',
      });
    }

    setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser.password && currentPasswordInput !== currentUser.password) {
      setMessage({ type: 'error', text: 'A senha atual informada está incorreta.' });
      return;
    }

    if (!newPassword || newPassword.length < 3) {
      setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 3 caracteres.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'A confirmação de senha não coincide.' });
      return;
    }

    onUpdateProfile({
      password: newPassword,
    });

    if (onAddAuditLog) {
      onAddAuditLog({
        authorName: currentUser.name,
        authorRole: currentUser.role,
        action: 'Alteração de Senha',
        details: `Usuário ${currentUser.name} alterou a própria senha de acesso com sucesso.`,
        module: 'Equipe',
      });
    }

    setCurrentPasswordInput('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage({ type: 'success', text: '🔑 Senha alterada e atualizada com sucesso!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="h-12 w-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Gestão de Perfil & Segurança
              </h2>
              <p className="text-xs text-slate-400">Edite suas informações reais e altere sua senha de acesso</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
              message.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
          >
            <Check className="h-4 w-4 shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveInfo} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <UserIcon className="h-4 w-4 text-emerald-400" />
            Informações Pessoais & Profissionais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail de Acesso</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone (Máscara DD 9 XXXX-XXXX)</label>
              <input
                type="text"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(61) 9 9999-8888"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {currentUser.role === 'physio' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registro CREFITO</label>
                <input
                  type="text"
                  value={crefito}
                  onChange={(e) => setCrefito(e.target.value)}
                  placeholder="CREFITO-3/184920-F"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Especialidade / Cargo</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Salvar Informações do Perfil</span>
          </button>
        </form>

        <form onSubmit={handleChangePassword} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="h-4 w-4 text-amber-400" />
            Redefinição de Senha
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Senha Atual</label>
              <input
                type="password"
                placeholder="Informe sua senha atual"
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nova Senha</label>
                <input
                  type="password"
                  placeholder="Digite a nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirmar Nova Senha</label>
                <input
                  type="password"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
          >
            <Lock className="h-4 w-4" />
            <span>Redefinir Minha Senha</span>
          </button>
        </form>

        {currentUser?.role === 'admin' && (
          <div className="space-y-4 rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-400" />
                Logo Oficial da Jucelino Castro Fisioterapia
              </h3>
              <ClinicLogo variant="header" showSubtitle={false} />
            </div>

            <p className="text-xs text-slate-400">
              O logo exibido em todos os ambientes do sistema é sempre o arquivo LOGOJC.PNG, sem substituição por outras imagens.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
              <ClinicLogo variant="header" showSubtitle={false} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
