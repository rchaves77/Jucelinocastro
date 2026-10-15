import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  ArrowUp,
  Phone,
  PhoneCall,
  MapPin,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import { PublicNavbar } from './components/PublicNavbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { ManipulativeTreatmentsSection } from './components/ManipulativeTreatmentsSection';
import { PathologiesIndexSection } from './components/PathologiesIndexSection';
import { TeamSection } from './components/TeamSection';
import { BlogSection } from './components/BlogSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { InsuranceAndContactSection } from './components/InsuranceAndContactSection';
import { PublicFooter } from './components/PublicFooter';

import { ServiceDetailModal } from './components/ServiceDetailModal';
import { BlogPostModal } from './components/BlogPostModal';
import { NewTestimonialModal } from './components/NewTestimonialModal';
import { SymptomTriageModal } from './components/SymptomTriageModal';

import { SERVICES_LIST, ServiceItem, CLINIC_INFO } from './data/servicesData';
import { BlogPost } from './data/blogData';
import { getStoredTestimonials, Testimonial } from './data/testimonialsData';

interface PublicLandingPageProps {
  onOpenLogin: () => void;
  onOpenBookingModal?: () => void;
  onOpenValidationModal?: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onOpenLogin,
  onOpenValidationModal,
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => getStoredTestimonials());

  const defaultMessage = encodeURIComponent(
    'Olá! Estava navegando no site da Jucelino Castro Fisioterapia e gostaria de agendar uma avaliação com o Dr. Jucelino Castro.'
  );
  const whatsappUrl = `https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${defaultMessage}`;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectServiceBySlug = (slug: string) => {
    const found = SERVICES_LIST.find((s) => s.slug === slug);
    if (found) {
      setSelectedService(found);
    }
  };

  const handleTestimonialAdded = (newTestimonial: Testimonial) => {
    setTestimonials((prev) => [newTestimonial, ...prev]);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="inicio" className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col justify-between pb-20 sm:pb-0">
      
      {/* 1. STICKY NAVBAR */}
      <PublicNavbar
        onOpenLogin={onOpenLogin}
        whatsappUrl={whatsappUrl}
        onOpenValidationModal={onOpenValidationModal}
      />

      {/* 2. HERO SECTION */}
      <HeroSection
        whatsappUrl={whatsappUrl}
        onOpenTriage={() => setIsTriageModalOpen(true)}
        onSelectServiceSlug={handleSelectServiceBySlug}
      />

      {/* 3. MANIPULATIVE TREATMENTS SECTION (Tratamento manipulativo cervical/lombar/vertebral) */}
      <ManipulativeTreatmentsSection
        whatsappUrl={whatsappUrl}
      />

      {/* 4. SPECIALIZED SERVICES (10 CATEGORIES & PROTOCOLS) */}
      <ServicesSection
        onSelectService={(service) => setSelectedService(service)}
        whatsappUrl={whatsappUrl}
      />

      {/* 5. COMPLETE PATHOLOGIES INDEX (A-Z DIRECTORY) */}
      <PathologiesIndexSection
        onSelectService={(service) => setSelectedService(service)}
        whatsappUrl={whatsappUrl}
      />

      {/* 6. TEAM & CLINIC INFRASTRUCTURE */}
      <TeamSection
        whatsappUrl={whatsappUrl}
      />

      {/* 7. INTEGRATED PHYSIOTHERAPY BLOG */}
      <BlogSection
        onSelectPost={(post) => setSelectedPost(post)}
      />

      {/* 8. PATIENT TESTIMONIALS & REVIEWS */}
      <TestimonialsSection
        testimonials={testimonials}
        onOpenNewTestimonialModal={() => setIsTestimonialModalOpen(true)}
      />

      {/* 9. INSURANCES, CONTACT & FAQ */}
      <InsuranceAndContactSection
        whatsappUrl={whatsappUrl}
      />

      {/* 10. FOOTER */}
      <PublicFooter
        onOpenLogin={onOpenLogin}
        whatsappUrl={whatsappUrl}
        onOpenValidationModal={onOpenValidationModal}
      />

      {/* MOBILE STICKY BOTTOM BAR (Otimizado para conversão no Celular e Google Meu Negócio) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-2xl flex items-center justify-between gap-2">
        <a
          href={`tel:${CLINIC_INFO.whatsappRaw}`}
          className="flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 active:from-red-700 active:to-red-800 text-white shadow-md shadow-red-900/20 text-[11px] font-black transition-all"
          title="Ligar agora no Celular"
        >
          <div className="flex items-center gap-1">
            <PhoneCall className="h-3.5 w-3.5 text-white animate-bounce" />
            <span>Ligar Celular</span>
          </div>
          <span className="text-[9px] text-red-100 font-semibold">{CLINIC_INFO.whatsappPhone}</span>
        </a>

        <a
          href={CLINIC_INFO.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-2.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-800 border border-slate-200 text-[10px] font-bold transition-all"
          title="Ver no Google Maps"
        >
          <MapPin className="h-3.5 w-3.5 text-[#0f3e8f] mb-0.5" />
          <span>Como Chegar</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-black text-[11px] shadow-md shadow-emerald-950/20 transition-all"
          title="Agendar no WhatsApp"
        >
          <div className="flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5 fill-white shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>WhatsApp</span>
          </div>
          <span className="text-[9px] text-emerald-100 font-semibold">Agendamento</span>
        </a>
      </div>

      {/* DESKTOP RETRACTABLE FLOATING WHATSAPP BUTTON */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex fixed bottom-6 right-6 z-40 items-center bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-2xl shadow-emerald-950/40 rounded-full transition-all duration-300 ease-in-out group p-3.5 hover:px-5 hover:py-3.5 cursor-pointer max-w-[54px] hover:max-w-[260px] overflow-hidden select-none hover:scale-105"
        title="Falar no WhatsApp com a equipe da clínica"
        aria-label="Agendar atendimento no WhatsApp"
      >
        <div className="relative flex items-center justify-center shrink-0">
          <svg
            className="h-6 w-6 fill-white shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-100 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
        </div>
        
        {/* Retractable expanding text on hover */}
        <span className="whitespace-nowrap font-black text-xs text-white opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[200px] group-hover:ml-2.5 transition-all duration-300 ease-in-out overflow-hidden">
          Agendar no WhatsApp
        </span>
      </a>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 p-3 rounded-full bg-white/95 hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-xl transition-all hover:scale-105 cursor-pointer backdrop-blur-sm"
          title="Voltar ao início da página"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 text-[#0f3e8f]" />
        </button>
      )}

      {/* MODALS */}

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        whatsappUrl={whatsappUrl}
      />

      {/* Blog Post Reader Modal */}
      <BlogPostModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        whatsappUrl={whatsappUrl}
      />

      {/* New Testimonial Submission Modal */}
      <NewTestimonialModal
        isOpen={isTestimonialModalOpen}
        onClose={() => setIsTestimonialModalOpen(false)}
        onTestimonialAdded={handleTestimonialAdded}
      />

      {/* Symptom Triage Modal */}
      <SymptomTriageModal
        isOpen={isTriageModalOpen}
        onClose={() => setIsTriageModalOpen(false)}
        onSelectService={(service) => setSelectedService(service)}
        whatsappUrl={whatsappUrl}
      />

    </div>
  );
};
