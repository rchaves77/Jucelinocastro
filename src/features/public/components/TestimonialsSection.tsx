import React, { useState } from 'react';
import {
  Star,
  Quote,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Globe,
  MessageSquare,
} from 'lucide-react';
import { Testimonial } from '../data/testimonialsData';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onOpenNewTestimonialModal?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'Coluna', 'Joelho', 'Ombro', 'Pés', 'Reabilitação'];

  const filtered = testimonials.filter((t) => {
    return filterCategory === 'all' || t.serviceCategory.toLowerCase() === filterCategory.toLowerCase();
  });

  return (
    <section id="depoimentos" className="py-16 md:py-24 bg-slate-50/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Google Business Profile Connected Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Conectado ao Google Maps (maps.app.goo.gl/TmRZvfBndpP6XB3A6)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Jucelino Castro Fisioterapia
              <span className="text-amber-500 flex items-center text-lg font-bold gap-1 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                <Star className="h-4 w-4 fill-amber-400" /> 5.0 (20+ Avaliações Reais)
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 font-medium">
              <MapPin className="h-4 w-4 text-[#0f3e8f] shrink-0" />
              Rua Quintino Bocaiuva, 1848 - Bosque, Rio Branco - AC, 69900-670
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/TmRZvfBndpP6XB3A6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
          >
            <Globe className="h-4 w-4 text-emerald-400" />
            <span>Ver no Google Maps</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#0f3e8f] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'Todas as Avaliações Reais' : `Casos de ${cat}`}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 text-left relative"
            >
              <div className="space-y-3">
                {/* Rating & Verified */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    <Globe className="h-3 w-3 text-blue-600" />
                    Google Review 5.0 ★
                  </span>
                </div>

                {/* Condition Tag */}
                <div className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-[#0f3e8f] text-[11px] font-bold border border-blue-100">
                  {item.condition}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed italic">
                  "{item.text}"
                </p>

                {/* Owner Reply if available */}
                {item.ownerReply && (
                  <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1">
                    <div className="font-bold text-[#0f3e8f] flex items-center gap-1.5 text-[11px]">
                      <MessageSquare className="h-3.5 w-3.5 text-[#0f3e8f]" />
                      <span>Resposta do Proprietário (Jucelino Castro):</span>
                    </div>
                    <p className="leading-relaxed text-slate-600 italic">
                      "{item.ownerReply}"
                    </p>
                  </div>
                )}
              </div>

              {/* Patient Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0f3e8f] text-white flex items-center justify-center font-black text-xs">
                    {item.avatarInitial}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] text-slate-500">{item.city} • {item.date}</div>
                  </div>
                </div>

                {item.externalUrl ? (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver no Google Maps"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-[#0f3e8f]" />
                  </a>
                ) : (
                  <Quote className="h-6 w-6 text-slate-200" />
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
