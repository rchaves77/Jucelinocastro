import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';

export const BlogSection: React.FC<any> = ({ onSelectPost }) => {
  return (
    <section id="blog" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-red-600 text-xs font-black uppercase tracking-[0.4em] mb-4 block">Educação e Ciência</span>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Entenda sua <span className="text-red-600">Coluna.</span></h2>
          </div>
          <button className="text-xs font-black text-slate-400 hover:text-red-600 transition-colors flex items-center gap-2 uppercase tracking-widest">
            Ver Todos os Artigos <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[1, 2].map((post, i) => (
            <motion.article 
              whileHover={{ scale: 1.02 }}
              key={i} 
              className="group cursor-pointer"
            >
              <div className="aspect-video bg-slate-100 rounded-[40px] overflow-hidden mb-8 relative">
                <img src={`https://images.unsplash.com/photo-1576091160550-217359f4ecf8?w=800&q=80&img=${i}`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Artigo" />
                <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 shadow-xl">Hérnia de Disco</div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-red-600 transition-colors leading-tight">Por que o Método CSD evita 95% das cirurgias de coluna?</h3>
              <p className="text-slate-500 leading-relaxed font-medium mb-6">Descubra como a descompressão mecânica de precisão atua na raiz nervosa sem a necessidade de procedimentos invasivos...</p>
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest">
                Ler Artigo Completo <ArrowRight size={14} className="text-red-600" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
