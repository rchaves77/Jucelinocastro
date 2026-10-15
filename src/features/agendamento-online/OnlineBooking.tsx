import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle2, ShieldCheck, Stethoscope, Star, ExternalLink, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import { GOOGLE_REVIEW_LINK } from '../../components/common/GoogleReviewModal';

interface OnlineBookingProps {
  onBookingSuccess?: () => void;
}

export const OnlineBooking: React.FC<OnlineBookingProps> = ({ onBookingSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState('Avaliação Ortopédica');
  const [selectedPhysio, setSelectedPhysio] = useState('Dr. Jucelino Castro');
  const [selectedDate, setSelectedDate] = useState('2026-08-03');
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const procedures = [
    { title: 'Avaliação Ortopédica', time: '50 min', price: 'R$ 250', desc: 'Avaliação física completa e elaboração de conduta.' },
    { title: 'Pilates Clínico', time: '50 min', price: 'R$ 160', desc: 'Exercícios focados em postura e core.' },
    { title: 'RPG / Reeducação Postural', time: '60 min', price: 'R$ 200', desc: 'Posturas globais para alinhamento da coluna.' },
  ];

  // Horários de 30 em 30 minutos conforme imagem enviada pelo usuário
  // Seg a Sex: 07:30 - 11:30 | 13:30 - 18:00
  // Sábado: 07:30 - 11:00
  const morningTimes = ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'];
  const afternoonTimes = ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

  const dateObj = new Date(selectedDate + 'T00:00:00');
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday

  let availableMorning = morningTimes;
  let availableAfternoon = afternoonTimes;

  if (dayOfWeek === 6) { // Sábado
    availableMorning = ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'];
    availableAfternoon = [];
  }

  const handleCopyReviewLink = () => {
    navigator.clipboard.writeText(GOOGLE_REVIEW_LINK);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFinished(true);
    if (onBookingSuccess) onBookingSuccess();
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto space-y-4 my-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Agendamento Solicitado com Sucesso!</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Recebemos sua solicitação de <strong>{selectedType}</strong> com <strong>{selectedPhysio}</strong> para o dia{' '}
            <strong>{selectedDate} às {selectedTime}</strong>.
          </p>
          <div className="rounded-2xl bg-teal-50 p-4 border border-teal-200 text-left text-xs space-y-1 text-teal-900">
            <p><strong>Paciente:</strong> {patientName}</p>
            <p><strong>Telefone:</strong> {patientPhone}</p>
            <p className="text-[11px] text-teal-700 mt-2">
              Nossa recepção enviará uma mensagem de confirmação no seu WhatsApp em instantes!
            </p>
          </div>

          {/* Google Review Call-to-action */}
          <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-left space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>Já é nosso paciente? Avalie a Jucelino Castro Fisioterapia no Google!</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Sua avaliação de 5 estrelas ajuda outros pacientes a encontrarem tratamento de excelência.
            </p>
            <a
              href={GOOGLE_REVIEW_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
            >
              <Star className="h-4 w-4 fill-slate-950" />
              <span>Deixar Avaliação no Google</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <button
            onClick={() => {
              setIsFinished(false);
              setStep(1);
            }}
            className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-700"
          >
            Fazer Outro Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Google Review Banner Top */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-emerald-500/10 border border-amber-500/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold shrink-0">
            <Star className="h-5 w-5 fill-slate-950" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              Link de Avaliação do Google da Jucelino Castro Fisioterapia
            </h4>
            <p className="text-[11px] text-slate-300 font-mono">https://maps.app.goo.gl/TmRZvfBndpP6XB3A6</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyReviewLink}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-slate-700 transition-colors"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
          </button>
          <a
            href={GOOGLE_REVIEW_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
          >
            <span>Avaliar</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3.5 py-1 text-xs font-semibold text-teal-800">
          <Stethoscope className="h-4 w-4" /> Agendamento Online Público
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Marque sua Consulta Fisioterapêutica</h1>
        <p className="text-xs text-slate-500">
          Horários de atendimento: Segunda a Sexta (07:30–11:30 e 13:30–18:00) | Sábado (07:30–11:00)
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 text-xs font-semibold">
        <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1. Serviço</span>
        <span className="text-slate-300">•</span>
        <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2. Horário (30 min)</span>
        <span className="text-slate-300">•</span>
        <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3. Dados</span>
      </div>

      {/* Step 1: Select Procedure */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {procedures.map((proc) => (
            <div
              key={proc.title}
              onClick={() => {
                setSelectedType(proc.title);
                setStep(2);
              }}
              className={`rounded-2xl border p-5 cursor-pointer transition-all hover:border-teal-500 hover:shadow-md bg-white ${
                selectedType === proc.title ? 'border-teal-600 ring-2 ring-teal-500/20' : 'border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-sm">{proc.title}</h3>
                <span className="font-bold text-teal-600 text-sm">{proc.price}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{proc.desc}</p>
              <span className="inline-block text-[10px] text-slate-400 font-medium mt-3">{proc.time}</span>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Date & Physio */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Selecione o Profissional</label>
            <div className="grid grid-cols-2 gap-3">
              {['Dr. Jucelino Castro', 'Dra. Aline Castro'].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedPhysio(name)}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedPhysio === name ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Data Desejada</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-1/2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
              />
            </div>

            {dayOfWeek === 0 ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold text-center">
                A clínica está fechada aos domingos. Por favor, escolha uma data de segunda a sábado.
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Horários Disponíveis de 30 em 30 minutos
                </label>

                {/* Morning */}
                <div>
                  <span className="text-[11px] font-bold text-amber-700 block mb-1.5">Manhã (07:30 – 11:30)</span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {availableMorning.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`py-1.5 rounded-lg border text-xs font-medium ${
                          selectedTime === t ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 text-slate-700 hover:border-teal-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Afternoon */}
                {availableAfternoon.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-teal-700 block mb-1.5">Tarde (13:30 – 18:00)</span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {availableAfternoon.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`py-1.5 rounded-lg border text-xs font-medium ${
                            selectedTime === t ? 'bg-teal-600 text-white border-teal-600' : 'border-slate-200 text-slate-700 hover:border-teal-400'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(1)} className="text-xs text-slate-500 font-semibold">Voltar</button>
            <button
              onClick={() => setStep(3)}
              disabled={dayOfWeek === 0}
              className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Contact Details */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Seus Dados de Contato</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo (Caixa Alta)</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value.toUpperCase())}
              placeholder="DIGITE SEU NOME COMPLETO..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 uppercase"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Celular</label>
            <input
              type="text"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
              required
            />
          </div>
          <div className="flex justify-between items-center pt-2">
            <button type="button" onClick={() => setStep(2)} className="text-xs text-slate-500 font-semibold">Voltar</button>
            <button type="submit" className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-semibold text-white">Confirmar Agendamento</button>
          </div>
        </form>
      )}
    </div>
  );
};

