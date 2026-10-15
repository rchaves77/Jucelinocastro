import React from 'react';
import {
  Phone,
  PhoneCall,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Award,
  Star,
  ArrowRight,
  Sparkles,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Calendar,
  Zap,
} from 'lucide-react';
import { CLINIC_INFO } from '../data/servicesData';

interface HeroSectionProps {
  whatsappUrl: string;
  onOpenTriage: () => void;
  onSelectServiceSlug: (slug: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  whatsappUrl,
  onOpenTriage,
  onSelectServiceSlug,
}) => {
  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Main Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold text-[#0f3e8f] shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-[#dc2626] animate-pulse" />
              <Award className="h-4 w-4 text-[#b91c1c]" />
              <span>Referência em Fisioterapia & Coluna em {CLINIC_INFO.cityState}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 leading-[1.12] tracking-tight">
              Recupere seus movimentos e viva sem as dores da{' '}
              <span className="text-[#0f3e8f] underline decoration-[#dc2626] decoration-4 underline-offset-4">
                hérnia de disco e lesões articulares.
              </span>
            </h1>

            {/* Sub-headline / Authority Text */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              A <strong className="text-[#0f3e8f] font-bold">Jucelino Castro Fisioterapia</strong> conta com mais de <strong className="text-slate-900 font-bold">43 mil pacientes reabilitados</strong> e <strong className="text-slate-900 font-bold">15 anos de experiência clínica</strong>. Tratamos hérnias de disco, ciático, dorsolombalgias, gonartrose de joelho, manguito rotador e fascite plantar com metodologia <strong className="text-[#b91c1c] font-bold">100% conservadora e sem cirurgia</strong>.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Atendimento individualizado com hora marcada a partir das <strong>07:30</strong>. Osteopatia, RPG, Quiropraxia e Pilates Clínico integrados em Rio Branco.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 rounded-2xl bg-[#0f3e8f] hover:bg-[#0c2f6d] px-7 py-4 text-sm font-bold text-white transition-all shadow-xl shadow-blue-900/25 active:scale-98 cursor-pointer"
              >
                <MessageCircle className="h-5 w-5 fill-white" />
                <span>Agendar Avaliação no WhatsApp</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={`tel:${CLINIC_INFO.whatsappRaw}`}
                className="flex items-center justify-center gap-2 rounded-2xl bg-white border-2 border-red-500 hover:bg-red-50 px-5 py-4 text-xs font-black text-red-600 transition-all shadow-sm active:scale-98"
                title="Ligar diretamente no celular da clínica"
              >
                <PhoneCall className="h-4 w-4 text-red-600 animate-pulse" />
                <span>Ligar no Celular: {CLINIC_INFO.whatsappPhone}</span>
              </a>

              <button
                onClick={onOpenTriage}
                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 px-5 py-4 text-xs font-bold text-[#0f3e8f] transition-all cursor-pointer"
              >
                <Zap className="h-4 w-4 text-[#dc2626]" />
                <span>Triagem Rápida de Sintomas</span>
              </button>
            </div>

            {/* Micro Badge NAP Google Meu Negócio */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-2">
              <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                <MapPin className="h-3.5 w-3.5 text-red-500" />
                {CLINIC_INFO.street}, {CLINIC_INFO.neighborhood} • Rio Branco - AC
              </span>
              <span className="text-slate-300">•</span>
              <a 
                href={`tel:${CLINIC_INFO.whatsappRaw}`}
                className="font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <Phone className="h-3 w-3" />
                Celular/Plantão: {CLINIC_INFO.whatsappPhone}
              </a>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">
                Fixo: {CLINIC_INFO.landlinePhone}
              </span>
            </div>

            {/* Trust Badges Counter */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#0f3e8f]">43.000+</div>
                <div className="text-[11px] text-slate-600 font-semibold mt-0.5">Pacientes Reabilitados</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#b91c1c]">15+ Anos</div>
                <div className="text-[11px] text-slate-600 font-semibold mt-0.5">Experiência Clínica</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 flex items-center justify-center sm:justify-start gap-1">
                  <span>5.0</span>
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400 inline" />
                </div>
                <div className="text-[11px] text-slate-600 font-semibold mt-0.5">Avaliações Google</div>
              </div>
            </div>

          </div>

          {/* Right Interactive Symptom Alert & Quick Consult Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden ring-1 ring-slate-100">
              
              {/* Brand Top Accent Strip */}
              <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-[#0f3e8f] via-[#1e40af] to-[#dc2626]" />

              <div className="space-y-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#b91c1c] text-[11px] font-bold uppercase tracking-wider border border-red-200">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Triagem Direcionada
                </span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Qual sintoma está limitando seu dia a dia?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Clique no seu sintoma para ver o tratamento fisioterapêutico específico:
                </p>
              </div>

              {/* Interactive Symptom Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => onSelectServiceSlug('protusao-discal-degeneracao')}
                  className="w-full text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#0f3e8f] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#dc2626] shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-[#0f3e8f]">Dor na Coluna, Lombalgia ou Hérnia</div>
                      <div className="text-xs text-slate-600">Queimação, travamento ou dor que irradia (ciático)</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#0f3e8f] group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => onSelectServiceSlug('gonartrose-joelho')}
                  className="w-full text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#0f3e8f] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#0f3e8f] shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-[#0f3e8f]">Gonartrose, Joelho ou Menisco</div>
                      <div className="text-xs text-slate-600">Estalos, dor ao descer escadas ou inchaço</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#0f3e8f] group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => onSelectServiceSlug('fascite-plantar-calcanhar')}
                  className="w-full text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#0f3e8f] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#dc2626] shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-[#0f3e8f]">Fascite Plantar ou Esporão</div>
                      <div className="text-xs text-slate-600">Pontadas e queimação nos primeiros passos da manhã</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#0f3e8f] group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => onSelectServiceSlug('manguito-rotador-ombro')}
                  className="w-full text-left p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#0f3e8f] transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#0f3e8f] shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-[#0f3e8f]">Dor no Ombro ou Manguito Rotador</div>
                      <div className="text-xs text-slate-600">Dificuldade para elevar o braço ou dormir de lado</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#0f3e8f] group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>

              {/* Clinic Guarantee Box */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-slate-800 text-xs font-medium leading-relaxed flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-[#0f3e8f] shrink-0" />
                <span>
                  <strong>Avaliação Completa:</strong> Testes ortopédicos específicos para descobrir a causa exata antes de qualquer manobra.
                </span>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-2xl bg-[#0f3e8f] hover:bg-[#0c2f6d] py-3.5 text-xs font-bold text-white transition-all shadow-md active:scale-98 cursor-pointer"
              >
                Falar com a Equipe no WhatsApp ({CLINIC_INFO.whatsappPhone})
              </a>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
