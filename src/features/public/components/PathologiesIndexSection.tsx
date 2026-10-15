import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { ALL_PATHOLOGIES_INDEX, SERVICES_LIST, ServiceItem, CLINIC_INFO } from '../data/servicesData';

interface PathologiesIndexSectionProps {
  onSelectService: (service: ServiceItem) => void;
  whatsappUrl: string;
}

export const PathologiesIndexSection: React.FC<PathologiesIndexSectionProps> = ({
  onSelectService,
  whatsappUrl,
}) => {
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(ALL_PATHOLOGIES_INDEX.map((p) => p.category)));
    return ['all', ...cats];
  }, []);

  const filteredPathologies = useMemo(() => {
    return ALL_PATHOLOGIES_INDEX.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesQuery =
        !filterQuery || item.name.toLowerCase().includes(filterQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, filterQuery]);

  const handleOpenPathologyService = (serviceId: number) => {
    const found = SERVICES_LIST.find((s) => s.id === serviceId);
    if (found) {
      onSelectService(found);
    }
  };

  return (
    <section id="patologias" className="py-16 md:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold text-[#0f3e8f]">
            <BookOpen className="h-4 w-4 text-[#dc2626]" />
            <span>Índice Clínico Completo</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Guia de Patologias & Condições Tratadas
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            Consulte a lista abrangente de diagnósticos ortopédicos, neurológicos e articulares que tratamos com fisioterapia conservadora em Rio Branco/AC.
          </p>
        </div>

        {/* Search & Categories Bar */}
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtrar por nome de patologia (ex: gonartrose, lipedema, espondilose, tíbia, menisco...)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-[#0f3e8f] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0f3e8f] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todas as Categorias' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Pathologies Pills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPathologies.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleOpenPathologyService(item.serviceId)}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 text-[#dc2626] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#0f3e8f]">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{item.category}</div>
                </div>
              </div>

              <span className="text-[10px] font-bold text-[#0f3e8f] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                <span>Ver</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Não encontrou seu diagnóstico exato listado acima?</span>
          <a
            href={`${whatsappUrl}&text=Olá Dr. Jucelino Castro, tenho uma dúvida sobre meu diagnóstico de fisioterapia.`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#0f3e8f] hover:underline flex items-center gap-1"
          >
            <span>Consultar equipe via WhatsApp</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
