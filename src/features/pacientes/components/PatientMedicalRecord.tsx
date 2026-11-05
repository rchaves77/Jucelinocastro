import React, { useState } from 'react';
import type { Patient, Evolution, ExamAttachment, User, EvolutionTemplate } from '../../../types';
import {
  ArrowLeft,
  User as UserIcon,
  FileText,
  Activity,
  History,
  Paperclip,
  Plus,
  ZoomIn,
  Printer,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  Edit3,
  Check,
  X,
  Bookmark,
  ShieldAlert,
  Tag,
  MessageSquare,
} from 'lucide-react';
import { TemplateManagerModal } from '../../templates/components/TemplateManagerModal';

interface PatientMedicalRecordProps {
  patient: Patient;
  onBack: () => void;
  onAddEvolution: (patientId: string, evo: Omit<Evolution, 'id'>) => void;
  onUpdateEvolution?: (patientId: string, evolutionId: string, evo: Partial<Evolution>) => void;
  onDeleteEvolution?: (patientId: string, evolutionId: string) => void;
  onAddExam: (patientId: string, exam: Omit<ExamAttachment, 'id'>) => void;
  onZoomImage: (title: string, url: string, category?: string, date?: string, notes?: string) => void;
  currentUser?: User;
  templates?: EvolutionTemplate[];
  onAddTemplate?: (tpl: Omit<EvolutionTemplate, 'id' | 'createdAt'>) => void;
  onUpdateTemplate?: (id: string, tpl: Partial<EvolutionTemplate>) => void;
  onDeleteTemplate?: (id: string) => void;
  onAddAuditLog?: (log: any) => void;
}

