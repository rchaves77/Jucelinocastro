import React from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Share2,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  BookOpen,
} from 'lucide-react';
import { BlogPost } from '../data/blogData';
import { CLINIC_INFO } from '../data/servicesData';

interface BlogPostModalProps {
  post: BlogPost | null;
  onClose: () => void;
  whatsappUrl: string;
}

export const BlogPostModal: React.FC<BlogPostModalProps> = ({
  post,
  onClose,
  whatsappUrl,
}) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header Image */}
        <div className="relative h-52 sm:h-64 w-full shrink-0 bg-slate-900">
          <img
            src={post.imageUrl}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('photo-1576091160399')) {
                target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#dc2626] text-white text-[11px] font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {post.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-left">
          
          {/* Metadata & Author */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0f3e8f] text-white flex items-center justify-center font-bold text-xs">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-900">{post.author}</div>
                <div className="text-[10px] text-slate-500">{post.authorRole}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#dc2626]" />
                {post.readTime}
              </span>
            </div>
          </div>

          {/* Paragraphs */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {post.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Key Takeaways Box */}
          <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3">
            <h4 className="text-xs font-bold text-[#0f3e8f] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-[#dc2626]" />
              <span>Pontos Principais para Guardar:</span>
            </h4>
            <div className="space-y-2">
              {post.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-[#0f3e8f] shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Dúvidas sobre este assunto? Agende sua avaliação na Jucelino Castro Fisioterapia.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Fechar
            </button>

            <a
              href={`${whatsappUrl}&text=Olá Dr. Jucelino Castro, li o artigo sobre "${encodeURIComponent(post.title)}" e gostaria de agendar uma consulta.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0f3e8f] hover:bg-[#0c2f6d] text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="h-4 w-4 fill-white" />
              <span>Falar com o Especialista</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
