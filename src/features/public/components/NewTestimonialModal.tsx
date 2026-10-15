import React, { useState } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  Heart,
  Sparkles,
  Send,
  MessageSquare,
} from 'lucide-react';
import { saveNewTestimonial, Testimonial } from '../data/testimonialsData';

interface NewTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestimonialAdded: (testimonial: Testimonial) => void;
}

export const NewTestimonialModal: React.FC<NewTestimonialModalProps> = ({
  isOpen,
  onClose,
  onTestimonialAdded,
}) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('Rio Branco - AC');
  const [condition, setCondition] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Coluna');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !condition.trim() || !text.trim()) return;

    const created = saveNewTestimonial({
      name: name.trim(),
      city: city.trim() || 'Rio Branco - AC',
      condition: condition.trim(),
      serviceCategory,
      rating,
      text: text.trim(),
    });

    onTestimonialAdded(created);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setCondition('');
      setText('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 p-6 sm:p-8 text-left">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Muito obrigado pelo seu depoimento!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Seu relato foi registrado com sucesso e já está disponível para inspirar outros pacientes que buscam reabilitação.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0f3e8f] text-[11px] font-bold border border-blue-200">
                Histórias de Sucesso
              </span>
              <h3 className="text-xl font-black text-slate-900 pt-1">
                Compartilhe Sua Experiência na Jucelino Castro Fisioterapia
              </h3>
              <p className="text-xs text-slate-500">
                Seu relato ajuda novos pacientes a entenderem a eficácia do tratamento conservador.
              </p>
            </div>

            {/* Rating Stars */}
            <div className="space-y-1 pt-1">
              <label className="text-xs font-bold text-slate-700">Sua Avaliação Geral:</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Seu Nome Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Mendes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-[#0f3e8f] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Cidade / Estado:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rio Branco - AC"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-[#0f3e8f] focus:outline-none"
                />
              </div>
            </div>

            {/* Condition & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Condição / Diagnóstico Tratado:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hérnia de Disco L5-S1"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-[#0f3e8f] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Categoria:</label>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-[#0f3e8f] focus:outline-none"
                >
                  <option value="Coluna">Coluna & Hérnia de Disco</option>
                  <option value="Joelho">Joelho & Gonartrose</option>
                  <option value="Ombro">Ombro & Manguito Rotador</option>
                  <option value="Pés">Pés & Fascite Plantar</option>
                  <option value="Reabilitação">Reabilitação Pós-Fratura</option>
                  <option value="Especialidades">Outras Especialidades</option>
                </select>
              </div>
            </div>

            {/* Testimonial Text */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Seu Relato (Como você estava e como está hoje?):</label>
              <textarea
                required
                rows={4}
                placeholder="Conte sobre como a fisioterapia com o Dr. Jucelino e equipe te ajudou a recuperar seus movimentos e viver sem dor..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-[#0f3e8f] focus:outline-none leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0f3e8f] hover:bg-[#0c2f6d] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Publicar Depoimento</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
