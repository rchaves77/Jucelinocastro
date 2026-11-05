import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Target, MessageCircle } from 'lucide-react';
import { SERVICES_LIST } from '../data/servicesData';
import { buildWhatsAppLink } from '../../../config/contact';

export const ServicesSection: React.FC<{
  onSelectService: (service: any) => void;
  whatsappUrl?: string;
}> = ({ onSelectService }) => {
  const [activeTab, setActiveTab] = useState<string>('todos');

  const safeServices = Array.isArray(SERVICES_LIST) ? SERVICES_LIST : [];

  const filteredServices = useMemo(() => {
    return safeServices.filter((item) => {
      return activeTab === 'todos' || item.category === activeTab;
    });
  }, [activeTab, safeServices]);

  const whatsappServices = buildWhatsAppLink(
    'Olá! Vi os protocolos CSD no site e gostaria de agendar uma avaliação.'
  );

  return (
    <section id="servicos" className="py-24 md:py-32 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-red-600 text-xs font-black uppercase tracking-[0.4em] mb-4 block">
            Especialidades Ouro
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">
            Protocolos <span className="text-red-600">CSD.</span>
          </h2>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {['todos', 'coluna', 'membros_inferiores', 'membros_superiores', 'especialidades'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <motion.div
              layout
              whileHover={{ y: -10 }}
              key={service.id}
              className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col"
            >
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                <img
  src={service.imageUrl}
  alt={service.name}
  className="w-full h-full object-cover md:grayscale md:group-hover:grayscale-0 transition-all duration-700"
/>
                <div className="absolute top-6 left-6 bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                  {service.categoryLabel}
                </div>
              </div>

              <div className="p-8 sm:p-10 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-widest mb-4">
                  <Target size={14} /> Foco: {service.anatomicalFocus}
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">
                  {service.name}
                </h3>

                <p className="text-slate-700 text-sm leading-relaxed mb-8 line-clamp-2">
                  {service.shortDesc}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto gap-3">
                  <button
                    onClick={() => onSelectService(service)}
                    className="text-xs font-black text-slate-900 hover:text-red-600 transition-colors uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                  >
                    Ver Protocolo <ChevronRight size={16} />
                  </button>

                  <a
                    href={whatsappServices}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Agendar ${service.name} no WhatsApp`}
                    className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center text-white hover:bg-emerald-700 transition-all shrink-0"
                  >
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <p className="text-center text-sm text-slate-600 py-12">
            Nenhum protocolo encontrado nesta categoria.
          </p>
        )}
      </div>
    </section>
  );
};