export const PatientMedicalRecord: React.FC<PatientMedicalRecordProps> = ({
  patient,
  onBack,
  onAddEvolution,
  onUpdateEvolution,
  onDeleteEvolution,
  onAddExam,
  onZoomImage,
  currentUser,
  templates = [],
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onAddAuditLog,
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'historico' | 'avaliacao' | 'evolucao' | 'anexos'>('geral');
  const [newEvoDesc, setNewEvoDesc] = useState('');
  const [painBefore, setPainBefore] = useState(6);
  const [painAfter, setPainAfter] = useState(2);
  const [procedureInput, setProcedureInput] = useState('');
  const [nextGoalsInput, setNextGoalsInput] = useState('Continuar protocolo terapêutico.');

  // Editing state for existing / draft evolutions
  const [editingEvoId, setEditingEvoId] = useState<string | null>(null);
  const [editEvoDesc, setEditEvoDesc] = useState('');
  const [editPainBefore, setEditPainBefore] = useState(5);
  const [editPainAfter, setEditPainAfter] = useState(2);
  const [editProceduresInput, setEditProceduresInput] = useState('');

  // Template Modal State
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const handleCreateEvolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvoDesc.trim()) return;

    const authorName = currentUser?.name || patient.assignedPhysioName;

    onAddEvolution(patient.id, {
      date: new Date().toISOString().split('T')[0],
      physioName: authorName,
      description: newEvoDesc,
      painScaleBefore: painBefore,
      painScaleAfter: painAfter,
      procedures: procedureInput ? procedureInput.split(',').map((s) => s.trim()) : ['Fisioterapia Integrada'],
      nextSessionGoals: nextGoalsInput || 'Evolução continuada.',
      isDraft: false,
    });

    if (onAddAuditLog) {
      onAddAuditLog({
        authorName,
        authorRole: currentUser?.role || 'physio',
        action: 'Nova Evolução Clínica',
        details: `Registrou evolução clínica no prontuário de ${patient.name}. EVA: ${painBefore} ➔ ${painAfter}.`,
        targetPatientName: patient.name,
        targetPatientId: patient.id,
        module: 'Prontuário',
      });
    }

    setNewEvoDesc('');
    setProcedureInput('');
    setNextGoalsInput('Continuar protocolo terapêutico.');
  };

  const handleStartEditEvo = (evo: Evolution) => {
    setEditingEvoId(evo.id);
    setEditEvoDesc(evo.description);
    setEditPainBefore(evo.painScaleBefore);
    setEditPainAfter(evo.painScaleAfter);
    setEditProceduresInput(evo.procedures.join(', '));
  };

  const handleSaveEditEvo = (evoId: string) => {
    if (!onUpdateEvolution) return;

    const authorName = currentUser?.name || 'Fisioterapeuta';

    onUpdateEvolution(patient.id, evoId, {
      description: editEvoDesc,
      painScaleBefore: editPainBefore,
      painScaleAfter: editPainAfter,
      procedures: editProceduresInput ? editProceduresInput.split(',').map((s) => s.trim()) : ['Fisioterapia'],
      isDraft: false, // Finalized considerations!
      lastUpdated: new Date().toISOString().split('T')[0],
      lastEditedBy: authorName,
    });

    if (onAddAuditLog) {
      onAddAuditLog({
        authorName,
        authorRole: currentUser?.role || 'physio',
        action: 'Considerações Adicionadas na Evolução',
        details: `Atualizou e finalizou considerações clínicas da evolução de ${patient.name}.`,
        targetPatientName: patient.name,
        targetPatientId: patient.id,
        module: 'Prontuário',
      });
    }

    setEditingEvoId(null);
  };

  const handleApplyTemplate = (tpl: EvolutionTemplate) => {
    setNewEvoDesc(tpl.description);
    setPainBefore(tpl.painScaleBefore);
    setPainAfter(tpl.painScaleAfter);
    setProcedureInput(tpl.procedures.join(', '));
    if (tpl.nextSessionGoals) {
      setNextGoalsInput(tpl.nextSessionGoals);
    }

    if (onAddAuditLog) {
      onAddAuditLog({
        authorName: currentUser?.name || 'Fisioterapeuta',
        authorRole: currentUser?.role || 'physio',
        action: 'Uso de Template Clínico',
        details: `Carregou o template "${tpl.title}" para a evolução de ${patient.name}.`,
        targetPatientName: patient.name,
        targetPatientId: patient.id,
        module: 'Templates',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <img
            src={patient.photoUrl}
            alt={patient.name}
            onClick={() => onZoomImage(`Foto: ${patient.name}`, patient.photoUrl)}
            className="h-12 w-12 rounded-full object-cover border-2 border-emerald-500 cursor-zoom-in"
          />
          <div>
            <h2 className="text-base font-bold text-slate-100">{patient.name}</h2>
            <p className="text-xs text-slate-400">
              Prontuário Nº {patient.id.toUpperCase()} • CPF: {patient.cpf}
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors shadow-sm cursor-pointer"
          title="Imprimir ou Salvar como PDF"
        >
          <Printer className="h-4 w-4 text-emerald-400" />
          <span>Imprimir / Salvar PDF</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-800 bg-slate-900 px-4 rounded-2xl border overflow-x-auto print:hidden">
        {[
          { id: 'geral', label: '1. Geral', icon: UserIcon },
          { id: 'historico', label: '2. Histórico', icon: History },
          { id: 'avaliacao', label: '3. Avaliação', icon: Activity },
          { id: 'evolucao', label: '4. Evolução', icon: FileText },
          { id: 'anexos', label: '5. Anexos / Exames', icon: Paperclip },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents Container */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 min-h-[350px] text-slate-200">
        {activeTab === 'geral' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-3 flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-emerald-400" /> Dados Pessoais
              </h4>
              <p><strong className="text-slate-200">Telefone:</strong> {patient.phone}</p>
              <p className="mt-2"><strong className="text-slate-200">E-mail:</strong> {patient.email}</p>
              <p className="mt-2"><strong className="text-slate-200">Data de Nasc.:</strong> {patient.birthDate}</p>
              <p className="mt-2"><strong className="text-slate-200">Gênero:</strong> {patient.gender}</p>
              <p className="mt-2"><strong>Endereço:</strong> {patient.address}</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-3">Vínculo Clínico</h4>
              <p><strong className="text-slate-200">Fisioterapeuta Responsável:</strong> {patient.assignedPhysioName}</p>
              <p className="mt-2"><strong className="text-slate-200">Status:</strong> {patient.status}</p>
              <p className="mt-2"><strong className="text-slate-200">Data de Entrada:</strong> {patient.createdAt}</p>
            </div>
          </div>
        )}

        {activeTab === 'historico' && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-800">
              <h4 className="font-bold text-slate-100 mb-1 text-xs">Queixa Principal:</h4>
              <p className="text-slate-300 leading-relaxed">{patient.anamnesis.mainComplaint}</p>
            </div>
            <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-800">
              <h4 className="font-bold text-slate-100 mb-1 text-xs">Histórico da Moléstia Atual (HMA):</h4>
              <p className="text-slate-300 leading-relaxed">{patient.anamnesis.illnessHistory || 'Nenhum histórico prévio registrado.'}</p>
            </div>
          </div>
        )}

        {activeTab === 'avaliacao' && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-800">
                <h4 className="font-bold text-slate-100 mb-2">Exame Físico / ADM</h4>
                <p className="leading-relaxed">{patient.anamnesis.physicalExam}</p>
              </div>
              <div className="rounded-xl bg-slate-800/60 p-4 border border-slate-800">
                <h4 className="font-bold text-slate-100 mb-2">Análise Postural & Core</h4>
                <p className="leading-relaxed">{patient.anamnesis.postureAnalysis}</p>
              </div>
            </div>
            <div className="rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/30 text-emerald-300">
              <h4 className="font-bold mb-1 text-emerald-400">Plano de Tratamento & Objetivos:</h4>
              <p className="leading-relaxed">{patient.anamnesis.treatmentPlan}</p>
            </div>
          </div>
        )}

        {activeTab === 'evolucao' && (
          <div className="space-y-6">
            {/* Header bar for Templates */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-950/20 p-4 rounded-2xl border border-purple-500/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-purple-200">Templates de Evolução Clínica</h4>
                  <p className="text-[11px] text-purple-300/80">
                    Agilize o preenchimento diário do prontuário carregando modelos pré-configurados com 1 clique
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-purple-400 transition-colors shadow-md shrink-0"
              >
                <Bookmark className="h-4 w-4" />
                <span>Usar / Gerenciar Templates ({templates.length})</span>
              </button>
            </div>

            {/* New Evolution Form */}
            <form onSubmit={handleCreateEvolution} className="rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-emerald-400" /> Registrar Nova Evolução Diária
                </h4>

                {newEvoDesc.trim() && onAddTemplate && (
                  <button
                    type="button"
                    onClick={() => {
                      const tTitle = prompt('Nome para o novo template:', 'Evolução ' + new Date().toLocaleDateString());
                      if (tTitle) {
                        onAddTemplate({
                          title: tTitle,
                          category: 'Geral',
                          description: newEvoDesc,
                          procedures: procedureInput ? procedureInput.split(',').map((s) => s.trim()) : ['Fisioterapia'],
                          painScaleBefore: painBefore,
                          painScaleAfter: painAfter,
                          nextSessionGoals: nextGoalsInput,
                          createdBy: currentUser?.name || 'Fisioterapeuta',
                        });
                        alert('✅ Template salvo com sucesso!');
                      }
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-purple-300 hover:text-white bg-purple-900/40 px-3 py-1.5 rounded-xl border border-purple-500/40 transition-colors"
                  >
                    <Bookmark className="h-3.5 w-3.5" /> Salvar este Texto como Template
                  </button>
                )}
              </div>

              <textarea
                value={newEvoDesc}
                onChange={(e) => setNewEvoDesc(e.target.value)}
                placeholder="Descreva os procedimentos realizados, resposta ao tratamento e queixas do paciente..."
                rows={4}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Procedimentos Realizados
                  </label>
                  <input
                    type="text"
                    placeholder="Laser, Crioterapia, Exercícios"
                    value={procedureInput}
                    onChange={(e) => setProcedureInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Escala de Dor (EVA) antes/depois
                  </label>
                  <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                    <span className="text-xs font-bold text-amber-400 shrink-0">Antes: {painBefore}</span>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={painBefore}
                      onChange={(e) => setPainBefore(Number(e.target.value))}
                      className="w-14 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-emerald-400 shrink-0">Depois: {painAfter}</span>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={painAfter}
                      onChange={(e) => setPainAfter(Number(e.target.value))}
                      className="w-14 accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Metas Próxima Sessão
                  </label>
                  <input
                    type="text"
                    placeholder="Objetivos para o próximo atendimento"
                    value={nextGoalsInput}
                    onChange={(e) => setNextGoalsInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md cursor-pointer"
                >
                  Salvar Evolução Clínica
                </button>
              </div>
            </form>

            {/* Evolutions List */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-200 flex items-center justify-between">
                <span>Histórico de Evoluções Clínicas ({patient.evolutions.length})</span>
                <span className="text-[11px] font-normal text-slate-400">Ordenado da mais recente para mais antiga</span>
              </h4>

              {patient.evolutions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                  Nenhuma evolução registrada ainda para este paciente.
                </div>
              ) : (
                patient.evolutions.map((evo) => {
                  const isEditingThis = editingEvoId === evo.id;
                  const isDraftFromReception = evo.isDraft || evo.receptionAutoGenerated;

                  return (
                    <div
                      key={evo.id}
                      className={`rounded-2xl border p-4 space-y-3 transition-all ${
                        isDraftFromReception
                          ? 'border-amber-500/40 bg-amber-950/20 text-slate-200'
                          : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 text-slate-200 shadow-sm'
                      }`}
                    >
                      {/* Top Header of evolution card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-emerald-400" />
                            {evo.date} — {evo.physioName}
                          </span>

                          {isDraftFromReception && (
                            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                              <AlertCircle className="h-3 w-3" /> Gerado na Recepção (Aguardando Considerações)
                            </span>
                          )}

                          {evo.lastEditedBy && (
                            <span className="text-[10px] text-slate-400 italic">
                              (Editado por {evo.lastEditedBy})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                            EVA: {evo.painScaleBefore} ➔ {evo.painScaleAfter}
                          </span>

                          {!isEditingThis ? (
                            <button
                              onClick={() => handleStartEditEvo(evo)}
                              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                            >
                              <Edit3 className="h-3 w-3 text-emerald-400" />
                              <span>{isDraftFromReception ? 'Adicionar Considerações' : 'Editar'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingEvoId(null)}
                              className="p-1 text-slate-400 hover:text-slate-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content / Edit View */}
                      {isEditingThis ? (
                        <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-emerald-500/40">
                          <h5 className="font-bold text-xs text-emerald-400 flex items-center gap-1.5">
                            <Edit3 className="h-4 w-4 text-emerald-400" /> Editar Considerações Clínicas
                          </h5>

                          <textarea
                            value={editEvoDesc}
                            onChange={(e) => setEditEvoDesc(e.target.value)}
                            rows={4}
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                                Procedimentos:
                              </label>
                              <input
                                type="text"
                                value={editProceduresInput}
                                onChange={(e) => setEditProceduresInput(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100"
                              />
                            </div>

                            <div className="flex items-center gap-3">
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-400">Dor Inicial:</label>
                                <input
                                  type="number"
                                  min={0}
                                  max={10}
                                  value={editPainBefore}
                                  onChange={(e) => setEditPainBefore(Number(e.target.value))}
                                  className="w-16 rounded-xl border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-400">Dor Final:</label>
                                <input
                                  type="number"
                                  min={0}
                                  max={10}
                                  value={editPainAfter}
                                  onChange={(e) => setEditPainAfter(Number(e.target.value))}
                                  className="w-16 rounded-xl border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                              onClick={() => setEditingEvoId(null)}
                              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleSaveEditEvo(evo.id)}
                              className="flex items-center gap-1 rounded-xl bg-emerald-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-md cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" /> Salvar Considerações
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                            {evo.description}
                          </p>

                          {evo.procedures && evo.procedures.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                              <span className="text-[11px] text-slate-400 font-semibold">Procedimentos:</span>
                              {evo.procedures.map((proc, pIdx) => (
                                <span key={pIdx} className="rounded-md bg-slate-800 px-2.5 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700">
                                  {proc}
                                </span>
                              ))}
                            </div>
                          )}

                          {evo.nextSessionGoals && (
                            <p className="text-[11px] text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30 mt-2">
                              <strong className="text-emerald-400">Metas Próxima Sessão:</strong> {evo.nextSessionGoals}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'anexos' && (
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-slate-200">
              Exames e Imagens (Clique no thumbnail para abrir zoom em alta definição)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {patient.exams.map((exam) => (
                <div
                  key={exam.id}
                  onClick={() => onZoomImage(exam.title, exam.fullUrl, exam.category, exam.date, exam.notes)}
                  className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-2 cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-900">
                    <img
                      src={exam.thumbnailUrl}
                      alt={exam.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ZoomIn className="h-6 w-6 text-emerald-400" />
                    </div>
                  </div>
                  <div className="mt-2 text-[11px]">
                    <span className="font-semibold text-slate-100 block truncate">{exam.title}</span>
                    <span className="text-slate-400 text-[10px]">{exam.date} • {exam.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Template Manager Modal */}
      <TemplateManagerModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templates={templates}
        onAddTemplate={onAddTemplate || (() => {})}
        onUpdateTemplate={onUpdateTemplate || (() => {})}
        onDeleteTemplate={onDeleteTemplate || (() => {})}
        onSelectTemplate={handleApplyTemplate}
        currentUserName={currentUser?.name}
      />
    </div>
  );
};
