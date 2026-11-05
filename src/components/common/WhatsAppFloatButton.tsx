import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { CONTACT, buildWhatsAppLink } from '../../config/contact';

export const WhatsAppFloatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const href = buildWhatsAppLink(
    'Olá! Vim pelo site e gostaria de agendar uma avaliação.'
  );

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex flex-col gap-2 mb-1">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200 shadow-xl px-4 py-3 hover:border-emerald-400 transition-all"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0">
              <MessageCircle className="h-4 w-4" />
            </span>
            <span className="text-left">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                WhatsApp
              </span>
              <span className="block text-xs font-bold text-slate-900">
                {CONTACT.whatsappDisplay}
              </span>
            </span>
          </a>

          <a
            href={CONTACT.landlineUrl}
            className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200 shadow-xl px-4 py-3 hover:border-slate-400 transition-all"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-white shrink-0">
              <Phone className="h-4 w-4" />
            </span>
            <span className="text-left">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Telefone fixo
              </span>
              <span className="block text-xs font-bold text-slate-900">
                {CONTACT.landlineDisplay}
              </span>
            </span>
          </a>
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Fechar opções de contato' : 'Abrir opções de contato'}
        className="flex items-center gap-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white pl-4 pr-5 py-3.5 shadow-2xl shadow-emerald-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          {!isOpen && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-40" />
          )}
          {isOpen ? (
            <X className="relative h-6 w-6" />
          ) : (
            <MessageCircle className="relative h-6 w-6" />
          )}
        </span>
        <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">
          {isOpen ? 'Fechar' : 'Falar no WhatsApp'}
        </span>
      </button>
    </div>
  );
};
