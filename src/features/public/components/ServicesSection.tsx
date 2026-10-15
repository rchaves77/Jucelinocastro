import React, { useState, useMemo } from 'react';
import {
  Search,
  Activity,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Stethoscope,
  Filter,
  Layers,
} from 'lucide-react';
import { SERVICES_LIST, ServiceItem, CLINIC_INFO } from '../data/servicesData';

const SERVICE_FALLBACK_IMAGES: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80',
  2: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80',
  3: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
  4: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80',
  5: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',
  6: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
  7: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  8: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
  9: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80',
  10: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=900&q=80',
};

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
  whatsappUrl: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  whatsappUrl,
}) => {
  const [activeTab, setActiveTab] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredServices = useMemo(() => {
    return SERVICES_LIST.filter((item) => {
      // Category filter
      const matchesCategory =
        activeTab === 'todos' ||
        (activeTab === 'coluna' && item.category === 'coluna') ||
        (activeTab === 'inferiores' && item.category === 'membros_inferiores') ||
        (activeTab === 'superiores' && item.category === 'membros_superiores') ||
        (activeTab === 'especialidades' && item.category === 'especialidades');

      // Search query filter matching name, shortDesc, or any captured pathology
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.shortDesc.toLowerCase().includes(query) ||
        item.capturedPathologies.some((p) => p.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <section id="servicos" className="py-16 md:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold text-[#0f3e8f]">
            <Activity className="h-4 w-4 text-[#dc2626]" />
            <span>Nossos Serviços Especializados</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Tratamentos Fisioterapêuticos Completos em Rio Branco/AC
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Abordagem integrada para coluna, articulações e tecidos moles. Encontre abaixo a fisioterapia específica para o seu diagnóstico ou utilize a busca rápida por patologia.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4 max-w-4xl mx-auto">
          
          {/* Live Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Digite sua condição (ex: Gonartrose, Túnel do carpo, Esporão, Hérnia de disco, Manguito, Lipedema...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-slate-50/70 text-sm text-slate-900 focus:bg-white focus:border-[#0f3e8f] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1 bg-slate-200 rounded-lg cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: 'todos', label: 'Todos os Serviços (10)' },
              { id: 'coluna', label: 'Coluna & Hérnia de Disco' },
              { id: 'inferiores', label: 'Joelho & Membros Inferiores' },
              { id: 'superiores', label: 'Ombro & Membros Superiores' },
              { id: 'especialidades', label: 'Artrose, Lipedema & Reabilitação' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0f3e8f] text-white shadow-md shadow-blue-900/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                {/* Service Image Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallback = SERVICE_FALLBACK_IMAGES[service.id] || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80';
                      if (target.src !== fallback) {
                        target.src = fallback;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Category & Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0f3e8f] text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                      #{service.id} {service.categoryLabel.split('&')[0]}
                    </span>
                    {service.badge && (
                      <span className="px-2.5 py-0.8 rounded-full bg-[#dc2626] text-white text-[10px] font-bold shadow-xs">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-base font-black text-white leading-tight drop-shadow-sm">
                      {service.name}
                    </h3>
                  </div>
                </div>

                {/* Service Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    
                    {/* Anatomical Target Indicator */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/80 border border-blue-200/60 text-[11px] font-bold text-[#0f3e8f]">
                      <Activity className="h-3.5 w-3.5 text-[#dc2626] shrink-0" />
                      <span className="truncate">Foco: {service.anatomicalFocus}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {service.shortDesc}
                    </p>

                    {/* Captured Pathologies Chips */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Lesões & Diagnósticos Atendidos:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {service.capturedPathologies.slice(0, 4).map((pathology, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.8 rounded-lg bg-slate-50 text-slate-700 text-[11px] font-semibold border border-slate-200"
                          >
                            {pathology}
                          </span>
                        ))}
                        {service.capturedPathologies.length > 4 && (
                          <span className="px-2 py-0.8 rounded-lg bg-blue-50 text-[#0f3e8f] text-[10px] font-bold">
                            +{service.capturedPathologies.length - 4} mais
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectService(service)}
                      className="flex items-center gap-1 text-xs font-bold text-[#0f3e8f] hover:text-[#0b2b68] transition-colors cursor-pointer group/btn"
                    >
                      <span>Ver Protocolo Completo</span>
                      <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    <a
                      href={`${whatsappUrl}&text=Olá Dr. Jucelino Castro, gostaria de saber mais sobre o tratamento para ${encodeURIComponent(service.name)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-[#0f3e8f] text-slate-700 hover:text-white transition-all"
                      title="Agendar este serviço"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <Search className="h-8 w-8 text-slate-400 mx-auto" />
            <div className="text-base font-bold text-slate-800">Nenhum serviço encontrado para "{searchQuery}"</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Tratamos dezenas de patologias articulares e neuromusculares. Fale diretamente com nossa equipe no WhatsApp para uma triagem personalizada.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('todos');
              }}
              className="px-4 py-2 rounded-xl bg-[#0f3e8f] text-white text-xs font-bold cursor-pointer"
            >
              Ver Todos os Serviços
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
