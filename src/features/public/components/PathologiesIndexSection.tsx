import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { ALL_PATHOLOGIES_INDEX } from '../data/servicesData';

const INITIAL_VISIBLE = 8;

export const PathologiesIndexSection: React.FC<{ onSelectService?: (s: any) => void }> = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const safePathologies = Array.isArray(ALL_PATHOLOGIES_INDEX) ? ALL_PATHOLOGIES_INDEX : [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return safePathologies;
    return safePathologies.filter((p) => p?.name?.toLowerCase().includes(q));
  }, [safePathologies, query]);

  const isSearching = query.trim().length > 0;
  const visible = isSearching || isExpanded ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const hiddenCount = filtered.length - visible.length;

  return (
    <section id="patologias" className="py-24 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8"
        >
          <div className="text-center md:text-left">
            <span className="text-red-600 text-xs font-black uppercase tracking-[0.4em] mb-4 block">
              A-Z Patologias
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              O que estamos <br />
              <span className="text-red-600">tratando hoje?</span>
            </h2>
          </div>

          <div className="relative w-full max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={query}
              placeholder="Buscar sua dor ou diagnóstico..."
              className="w-full bg-white border border-slate-300 rounded-2xl py-5 pl-16 pr-6 text-base font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-400 transition-all shadow-sm"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visible.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 group cursor-pointer hover:border-red-400 hover:shadow-md active:border-red-400 active:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-2 h-2 bg-red-600 rounded-full shrink-0" />
                <span className="text-sm sm:text-[15px] font-bold text-slate-800 group-hover:text-slate-950 group-active:text-slate-950 transition-colors leading-snug">
                  {item.name}
                </span>
              </div>
              <ShieldCheck
                size={16}
                className="text-slate-300 group-hover:text-red-600 group-active:text-red-600 transition-colors shrink-0"
              />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-slate-600 py-10">
            Nenhuma patologia encontrada para "{query}".
          </p>
        )}

        {!isSearching && filtered.length > INITIAL_VISIBLE && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white active:bg-slate-900 active:text-white text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Ver todas as {filtered.length} patologias tratadas
                </>
              )}
            </button>
          </div>
        )}

        {!isSearching && !isExpanded && hiddenCount > 0 && (
          <p className="text-center text-xs text-slate-500 mt-4 font-medium">
            +{hiddenCount} patologias tratadas nesta clínica
          </p>
        )}
      </div>
    </section>
  );
};
