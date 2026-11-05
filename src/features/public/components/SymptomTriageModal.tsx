import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Activity, Zap, ShieldAlert, Target } from 'lucide-react';

export const SymptomTriageModal: React.FC<any> = ({ isOpen, onClose, onSelectService, whatsappUrl }) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const areas = [
    { id: 'cervical', label: 'Cervical / Pescoço', icon: <Target className="text-red-500" /> },
    { id: 'lombar', label: 'Lombar / Ciático', icon: <Activity className="text-red-500" /> },
    { id: 'membros', label: 'Ombros / Braços', icon: <Zap className="text-red-500" /> },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
          
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <ShieldAlert size={14} /> Pré-Avaliação Digital CSD
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Onde você sente <span className="text-red-600">mais dor agora?</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {areas.map((area) => (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                className={`flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all ${
                  selectedArea === area.id ? 'bg-red-600 border-red-500 shadow-lg shadow-red-600/20' : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className={`${selectedArea === area.id ? 'text-white' : 'text-red-500'}`}>{area.icon}</div>
                <span className="text-xs font-bold text-white uppercase tracking-tighter text-center">{area.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedArea && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-6">
                <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-red-600 pl-6">
                  Sintomas detectados compatíveis com o **Método CSD**. Recomendamos uma avaliação biomecânica imediata para descompressão discal.
                </p>
                <a href={whatsappUrl} className="flex items-center justify-center gap-3 bg-white text-slate-900 w-full py-5 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all">
                  INICIAR TRATAMENTO AGORA <ArrowRight size={18} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
