import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';

interface BlogSectionProps {
  onSelectPost: (post: BlogPost) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onSelectPost }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Coluna & Hérnia', 'Joelho & Membros Inferiores', 'Pés & Tornozelo', 'Ombro & Membros Superiores'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    return selectedCategory === 'all' || post.category === selectedCategory;
  });

  return (
    <section id="blog" className="py-16 md:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-1.5 text-xs font-bold text-[#0f3e8f]">
              <BookOpen className="h-4 w-4 text-[#dc2626]" />
              <span>Blog de Fisioterapia & Saúde da Coluna</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Artigos Educativos & Orientações Médicas
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Conteúdo baseado em evidências científicas e na prática clínica diária do Dr. Jucelino Castro e equipe no Acre.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0f3e8f] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todos os Artigos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('photo-1576091160399')) {
                        target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80';
                      }
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0f3e8f] text-[10px] font-black uppercase tracking-wider shadow-xs">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="h-3 w-3 text-[#dc2626]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-[#0f3e8f] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Author & Footer Action */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 font-medium truncate">
                  Por <strong className="text-slate-800">{post.author}</strong>
                </div>

                <span className="text-xs font-bold text-[#0f3e8f] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Ler artigo</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
