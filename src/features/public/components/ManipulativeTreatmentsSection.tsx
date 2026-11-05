import React from 'react';
import { motion } from 'motion/react';
import { Zap, Target, ShieldCheck } from 'lucide-react';

export const ManipulativeTreatmentsSection: React.FC<{ whatsappUrl?: string }> = () => {
  const steps = [
    {
      n: '01',
      t: 'Diagnóstico Mecânico CSD',
      d: 'Identificamos a origem exata da compressão nervosa através de testes de carga e mobilidade.',
      i: <Target />,
    },
    {
      n: '02',
      t: 'Descompressão de Precisão',
      d: 'Ajustes manuais milimétricos para libertar o disco intervertebral e restaurar o fluxo nervoso.',
      i: <Zap />,
    },
    {
      n: '03',
      t: 'Estabilização Dinâmica',
      d: 'Blindagem muscular da coluna para que você nunca mais volte a travar.',
      i: <ShieldCheck />,
    },
  ];

  return (
    <section id="metodo" className="py-24 md:py-32 bg-slate-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <div>
            <span className="text-rose-400 text-xs font-black uppercase tracking-[0.5em] mb-8 block">
              Inovação em Coluna
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-12 tracking-tighter leading-tight">
              O Método <br />
              <span className="text-rose-400 italic font-serif font-light">CSD</span>
            </h2>

            <div className="space-y-10">
              {steps.map((s, i) => (
                <motion.div whileHover={{ x: 10 }} key={i} className="flex gap-6 group">
                  <span className="text-5xl sm:text-6xl font-black text-slate-700 group-hover:text-rose-400 transition-colors shrink-0">
                    {s.n}
                  </span>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold mb-2 text-white">{s.t}</h4>
                    <p className="text-slate-300 leading-relaxed font-medium text-sm">{s.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] bg-slate-900 rounded-[60px] sm:rounded-[80px] overflow-hidden border-8 border-slate-900 shadow-2xl relative group">
               <img
  src="https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=900&q=80"
  alt="Tratamento de coluna — Método CSD"
  className="w-full h-full object-cover opacity-90 md:opacity-70 md:grayscale md:group-hover:opacity-100 md:group-hover:grayscale-0 transition-all duration-700"
/>  
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="absolute -bottom-8 -right-4 sm:-bottom-10 sm:-right-10 bg-rose-600 text-white p-8 sm:p-12 rounded-[40px] sm:rounded-[50px] shadow-2xl">
              <p className="text-3xl sm:text-4xl font-black leading-none tracking-tighter">
                Zero <br /> Cirurgia
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px] -z-0 pointer-events-none" />
    </section>
  );
};
