import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  MessageCircle,
  Lock,
  Menu,
  X,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Instagram,
  FileCheck,
} from 'lucide-react';
import { ClinicLogo } from '../../../components/common/ClinicLogo';
import { CLINIC_INFO } from '../data/servicesData';

interface PublicNavbarProps {
  onOpenLogin: () => void;
  whatsappUrl: string;
  onOpenValidationModal?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  onOpenLogin,
  whatsappUrl,
  onOpenValidationModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Manipulativos', href: '#manipulativos' },
    { label: 'Patologias', href: '#patologias' },
    { label: 'Corpo Clínico', href: '#equipe' },
    { label: 'Blog', href: '#blog' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Convênios & Localização', href: '#contato' },
  ];

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#0b2b68] text-white py-2 px-4 text-xs font-semibold border-b border-blue-900 shadow-xs relative z-50">
        {/* Hidden SVG defs for Instagram gradient */}
        <svg width="0" height="0" className="absolute pointer-events-none opacity-0" aria-hidden="true">
          <defs>
            <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="25%" stopColor="#e6683c" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="75%" stopColor="#cc2366" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
        </svg>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#dc2626] animate-pulse ring-2 ring-red-400/40 shrink-0" />
            <span className="text-slate-100">
              Bosque, Rio Branco/AC • Atendimento a partir das <strong className="text-amber-300 font-bold">07:30</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            {/* Celular com ênfase máxima */}
            <a
              href={`tel:${CLINIC_INFO.whatsappRaw}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-black transition-all shadow-2xs"
              title="Ligar para o Celular / Plantão da Clínica"
            >
              <PhoneCall className="h-3 w-3 text-white animate-pulse" />
              <span>Celular: {CLINIC_INFO.whatsappPhone}</span>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-emerald-300 hover:text-white font-bold transition-colors"
              title="Conversar no WhatsApp"
            >
              <svg
                className="h-3.5 w-3.5 fill-[#25D366] transition-transform group-hover:scale-110 shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Fixo */}
            <a
              href={`tel:${CLINIC_INFO.landlinePhone.replace(/\D/g, '')}`}
              className="hidden lg:inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              title="Ligar para telefone fixo"
            >
              <Phone className="h-3 w-3 text-blue-300" />
              <span>Fixo: {CLINIC_INFO.landlinePhone}</span>
            </a>
            <span className="text-blue-400 hidden sm:inline">•</span>
            {onOpenValidationModal && (
              <button
                onClick={onOpenValidationModal}
                className="hidden lg:inline-flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors font-bold cursor-pointer"
                title="Validar Autenticidade de Declaração / Atestado de Comparecimento"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Validar Declaração</span>
              </button>
            )}
            <span className="text-blue-400 hidden lg:inline">•</span>
            <a
              href={CLINIC_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 hover:opacity-90 font-bold transition-all"
              title="Visitar Instagram oficial"
            >
              <Instagram
                className="h-3.5 w-3.5 transition-transform group-hover:scale-110"
                style={{ stroke: 'url(#instagram-gradient)' }}
              />
              <span className="bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent font-extrabold tracking-wide">
                Instagram
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Sticky Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2 shrink-0 group">
            <ClinicLogo variant="header" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6 text-[13px] font-bold text-slate-800 tracking-wide">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="hover:text-[#0f3e8f] transition-colors py-1 border-b-2 border-transparent hover:border-[#0f3e8f]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Certificate / Declaration Validator */}
            {onOpenValidationModal && (
              <button
                onClick={onOpenValidationModal}
                className="hidden sm:flex items-center gap-1.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 px-3 py-2.5 text-xs font-bold transition-all border border-emerald-300/60 shadow-2xs cursor-pointer"
                title="Validar Declaração de Comparecimento com QR Code ou Hash"
              >
                <FileCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="hidden md:inline">Validar Declaração</span>
                <span className="md:hidden">Validar</span>
              </button>
            )}

            {/* Team Access */}
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-800 transition-all border border-slate-300 shadow-2xs cursor-pointer"
              title="Acesso Restrito ao Sistema Clínico da Equipe"
            >
              <Lock className="h-3.5 w-3.5 text-[#0f3e8f]" />
              <span className="hidden sm:inline">Acesso Equipe</span>
            </button>

            {/* Direct WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#0f3e8f] hover:bg-[#0c2f6d] active:scale-95 px-4 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-blue-900/20 cursor-pointer"
            >
              <MessageCircle className="h-4 w-4 fill-white" />
              <span className="hidden sm:inline">Agendar Avaliação</span>
              <span className="sm:hidden">Agendar</span>
            </a>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Abrir Menu de Navegação"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-fade-in space-y-3">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 text-xs font-bold text-slate-800 hover:text-[#0f3e8f] transition-all"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </a>
              ))}

              {onOpenValidationModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenValidationModal();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-bold transition-all border border-emerald-200/80 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Validar Declaração / Atestado
                  </span>
                  <ChevronRight className="h-4 w-4 text-emerald-600" />
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold px-2">
                <Clock className="h-4 w-4 text-[#0f3e8f] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-slate-900 font-bold">{CLINIC_INFO.hoursWeekday}</div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-600 font-medium">
                    <span className="text-slate-800 font-semibold">{CLINIC_INFO.hoursSaturday}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{CLINIC_INFO.hoursSunday}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold px-2">
                <MapPin className="h-4 w-4 text-[#dc2626] shrink-0 mt-0.5" />
                <span className="leading-snug">{CLINIC_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-pink-700 font-semibold px-2">
                <Instagram className="h-4 w-4 text-pink-600 shrink-0" />
                <a href={CLINIC_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {CLINIC_INFO.instagramHandle}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
