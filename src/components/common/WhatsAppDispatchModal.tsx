import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  MessageSquare,
  Send,
  Monitor,
  Globe,
  Smartphone,
  Check,
  Copy,
  UserCheck,
  Star,
  Calendar,
  FileText,
  ExternalLink,
  Sun,
  Clock,
  Zap,
  Users,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Patient, Appointment } from '../../types';
import { GOOGLE_REVIEW_LINK } from './GoogleReviewModal';
import { formatPhone } from '../../utils/masks';
import {
  WhatsAppMode,
  getSuggestedConfirmationTargetDate,
  cleanPhoneDigits,
  formatAppointmentConfirmationMessage,
  openWhatsApp,
} from '../../utils/whatsappMessages';

interface WhatsAppDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients?: Patient[];
  appointments?: Appointment[];
  initialPatient?: Patient | null;
  initialPhone?: string;
  initialMessage?: string;
  initialTargetDate?: string;
}

export const WhatsAppDispatchModal: React.FC<WhatsAppDispatchModalProps> = ({
  isOpen,
  onClose,
  patients = [],
  appointments = [],
  initialPatient = null,
  initialPhone = '',
  initialMessage = '',
  initialTargetDate,
}) => {
  // Suggested target date for next-day / Monday confirmations
  const suggestedInfo = useMemo(() => getSuggestedConfirmationTargetDate(), []);

  const [activeTab, setActiveTab] = useState<'proximo_dia' | 'manual'>('proximo_dia');
  const [targetConfirmDate, setTargetConfirmDate] = useState<string>(
    initialTargetDate || suggestedInfo.targetDateStr
  );

  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatient?.id || '');
  const [customPhone, setCustomPhone] = useState<string>(
    formatPhone(initialPhone || initialPatient?.phone || '')
  );
  const [customName, setCustomName] = useState<string>(initialPatient?.name || '');

  // Preferred dispatch mode saved in localStorage
  const [sendMode, setSendMode] = useState<WhatsAppMode>(() => {
    return (localStorage.getItem('jc_wa_send_mode') as WhatsAppMode) || 'windows';
  });

  const [messageTemplate, setMessageTemplate] = useState<
    'lembrete' | 'sabado_segunda' | 'google_review' | 'exercicios' | 'custom'
  >(suggestInfoIsMonday(suggestedInfo.isMonday || suggestedInfo.isSaturday));

  const [messageText, setMessageText] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>(
    suggestedInfo.isMonday || suggestedInfo.isSaturday
      ? `Segunda-feira (${suggestedInfo.formattedTargetDate}) a partir das 07:30`
      : `Amanhã, ${suggestedInfo.dayLabel} (${suggestedInfo.formattedTargetDate})`
  );
  const [copied, setCopied] = useState(false);
  const [dispatchedIds, setDispatchedIds] = useState<Set<string>>(new Set());

  function suggestInfoIsMonday(isMonOrSat: boolean) {
    return isMonOrSat ? 'sabado_segunda' : 'lembrete';
  }

  // Filter appointments for the target date
  const targetAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.date === targetConfirmDate && a.status !== 'canceled')
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
  }, [appointments, targetConfirmDate]);

  // Sync when initialPatient changes
  useEffect(() => {
    if (initialPatient) {
      setSelectedPatientId(initialPatient.id);
      setCustomPhone(formatPhone(initialPatient.phone));
      setCustomName(initialPatient.name);
      setActiveTab('manual');
    } else if (initialPhone) {
      setCustomPhone(formatPhone(initialPhone));
      setActiveTab('manual');
    }
  }, [initialPatient, initialPhone]);

  // Update send mode preference
  const handleModeChange = (mode: WhatsAppMode) => {
    setSendMode(mode);
    localStorage.setItem('jc_wa_send_mode', mode);
  };

  // Handle patient selection change
  const handlePatientSelect = (pId: string) => {
    setSelectedPatientId(pId);
    if (!pId) return;
    const found = patients.find((p) => p.id === pId);
    if (found) {
      setCustomPhone(formatPhone(found.phone));
      setCustomName(found.name);
    }
  };

  // Auto-generate message text based on template and name
  useEffect(() => {
    if (initialMessage && messageTemplate === 'custom') {
      return;
    }

    const nameToUse = customName ? customName.split(' ')[0] : 'Paciente';

    if (messageTemplate === 'sabado_segunda') {
      setMessageText(
        `Olá, ${nameToUse}! ☀️\n\n` +
          `Passando para *confirmar a sua consulta* na *Jucelino Castro Fisioterapia* para *Segunda-feira (${suggestedInfo.formattedTargetDate})* com Dr. Jucelino Castro (Sala 01).\n` +
          `⏰ *Lembrete importante:* Nossos atendimentos na segunda-feira iniciam pontualmente às 07:30.\n\n` +
          `Podemos confirmar a sua presença? Por favor, responda com *SIM* para garantirmos seu horário ou nos avise com antecedência caso precise remarcar. Obrigado!`
      );
    } else if (messageTemplate === 'lembrete') {
      setMessageText(
        `Olá, ${nameToUse}! 🩺\n\n` +
          `Passando para *confirmar o seu atendimento* na *Jucelino Castro Fisioterapia* agendado para *${appointmentDate}* com Dr. Jucelino Castro (Sala 01).\n\n` +
          `Podemos confirmar sua presença? Por favor, responda com *SIM* para garantirmos o seu horário ou nos avise se precisar reagendar. Obrigado!`
      );
    } else if (messageTemplate === 'google_review') {
      setMessageText(
        `Olá, ${nameToUse}! Tudo bem? Gostaria de saber como foi seu atendimento e tratamento na Jucelino Castro Fisioterapia.\n\nPoderia avaliar nosso atendimento no Google?\nLink: ${GOOGLE_REVIEW_LINK}`
      );
    } else if (messageTemplate === 'exercicios') {
      setMessageText(
        `Olá, ${nameToUse}! 🏃‍♂️ Lembrete do seu fisioterapeuta: lembre-se de realizar a sua série de exercícios prescritos hoje para acelerar sua recuperação.\n\nQualquer dúvida na postura ou repetições, nos chame aqui!`
      );
    } else if (messageTemplate === 'custom' && !messageText) {
      setMessageText(`Olá, ${nameToUse}! `);
    }
  }, [messageTemplate, customName, appointmentDate, suggestedInfo]);

  if (!isOpen) return null;

  const formattedPhoneDigits = cleanPhoneDigits(customPhone);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenManualWhatsApp = () => {
    if (!formattedPhoneDigits) {
      alert('Por favor, informe ou selecione um telefone válido com DDD.');
      return;
    }
    openWhatsApp({
      phone: formattedPhoneDigits,
      text: messageText,
      mode: sendMode,
    });
  };

  const handleDispatchSingleAppointment = (app: Appointment) => {
    const text = formatAppointmentConfirmationMessage({
      patientName: app.patientName,
      date: app.date,
      timeSlot: app.timeSlot,
      physioName: app.physioName,
      room: app.room,
      isEncaixe: app.isEncaixe,
    });

    openWhatsApp({
      phone: app.patientPhone || '5561999998888',
      text,
      mode: sendMode,
    });

    setDispatchedIds((prev) => new Set(prev).add(app.id));
  };

  // Format date display for target date header
  const targetDateObj = new Date(targetConfirmDate + 'T12:00:00');
  const targetDayOfWeek = targetDateObj.getDay();
  const isTargetMonday = targetDayOfWeek === 1;
  const targetFormatted = targetDateObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 text-slate-100 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <MessageSquare className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Confirmações WhatsApp
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  D-1 & Sábado ➡️ Segunda
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Dispare confirmações automáticas de um dia para o outro para evitar faltas e esquecimentos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dispatch Mode Selector (Windows App vs Web vs Universal) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Canal de Disparo WhatsApp</span>
            <span className="text-[11px] text-slate-400 font-normal">Sua preferência fica salva</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleModeChange('windows')}
              className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                sendMode === 'windows'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Monitor className="h-5 w-5 text-emerald-400" />
              <span>App do Windows</span>
              <span className="text-[9px] font-normal text-slate-400">Desktop Nativo</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('web')}
              className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                sendMode === 'web'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Globe className="h-5 w-5 text-cyan-400" />
              <span>WhatsApp Web</span>
              <span className="text-[9px] font-normal text-slate-400">No Navegador</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('universal')}
              className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                sendMode === 'universal'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Smartphone className="h-5 w-5 text-amber-400" />
              <span>Universal (wa.me)</span>
              <span className="text-[9px] font-normal text-slate-400">Direto / Mobile</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Disparo Rápido do Próximo Dia / Segunda vs Manual */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('proximo_dia')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'proximo_dia'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Pacientes do Próximo Dia ({targetAppointments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Mensagem Personalizada</span>
          </button>
        </div>

        {/* TAB 1: LIST OF SCHEDULED APPOINTMENTS FOR TARGET DATE */}
        {activeTab === 'proximo_dia' && (
          <div className="space-y-4">
            {/* Target Date Controller & Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200 capitalize">
                    {targetFormatted}
                  </span>
                  {isTargetMonday && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sun className="h-3 w-3" />
                      Início pontual às 07:30
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Confirmando com 1 dia de antecedência para preencher e garantir vagas da agenda.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[11px] text-slate-400 font-medium">Data Alvo:</label>
                <input
                  type="date"
                  value={targetConfirmDate}
                  onChange={(e) => setTargetConfirmDate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Patients List for Target Date */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {targetAppointments.length > 0 ? (
                targetAppointments.map((app) => {
                  const isSent = dispatchedIds.has(app.id);
                  return (
                    <div
                      key={app.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-800/70 border border-slate-700/70 hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex flex-col items-center justify-center font-mono font-bold text-xs bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-emerald-400 shrink-0">
                          <Clock className="h-3 w-3 text-slate-500 mb-0.5" />
                          {app.timeSlot}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-100 truncate flex items-center gap-1.5">
                            <span>{app.patientName}</span>
                            {app.isEncaixe && (
                              <span className="text-[9px] font-black uppercase text-amber-400 bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shrink-0">
                                <Zap className="h-2.5 w-2.5 fill-amber-400" />
                                Encaixe
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">
                            {formatPhone(app.patientPhone || 'Telefone não cadastrado')} • {app.physioName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSent && (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-xl border border-emerald-500/20 flex items-center gap-1 hidden sm:flex">
                            <CheckCircle2 className="h-3 w-3" />
                            Enviado
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDispatchSingleAppointment(app)}
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow cursor-pointer"
                          title="Disparar mensagem formatada de confirmação no WhatsApp"
                        >
                          <Send className="h-3.5 w-3.5 fill-slate-950" />
                          <span>{isSent ? 'Reenviar' : 'Confirmar'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 text-slate-500 text-xs space-y-2">
                  <Users className="h-8 w-8 mx-auto text-slate-600" />
                  <p>Nenhum paciente agendado para a data selecionada ({targetFormatted}).</p>
                  <p className="text-[11px] text-slate-600">
                    Altere a data acima para visualizar outros dias ou use a aba &quot;Mensagem Personalizada&quot;.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MANUAL / CUSTOM TEMPLATE DISPATCH */}
        {activeTab === 'manual' && (
          <div className="space-y-4">
            {/* Patient Selection & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Selecionar Paciente Cadastrado
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">-- Inserir Número Manualmente --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatPhone(p.phone)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Telefone com DDD (WhatsApp)
                </label>
                <input
                  type="text"
                  placeholder="(61) 9 9999-8888"
                  value={customPhone}
                  onChange={(e) => {
                    setCustomPhone(formatPhone(e.target.value));
                    if (selectedPatientId) setSelectedPatientId('');
                  }}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800 p-2.5 text-xs font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Name Customization (if typing manually) */}
            {!selectedPatientId && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome do Destinatário (para personalizar a mensagem)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Maria Santos"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800 p-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            )}

            {/* Template Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Modelo de Mensagem Pronta
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => setMessageTemplate('lembrete')}
                  className={`p-2 rounded-xl border text-xs font-medium text-left flex items-center gap-1.5 transition-colors cursor-pointer ${
                    messageTemplate === 'lembrete'
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-teal-400" />
                  <span className="truncate">Véspera (D-1)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMessageTemplate('sabado_segunda');
                    setAppointmentDate(`Segunda-feira (${suggestedInfo.formattedTargetDate}) a partir das 07:30`);
                  }}
                  className={`p-2 rounded-xl border text-xs font-medium text-left flex items-center gap-1.5 transition-colors cursor-pointer ${
                    messageTemplate === 'sabado_segunda'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold ring-1 ring-amber-500'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Confirmar consultas de Segunda-feira (início às 07:30)"
                >
                  <Sun className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span className="truncate">Sábado ➡️ Segunda (07:30)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMessageTemplate('google_review')}
                  className={`p-2 rounded-xl border text-xs font-medium text-left flex items-center gap-1.5 transition-colors cursor-pointer ${
                    messageTemplate === 'google_review'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Star className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span className="truncate">Avaliação Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMessageTemplate('exercicios')}
                  className={`p-2 rounded-xl border text-xs font-medium text-left flex items-center gap-1.5 transition-colors cursor-pointer ${
                    messageTemplate === 'exercicios'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span className="truncate">Exercícios Casa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMessageTemplate('custom')}
                  className={`p-2 rounded-xl border text-xs font-medium text-left flex items-center gap-1.5 transition-colors cursor-pointer ${
                    messageTemplate === 'custom'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-purple-400" />
                  <span className="truncate">Mensagem Livre</span>
                </button>
              </div>
            </div>

            {/* Date input helper if template is 'lembrete' */}
            {messageTemplate === 'lembrete' && (
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-800 space-y-1">
                <label className="block text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-emerald-400" />
                  <span>Data/Horário do Atendimento:</span>
                </label>
                <input
                  type="text"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  placeholder="Ex: Amanhã às 08:30"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            )}

            {/* Textarea Preview & Editing */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Conteúdo da Mensagem
                </label>
                <button
                  onClick={handleCopyMessage}
                  className="flex items-center gap-1 text-[11px] text-emerald-400 hover:underline cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Texto copiado!' : 'Copiar texto'}</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none leading-relaxed font-sans"
              />
            </div>

            {/* Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>
                  Destino: <strong className="text-slate-200 font-mono">{formattedPhoneDigits || 'Nenhum informado'}</strong>
                </span>
              </div>

              <button
                onClick={handleOpenManualWhatsApp}
                disabled={!formattedPhoneDigits}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="h-4 w-4 fill-slate-950" />
                <span>
                  {sendMode === 'windows'
                    ? 'Abrir no App do Windows'
                    : sendMode === 'web'
                    ? 'Abrir no WhatsApp Web'
                    : 'Abrir via WhatsApp Universal'}
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
