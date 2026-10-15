import { useState, useEffect } from 'react';
import { EvolutionTemplate } from '../../../types';

const DEFAULT_TEMPLATES: EvolutionTemplate[] = [
  {
    id: 'tpl_1',
    title: 'Pós-Operatório de LCA / Joelho',
    category: 'Ortopedia',
    description: 'Paciente em acompanhamento pós-operatório de joelho. Apresenta leve edema periarticular. Realizada goniometria para ganho de ADM de flexão e extensão, exercícios isométricos de quadríceps, crioterapia por 20 minutos e laserterapia pontual na linha de incisão.',
    procedures: ['Laserterapia', 'Crioterapia', 'Mobilização Patelar', 'Isometria de Quadríceps'],
    painScaleBefore: 6,
    painScaleAfter: 2,
    nextSessionGoals: 'Aumentar amplitude de movimento em flexão e evoluir carga de treino.',
    createdAt: '2026-08-01',
    createdBy: 'Dr. Jean Chaves',
  },
  {
    id: 'tpl_2',
    title: 'RPG & Reeducação Postural Coluna',
    category: 'RPG',
    description: 'Sessão de Reeducação Postural Global (RPG) direcionada à cadeia posterior e descompressão discal. Realizadas posturas em desacarga, mobilização da cintura escapular, tração cervical suave e liberação miofascial suboccipital. Ótima resposta e alívio de dor.',
    procedures: ['RPG', 'Tração Cervical Manual', 'Liberação Miofascial', 'Treino Respiratório'],
    painScaleBefore: 7,
    painScaleAfter: 2,
    nextSessionGoals: 'Progredir para posturas em pé e fortalecimento da cintura escapular.',
    createdAt: '2026-08-01',
    createdBy: 'Rômulo Chaves',
  },
  {
    id: 'tpl_3',
    title: 'Pilates Clínico & Estabilização de Core',
    category: 'Pilates',
    description: 'Atendimento de Pilates Clínico utilizando Reformer e Cadillac. Sequência focada no recrutamento do Powerhouse (transverso do abdômen e assoalho pélvico), treino proprioceptivo de tornozelo/joelho e fortalecimento de glúteo médio com molas de carga média.',
    procedures: ['Pilates no Reformer', 'Fortalecimento de Powerhouse', 'Propriocepção em Disco'],
    painScaleBefore: 4,
    painScaleAfter: 1,
    nextSessionGoals: 'Aumentar resistência dos estabilizadores profundos do tronco.',
    createdAt: '2026-08-02',
    createdBy: 'Dra. Aline Castro',
  },
  {
    id: 'tpl_4',
    title: 'Tratamento de Cervicalgia / Hérnia Discal',
    category: 'Traumatologia',
    description: 'Queixa de dor em região cervical com irradiação para trapézio superior. Aplicada eletroterapia analgésica TENS (100Hz) por 20 min, ultrassom terapêutico contínuo e mobilização neural de membro superior. Paciente refere alívio imediato da tensão muscular.',
    procedures: ['Eletroterapia TENS', 'Ultrassom Terapêutico', 'Mobilização Neural', 'Cinesioterapia'],
    painScaleBefore: 8,
    painScaleAfter: 3,
    nextSessionGoals: 'Desensibilizar raiz nervosa e liberar musculatura paravertebral.',
    createdAt: '2026-08-02',
    createdBy: 'Dr. Jean Chaves',
  },
  {
    id: 'tpl_5',
    title: 'Sessão de Analgesia & Manutenção Preventiva',
    category: 'Geral',
    description: 'Sessão de manutenção preventiva. Realizado protocolo de alívio com ventosaterapia em paravertebrais, alongamentos globais das cadeias musculares e orientações de ergonomia para rotina de trabalho.',
    procedures: ['Ventosaterapia', 'Alongamento Global', 'Ergonomia'],
    painScaleBefore: 3,
    painScaleAfter: 0,
    nextSessionGoals: 'Manter padrão funcional sem queixas dolorosas.',
    createdAt: '2026-08-03',
    createdBy: 'Katiuscia Braga Castro',
  },
];

export function useEvolutionTemplates() {
  const [templates, setTemplates] = useState<EvolutionTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('jc_evolution_templates');
      return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('jc_evolution_templates', JSON.stringify(templates));
    } catch (err) {
      console.error('Failed to save evolution templates:', err);
    }
  }, [templates]);

  const addTemplate = (templateData: Omit<EvolutionTemplate, 'id' | 'createdAt'>) => {
    const newTpl: EvolutionTemplate = {
      id: `tpl_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...templateData,
    };
    setTemplates((prev) => [newTpl, ...prev]);
    return newTpl;
  };

  const updateTemplate = (id: string, updatedData: Partial<EvolutionTemplate>) => {
    setTemplates((prev) =>
      prev.map((tpl) => (tpl.id === id ? { ...tpl, ...updatedData } : tpl))
    );
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((tpl) => tpl.id !== id));
  };

  return {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
