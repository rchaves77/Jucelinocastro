import React from 'react';
import {
  Phone,
  PhoneCall,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ChevronUp,
  Heart,
  Instagram,
  FileCheck,
  Compass,
} from 'lucide-react';
import { ClinicLogo } from '../../../components/common/ClinicLogo';
import { CLINIC_INFO } from '../data/servicesData';

interface PublicFooterProps {
  onOpenLogin: () => void;
  whatsappUrl: string;
  onOpenValidationModal?: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onOpenLogin,
  whatsappUrl,
  onOpenValidationModal,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 text-left items-start">
          
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-4">
            <div className="bg-white p-2 rounded-2xl inline-flex items-center justify-start shadow-sm">
              <ClinicLogo variant="header" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              <strong className="text-white">Jucelino Castro Fisioterapia:</strong> Centro especializado em tratamento conservador da coluna, hérnia de disco, ciatalgia, gonartrose e reabilitação ortopédica no Acre.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
              <ShieldCheck className="h-4 w-4 text-[#dc2626]" />
              <span>{CLINIC_INFO.founderCrefito}</span>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <a
                href={CLINIC_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-950/60 border border-pink-700/50 text-pink-300 hover:text-white hover:bg-pink-900/80 transition-all text-xs font-bold"
              >
                <Instagram className="h-4 w-4 text-pink-400" />
                <span>{CLINIC_INFO.instagramHandle}</span>
              </a>
            </div>

            <div className="text-xs text-slate-400">
              Mais de <strong className="text-white font-bold">43.000 pacientes atendidos</strong> e 15 anos de excelência médica.
            </div>
          </div>

          {/* Col 2: Serviços Rápidos (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-blue-400">
              Tratamentos Principais
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  • Hérnia & Protusão Discal
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  • Gonartrose e Joelho
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  • Fascite Plantar & Esporão
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  • Manguito Rotador & Ombro
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  • Túnel do Carpo & Epicondilite
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  • Reabilitação Pós-Fratura & Lipedema
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Navegação (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-blue-400">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#manipulativos" className="hover:text-white transition-colors">
                  Manipulativos
                </a>
              </li>
              <li>
                <a href="#patologias" className="hover:text-white transition-colors">
                  Guia de Patologias
                </a>
              </li>
              <li>
                <a href="#equipe" className="hover:text-white transition-colors">
                  Corpo Clínico
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition-colors">
                  Blog de Fisioterapia
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-white transition-colors">
                  Depoimentos Reais
                </a>
              </li>
              {onOpenValidationModal && (
                <li>
                  <button
                    onClick={onOpenValidationModal}
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-bold flex items-center gap-1.5 cursor-pointer"
                    title="Verificar validade de atestados e declarações emitidos pela clínica"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Validar Declaração / QR Code</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={onOpenLogin}
                  className="text-xs text-slate-400 hover:text-white transition-colors font-semibold cursor-pointer"
                >
                  Área Restrita Equipe
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contato, Celular & Georreferenciamento (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-blue-400">
              Atendimento em Rio Branco
            </h4>

            <div className="space-y-3 text-xs text-slate-300">
              {/* Celular com ênfase total */}
              <a
                href={`tel:${CLINIC_INFO.whatsappRaw}`}
                className="flex items-center gap-2 p-2 rounded-xl bg-red-950/40 border border-red-500/50 hover:border-red-400 transition-all text-white"
                title="Ligar no Celular"
              >
                <div className="p-1 rounded-lg bg-red-600 text-white shrink-0">
                  <PhoneCall className="h-3.5 w-3.5 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] text-red-300 font-bold uppercase">Celular / Atendimento Imediato</div>
                  <div className="font-black text-sm text-white">{CLINIC_INFO.whatsappPhone}</div>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-200 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: <strong className="text-white">{CLINIC_INFO.whatsappPhone}</strong></span>
              </a>

              {/* Fixo */}
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span>Telefone Fixo: {CLINIC_INFO.landlinePhone}</span>
              </div>

              {/* Endereço & Georreferenciamento */}
              <div className="flex items-start gap-2 pt-1 border-t border-slate-800">
                <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-slate-200">{CLINIC_INFO.address}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                    <Compass className="h-3 w-3 text-blue-400" />
                    <span>GPS: -9.959388, -67.810929 ({CLINIC_INFO.latRef}/{CLINIC_INFO.lonRef})</span>
                  </div>
                </div>
              </div>

              {/* Horários */}
              <div className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-200">{CLINIC_INFO.hoursWeekday}</div>
                  <div className="font-bold text-slate-200">{CLINIC_INFO.hoursSaturday}</div>
                </div>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap gap-2">
              <a
                href={`tel:${CLINIC_INFO.whatsappRaw}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>Ligar Agora</span>
              </a>
              <a
                href={CLINIC_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-red-400" />
                <span>Google Maps</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-center sm:text-left">
            <span>© {new Date().getFullYear()} <strong>{CLINIC_INFO.name}</strong>. Todos os direitos reservados.</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>
              Desenvolvido por{' '}
              <a
                href="https://instagram.com/cliente_box"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline-offset-2 hover:underline"
              >
                @cliente_box
              </a>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {onOpenValidationModal && (
              <button
                onClick={onOpenValidationModal}
                className="text-xs text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium"
                title="Validar Declaração de comparecimento"
              >
                <FileCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Validador de Declaração</span>
              </button>
            )}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1.5"
              title="Voltar ao topo"
            >
              <span className="text-[11px] font-medium text-slate-300">Topo</span>
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
