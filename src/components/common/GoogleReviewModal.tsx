import React, { useState } from 'react';
import { X, Star, Copy, Check, Share2, QrCode, ExternalLink, MessageCircle } from 'lucide-react';

interface GoogleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GOOGLE_REVIEW_LINK = 'https://maps.app.goo.gl/TmRZvfBndpP6XB3A6';

export const GoogleReviewModal: React.FC<GoogleReviewModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(GOOGLE_REVIEW_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Tudo bem? Gostaria de saber como foi seu atendimento e tratamento na Jucelino Castro Fisioterapia. 🌟\n\nPoderia avaliar nosso atendimento no Google?\nLink: ${GOOGLE_REVIEW_LINK}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 text-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Star className="h-6 w-6 fill-amber-400 stroke-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Avaliações no Google</h2>
              <p className="text-xs text-slate-400">Compartilhar link de avaliação com os clientes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            As avaliações geram confiança e ajudam a <strong>Jucelino Castro Fisioterapia</strong> a se destacar na Pesquisa do Google e no Google Maps!
          </p>

          {/* Link Box */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Link direto para a Avaliação:</label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 p-2">
              <input
                type="text"
                readOnly
                value={GOOGLE_REVIEW_LINK}
                className="w-full bg-transparent px-2 text-xs font-mono text-emerald-400 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 p-2.5 font-bold text-emerald-400 hover:bg-emerald-600/30 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Enviar via WhatsApp</span>
            </a>

            <button
              onClick={() => setShowQr(!showQr)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-slate-800 border border-slate-700 p-2.5 font-bold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <QrCode className="h-4 w-4 text-amber-400" />
              <span>{showQr ? 'Ocultar QR Code' : 'Exibir QR Code'}</span>
            </button>
          </div>

          {/* QR Code Preview */}
          {showQr && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-2 text-slate-900 animate-fade-in">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(GOOGLE_REVIEW_LINK)}`}
                alt="QR Code Google Review"
                className="mx-auto h-36 w-36 rounded-xl border p-1"
              />
              <p className="text-[11px] text-slate-600 font-semibold">
                Escaneie com a câmera do celular para avaliar no Google
              </p>
            </div>
          )}

          {/* Direct Link Open Button */}
          <div className="pt-2 text-center">
            <a
              href={GOOGLE_REVIEW_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline"
            >
              <span>Testar link no navegador</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
