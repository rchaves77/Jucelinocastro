import React from 'react';
import {
  Sparkles,
  Activity,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { MANIPULATIVE_TREATMENTS, CLINIC_INFO } from '../data/servicesData';

interface ManipulativeTreatmentsSectionProps {
  whatsappUrl: string;
}

export const ManipulativeTreatmentsSection: React.FC<ManipulativeTreatmentsSectionProps> = ({
  whatsappUrl,
}) => {
  return (
    <section id="manipulativos" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-blue-50/30 to-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 border border-blue-200 px-4 py-1.5 text-xs font-bold text-[#0f3e8f]">
            <Sparkles className="h-4 w-4 text-[#dc2626]" />
            <span>Terapia Manual & Quiropraxia Avançada</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Tratamentos Manipulativos de Alta Precisão
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Métodos mecânicos exclusivos desenvolvidos pelo Dr. Jucelino Castro para desobstrução articular, liberação de raízes nervosas e alívio imediato da dor aguda ou crônica.
          </p>
        </div>

        {/* 3 Main Manipulative Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MANIPULATIVE_TREATMENTS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group"
            >
              <div className="space-y-4">
                
                {/* Badge & Step */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0f3e8f] text-[11px] font-bold border border-blue-200">
                    {item.badge}
                  </span>
                  <span className="text-xs font-black text-slate-400">
                    0{idx + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-[#0f3e8f] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>

                {/* Indications */}
                <div className="space-y-2 pt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Principais Indicações:
                  </div>
                  <ul className="space-y-1.5">
                    {item.indications.map((ind, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#dc2626] shrink-0 mt-0.5" />
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Results Highlight */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-[11px] text-slate-800 font-medium leading-relaxed">
                  <strong className="text-[#0f3e8f] block mb-0.5">Resultado Clínico Esperado:</strong>
                  {item.results}
                </div>

                <a
                  href={`${whatsappUrl}&text=Olá Dr. Jucelino Castro, gostaria de agendar uma sessão de ${encodeURIComponent(item.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#0f3e8f] text-slate-700 hover:text-white text-xs font-bold transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Consultar Disponibilidade</span>
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Integrated Modalities Strip (Osteopatia, RPG, Reabilitação Esportiva e Pós-fratura) */}
        <div className="rounded-3xl bg-[#0f3e8f] text-white p-8 md:p-10 shadow-xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Metodologia Multidisciplinar
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Osteopatia, RPG, Pilates Clínico & Reabilitação Esportiva Acelerada
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
                Além das manipulações vertebrais, combinamos a Reeducação Postural Global (RPG) para realinhamento postural duradouro, Pilates Clínico individualizado para blindagem da coluna e reabilitação esportiva para retorno seguro a treinos e competições.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-slate-100 text-[#0f3e8f] font-bold text-xs py-3.5 px-6 shadow-md transition-all text-center"
              >
                <MessageCircle className="h-4 w-4 fill-[#0f3e8f]" />
                <span>Agendar Avaliação Global</span>
              </a>
              <a
                href={`tel:${CLINIC_INFO.landlinePhone.replace(/\D/g, '')}`}
                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-900/60 hover:bg-blue-900 border border-blue-400/30 text-white font-semibold text-xs py-3.5 px-6 transition-all text-center"
              >
                <span>Fixo: {CLINIC_INFO.landlinePhone}</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
