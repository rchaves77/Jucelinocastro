import React from 'react';
import { ClinicLogo } from '../../../components/common/ClinicLogo';
import {
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Instagram,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { CONTACT, buildWhatsAppLink } from '../../../config/contact';

interface PublicFooterProps {
  onOpenLogin: () => void;
  whatsappUrl?: string;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onOpenLogin }) => {
  const whatsappFooter = buildWhatsAppLink(
    'Olá! Vim pelo site e gostaria de agendar uma avaliação.'
  );

  return (
    <footer className="bg-slate-950 text-white pt-20 md:pt-24 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Bloco de contato em destaque */}
        <div className="rounded-[32px] sm:rounded-[40px] bg-slate-900 border border-slate-800 p-7 sm:p-10 mb-14">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                Fale com a nossa equipe
              </h3>
              <p className="text-sm text-slate-300">
                Agende sua avaliação pelo WhatsApp ou ligue para a clínica.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <a
                href={whatsappFooter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{CONTACT.whatsappDisplay}</span>
              </a>

              <a
                href={CONTACT.landlineUrl}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white text-sm font-bold transition-all"
                title="Prefere ligar? Fale no telefone fixo"
              >
                <Phone className="h-4 w-4" />
                <span>{CONTACT.landlineDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-14">

          {/* Coluna 1: Marca */}
          <div className="lg:col-span-5 space-y-7">
            <ClinicLogo variant="large" />
            <p className="text-slate-300 text-base leading-relaxed max-w-sm">
              A maior referência em tratamento de coluna e reabilitação conservadora em Rio Branco.
              Onde a ciência encontra o alívio.
            </p>

            <div className="flex gap-3">
              <a
                href={whatsappFooter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-600 transition-all group"
              >
                <MessageCircle size={20} className="text-slate-300 group-hover:text-white" />
              </a>

              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all group"
              >
                <Instagram size={20} className="text-slate-300 group-hover:text-white" />
              </a>

              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Maps"
                className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center hover:bg-slate-700 transition-all group"
              >
                <MapPin size={20} className="text-slate-300 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Contato e Localização */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-red-500">
                Unidade Rio Branco
              </h4>

              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 items-start group"
              >
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-red-500 transition-colors">
                  <MapPin size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1 tracking-tight group-hover:text-red-400 transition-colors">
                    Bosque
                  </p>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    Rua Quintino Bocaiuva, 1848
                    <br />
                    Rio Branco - AC, 69900-670
                  </p>
                </div>
              </a>

             <div className="flex gap-4 items-start">
  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 border border-slate-700">
    <Clock size={18} className="text-red-500" />
  </div>
  <div>
    <p className="text-sm font-bold text-white mb-1 tracking-tight">Atendimento</p>
    <p className="text-xs text-slate-200 font-semibold">Seg a Sex: 07:30 às 18:00</p>
    <p className="text-[11px] text-slate-400 italic">Almoço: 11:30 às 13:30</p>
    <p className="text-xs text-slate-200 font-semibold mt-1">Sábado: 07:30 às 11:00</p>
  </div>
</div>

              <a href={CONTACT.landlineUrl} className="flex gap-4 items-start group">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 border border-slate-700 group-hover:border-red-500 transition-colors">
                  <Phone size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1 tracking-tight group-hover:text-red-400 transition-colors">
                    Telefone Fixo
                  </p>
                  <p className="text-xs text-slate-300 italic">{CONTACT.landlineDisplay}</p>
                </div>
              </a>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-red-500">
                Certificação
              </h4>

              <div className="bg-slate-900/60 p-7 rounded-[32px] border border-slate-700 relative overflow-hidden group">
                <ShieldCheck
                  size={90}
                  className="absolute -bottom-8 -right-8 text-slate-800 group-hover:text-red-600/10 transition-colors"
                />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Metodologia Registrada
                </p>
                <h5 className="text-3xl font-black text-white tracking-tighter mb-4 leading-none italic font-serif">
                  CSD
                </h5>
                <button
                  onClick={onOpenLogin}
                  className="text-[10px] font-black text-red-500 underline uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
                >
                  Acesso Restrito à Equipe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">
            © {new Date().getFullYear()} Jucelino Castro Fisioterapia — Todos os direitos reservados
          </p>

          <a
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
          >
            <span>Sistema de Alta Precisão Online</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
