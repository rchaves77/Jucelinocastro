import React, { useState, useEffect } from 'react';
import { Appointment, Patient, User } from '../../../types';
import { X, UserPlus, UserCheck, Shield, Phone, User as UserIcon, Zap, Clock } from 'lucide-react';

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
  onSave: (data: SaveAppointmentData) => void;
  initialData?: Appointment | null;
  defaultDate?: string;
  patients?: Patient[];
  onOpenNewPatient?: () => void;
  physios?: User[];
  existingAppointments?: Appointment[];
}

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

  // Common Appointment Fields
  const [physioId, setPhysioId] = useState('u2'); // Default Dr. Jucelino Castro
  const [date, setDate] = useState(defaultDate);
  const [timeSlot, setTimeSlot] = useState('09:00');
  const [type, setType] = useState<Appointment['type']>('Sessão');
  const [room, setRoom] = useState('Quiropraxia - Sala 01'); // Default Quiropraxia - Sala 01
  const [price, setPrice] = useState('180');
  const [notes, setNotes] = useState('');
  const [isEncaixe, setIsEncaixe] = useState(false);

  // Formatting helpers for Phone & CPF
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

  useEffect(() => {
    if (!isOpen) return;

    if (initialData && initialData.id) {
      // Editing existing appointment
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
      // Creating new appointment with prefilled slot / encaixe
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
      // Start completely blank for new appointments as requested
      setSelectedPatientId(null);
      setPatientNameInput('');
      setPhone('');
      setCpf('');
      setPhysioId(physios[0]?.id || 'u2');
      setRoom('Quiropraxia - Sala 01');
      setDate(defaultDate);
      setTimeSlot('09:00');
      setType('Sessão');
      setPrice('180');
      setNotes('');
      setIsEncaixe(false);
    }
  }, [isOpen, initialData]); // Intentionally exclude patients/physios to prevent resetting user typing

  if (!isOpen) return null;

  // Filter existing patients based on typed input
  const matchingPatients = patientNameInput.trim()
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(patientNameInput.toLowerCase()) ||
          p.phone.includes(patientNameInput) ||
          (p.cpf && p.cpf.includes(patientNameInput))
      )
    : [];

  const handleSelectPatientSuggestion = (p: Patient) => {
    setSelectedPatientId(p.id);
    setPatientNameInput(p.name);
    setPhone(p.phone ? formatPhone(p.phone) : '');
    setCpf(p.cpf ? formatCPF(p.cpf) : '');
    setShowSuggestions(false);
  };

  const handleNameInputChange = (val: string) => {
    const upperVal = val.toUpperCase();
    setPatientNameInput(upperVal);
    setShowSuggestions(true);

    // If exact name match found in system, auto link patientId
    const exactMatch = patients.find((p) => p.name.toLowerCase() === upperVal.trim().toLowerCase());
    if (exactMatch) {
      setSelectedPatientId(exactMatch.id);
      if (!phone) setPhone(formatPhone(exactMatch.phone));
      if (!cpf) setCpf(formatCPF(exactMatch.cpf || ''));
    } else {
      setSelectedPatientId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientNameInput.trim()) {
      alert('⚠️ Por favor, informe o nome do paciente.');
      return;
    }

    if (!phone.trim()) {
      alert('⚠️ Por favor, informe o celular/WhatsApp do paciente.');
      return;
    }

    // 1. Conflict Validation check: Allow 1 Regular Appointment + 1 Encaixe in the same slot
    const isEditingCurrent = initialData ? initialData.id : null;
    const selectedPhysioObj = physios.find((p) => p.id === physioId);
    let resolvedPhysioName = selectedPhysioObj ? selectedPhysioObj.name : 'Dr. Jucelino Castro';

    let currentIsEncaixe = isEncaixe;

    const slotAppointments = existingAppointments.filter((app) => {
      if (app.id === isEditingCurrent) return false;
      if (app.status === 'canceled' || app.status === 'no_show' || (app.status as string) === 'Cancelado') return false;
      return app.date === date && app.timeSlot === timeSlot;
    });

    const isTargetJucelinoRoom1 =
      (physioId === 'u2' || resolvedPhysioName.includes('Jucelino')) &&
      (room.toLowerCase().includes('quiropraxia') || room.toLowerCase().includes('sala 01'));

    const matchingSlotApps = slotAppointments.filter((app) => {
      const isAppJucelinoRoom1 =
        (app.physioId === 'u2' || app.physioName.includes('Jucelino')) &&
        (app.room.toLowerCase().includes('quiropraxia') || app.room.toLowerCase().includes('sala 01'));

      if (isTargetJucelinoRoom1 && isAppJucelinoRoom1) return true;
      const sameRoom = app.room.toLowerCase().trim() === room.toLowerCase().trim();
      const samePhysio = app.physioId === physioId;
      return sameRoom || samePhysio;
    });

    const normalApp = matchingSlotApps.find((a) => !a.isEncaixe);
    const encaixeApp = matchingSlotApps.find((a) => a.isEncaixe);

    if (currentIsEncaixe) {
      if (encaixeApp) {
        alert(
          `🚨 ENCAIXE JÁ OCUPADO!\n\nJá existe o(a) paciente "${encaixeApp.patientName}" agendado(a) como ENCAIXE no dia ${date} às ${timeSlot}.\n\nCada horário permite apenas 1 agendamento titular e 1 encaixe.`
        );
        return;
      }
    } else {
      if (normalApp) {
        if (!encaixeApp) {
          const wantEncaixe = window.confirm(
            `⚠️ HORÁRIO TITULAR JÁ PREENCHIDO!\n\nJá existe o(a) paciente "${normalApp.patientName}" agendado(a) como titular no dia ${date} às ${timeSlot}.\n\nA vaga de ENCAIXE para este horário está DISPONÍVEL.\n\nDeseja agendar "${patientNameInput.trim()}" como ENCAIXE?\n\n[OK] = Sim, agendar como Encaixe\n[Cancelar] = Não, vou escolher outro horário`
          );
          if (wantEncaixe) {
            currentIsEncaixe = true;
            setIsEncaixe(true);
          } else {
            return;
          }
        } else {
          alert(
            `🚨 HORÁRIO TOTALMENTE LOTADO!\n\nO horário ${date} às ${timeSlot} já possui o Agendamento Titular ("${normalApp.patientName}") e o Encaixe ("${encaixeApp.patientName}") preenchidos.\n\nPor favor, selecione outro horário.`
          );
          return;
        }
      }
    }

    let targetPatientId = selectedPatientId;
    let isNew = !targetPatientId;
    let matchedPatient = patients.find((p) => p.id === targetPatientId);

    // 2. Duplicate Patient Check when creating a new patient
    if (isNew) {
      const inputCpfDigits = cpf.replace(/\D/g, '');
      const inputPhoneDigits = phone.replace(/\D/g, '');
      const inputNameNormalized = patientNameInput.trim().toLowerCase();

      const dupPatient = patients.find((p) => {
        const pCpfDigits = (p.cpf || '').replace(/\D/g, '');
        const pPhoneDigits = (p.phone || '').replace(/\D/g, '');
        const pNameNormalized = (p.name || '').trim().toLowerCase();

        const sameCpf = inputCpfDigits && inputCpfDigits !== '00000000000' && inputCpfDigits === pCpfDigits;
        const samePhone = inputPhoneDigits && inputPhoneDigits.length >= 8 && inputPhoneDigits === pPhoneDigits;
        const sameName = inputNameNormalized && inputNameNormalized === pNameNormalized;

        return sameCpf || samePhone || sameName;
      });

      if (dupPatient) {
        const useExisting = window.confirm(
          `⚠️ ENCONTRADO PRONTUÁRIO EXISTENTE NO SISTEMA!\n\nJá existe um paciente cadastrado com estes dados:\n• Nome: ${dupPatient.name}\n• Celular: ${dupPatient.phone}\n• CPF: ${dupPatient.cpf || 'Não informado'}\n\nDeseja VINCULAR este agendamento ao prontuário existente de "${dupPatient.name}"?\n\n[OK] = Sim, vincular ao prontuário de ${dupPatient.name}\n[Cancelar] = Não, criar um NOVO prontuário`
        );

        if (useExisting) {
          isNew = false;
          targetPatientId = dupPatient.id;
          matchedPatient = dupPatient;
          setSelectedPatientId(dupPatient.id);
          setPatientNameInput(dupPatient.name);
          setPhone(formatPhone(dupPatient.phone));
          if (dupPatient.cpf) setCpf(formatCPF(dupPatient.cpf));
        }
      }
    }

    try {
      if (isNew) {
        onSave({
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
          isEncaixe: currentIsEncaixe,
        });
      } else {
        onSave({
          isNewPatient: false,
          patientId: matchedPatient?.id || targetPatientId,
          patientName: matchedPatient ? matchedPatient.name : patientNameInput,
          patientPhone: phone.trim() || matchedPatient?.phone || '(11) 99999-9999',
          patientPhoto: matchedPatient?.photoUrl,
          physioId,
          physioName: resolvedPhysioName,
          date,
          timeSlot,
          type,
          room,
          price: Number(price) || 180,
          notes,
          status: 'confirmed',
          isEncaixe: currentIsEncaixe,
        });
      }

      alert(
        `✅ AGENDAMENTO CONCLUÍDO COM SUCESSO!\n\nPaciente: ${patientNameInput.trim()}\nModalidade: ${
          currentIsEncaixe ? '⚡ ENCAIXE DE HORÁRIO' : '📅 Agendamento Titular (Normal)'
        }\nStatus: ${
          isNew ? 'Novo Paciente (Prontuário gerado)' : 'Paciente Cadastrado'
        }\nProfissional: ${resolvedPhysioName}\nData: ${date} às ${timeSlot}\nSala: ${room}`
      );

      onClose();
    } catch (err) {
      alert(`🚨 FALHA NO PROCESSAMENTO: Não foi possível salvar o agendamento. Tente novamente.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 shadow-2xl border border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                {initialData ? 'Editar Agendamento' : 'Novo Agendamento & Cadastro Rápido'}
              </h3>
              <p className="text-[11px] text-slate-400">
                O paciente já entra cadastrado no prontuário automaticamente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Unified Patient Field with Autocomplete Search & Quick Auto-Registration */}
          <div className="space-y-3 rounded-2xl bg-slate-950 p-4 border border-slate-800 relative">
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <UserIcon className="h-3.5 w-3.5 text-emerald-400" />
                  Nome do Paciente *
                </span>
                {selectedPatientId ? (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    ✓ Paciente Cadastrado
                  </span>
                ) : patientNameInput.trim() ? (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    ✨ Novo Paciente (Cadastro Automático)
                  </span>
                ) : null}
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={patientNameInput}
                  onChange={(e) => handleNameInputChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="DIGITE O NOME DO PACIENTE..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium uppercase"
                  required
                  autoComplete="off"
                />

                {/* Autocomplete Dropdown List */}
                {showSuggestions && matchingPatients.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-30 max-h-48 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl divide-y divide-slate-800">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/80 sticky top-0 backdrop-blur-sm">
                      Pacientes Cadastrados ({matchingPatients.length})
                    </div>
                    {matchingPatients.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPatientSuggestion(p)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-slate-800/90 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {p.phone} {p.cpf ? `• CPF: ${p.cpf}` : ''}
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          Selecionar
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Phone & CPF Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="min-w-0">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-emerald-400" /> Celular / WhatsApp *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(68) 99206-4951"
                  className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  required
                />
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

          {/* Modalidade da Vaga (Titular vs Encaixe) */}
          <div className="rounded-2xl bg-slate-950 p-3.5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Modalidade de Atendimento
              </label>
              <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setIsEncaixe(false)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    !isEncaixe
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  📅 Titular (Normal)
                </button>
                <button
                  type="button"
                  onClick={() => setIsEncaixe(true)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    isEncaixe
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ⚡ Encaixe
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              {isEncaixe ? (
                <span className="text-amber-400 font-medium">
                  ⚡ <strong>Encaixe Ativo:</strong> Este agendamento será posicionado lado a lado na coluna de Encaixe do Dr. Jucelino Castro no mesmo horário.
                </span>
              ) : (
                <span className="text-slate-400">
                  📅 <strong>Agendamento Titular:</strong> Ocupa a coluna principal de agendamento do horário.
                </span>
              )}
            </p>
          </div>

          {/* Professional & Procedure Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fisioterapeuta / Atendente</label>
              <select
                value={physioId}
                onChange={(e) => setPhysioId(e.target.value)}
                className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {(physios && physios.length > 0
                  ? physios.filter((p) => p.role === 'physio' || p.id !== 'u1')
                  : [
                      { id: 'u2', name: 'Dr. Jucelino Castro' },
                      { id: 'u3', name: 'Dra. Aline Castro' },
                    ]
                ).map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Procedimento</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Appointment['type'])}
                className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium text-emerald-400"
              >
                <option value="Avaliação" className="bg-slate-900 text-slate-200">Avaliação Inicial</option>
                <option value="Sessão" className="bg-slate-900 text-slate-200">Sessão Fisioterapia</option>
                <option value="Quiropraxia" className="bg-slate-900 text-slate-200">Ajuste Quiropráxico</option>
                <option value="Pilates" className="bg-slate-900 text-slate-200">Pilates Clínico</option>
                <option value="RPG" className="bg-slate-900 text-slate-200">RPG / Postural</option>
                <option value="Retorno" className="bg-slate-900 text-slate-200">Retorno</option>
              </select>
            </div>
          </div>

          {/* Date, Time & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Horário</label>
              <input
                type="time"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Valor (R$)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Room */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Sala de Atendimento</label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              <option value="Quiropraxia - Sala 01" className="bg-slate-900 text-slate-200">
                Quiropraxia - Sala 01 (Dr. Jucelino Castro)
              </option>
              <option value="Fisioterapia - Sala 02" className="bg-slate-900 text-slate-200">
                Fisioterapia - Sala 02
              </option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Observações Clínicas / Queixa Inicial
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Ex: Dor lombar aguda há 3 dias, trazer exames..."
            />
          </div>

          {/* Footer Actions */}
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
              <span>Salvar Agendamento & Criar Prontuário</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


