import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Stethoscope,
  Star,
  ExternalLink,
  Copy,
  Check,
  MessageCircle,
  Lock,
} from 'lucide-react';
import { GOOGLE_REVIEW_LINK } from '../../components/common/GoogleReviewModal';
import { getSlotConfig, CONTACT, buildWhatsAppLink } from '../../config/contact';

interface OnlineBookingProps {
  onBookingSuccess?: () => void;
}

export const OnlineBooking: React.FC<OnlineBookingProps> = ({ onBookingSuccess }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState('Avaliação Ortopédica');
  const [selectedPhysio, setSelectedPhysio] = useState('Dr. Jucelino Castro');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const procedures = [
    {
      title: 'Avaliação Ortopédica',
      time: '50 min',
      price: 'R$ 250',
      desc: 'Avaliação física completa e elaboração de conduta.',
    },
    {
      title: 'Pilates Clínico',
      time: '50 min',
      price: 'R$ 160',
      desc: 'Exercícios focados em postura e core.',
    },
    {
      title: 'RPG / Reeducação Postural',
      time: '60 min',
      price: 'R$ 200',
      desc: 'Posturas globais para alinhamento da coluna.',
    },
  ];

  const slotConfig = getSlotConfig(selectedDate);
  const availableMorning = slotConfig.morning;
  const availableAfternoon = slotConfig.afternoon;

  const dayOfWeek = new Date(`${selectedDate}T00:00:00`).getDay();
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0;

  const whatsappFallback = buildWhatsAppLink(
    'Olá! Gostaria de agendar um horário que não encontrei no site.'
  );

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

  const handleReset = () => {
    setIsFinished(false);
    setStep(1);
    setPatientName('');
    setPatientPhone('');
  };

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto space-y-4 my-8">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-700 text-center space-y-4 shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h2 className="text-xl font-bold text-white">Agendamento Solicitado com Sucesso!</h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Recebemos sua solicitação de <strong className="text-white">{selectedType}</strong> com{' '}
            <strong className="text-white">{selectedPhysio}</strong> para o dia{' '}
            <strong className="text-white">
              {selectedDate} às {selectedTime}
            </strong>
            .
          </p>

          <div className="rounded-2xl bg-slate-800 p-4 border border-slate-700 text-left text-sm space-y-1">
            <p className="text-slate-200">
              <strong className="text-white">Paciente:</strong> {patientName}
            </p>
            <p className="text-slate-200">
              <strong className="text-white">Telefone:</strong> {patientPhone}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Nossa recepção enviará uma mensagem de confirmação no seu WhatsApp em instantes.
            </p>
          </div>

          <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-500/30 text-left space-y-2">
            <div className="flex items-center gap-2 text-amber-200 font-bold text-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>Já é nosso paciente? Avalie a clínica no Google!</span>
            </div>
            <p className="text-xs text-amber-100/80">
              Sua avaliação de 5 estrelas ajuda outros pacientes a encontrarem tratamento de
              excelência.
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
            onClick={handleReset}
            className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Fazer Outro Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">

      {/* Banner de avaliação Google — contraste corrigido */}
      <div className="rounded-2xl bg-slate-800 border border-amber-500/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold shrink-0">
            <Star className="h-5 w-5 fill-slate-950" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white">Avalie a clínica no Google</h4>
            <p className="text-xs text-amber-200 font-mono break-all">{GOOGLE_REVIEW_LINK}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={handleCopyReviewLink}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-slate-700 border border-slate-600 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-slate-600 transition-colors"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
          </button>

          <a
            href={GOOGLE_REVIEW_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
          >
            <span>Avaliar</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Cabeçalho */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-300">
          <Stethoscope className="h-4 w-4" /> Agendamento Online
        </div>
        <h1 className="text-2xl font-bold text-white">Marque sua Consulta Fisioterapêutica</h1>
        <p className="text-sm text-slate-300">
          Seg a Sex: 07:30 às 18:00 (almoço 11:30 às 13:30) • Sábado: 07:30 às 11:00
        </p>
      </div>

      {/* Etapas */}
      <div className="flex items-center justify-center gap-3 text-xs font-semibold flex-wrap">
        <span
          className={`px-3 py-1 rounded-full ${
            step >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
          }`}
        >
          1. Serviço
        </span>
        <span className="text-slate-600">•</span>
        <span
          className={`px-3 py-1 rounded-full ${
            step >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
          }`}
        >
          2. Horário (30 min)
        </span>
        <span className="text-slate-600">•</span>
        <span
          className={`px-3 py-1 rounded-full ${
            step >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
          }`}
        >
          3. Dados
        </span>
      </div>

      {/* Etapa 1: Procedimento */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {procedures.map((proc) => (
            <div
              key={proc.title}
              onClick={() => {
                setSelectedType(proc.title);
                setStep(2);
              }}
              className={`rounded-2xl border p-5 cursor-pointer transition-all bg-slate-900 hover:border-emerald-500 hover:shadow-lg ${
                selectedType === proc.title
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-white text-sm">{proc.title}</h3>
                <span className="font-bold text-emerald-400 text-sm shrink-0">{proc.price}</span>
              </div>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">{proc.desc}</p>
              <span className="inline-block text-xs text-slate-400 font-medium mt-3">
                {proc.time}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Etapa 2: Data e Profissional */}
      {step === 2 && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              Selecione o Profissional
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Dr. Jucelino Castro', 'Dra. Aline Castro'].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedPhysio(name)}
                  className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                    selectedPhysio === name
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-700 text-slate-300 hover:border-emerald-500/50'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Data Desejada
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-1/2 rounded-xl border border-slate-600 bg-slate-800 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {isSunday ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-semibold text-center">
                A clínica está fechada aos domingos. Escolha uma data de segunda a sábado.
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-200">
                  Horários disponíveis (30 em 30 minutos)
                </label>

                <div>
                  <span className="text-xs font-bold text-amber-300 block mb-2">
                    Manhã (07:30 – 11:00)
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {availableMorning.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedTime === t
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                            : 'border-slate-600 text-slate-200 hover:border-emerald-500'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {!isSaturday && availableAfternoon.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-cyan-300 block mb-2">
                      Tarde (13:30 – 18:00)
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {availableAfternoon.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                            selectedTime === t
                              ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                              : 'border-slate-600 text-slate-200 hover:border-emerald-500'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isSaturday && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm space-y-2">
                    <div className="flex items-center gap-2 font-bold">
                      <Lock className="h-4 w-4" />
                      <span>Sábado: atendimento apenas pela manhã</span>
                    </div>
                    <p className="text-xs leading-relaxed text-amber-100/80">
                      Aos sábados a clínica atende das 07:30 às 11:00. Para horários à tarde, fale
                      com a recepção pelo WhatsApp.
                    </p>
                    <a
                      href={whatsappFallback}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Falar no WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-slate-400 font-semibold hover:text-white transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={isSunday}
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Etapa 3: Dados de contato */}
      {step === 3 && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-6 rounded-2xl border border-slate-700 space-y-4"
        >
          <h3 className="font-bold text-white text-base">Seus Dados de Contato</h3>

          <div className="rounded-xl bg-slate-800 border border-slate-700 p-3 text-sm space-y-1">
            <p className="text-slate-200">
              <strong className="text-white">Serviço:</strong> {selectedType}
            </p>
            <p className="text-slate-200">
              <strong className="text-white">Profissional:</strong> {selectedPhysio}
            </p>
            <p className="text-slate-200">
              <strong className="text-white">Data:</strong> {selectedDate} às {selectedTime}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value.toUpperCase())}
              placeholder="DIGITE SEU NOME COMPLETO"
              className="w-full rounded-xl border border-slate-600 bg-slate-800 p-3 text-sm text-white placeholder-slate-500 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">
              WhatsApp / Celular
            </label>
            <input
              type="tel"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="(68) 99999-9999"
              className="w-full rounded-xl border border-slate-600 bg-slate-800 p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              required
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-sm text-slate-400 font-semibold hover:text-white transition-colors"
            >
              Voltar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      )}

      {/* Rodapé de contato */}
      <div className="text-center text-sm text-slate-300 pt-2">
        Precisa de ajuda?{' '}
        <a
          href={buildWhatsAppLink('Olá! Preciso de ajuda com o agendamento online.')}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
        >
          Fale com a recepção no WhatsApp {CONTACT.whatsappDisplay}
        </a>
      </div>
    </div>
  );
};
