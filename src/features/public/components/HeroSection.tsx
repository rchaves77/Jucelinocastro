import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, animate } from 'motion/react';
import { MessageCircle, Phone, ShieldCheck, Star, Users } from 'lucide-react';
import { CONTACT, HOURS, buildWhatsAppLink } from '../../../config/contact';

/** Contador animado que sobe de 0 até o valor final quando entra na tela. */
const AnimatedCounter: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, to, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (latest) => setValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [isInView, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
};

export const HeroSection: React.FC<{ whatsappUrl?: string }> = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax: a imagem desce mais devagar que o scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);

  const whatsappHero = buildWhatsAppLink(
    'Olá! Vim pelo site e gostaria de agendar uma avaliação com o Dr. Jucelino Castro.'
  );

  return (
    <section
      ref={sectionRef}
      className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-white"
    >
      {/* Imagem de fundo com parallax — sem filtro apagado */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <img
          src="/jucelino_-_Copia.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-[70%_center] opacity-100"
        />
      </motion.div>

      {/* Overlay apenas do lado do texto, para garantir leitura */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/90 to-white/30 md:via-white/80 md:to-transparent pointer-events-none" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="max-w-7xl mx-auto px-6 relative z-10 will-change-transform"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="h-[2px] w-12 bg-rose-600"></span>
            <span className="text-rose-600 text-xs font-black uppercase tracking-[0.4em]">
              Método CSD • Por Dr. Jucelino Castro
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-[100px] font-black text-slate-900 leading-[0.88] tracking-tighter mb-8">
            Coluna <br />
            <span className="text-rose-600 font-serif italic font-light tracking-normal text-4xl sm:text-5xl md:text-[80px]">
              Sem Dor.
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-700 leading-relaxed mb-10 max-w-2xl font-medium">
            O fim da sua limitação física começa com o diagnóstico mecânico de precisão.{' '}
            <strong className="text-slate-900 font-black">Tratamento 100% conservador.</strong>
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">5.0 no Google</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Users className="h-4 w-4 text-rose-600" />
              +<AnimatedCounter to={43} /> mil pacientes reabilitados
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <ShieldCheck className="h-4 w-4 text-rose-600" />
              CREFITO ativo
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href={whatsappHero}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 text-white px-8 py-5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-2xl shadow-emerald-600/30 active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Agendar no WhatsApp</span>
            </a>

            <a
              href={CONTACT.landlineUrl}
              className="inline-flex items-center justify-center gap-2 px-6 py-5 rounded-2xl border-2 border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900 active:border-slate-900 active:text-slate-900 text-sm font-bold transition-all"
            >
              <Phone className="h-4 w-4" />
              <span>{CONTACT.landlineDisplay}</span>
            </a>
          </div>

          <p className="mt-5 text-xs text-slate-500 font-medium">
            Resposta em poucos minutos no horário comercial • {HOURS.full}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};
