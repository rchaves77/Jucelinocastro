import React from 'react';
import { Patient, Appointment } from '../../types';
import { Calendar, Clock, FileText, Activity, User } from 'lucide-react';

interface PatientPortalProps {
  patients?: Patient[];
  appointments?: Appointment[];
  onZoomImage: (title: string, url: string, category?: string, date?: string, notes?: string) => void;
  onGoToBooking: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  patients = [],
  appointments = [],
  onZoomImage,
  onGoToBooking,
}) => {
  const patient = patients[0];
  const myAppointments = patient ? appointments.filter((a) => a.patientId === patient.id) : [];

  if (!patient) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="rounded-3xl bg-slate-900 p-8 text-center border border-slate-800 shadow-xl space-y-4">
          <User className="h-12 w-12 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-100">Portal do Paciente</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Ainda não há cadastro de paciente ativo no portal. Agende sua primeira consulta para acessar seu plano de tratamento.
          </p>
          <button
            onClick={onGoToBooking}
            className="rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg"
          >
            Agendar Primeira Consulta Online
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-slate-900 p-6 sm:p-8 text-slate-100 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={patient.photoUrl}
              alt={patient.name}
              className="h-16 w-16 rounded-full object-cover border-2 border-emerald-500 shadow-md"
            />
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 mb-1">
                Portal do Paciente
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-100">Olá, {patient.name.split(' ')[0]}!</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Acompanhe o seu plano de reabilitação e próximas consultas.
              </p>
            </div>
          </div>
          <button
            onClick={onGoToBooking}
            className="rounded-2xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg"
          >
            Agendar Nova Consulta
          </button>
        </div>
      </div>

      {/* Google Review Banner for Patients */}
      <div className="rounded-2xl bg-slate-900 border border-amber-500/30 p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <span className="text-xl font-black">★</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Como foi seu atendimento na Jucelino Castro Fisioterapia?</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Deixe sua avaliação de 5 estrelas no Google! Sua opinião é fundamental para nossa clínica.
            </p>
          </div>
        </div>
        <a
          href="https://maps.app.goo.gl/TmRZvfBndpP6XB3A6"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-md flex items-center gap-1.5 shrink-0"
        >
          <span>Avaliar no Google</span>
          <span className="text-sm">→</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Appointment Card */}
        <div className="md:col-span-2 rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-400" /> Próximas Consultas
            </h3>
            <span className="text-xs text-slate-400">{myAppointments.length} agendamento(s)</span>
          </div>

          {myAppointments.length > 0 ? (
            <div className="space-y-3">
              {myAppointments.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/60 p-4"
                >
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                      {app.type}
                    </span>
                    <div className="font-bold text-slate-200 text-sm mt-1">{app.physioName}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-emerald-400" /> {app.date} às {app.timeSlot}
                      </span>
                      <span>•</span>
                      <span>{app.room}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    Confirmado
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center space-y-2 border border-dashed border-slate-800 rounded-2xl">
              <p className="text-xs text-slate-400">Você não possui consultas agendadas no momento.</p>
            </div>
          )}
        </div>

        {/* Treatment Summary */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <Activity className="h-4 w-4 text-emerald-400" /> Meu Tratamento
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <p className="font-semibold text-slate-200">Fisioterapeuta:</p>
            <p className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">{patient.assignedPhysioName || 'Dr. Jean Chaves'}</p>
            <p className="font-semibold text-slate-200 mt-3">Plano de Cuidados:</p>
            <p className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 leading-relaxed">
              {patient.anamnesis?.treatmentPlan || 'Plano de tratamento pendente de avaliação clínica.'}
            </p>
          </div>
        </div>
      </div>

      {/* Patient Exams Gallery */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-400" /> Meus Exames Anexados
        </h3>
        {patient.exams && patient.exams.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {patient.exams.map((exam) => (
              <div
                key={exam.id}
                onClick={() => onZoomImage(exam.title, exam.fullUrl, exam.category, exam.date, exam.notes)}
                className="rounded-xl border border-slate-800 bg-slate-800/60 p-3 cursor-pointer hover:border-emerald-500 transition-all text-center space-y-2"
              >
                <img
                  src={exam.thumbnailUrl}
                  alt={exam.title}
                  className="h-24 w-full object-cover rounded-lg border border-slate-700"
                />
                <span className="text-xs font-bold text-slate-200 block truncate">{exam.title}</span>
                <span className="text-[10px] text-emerald-400 font-semibold block">{exam.category}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-400">Nenhum exame anexo para este paciente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

