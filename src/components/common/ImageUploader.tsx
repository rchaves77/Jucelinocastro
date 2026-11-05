import React, { useState } from 'react';
import { Camera, Upload, Link, Check, User as UserIcon } from 'lucide-react';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  label?: string;
  className?: string;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594824813566-88855ce78905?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageChange,
  label = 'Foto de Perfil',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState(currentImageUrl || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem é muito grande. Por favor escolha uma foto até 5MB.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageChange(base64String);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      alert('Erro ao carregar a imagem.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim());
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-200 flex items-center justify-between mb-1">
          <span>{label}</span>
          <span className="text-[10px] text-emerald-400 font-semibold">100% Gratuito & Direto</span>
        </label>
      )}

      <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
        {/* Preview Container */}
        <div className="relative group shrink-0">
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="Preview"
              className="h-16 w-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
            />
          ) : (
            <div className="h-16 w-16 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
              <UserIcon className="h-6 w-6" />
            </div>
          )}
          {isProcessing && (
            <div className="absolute inset-0 rounded-2xl bg-slate-950/70 flex items-center justify-center">
              <span className="h-4 w-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Tab Controls & Inputs */}
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="h-3 w-3" />
              <span>Arquivo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                activeTab === 'url'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Link className="h-3 w-3" />
              <span>Link URL</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                activeTab === 'presets'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="h-3 w-3" />
              <span>Modelos</span>
            </button>
          </div>

          {/* Mode 1: File Upload */}
          {activeTab === 'upload' && (
            <div>
              <label className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-dashed border-slate-700 bg-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 cursor-pointer transition-colors">
                <Upload className="h-3.5 w-3.5 text-emerald-400" />
                <span>Escolher foto do computador / celular</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Mode 2: Link URL */}
          {activeTab === 'url' && (
            <div className="flex gap-1.5">
              <input
                type="url"
                placeholder="https://exemplo.com/foto.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="rounded-xl bg-emerald-500 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                OK
              </button>
            </div>
          )}

          {/* Mode 3: Presets */}
          {activeTab === 'presets' && (
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              {PRESET_AVATARS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onImageChange(preset)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 shrink-0 ${
                    currentImageUrl === preset ? 'border-emerald-400 ring-2 ring-emerald-500/40' : 'border-slate-700'
                  }`}
                >
                  <img src={preset} alt={`Avatar ${idx}`} className="h-8 w-8 object-cover" />
                  {currentImageUrl === preset && (
                    <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center text-white">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
