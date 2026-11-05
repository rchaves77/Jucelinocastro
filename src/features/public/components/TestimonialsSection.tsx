import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Globe,
  Quote,
  BadgeCheck,
  MessageCircle,
} from 'lucide-react';
import { Testimonial } from '../data/testimonialsData';
import { CONTACT, buildWhatsAppLink } from '../../../config/contact';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onOpenNewTestimonialModal?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials = [],
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    safeTestimonials.forEach((t) => {
      if (t.role) set.add(t.role);
    });
    return ['all', ...Array.from(set)];
  }, [safeTestimonials]);

  const filtered = useMemo(() => {
    if (filterCategory === 'all') return safeTestimonials;
    return safeTestimonials.filter((t) => t.role === filterCategory);
  }, [safeTestimonials, filterCategory]);

  const totalReviews = safeTestimonials.length;
  const averageStars =
    totalReviews > 0
      ? (safeTestimonials.reduce((acc, t) => acc + (t.stars || 0), 0) / totalReviews).toFixed(1)
      : '5.0';

  const whatsappFromTestimonials = buildWhatsAppLink(
    'Olá! Vi os depoimentos no site e gostaria de agendar uma avaliação.'
  );

  return (
    <section id="depoimentos" className="py-16 md:py-24 bg-slate-50/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" />
                <span>Conectado ao Google Maps</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
                Jucelino Castro Fisioterapia
                <span className="text-amber-500 flex items-center text-lg font-bold gap-1 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                  <Star className="h-4 w-4 fill-amber-400" />
                  {averageStars} (20+ Avaliações Reais)
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 flex items-center gap-1.5 font-medium">
                <MapPin className="h-4 w-4 text-[#0f3e8f] shrink-0" />
                {CONTACT.address}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <a
                href={whatsappFromTestimonials}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/25 active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Agendar no WhatsApp</span>
              </a>

              <a
                href={CONTACT.landlineUrl}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900 active:border-slate-900 active:text-slate-900 text-xs font-bold transition-all"
              >
                <span>{CONTACT.landlineDisplay}</span>
              </a>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center gap-2 justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#0f3e8f] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 active:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'Todas as Avaliações' : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.5) }}
              whileHover={{ y: -6 }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg active:shadow-lg transition-all flex flex-col justify-between space-y-4 text-left relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(item.stars || 5)].map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    <Globe className="h-3 w-3 text-blue-600" />
                    Google Review
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {item.isLocalGuide && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      <BadgeCheck className="h-3 w-3 text-orange-600" />
                      Local Guide
                    </span>
                  )}

                  {typeof item.reviewCount === 'number' && item.reviewCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {item.reviewCount} {item.reviewCount === 1 ? 'avaliação' : 'avaliações'}
                    </span>
                  )}

                  {typeof item.photoCount === 'number' && item.photoCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {item.photoCount} {item.photoCount === 1 ? 'foto' : 'fotos'}
                    </span>
                  )}
                </div>

                {item.role && (
                  <div className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-[#0f3e8f] text-[11px] font-bold border border-blue-100">
                    {item.role}
                  </div>
                )}

                <div className="relative">
                  <Quote className="absolute -top-1 -left-1 h-5 w-5 text-slate-200" />
                  <p className="relative pl-6 text-sm sm:text-[15px] text-slate-800 leading-relaxed font-medium">
                    {item.content}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{item.author}</p>
                    {item.date && (
                      <p className="text-[10px] text-slate-500 font-medium">{item.date}</p>
                    )}
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                </div>

                <a
                  href={whatsappFromTestimonials}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 active:bg-emerald-600 text-emerald-700 hover:text-white active:text-white border border-emerald-200 hover:border-emerald-600 active:border-emerald-600 text-[11px] font-black uppercase tracking-wider transition-all active:scale-95"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Quero esse resultado</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-600 py-8">
            Nenhuma avaliação encontrada nesta categoria.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-center space-y-5"
        >
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pronto para começar seu tratamento?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Fale agora com a nossa equipe pelo WhatsApp e agende sua avaliação com o Dr. Jucelino
            Castro.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={whatsappFromTestimonials}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-400 text-slate-950 text-sm font-black uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/25 active:scale-95 w-full sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Agendar pelo WhatsApp</span>
            </a>

            <a
              href={CONTACT.landlineUrl}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white active:bg-slate-800 active:text-white text-sm font-bold transition-all w-full sm:w-auto"
            >
              <span>{CONTACT.landlineDisplay}</span>
            </a>
          </div>

          <a
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-200 active:text-slate-200 transition-colors pt-2"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Ver todas as avaliações no Google</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
