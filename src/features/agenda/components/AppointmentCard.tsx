import React from 'react';
import { Appointment } from '../../../types';
import { DropdownMenu, DropdownItem } from '../../../components/common/DropdownMenu';
import { Clock, MapPin, CheckCircle2, XCircle, AlertCircle, AlertTriangle, Edit, Eye, MessageCircle, Play, UserX, CheckCheck, Award, Star, Zap } from 'lucide-react';
import { formatAppointmentConfirmationMessage, openWhatsApp } from '../../../utils/whatsappMessages';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (app: Appointment) => void;
  onStartAttendance?: (id: string) => void;
  onCancel: (id: string) => void;
  onAbsence?: (id: string) => void;
  onComplete: (id: string) => void;
  onGenerateCertificate?: (app: Appointment) => void;
  onViewPatientRecord?: (patientId: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onStartAttendance,
  onCancel,
  onAbsence,
  onComplete,
  onGenerateCertificate,
  onViewPatientRecord,
}) => {
  const statusConfig = {
    confirmed: {
      label: 'Agendado',
      bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    in_progress: {
      label: 'Em Atendimento',
      bg: 'bg-sky-500/20 text-sky-400 border-sky-500/30 animate-pulse',
      icon: Play,
    },
    completed: {
      label: 'Atendido',
      bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: CheckCheck,
    },
    pending: {
      label: 'Pendente',
      bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: AlertCircle,
    },
    canceled: {
      label: 'Desmarcou',
      bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      icon: XCircle,
    },
    no_show: {
      label: 'Faltou',
      bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: UserX,
    },
  };

  const statusInfo = statusConfig[appointment.status] || statusConfig.confirmed;

  const handleWhatsAppConfirm = () => {
    const text = formatAppointmentConfirmationMessage({
      patientName: appointment.patientName,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      physioName: appointment.physioName,
      room: appointment.room,
      isEncaixe: appointment.isEncaixe,
    });
    openWhatsApp({
      phone: appointment.patientPhone || '5561999998888',
      text,
    });
  };

  const handleWhatsAppCancel = () => {
    const firstName = appointment.patientName ? appointment.patientName.split(' ')[0] : 'Paciente';
    const text = `Olá, ${firstName}! Informamos que seu agendamento na Jucelino Castro Fisioterapia de ${appointment.date} às ${appointment.timeSlot} foi DESMARCADO. Entre em contato para reagendar quando desejar!`;
    openWhatsApp({
      phone: appointment.patientPhone || '5561999998888',
      text,
    });
    onCancel(appointment.id);
  };

  const handleQuickWhatsApp = () => {
    const text = formatAppointmentConfirmationMessage({
      patientName: appointment.patientName,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      physioName: appointment.physioName,
      room: appointment.room,
      isEncaixe: appointment.isEncaixe,
    });
    openWhatsApp({
      phone: appointment.patientPhone || '5561999998888',
      text,
    });
  };

  const handleWhatsAppGoogleReview = () => {
    const firstName = appointment.patientName ? appointment.patientName.split(' ')[0] : 'Paciente';
    const text = `Olá, ${firstName}! Tudo bem? Gostaria de saber como foi sua experiência no tratamento na Jucelino Castro Fisioterapia. Poderia avaliar nosso atendimento no Google? Link: https://maps.app.goo.gl/TmRZvfBndpP6XB3A6`;
    openWhatsApp({
      phone: appointment.patientPhone || '',
      text,
    });
  };

  const dropdownItems: DropdownItem[] = [
    {
      label: 'Marcar Em Atendimento',
      icon: <Play className="h-3.5 w-3.5 text-sky-400" />,
      onClick: () => onStartAttendance && onStartAttendance(appointment.id),
    },
    {
      label: 'Marcar como Atendido',
      icon: <CheckCheck className="h-3.5 w-3.5 text-purple-400" />,
      onClick: () => onComplete(appointment.id),
    },
    {
      label: 'Convidar p/ Avaliação Google (WhatsApp)',
      icon: <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />,
      onClick: handleWhatsAppGoogleReview,
    },
    {
      label: 'Gerar Declaração de Comparecimento',
      icon: <Award className="h-3.5 w-3.5 text-emerald-400" />,
      onClick: () => onGenerateCertificate ? onGenerateCertificate(appointment) : onComplete(appointment.id),
    },
    {
      label: 'Paciente Desmarcou',
      icon: <XCircle className="h-3.5 w-3.5 text-rose-400" />,
      variant: 'danger',
      onClick: () => onCancel(appointment.id),
    },
    {
      label: 'Paciente Faltou (Não compareceu)',
      icon: <UserX className="h-3.5 w-3.5 text-amber-400" />,
      variant: 'danger',
      onClick: () => onAbsence && onAbsence(appointment.id),
    },
    {
      label: 'Enviar Lembrete WA',
      icon: <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />,
      onClick: handleQuickWhatsApp,
    },
    {
      label: 'Ver Prontuário do Paciente',
      icon: <Eye className="h-3.5 w-3.5 text-emerald-400" />,
      onClick: () => onViewPatientRecord && onViewPatientRecord(appointment.patientId),
    },
    {
      label: 'Editar Agendamento',
      icon: <Edit className="h-3.5 w-3.5" />,
      onClick: () => onEdit(appointment),
    },
  ];

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 shadow-sm transition-all ${
        appointment.isEncaixe
          ? 'border-amber-500/50 bg-slate-900/90 shadow-amber-500/5 hover:border-amber-400'
          : 'border-slate-800 bg-slate-900 hover:border-emerald-500/50 hover:shadow-md'
      }`}
    >
      {/* Encaixe Header Banner if applicable */}
      {appointment.isEncaixe && (
        <div className="mb-2 flex items-center justify-between rounded-lg bg-amber-500/15 px-2 py-0.5 border border-amber-500/30">
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-300">
            <Zap className="h-3 w-3 text-amber-400 fill-amber-400" />
            Encaixe de Horário
          </span>
          <span className="text-[9px] font-medium text-amber-400/80">Simultâneo</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {appointment.patientPhoto ? (
            <img
              src={appointment.patientPhoto}
              alt={appointment.patientName}
              className={`h-9 w-9 rounded-full object-cover border shrink-0 ${
                appointment.isEncaixe ? 'border-amber-500/50' : 'border-slate-700'
              }`}
            />
          ) : (
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-xs border ${
                appointment.isEncaixe
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {appointment.patientName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-slate-100 text-xs leading-snug flex items-center gap-1.5 flex-wrap">
              <span className="truncate">{appointment.patientName}</span>
              {appointment.isEncaixe && (
                <span
                  title="Encaixe de Horário (Atendimento Simultâneo)"
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 shadow-sm"
                >
                  <AlertTriangle className="h-3 w-3 text-amber-400 fill-amber-400/20 shrink-0" />
                  <span>Encaixe</span>
                </span>
              )}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span
                className={`flex items-center gap-1 font-semibold font-mono ${
                  appointment.isEncaixe ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                <Clock className="h-3 w-3" />
                {appointment.timeSlot}
              </span>
              <span>•</span>
              <span className="text-slate-300 font-medium truncate">{appointment.type}</span>
            </div>
          </div>
        </div>

        {/* Three dots dropdown menu */}
        <DropdownMenu items={dropdownItems} id={`app-menu-${appointment.id}`} />
      </div>

      {/* Quick Action Buttons for Reception */}
      <div className="mt-2.5 grid grid-cols-3 gap-1 pt-2 border-t border-slate-800/80">
        <button
          onClick={() => onStartAttendance && onStartAttendance(appointment.id)}
          className={`flex items-center justify-center gap-1 rounded-xl border py-1.5 px-1.5 text-[10px] font-bold transition-all cursor-pointer ${
            appointment.status === 'in_progress'
              ? 'bg-sky-500 text-slate-950 border-sky-400 font-extrabold shadow-sm'
              : 'bg-sky-500/10 text-sky-400 border-sky-500/30 hover:bg-sky-500/20'
          }`}
          title="Mudar para Em Atendimento (inicia contagem de 30 minutos)"
        >
          <Play className="h-3 w-3" />
          <span>Atendendo</span>
        </button>

        <button
          onClick={() => onCancel(appointment.id)}
          className="flex items-center justify-center gap-1 rounded-xl bg-rose-500/10 border border-rose-500/30 py-1.5 px-1.5 text-[10px] font-bold text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
          title="Marcar como Desmarcou e Registrar no Prontuário"
        >
          <XCircle className="h-3 w-3" />
          <span>Desmarcou</span>
        </button>

        <button
          onClick={() => onAbsence && onAbsence(appointment.id)}
          className="flex items-center justify-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/30 py-1.5 px-1.5 text-[10px] font-bold text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
          title="Marcar que o Paciente Faltou e Registrar no Prontuário"
        >
          <UserX className="h-3 w-3" />
          <span>Faltou</span>
        </button>
      </div>

      {/* Prominent Certificate Button when appointment is Completed / Atendido */}
      {appointment.status === 'completed' && (
        <button
          onClick={() => onGenerateCertificate ? onGenerateCertificate(appointment) : onComplete(appointment.id)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 py-2 px-2 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all cursor-pointer shadow-sm"
          title="Gerar/Visualizar Declaração de Comparecimento com Logo, QR Code e Validação"
        >
          <Award className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>Emitir Declaração de Comparecimento</span>
        </button>
      )}

      {/* Details Footer */}
      <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400 truncate">
          <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
          <span className="truncate">{appointment.room}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-emerald-400 font-mono">R$ {appointment.price}</span>
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusInfo.bg}`}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
};
