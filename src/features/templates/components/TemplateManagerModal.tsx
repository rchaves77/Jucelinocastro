import React, { useState, useEffect } from 'react';
import { EvolutionTemplate } from '../../../types';
import { Sparkles, Plus, Trash2, Edit3, X, Check, FileText, Search, Bookmark, Tag, Copy, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface TemplateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: EvolutionTemplate[];
  onAddTemplate: (tpl: Omit<EvolutionTemplate, 'id' | 'createdAt'>) => void;
  onUpdateTemplate: (id: string, tpl: Partial<EvolutionTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
  onSelectTemplate?: (tpl: EvolutionTemplate) => void;
  currentUserName?: string;
}

type FontSizeOption = 'normal' | 'large' | 'xlarge';

export const TemplateManagerModal: React.FC<TemplateManagerModalProps> = ({
  isOpen,
  onClose,
  templates,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onSelectTemplate,
  currentUserName = 'Fisioterapeuta',
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [search, setSearch] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<EvolutionTemplate | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Font Size Preference (saved in localStorage)
  const [fontSize, setFontSize] = useState<FontSizeOption>(() => {
    return (localStorage.getItem('jc_template_font_size') as FontSizeOption) || 'large';
  });

  const handleFontSizeChange = (size: FontSizeOption) => {
    setFontSize(size);
    localStorage.setItem('jc_template_font_size', size);
  };

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Ortopedia');
  const [description, setDescription] = useState('');
  const [proceduresInput, setProceduresInput] = useState('');
  const [painBefore, setPainBefore] = useState(6);
  const [painAfter, setPainAfter] = useState(2);
  const [goals, setGoals] = useState('');

  if (!isOpen) return null;

  const handleOpenCreate = (tplToEdit?: EvolutionTemplate) => {
    if (tplToEdit) {
      setEditingTemplate(tplToEdit);
      setTitle(tplToEdit.title);
      setCategory(tplToEdit.category);
      setDescription(tplToEdit.description);
      setProceduresInput(tplToEdit.procedures.join(', '));
      setPainBefore(tplToEdit.painScaleBefore);
      setPainAfter(tplToEdit.painScaleAfter);
      setGoals(tplToEdit.nextSessionGoals);
    } else {
      setEditingTemplate(null);
      setTitle('');
      setCategory('Ortopedia');
      setDescription('');
      setProceduresInput('Cinesioterapia, Analgesia, Mobilização');
      setPainBefore(6);
      setPainAfter(2);
      setGoals('Progresso nos objetivos fisioterapêuticos.');
    }
    setActiveTab('create');
  };

  const handleDuplicate = (tpl: EvolutionTemplate) => {
    setEditingTemplate(null);
    setTitle(`${tpl.title} (Cópia Personalizada)`);
    setCategory(tpl.category);
    setDescription(tpl.description);
    setProceduresInput(tpl.procedures.join(', '));
    setPainBefore(tpl.painScaleBefore);
    setPainAfter(tpl.painScaleAfter);
    setGoals(tpl.nextSessionGoals);
    setActiveTab('create');
    setFeedbackMsg('📝 Modelo duplicado! Edite os detalhes abaixo e clique em Salvar.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Por favor, informe o Título e a Descrição do Template.');
      return;
    }

    const proceduresArr = proceduresInput
      ? proceduresInput.split(',').map((p) => p.trim()).filter(Boolean)
      : ['Fisioterapia Integrada'];

    if (editingTemplate) {
      onUpdateTemplate(editingTemplate.id, {
        title: title.trim(),
        category,
        description: description.trim(),
        procedures: proceduresArr,
        painScaleBefore: painBefore,
        painScaleAfter: painAfter,
        nextSessionGoals: goals.trim(),
      });
      setFeedbackMsg('✅ Modelo personalizado e atualizado com sucesso!');
    } else {
      onAddTemplate({
        title: title.trim(),
        category,
        description: description.trim(),
        procedures: proceduresArr,
        painScaleBefore: painBefore,
        painScaleAfter: painAfter,
        nextSessionGoals: goals.trim(),
        createdBy: currentUserName,
      });
      setFeedbackMsg('🎉 Novo modelo salvo na sua lista de templates!');
    }

    setTimeout(() => setFeedbackMsg(''), 3000);
    setActiveTab('list');
    setEditingTemplate(null);
  };

  const filteredTemplates = templates.filter((t) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term)
    );
  });

  // Dynamic Font Size CSS Classes
  const descriptionFontSize = {
    normal: 'text-sm leading-relaxed',
    large: 'text-base leading-relaxed font-normal',
    xlarge: 'text-lg leading-relaxed font-normal',
  }[fontSize];

  const titleFontSize = {
    normal: 'text-base font-bold',
    large: 'text-lg font-extrabold',
    xlarge: 'text-xl font-black',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-5 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-4 sm:p-6 shadow-2xl text-slate-100 space-y-4 relative max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
              <Sparkles className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2 flex-wrap">
                Templates & Modelos de Evolução
                <span className="rounded-full bg-purple-500/20 px-3 py-0.5 text-xs font-extrabold text-purple-300 border border-purple-500/30">
                  {templates.length} Salvo{templates.length !== 1 ? 's' : ''}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Personalize seus modelos com letras ampliadas para facilitar a leitura diária
              </p>
            </div>
          </div>

          {/* Font Size Controls */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
                <ZoomIn className="h-3.5 w-3.5 text-purple-400" /> Fonte:
              </span>
              <button
                type="button"
                onClick={() => handleFontSizeChange('normal')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  fontSize === 'normal'
                    ? 'bg-purple-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tamanho da letra: Normal (14px)"
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('large')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  fontSize === 'large'
                    ? 'bg-purple-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tamanho da letra: Grande (16px)"
              >
                Grande
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('xlarge')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  fontSize === 'xlarge'
                    ? 'bg-purple-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tamanho da letra: Extra Grande (18px)"
              >
                Extra Grande
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in shrink-0">
            <Sparkles className="h-4 w-4 shrink-0 text-purple-400" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Action Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'list'
                  ? 'bg-purple-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span>Modelos Salvos ({templates.length})</span>
            </button>

            <button
              onClick={() => handleOpenCreate()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'create'
                  ? 'bg-purple-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>+ Criar Novo Template</span>
            </button>
          </div>

          {activeTab === 'list' && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar modelo salvo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-purple-500 focus:outline-none placeholder:text-slate-500"
              />
            </div>
          )}
        </div>

        {/* TAB 1: LIST & CUSTOMIZE SAVED TEMPLATES */}
        {activeTab === 'list' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {filteredTemplates.length === 0 ? (
              <div className="py-16 text-center space-y-3 border border-dashed border-slate-800 rounded-3xl bg-slate-950/40">
                <FileText className="h-10 w-10 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">Nenhum template encontrado com essa busca.</p>
                <button
                  onClick={() => handleOpenCreate()}
                  className="rounded-xl bg-purple-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-purple-400 transition-colors"
                >
                  Criar Primeiro Modelo Personalizado
                </button>
              </div>
            ) : (
              filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-5 space-y-3 hover:border-purple-500/50 transition-all shadow-lg"
                >
                  {/* Top Bar of Template Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-extrabold text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" /> {tpl.category}
                      </span>
                      <h3 className={`${titleFontSize} text-slate-100`}>{tpl.title}</h3>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                      <span>
                        EVA: <strong className="text-emerald-400 font-bold">{tpl.painScaleBefore} ➔ {tpl.painScaleAfter}</strong>
                      </span>
                      {tpl.createdBy && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">Por: <strong className="text-slate-300">{tpl.createdBy}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Main Evolution Text - AMPLIFIED FONT */}
                  <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-slate-100 font-medium">
                    <p className={`${descriptionFontSize} whitespace-pre-wrap`}>
                      {tpl.description}
                    </p>

                    {tpl.nextSessionGoals && (
                      <div className="mt-3 pt-2 border-t border-slate-800/80 text-xs text-purple-300 font-semibold flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                        <span>Metas: {tpl.nextSessionGoals}</span>
                      </div>
                    )}
                  </div>

                  {/* Procedures Tags & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-slate-400">Procedimentos:</span>
                      {tpl.procedures.map((proc, idx) => (
                        <span key={idx} className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 border border-slate-700/60">
                          {proc}
                        </span>
                      ))}
                    </div>

                    {/* Button Group to Customize, Duplicate, Delete, Use */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        onClick={() => handleOpenCreate(tpl)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-purple-300 hover:bg-slate-700 hover:text-purple-200 transition-colors cursor-pointer"
                        title="Personalizar e alterar este modelo salvo"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Personalizar</span>
                      </button>

                      <button
                        onClick={() => handleDuplicate(tpl)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Duplicar modelo para criar uma variação personalizada"
                      >
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                        <span>Duplicar</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Deseja excluir permanentemente o modelo "${tpl.title}"?`)) {
                            onDeleteTemplate(tpl.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        title="Excluir Modelo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      {onSelectTemplate && (
                        <button
                          onClick={() => {
                            onSelectTemplate(tpl);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 rounded-xl bg-purple-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-purple-400 transition-all shadow-md cursor-pointer ml-1"
                        >
                          <Check className="h-4 w-4 stroke-[3]" />
                          <span>Usar no Prontuário</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: CREATE OR EDIT / CUSTOMIZE FORM */}
        {activeTab === 'create' && (
          <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto space-y-4 pr-1">
            <div className="bg-purple-950/20 p-3 rounded-2xl border border-purple-500/30 text-xs text-purple-300 flex items-center justify-between gap-2">
              <span className="font-bold flex items-center gap-1.5">
                <Edit3 className="h-4 w-4 text-purple-400" />
                {editingTemplate ? `Personalizando modelo: "${editingTemplate.title}"` : 'Criando Novo Modelo de Evolução'}
              </span>
              <span className="text-[11px] text-slate-400">Preencha e clique em Salvar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Nome do Modelo / Título *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Reabilitação Quiropraxia & Liberação Miofascial"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Categoria Clínica
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm font-bold text-purple-300 focus:border-purple-500 focus:outline-none"
                >
                  <option value="Quiropraxia">Quiropraxia</option>
                  <option value="Ortopedia">Ortopedia</option>
                  <option value="RPG">RPG / Postural</option>
                  <option value="Pilates">Pilates Clínico</option>
                  <option value="Traumatologia">Traumatologia / Coluna</option>
                  <option value="Neurologia">Neurologia</option>
                  <option value="Geral">Atendimento Geral</option>
                  <option value="Personalizado">Personalizado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                <span>Texto Padrão da Evolução (Letras Ampliadas) *</span>
                <span className="text-[10px] text-slate-400">Pode conter detalhes de procedimentos e conduta</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Escreva aqui a evolução clínica completa..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:outline-none leading-relaxed font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Procedimentos (separados por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="Laser, Crioterapia, Mobilização"
                  value={proceduresInput}
                  onChange={(e) => setProceduresInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Escala de Dor Inicial (0-10): <strong className="text-purple-400">{painBefore}</strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={painBefore}
                  onChange={(e) => setPainBefore(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Escala de Dor Final (0-10): <strong className="text-emerald-400">{painAfter}</strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={painAfter}
                  onChange={(e) => setPainAfter(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Metas para Próxima Sessão
              </label>
              <input
                type="text"
                placeholder="Ex: Progredir amplitude de movimento e força muscular."
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Voltar aos Modelos
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-purple-500 px-6 py-2.5 text-xs sm:text-sm font-extrabold text-slate-950 hover:bg-purple-400 transition-all shadow-lg cursor-pointer"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>{editingTemplate ? 'Salvar Alterações' : 'Salvar Modelo'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
