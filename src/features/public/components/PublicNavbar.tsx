import React, { useState } from 'react';
import { Menu, X, Lock, ShieldCheck } from 'lucide-react';
import { ClinicLogo } from '../../../components/common/ClinicLogo';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogin = () => {
    closeMenu();
    onOpenLogin();
  };

  const handleValidation = () => {
    closeMenu();
    onOpenValidationModal?.();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 h-24 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center gap-4">
        <ClinicLogo variant="header" />

        {/* Menu Desktop */}
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] items-center">
          <a href="#metodo" className="hover:text-red-600 transition-colors">
            O Método CSD
          </a>
          <a href="#depoimentos" className="hover:text-red-600 transition-colors">
            Casos Reais
          </a>
          <a href="#servicos" className="hover:text-red-600 transition-colors">
            Tratamentos
          </a>

          {onOpenValidationModal && (
            <button
              onClick={handleValidation}
              className="text-slate-500 font-black uppercase hover:text-red-600 transition-all cursor-pointer flex items-center gap-1.5"
              title="Validar Declaração de Comparecimento"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Validar
            </button>
          )}

          <button
            onClick={handleLogin}
            className="text-red-600 font-black uppercase hover:opacity-70 transition-all cursor-pointer flex items-center gap-1.5"
            title="Acesso Restrito ao Sistema"
          >
            <Lock className="h-3.5 w-3.5" />
            Acesso Restrito
          </button>
        </div>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block bg-red-600 text-white px-6 lg:px-8 py-3.5 rounded-full text-xs font-black hover:bg-slate-900 transition-all shadow-xl shadow-red-600/20 active:scale-95"
          >
            AGENDAR AVALIAÇÃO
          </a>

          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-white border-b border-slate-200 shadow-lg">
          <div className="px-6 py-5 flex flex-col gap-4 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            <a href="#metodo" onClick={closeMenu} className="hover:text-red-600 transition-colors">
              O Método CSD
            </a>
            <a href="#depoimentos" onClick={closeMenu} className="hover:text-red-600 transition-colors">
              Casos Reais
            </a>
            <a href="#servicos" onClick={closeMenu} className="hover:text-red-600 transition-colors">
              Tratamentos
            </a>

            {onOpenValidationModal && (
              <button
                onClick={handleValidation}
                className="text-left text-slate-600 flex items-center gap-2 hover:text-red-600 transition-colors cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                Validar Declaração
              </button>
            )}

            <button
              onClick={handleLogin}
              className="text-left text-red-600 flex items-center gap-2 cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              Acesso Restrito
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="bg-red-600 text-white text-center px-6 py-3.5 rounded-full hover:bg-slate-900 transition-all"
            >
              AGENDAR AVALIAÇÃO
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
