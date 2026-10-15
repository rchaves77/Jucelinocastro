import React, { useState } from 'react';
import { X, Image as ImageIcon, Upload, Link, Check, RefreshCw } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { ClinicLogo } from './ClinicLogo';

interface LogoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoUploaderModal: React.FC<LogoUploaderModalProps> = ({ isOpen, onClose }) => {
  const [logoUrl, setLogoUrl] = useState<string>(
    () => localStorage.getItem('jc_clinic_logo') || ''
  );
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (logoUrl.trim()) {
      localStorage.setItem('jc_clinic_logo', logoUrl.trim());
    } else {
      localStorage.removeItem('jc_clinic_logo');
    }
    window.dispatchEvent(new Event('storage'));
    setSuccessMsg('🎨 Logomarca oficial da clínica atualizada com sucesso!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1500);
  };

  const handleRestoreDefault = () => {
    setLogoUrl('');
    localStorage.removeItem('jc_clinic_logo');
    window.dispatchEvent(new Event('storage'));
    setSuccessMsg('Logomarca restaurada para o padrão oficial!');
    setTimeout(() => {
      setSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm md:text-base">
                Alterar Logomarca Oficial da Clínica
              </h3>
              <p className="text-[11px] text-slate-400">
                Envie o arquivo original da sua logo (PNG, JPG, SVG)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Current Preview */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pré-visualização do Topo & Documentos
            </span>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
              <ClinicLogo variant="header" />
            </div>
          </div>

          {/* Uploader Component */}
          <div className="space-y-3">
            <ImageUploader
              label="1. Fazer Upload de Imagem (do computador ou celular)"
              currentImageUrl={logoUrl}
              onImageUploaded={(url) => setLogoUrl(url)}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Link className="h-3.5 w-3.5 text-slate-400" />
                2. Ou cole a URL direta da Logomarca (Link de imagem)
              </label>
              <input
                type="text"
                placeholder="https://exemplo.com.br/minha-logo-oficial.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
            💡 <strong>Dica:</strong> Imagens em formato PNG com fundo transparente são recomendadas para melhor acabamento em todas as telas da aplicação.
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleRestoreDefault}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Restaurar Padrão</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Salvar Logomarca</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
