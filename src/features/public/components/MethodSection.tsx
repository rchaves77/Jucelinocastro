import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Target, Activity, MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '../../../config/contact';

export const MethodSection: React.FC = () => {
  const whatsappMethod = buildWhatsAppLink(
    'Olá! Vi o site e quero saber mais sobre o Método CSD (Coluna Sem Dor).'
  );

  return (
    <section id="metodo" className="py-24 md:py-32 bg-slate-950 overflow-hidden relative">
      {/* Brilho decorativo de fundo */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Logo do CSD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="rounded-[32px] sm:rounded-[48px] overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src="/csd-logo.png"
                alt="Método CSD — Coluna Sem Dor, por Dr. Jucelino Castro"
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Texto explicativo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-8 order-1 lg:order-2"
          >
            <div>
              <span className="text-rose-500 text-xs font-black uppercase tracking-[0.4em] mb-4 block">
                Metodologia Exclusiva
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-6 leading-[1.05]">
                O que é o <span className="text-rose-500">CSD?</span>
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed">
                Coluna Sem Dor é um protocolo de tratamento conservador que une diagnóstico
                mecânico de precisão, quiropraxia e osteopatia para eliminar a dor sem cirurgia.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-rose-600/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <Target className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Diagnóstico de precisão</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Identificamos a causa real da dor, não apenas o sintoma.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-rose-600/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Tratamento 100% conservador</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Técnicas manuais e reabilitação, sem procedimentos invasivos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-rose-600/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Resultado comprovado</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Mais de 43 mil pacientes reabilitados com o método.
                  </p>
                </div>
              </div>
            </div>

            <a
              href={whatsappMethod}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 text-white text-sm font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/25 active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Quero ser avaliado</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
