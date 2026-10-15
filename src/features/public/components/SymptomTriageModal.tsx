import React, { useState } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { SERVICES_LIST, ServiceItem, CLINIC_INFO } from '../data/servicesData';

interface SymptomTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: ServiceItem) => void;
  whatsappUrl: string;
}

interface QuestionOption {
  text: string;
  serviceSlug: string;
  urgency: 'alta' | 'moderada' | 'rotina';
  desc: string;
}

export const SymptomTriageModal: React.FC<SymptomTriageModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
  whatsappUrl,
}) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  if (!isOpen) return null;

  const areas = [
    {
      id: 'coluna',
      label: 'Coluna / Pescoço / Lombar',
      icon: '🦴',
      symptoms: [
        {
          text: 'Dor lombar com queimação ou dormência na perna (Nervo Ciático)',
          serviceSlug: 'protusao-discal-degeneracao',
          urgency: 'alta' as const,
          desc: 'Indicação direta para descompressão discal e tratamento manipulativo lombar.',
        },
        {
          text: 'Dor no pescoço, torcicolo e pontadas que vão para o braço',
          serviceSlug: 'protusao-discal-degeneracao',
          urgency: 'alta' as const,
          desc: 'Indicação para tratamento manipulativo cervical e realinhamento postural.',
        },
        {
          text: 'Sensação de cansaço ou peso nas costas ao final do dia (Postural / Escoliose)',
          serviceSlug: 'protusao-discal-degeneracao',
          urgency: 'moderada' as const,
          desc: 'Indicação para RPG, Osteopatia e Pilates Clínico.',
        },
      ],
    },
    {
      id: 'joelho',
      label: 'Joelho & Perna',
      icon: '🦵',
      symptoms: [
        {
          text: 'Dor e estalos ao subir/descer escadas ou agachar (Gonartrose / Condromalácia)',
          serviceSlug: 'gonartrose-joelho',
          urgency: 'moderada' as const,
          desc: 'Reabilitação do atrito articular e fortalecimento de suporte.',
        },
        {
          text: 'Pós-fratura de tíbia ou cirurgia ortopédica recente',
          serviceSlug: 'fisioterapia-pos-fratura',
          urgency: 'alta' as const,
          desc: 'Reabilitação de amplitude, drenagem do inchaço e ganho de força.',
        },
        {
          text: 'Sensação de peso intenso, queimação e acúmulo de gordura (Lipedema)',
          serviceSlug: 'reabilitacao-quadril-lipedema',
          urgency: 'moderada' as const,
          desc: 'Terapia descongestiva e fortalecimento muscular de baixo impacto.',
        },
      ],
    },
    {
      id: 'pe',
      label: 'Calcanhar & Pé',
      icon: '🦶',
      symptoms: [
        {
          text: 'Dor aguda no calcanhar ao colocar o pé no chão pela manhã (Fascite / Esporão)',
          serviceSlug: 'fascite-plantar-calcanhar',
          urgency: 'alta' as const,
          desc: 'Liberação miofascial profunda e reeducação mecânica da pisada.',
        },
      ],
    },
    {
      id: 'ombro_braco',
      label: 'Ombro, Cotovelo & Mão',
      icon: '💪',
      symptoms: [
        {
          text: 'Dor no ombro ao dormir de lado ou elevar o braço (Manguito Rotador / Bursite)',
          serviceSlug: 'manguito-rotador-ombro',
          urgency: 'alta' as const,
          desc: 'Descompressão subacromial e reequilíbrio escapular.',
        },
        {
          text: 'Dormência e formigamento nos dedos da mão (Túnel do Carpo)',
          serviceSlug: 'tunel-do-carpo',
          urgency: 'alta' as const,
          desc: 'Mobilização neural e tração dos ossos carpais.',
        },
        {
          text: 'Dor em queimação no cotovelo ao segurar pesos (Epicondilite)',
          serviceSlug: 'epicondilite-lateral',
          urgency: 'moderada' as const,
          desc: 'Terapia tecidual profunda Cyriax e fortalecimento excêntrico.',
        },
      ],
    },
  ];

  const handleSelectOption = (slug: string) => {
    const service = SERVICES_LIST.find((s) => s.slug === slug);
    if (service) {
      onClose();
      onSelectService(service);
    }
  };

  const selectedAreaData = areas.find((a) => a.id === selectedArea);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 p-6 sm:p-8 text-left space-y-6">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0f3e8f] text-[11px] font-bold border border-blue-200">
            Autoavaliação Rápida
          </span>
          <h3 className="text-xl font-black text-slate-900 pt-1">
            Triagem Digital de Sintomas
          </h3>
          <p className="text-xs text-slate-500">
            Selecione onde está sua dor para descobrir a abordagem fisioterapêutica indicada:
          </p>
        </div>

        {/* Area selection tabs */}
        <div className="grid grid-cols-2 gap-2.5">
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedArea(area.id)}
              className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                selectedArea === area.id
                  ? 'border-[#0f3e8f] bg-blue-50/80 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <span className="text-2xl">{area.icon}</span>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {area.label}
              </div>
            </button>
          ))}
        </div>

        {/* Symptoms list for selected area */}
        {selectedAreaData ? (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-700">
              Escolha a descrição que mais se aproxima do seu caso:
            </div>

            <div className="space-y-2">
              {selectedAreaData.symptoms.map((symptom, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(symptom.serviceSlug)}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#0f3e8f] hover:bg-blue-50/40 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0f3e8f]">
                        {symptom.text}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {symptom.desc}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#0f3e8f] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-500">
            Clique em uma das 4 regiões corporais acima para visualizar os sintomas frequentes.
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Precisa de atendimento urgente?</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#0f3e8f] hover:underline flex items-center gap-1"
          >
            <span>Falar no WhatsApp</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
