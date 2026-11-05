import React from 'react';
import { motion } from 'motion/react';
import { Award, GraduationCap, ShieldCheck, Star } from 'lucide-react';

export const TeamSection: React.FC = () => {
  return (
    <section id="equipe" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="text-red-600 text-xs font-black uppercase tracking-[0.4em] mb-4 block">
            Corpo Clínico Especializado
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">
            A Autoridade por trás do <span className="text-red-600">CSD.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            <div className="aspect-[4/5] rounded-[40px] sm:rounded-[60px] overflow-hidden shadow-2xl border-8 border-slate-50 relative group">
              <img
                src="/jucelino_-_Copia.png"
                alt="Dr. Jucelino Castro — Fisioterapeuta"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-8 bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-2xl border border-slate-100"
            >
              <div className="flex gap-1 text-amber-400 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-900 font-black text-xl tracking-tighter">+15 Anos</p>
              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest leading-none">
                Experiência Clínica
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="lg:col-span-7 space-y-8"
          >
            <div>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tighter">
                Dr. Jucelino Castro
              </h3>
              <p className="text-red-600 font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                <Award size={16} /> Criador do Método Coluna Sem Dor (CSD)
              </p>
              <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium">
                Pioneiro no tratamento conservador de coluna no Acre. Ao longo de sua trajetória,
                desenvolveu o método <strong className="text-slate-900 font-black">CSD</strong>,
                unindo a precisão da Quiropraxia à ciência da Osteopatia para evitar que pacientes
                precisem passar por cirurgias invasivas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -4 }}
                className="p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all"
              >
                <GraduationCap className="text-red-600 mb-4" size={24} />
                <h4 className="font-bold text-slate-900 mb-2">Especialista em Coluna</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Formação avançada em diagnóstico mecânico e descompressão discal.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -4 }}
                className="p-6 bg-slate-50 rounded-3xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all"
              >
                <ShieldCheck className="text-red-600 mb-4" size={24} />
                <h4 className="font-bold text-slate-900 mb-2">Registro Ativo</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Membro do conselho regional de fisioterapia com atuação ética e científica.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
