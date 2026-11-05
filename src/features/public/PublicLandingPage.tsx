import React, { useEffect, useState } from 'react';
import { REAL_TESTIMONIALS } from './data/testimonialsData';
import { PublicNavbar } from './components/PublicNavbar';
import { HeroSection } from './components/HeroSection';
import { ManipulativeTreatmentsSection } from './components/ManipulativeTreatmentsSection';
import { MethodSection } from './components/MethodSection';
import { ServicesSection } from './components/ServicesSection';
import { PathologiesIndexSection } from './components/PathologiesIndexSection';
import { TeamSection } from './components/TeamSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { InsuranceAndContactSection } from './components/InsuranceAndContactSection';
import { PublicFooter } from './components/PublicFooter';
import { WhatsAppFloatButton } from '../../components/common/WhatsAppFloatButton';
import { CONTACT } from '../../config/contact';

interface PublicLandingPageProps {
  onOpenLogin: () => void;
  onOpenValidationModal?: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onOpenLogin,
  onOpenValidationModal,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Barra de progresso de leitura */}
      <div className="fixed top-0 left-0 right-0 z-[70] h-[3px] bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <PublicNavbar
        onOpenLogin={onOpenLogin}
        whatsappUrl={CONTACT.whatsappUrl}
        onOpenValidationModal={onOpenValidationModal}
      />

      <main>
        <HeroSection whatsappUrl={CONTACT.whatsappUrl} />
        <ManipulativeTreatmentsSection whatsappUrl={CONTACT.whatsappUrl} />
        <MethodSection />
        <ServicesSection onSelectService={() => {}} whatsappUrl={CONTACT.whatsappUrl} />
        <PathologiesIndexSection onSelectService={() => {}} />
        <TeamSection />
        <TestimonialsSection testimonials={REAL_TESTIMONIALS} />
        <InsuranceAndContactSection whatsappUrl={CONTACT.whatsappUrl} />
      </main>

      <PublicFooter onOpenLogin={onOpenLogin} whatsappUrl={CONTACT.whatsappUrl} />
      <WhatsAppFloatButton />
    </div>
  );
};
