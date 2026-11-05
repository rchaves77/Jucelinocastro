import React, { useState, useEffect, useMemo } from 'react';
import { Appointment, Patient, User } from '../../../types';
import {
  X,
  UserPlus,
  UserCheck,
  Shield,
  Phone,
  User as UserIcon,
  Zap,
  AlertTriangle,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { getSlotConfig } from '../../../config/contact';

interface SaveAppointmentData extends Partial<Appointment> {
  isNewPatient?: boolean;
  newPatientData?: {
    name: string;
    phone: string;
    cpf: string;
    procedureType: string;
  };
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SaveAppointmentData) => boolean | void;
  initialData?: Appointment | null;
  defaultDate?: string;
  patients?: Patient[];
  onOpenNewPatient?: () => void;
  physios?: User[];
  existingAppointments?: Appointment[];
}

type FieldErrors = {
  patientName?: string;
  phone?: string;
  slot?: string;
  date?: string;
};

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultDate = new Date().toISOString().split('T')[0],
  patients = [],
  physios = [],
  existingAppointments = [],
}) => {
  const [patientNameInput, setPatientNameInput] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [physioId, setPhysioId] = useState('u2');
  const [date, setDate] = useState(defaultDate);
  const [timeSlot, setTimeSlot] = useState('09:00');
  const [type, setType] = useState<Appointment['type']>('Sessão');
  const [room, setRoom] = useState('Quiropraxia - Sala 01');
  const [price, setPrice] = useState('180');
  const [notes, setNotes] = useState('');
  const [isEncaixe, setIsEncaixe] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const slotConfig = getSlotConfig(date);
  const dayOfWeek = new Date(`${date}T00:00:00`).getDay();
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0;

  const allSlots = useMemo(
    () => [...slotConfig.morning, ...slotConfig.afternoon],
    [slotConfig.morning, slotConfig.afternoon]
  );

  // Ocupação do horário selecionado (ignora o próprio agendamento em edição)
  const slotOccupancy = useMemo(() => {
    const editingId = initialData?.id || null;
    const active = (existingAppointments || []).filter((app) => {
      if (app.id === editingId) return false;
      if (app.status === 'canceled' || app.status === 'no_show') return false;
      return app.date === date && app.timeSlot === timeSlot;
    });

    return {
      titular: active.find((a) => !a.isEncaixe) || null,
      encaixe: active.find((a) => a.isEncaixe) || null,
    };
  }, [existingAppointments, date, timeSlot, initialData]);

  const titularOcupado = Boolean(slotOccupancy.titular);
  const encaixeOcupado = Boolean(slotOccupancy.encaixe);
  const slotLotado = titularOcupado && encaixeOcupado;
  const titularBloqueado = isSaturday && slotConfig.afternoon.includes(timeSlot);

  useEffect(() => {
    if (!isOpen) return;

    setErrors({});
    setSuggestion(null);

    if (initialData && initialData.id) {
      setSelectedPatientId(initialData.patientId);
      setPatientNameInput(initialData.patientName);
      setPhone(initialData.patientPhone ? formatPhone(initialData.patientPhone) : '');
      const existingP = patients.find((p) => p.id === initialData.patientId);
      setCpf(existingP?.cpf ? formatCPF(existingP.cpf) : '');
      setPhysioId(initialData.physioId || 'u2');
      setDate(initialData.date || defaultDate);
      setTimeSlot(initialData.timeSlot || '09:00');
      setType(initialData.type || 'Sessão');
      setRoom(initialData.room || 'Quiropraxia - Sala 01');
      setPrice(initialData.price ? initialData.price.toString() : '180');
      setNotes(initialData.notes || '');
      setIsEncaixe(Boolean(initialData.isEncaixe));
    } else if (initialData && !initialData.id) {
      setSelectedPatientId(null);
      setPatientNameInput('');
      setPhone('');
      setCpf('');
      setPhysioId(initialData.physioId || 'u2');
      setRoom(initialData.room || 'Quiropraxia - Sala 01');
      setDate(initialData.date || defaultDate);
      setTimeSlot(initialData.timeSlot || '09:00');
      setType(initialData.type || 'Sessão');
      setPrice(initialData.price ? initialData.price.toString() : '180');
      setNotes(initialData.notes || '');
      setIsEncaixe(Boolean(initialData.isEncaixe));
    } else {
      setSelectedPatientId(null);
      setPatientNameInput('');
      setPhone('');
      setCpf('');
      setPhysioId('u2');
      setRoom('Quiropraxia - Sala 01');
      setDate(defaultDate);
      setTimeSlot(slotConfig.morning[0] || '07:30');
      setType('Sessão');
      setPrice('180');
      setNotes('');
      setIsEncaixe(false);
    }
  }, [isOpen, initialData, defaultDate]);

  const handleNameInputChange = (value: string) => {
    setPatientNameInput(value);
    setShowSuggestions(true);
    setErrors((prev) => ({ ...prev, patientName: undefined }));

    const match = (patients || []).find(
      (p) => p.name?.toLowerCase() === value.toLowerCase().trim()
    );
    if (match) {
      setSelectedPatientId(match.id);
      if (match.phone) setPhone(formatPhone(match.phone));
      if (match.cpf) setCpf(formatCPF(match.cpf));
    } else {
      setSelectedPatientId(null);
    }
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setErrors((prev) => ({ ...prev, date: undefined, slot: undefined }));

    const cfg = getSlotConfig(newDate);
    const slots = [...cfg.morning, ...cfg.afternoon];
    if (!slots.includes(timeSlot)) {
      setTimeSlot(cfg.morning[0] || '07:30');
    }
  };

  const handleSlotChange = (newSlot: string) => {
    setTimeSlot(newSlot);
    setErrors((prev) => ({ ...prev, slot: undefined }));

    const isAfternoonSlot = slotConfig.afternoon.includes(newSlot);
    if (isSaturday && isAfternoonSlot) {
      setIsEncaixe(true);
    }
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};

    if (!patientNameInput.trim()) {
      next.patientName = 'Informe o nome do paciente.';
    }

    if (!phone.trim()) {
      next.phone = 'Informe o celular ou WhatsApp do paciente.';
    } else if (phone.replace(/\D/g, '').length < 10) {
      next.phone = 'Telefone incompleto. Use DDD + número.';
    }

    if (isSunday) {
      next.date = 'A clínica não abre aos domingos. Escolha outra data.';
    }

    if (!allSlots.includes(timeSlot)) {
      next.slot = 'Este horário não está disponível nesta data.';
    }

    if (titularBloqueado && !isEncaixe) {
      next.slot = 'Sábado à tarde aceita apenas encaixe. Marque como Encaixe para continuar.';
    }

    if (isEncaixe && encaixeOcupado) {
      next.slot = `O encaixe das ${timeSlot} já está com ${slotOccupancy.encaixe?.patientName}.`;
    }

    if (!isEncaixe && titularOcupado) {
      next.slot = `O horário ${timeSlot} já tem titular (${slotOccupancy.titular?.patientName}). A vaga de encaixe está livre.`;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const selectedPhysioObj = physios.find((p) => p.id === physioId);
    const resolvedPhysioName = selectedPhysioObj ? selectedPhysioObj.name : 'Dr. Jucelino Castro';
    const matchedPatient = (patients || []).find((p) => p.id === selectedPatientId);
    const isNew = !matchedPatient;

    const payload: SaveAppointmentData = isNew
      ? {
          isNewPatient: true,
          newPatientData: {
            name: patientNameInput.trim(),
            phone: phone.trim(),
            cpf: cpf.trim() || '000.000.000-00',
            procedureType: type,
          },
          physioId,
          physioName: resolvedPhysioName,
          date,
          timeSlot,
          type,
          room,
          price: Number(price) || 180,
          notes,
          status: 'confirmed',
          isEncaixe,
        }
      : {
          isNewPatient: false,
          patientId: matchedPatient.id,
          patientName: matchedPatient.name,
          patientPhone: phone.trim() || matchedPatient.phone,
          patientPhoto: matchedPatient.photoUrl,
          physioId,
          physioName: resolvedPhysioName,
          date,
          timeSlot,
          type,
          room,
          price: Number(price) || 180,
          notes,
          status: 'confirmed',
          isEncaixe,
        };

    const result = onSave(payload);

    // Se o handler retornar false, o salvamento foi rejeitado — mantém o modal aberto
    if (result === false) {
      setErrors({ slot: 'Não foi possível salvar. Verifique o horário e tente novamente.' });
      return;
    }

    onClose();
  };

  if (!isOpen) return null;

  const suggestions = (patients || [])
    .filter((p) => p.name?.toLowerCase().includes(patientNameInput.toLowerCase().trim()))
    .slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-emerald-400" />
            <h2 className="text-sm font-black text-slate-100 uppercase tracking-wide">
              {initialData?.id ? 'Editar Agendamento' : 'Novo Agendamento'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Paciente */}
          <div className="space-y-3 rounded-2xl bg-slate-950 p-4 border border-slate-800 relative">
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <UserIcon className="h-3.5 w-3.5 text-emerald-400" />
                  Nome do Paciente *
                </span>
                {selectedPatientId ? (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Paciente Cadastrado
                  </span>
                ) : patientNameInput.trim() ? (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    Novo Paciente
                  </span>
                ) : null}
              </label>

              <input
                type="text"
                value={patientNameInput}
                onChange={(e) => handleNameInputChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="DIGITE O NOME DO PACIENTE"
                className={`w-full rounded-xl border bg-slate-900 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 font-medium uppercase ${
                  errors.patientName
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
                }`}
                autoComplete="off"
              />

              {errors.patientName && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.patientName}
                </p>
              )}

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 shadow-xl max-h-44 overflow-y-auto">
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPatientNameInput(p.name);
                        setSelectedPatientId(p.id);
                        if (p.phone) setPhone(formatPhone(p.phone));
                        if (p.cpf) setCpf(formatCPF(p.cpf));
                        setShowSuggestions(false);
                        setErrors((prev) => ({ ...prev, patientName: undefined }));
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 transition-colors"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="min-w-0">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-emerald-400" /> Celular / WhatsApp *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    setPhone(formatPhone(e.target.value));
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="(68) 99206-4951"
                  className={`w-full min-w-0 rounded-xl border bg-slate-900 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 font-mono ${
                    errors.phone
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                      : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                    <AlertTriangle className="h-3 w-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="min-w-0">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Shield className="h-3 w-3 text-emerald-400" /> CPF do Paciente
                </label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className={`w-full min-w-0 rounded-xl border bg-slate-800 p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 ${
                  errors.date
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
                }`}
              />
              {errors.date && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.date}
                </p>
              )}
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Horário</label>
              <select
                value={timeSlot}
                onChange={(e) => handleSlotChange(e.target.value)}
                className={`w-full min-w-0 rounded-xl border bg-slate-800 p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 font-mono ${
                  errors.slot
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
                    : 'border-slate-700 focus:border-emerald-500 focus:ring-emerald-500'
                }`}
              >
                {slotConfig.morning.length > 0 && (
                  <optgroup label="Manhã (07:30 – 11:00)">
                    {slotConfig.morning.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </optgroup>
                )}
                {slotConfig.afternoon.length > 0 && (
                  <optgroup label={isSaturday ? 'Tarde (apenas encaixe)' : 'Tarde (13:30 – 17:30)'}>
                    {slotConfig.afternoon.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          </div>

          {/* Status do horário */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Ocupação das {timeSlot}
              </span>
              {slotLotado && (
                <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                  LOTADO
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                className={`rounded-xl border px-3 py-2 text-[11px] font-semibold ${
                  titularOcupado
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                <span className="block text-[9px] uppercase tracking-wider opacity-70">Titular</span>
                {titularOcupado ? slotOccupancy.titular?.patientName : 'Livre'}
              </div>

              <div
                className={`rounded-xl border px-3 py-2 text-[11px] font-semibold ${
                  encaixeOcupado
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}
              >
                <span className="block text-[9px] uppercase tracking-wider opacity-70">Encaixe</span>
                {encaixeOcupado ? slotOccupancy.encaixe?.patientName : 'Livre'}
              </div>
            </div>

            {titularBloqueado && (
              <p className="flex items-start gap-1.5 text-[11px] font-semibold text-amber-400">
                <Lock className="h-3 w-3 mt-0.5 shrink-0" />
                Sábado à tarde aceita apenas encaixe.
              </p>
            )}

            {errors.slot && (
              <p className="flex items-start gap-1.5 text-[11px] font-semibold text-rose-400">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                {errors.slot}
              </p>
            )}
          </div>

          {/* Tipo: Titular ou Encaixe */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 space-y-2">
            <label className="block text-[11px] font-semibold text-slate-300">
              Tipo de Agendamento
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEncaixe(false);
                  setErrors((prev) => ({ ...prev, slot: undefined }));
                }}
                disabled={titularOcupado || titularBloqueado}
                className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  !isEncaixe
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                } ${titularOcupado || titularBloqueado ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                Titular
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEncaixe(true);
                  setErrors((prev) => ({ ...prev, slot: undefined }));
                }}
                disabled={encaixeOcupado}
                className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  isEncaixe
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                } ${encaixeOcupado ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                Encaixe
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isEncaixe
                ? 'Encaixe: aparece na coluna secundária do mesmo horário.'
                : 'Titular: ocupa a coluna principal do horário.'}
            </p>
          </div>

          {/* Profissional, Procedimento, Sala, Valor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Profissional</label>
              <select
                value={physioId}
                onChange={(e) => setPhysioId(e.target.value)}
                className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="u2">Dr. Jucelino Castro</option>
                {physios
                  .filter((p) => p.id !== 'u2')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tipo de Procedimento
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Appointment['type'])}
                className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-emerald-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="Sessão">Sessão</option>
                <option value="Avaliação">Avaliação</option>
                <option value="Retorno">Retorno</option>
                <option value="Pilates">Pilates</option>
                <option value="RPG">RPG</option>
              </select>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sala</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
              >
                <option value="Quiropraxia - Sala 01">Quiropraxia - Sala 01</option>
                <option value="Osteopatia - Sala 02">Osteopatia - Sala 02</option>
                <option value="Pilates - Sala 03">Pilates - Sala 03</option>
                <option value="RPG - Sala 04">RPG - Sala 04</option>
              </select>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Valor (R$)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="10"
                className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Informações adicionais sobre o agendamento"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserCheck className="h-4 w-4" />
              <span>Salvar Agendamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
