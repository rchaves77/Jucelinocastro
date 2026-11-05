import React from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Phone,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { ServiceItem, CLINIC_INFO } from '../data/servicesData';

const SERVICE_FALLBACK_IMAGES: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80',
  2: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80',
  3: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
  4: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80',
  5: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
  6: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
  7: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  8: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
  9: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
  10: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=900&q=80',
};

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  whatsappUrl: string;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  whatsappUrl,
}) => {
  if (!service) return null;

  const serviceWhatsapp = `${whatsappUrl}&text=Olá Dr. Jucelino Castro, gostaria de agendar uma avaliação para ${encodeURIComponent(service.name)}.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header with image */}
        <div className="relative h-48 sm:h-56 w-full shrink-0 bg-slate-900">
          <img
            src={service.imageUrl}
            alt={service.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              const target = e.currentTarget;
              const fallback = SERVICE_FALLBACK_IMAGES[service.id] || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80';
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 space-y-1">
            <span className="px-3 py-1 rounded-full bg-[#0f3e8f] text-white text-[11px] font-bold uppercase tracking-wider">
              {service.categoryLabel}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {service.name}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-left">
          
          {/* Anatomical Target Banner */}
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xs">
            <span className="px-2 py-0.5 rounded-lg bg-[#dc2626] text-white text-[10px] font-bold uppercase tracking-wider">
              Área Anatômica
            </span>
            <span className="text-blue-100">{service.anatomicalFocus}</span>
          </div>

          {/* Main Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#0f3e8f] uppercase tracking-wider">
              Sobre o Tratamento Clínico
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {service.fullDesc}
            </p>
          </div>

          {/* Captured Pathologies */}
          <div className="space-y-2.5 p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-[#dc2626]" />
              <span>Patologias e Sintomas Diagnosticados:</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {service.capturedPathologies.map((pathology, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white text-[#0f3e8f] text-xs font-semibold border border-blue-200 shadow-2xs"
                >
                  {pathology}
                </span>
              ))}
            </div>
          </div>

          {/* Protocol Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Como Funciona Nosso Protocolo Fisioterapêutico:
            </h4>
            <div className="space-y-2">
              {service.protocolSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
                >
                  <span className="w-5 h-5 rounded-full bg-[#0f3e8f] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Principais Benefícios:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-slate-700 font-medium bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200/70"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Atendimento em {CLINIC_INFO.cityState} • Fixo: {CLINIC_INFO.landlinePhone}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Fechar
            </button>

            <a
              href={serviceWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0f3e8f] hover:bg-[#0c2f6d] text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="h-4 w-4 fill-white" />
              <span>Agendar Avaliação</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
