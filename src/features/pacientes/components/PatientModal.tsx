import React, { useState, useEffect } from 'react';
import { Patient } from '../../../types';
import { X } from 'lucide-react';
import { ImageUploader } from '../../../components/common/ImageUploader';
import { formatCPF, formatPhone } from '../../../utils/masks';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Partial<Patient>) => void;
  initialData?: Patient | null;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Patient['gender']>('Feminino');
  const [address, setAddress] = useState('');
  const [mainComplaint, setMainComplaint] = useState('');
  const [physioId, setPhysioId] = useState('u2');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCpf(initialData.cpf);
      setPhone(initialData.phone);
      setEmail(initialData.email);
      setBirthDate(initialData.birthDate);
      setGender(initialData.gender);
      setAddress(initialData.address);
      setMainComplaint(initialData.mainComplaint);
      setPhysioId(initialData.assignedPhysioId || 'u2');
      setPhotoUrl(initialData.photoUrl || '');
    } else {
      setName('');
      setCpf('');
      setPhone('');
      setEmail('');
      setBirthDate('1990-01-01');
      setGender('Feminino');
      setAddress('');
      setMainComplaint('');
      setPhysioId('u2');
      setPhotoUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim().toUpperCase(),
      cpf,
      phone,
      email,
      birthDate,
      gender,
      address,
      mainComplaint,
      photoUrl,
      assignedPhysioId: physioId,
      assignedPhysioName: physioId === 'u3' ? 'Dra. Aline Castro' : 'Dr. Jucelino Castro',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 shadow-2xl border border-slate-800 overflow-hidden text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/50">
          <h3 className="font-bold text-slate-100 text-base">
            {initialData ? 'Editar Cadastro de Paciente' : 'Novo Cadastro de Paciente'}
          </h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Patient Photo Uploader */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
            <ImageUploader
              label="Foto do Paciente (Foto de Perfil / Câmera)"
              currentImageUrl={photoUrl}
              onImageChange={(url) => setPhotoUrl(url)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">Nome Completo (Caixa Alta)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="DIGITE O NOME DO PACIENTE..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none transition-colors uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">CPF (Máscara XXX.XXX.XXX-XX)</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none font-mono transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Telefone (Máscara (DD) 9 XXXX-XXXX)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(61) 9 9999-8888"
                maxLength={16}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none font-mono transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Data de Nasc.</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Gênero</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Patient['gender'])}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none transition-colors"
              >
                <option value="Feminino" className="bg-slate-900 text-slate-100">Feminino</option>
                <option value="Masculino" className="bg-slate-900 text-slate-100">Masculino</option>
                <option value="Outro" className="bg-slate-900 text-slate-100">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Fisioterapeuta</label>
              <select
                value={physioId}
                onChange={(e) => setPhysioId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none transition-colors"
              >
                <option value="u2" className="bg-slate-900 text-slate-100">Dr. Jucelino Castro</option>
                <option value="u3" className="bg-slate-900 text-slate-100">Dra. Aline Castro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">Queixa Principal / Motivo da Consulta</label>
            <textarea
              value={mainComplaint}
              onChange={(e) => setMainComplaint(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="Descreva brevemente o sintoma ou diagnóstico inicial..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md"
            >
              Salvar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
