import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../../../types';
import { X, UserPlus, Image, Shield, Stethoscope, Mail, Check, Sparkles, Key } from 'lucide-react';
import { ImageUploader } from '../../../components/common/ImageUploader';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id'> | Partial<User>, id?: string) => void;
  initialData?: User | null;
}

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('physio');
  const [specialty, setSpecialty] = useState('');
  const [crefito, setCrefito] = useState('');
  const [password, setPassword] = useState('123');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setRole(initialData.role || 'physio');
      setSpecialty(initialData.specialty || '');
      setCrefito(initialData.crefito || '');
      setPassword(initialData.password || '123');
      setAvatarUrl(initialData.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80');
    } else {
      setName('');
      setEmail('');
      setRole('physio');
      setSpecialty('Fisioterapia Ortopédica & Esportiva');
      setCrefito('CREFITO-3/00000-F');
      setPassword('123');
      setAvatarUrl('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const dataPayload = {
      name,
      email,
      role,
      specialty: specialty.trim(),
      crefito: role === 'physio' || role === 'admin' ? crefito.trim() : undefined,
      password: password.trim() || '123',
      avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    };

    onSave(dataPayload, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {initialData ? 'Editar Perfil & Acesso' : 'Adicionar Membro à Equipe'}
              </h2>
              <p className="text-xs text-slate-400">
                {initialData ? 'Altere as permissões e dados do profissional.' : 'Cadastre novos fisioterapeutas, administradores ou recepção.'}
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Avatar Photo Selector */}
          <ImageUploader
            label="Foto de Perfil do Profissional"
            currentImageUrl={avatarUrl}
            onImageChange={(url) => setAvatarUrl(url)}
          />

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Nome Completo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Rômulo Chaves"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">E-mail de Acesso *</label>
              <input
                type="email"
                required
                placeholder="Ex: nome@jcfisioterapia.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Access Role Selector */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-400" /> Perfil de Acesso no Sistema
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  role === 'admin'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">Administrador</div>
                <div className="text-[10px] opacity-80 mt-0.5">Acesso total e relatórios</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('physio')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  role === 'physio'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">Fisioterapeuta</div>
                <div className="text-[10px] opacity-80 mt-0.5">Atendimento e prontuário</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('secretary')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  role === 'secretary'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">Secretária / Recepção</div>
                <div className="text-[10px] opacity-80 mt-0.5">Agenda e agendamentos</div>
              </button>
            </div>
          </div>

          {/* Specialty & CREFITO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Especialidade / Cargo</label>
              <input
                type="text"
                placeholder="Ex: Fisioterapia Trauma-Ortopédica"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            {(role === 'physio' || role === 'admin') && (
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Nº CREFITO</label>
                <input
                  type="text"
                  placeholder="Ex: CREFITO-3/12345-F"
                  value={crefito}
                  onChange={(e) => setCrefito(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>
            )}
          </div>

          {/* Password Reset Field (Admin Control) */}
          <div className="space-y-1 bg-slate-950/50 p-3 rounded-2xl border border-slate-800">
            <label className="font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Key className="h-3.5 w-3.5 text-emerald-400" /> Senha de Acesso do Profissional
              </span>
              <span className="text-[10px] text-slate-400 font-normal">(Definir/Redefinir Senha)</span>
            </label>
            <input
              type="text"
              required
              placeholder="Digite a nova senha de acesso..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-400">
              Dica: Como administrador, você pode alterar a senha de qualquer profissional a qualquer momento.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>{initialData ? 'Salvar Alterações' : 'Cadastrar Membro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
