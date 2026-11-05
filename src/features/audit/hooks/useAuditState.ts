import { useState, useEffect } from 'react';
import { AuditLog, UserRole } from '../../../types';

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_101',
    timestamp: '2026-08-03 08:05',
    authorName: 'Katiuscia Braga Castro',
    authorRole: 'secretary',
    action: 'Confirmação de Presença & Auto-Evolução',
    details: 'Confirmou presença do paciente João Silva para atendimento das 08:00 (Sala 01 - Ortopedia). Rascunho de evolução gerado automaticamente.',
    targetPatientName: 'João Silva',
    targetPatientId: 'p1',
    module: 'Atendimento/Recepção',
  },
  {
    id: 'log_102',
    timestamp: '2026-08-03 08:12',
    authorName: 'Dr. Jean Chaves',
    authorRole: 'physio',
    action: 'Edição de Evolução Clínica',
    details: 'Completou considerações clínicas na evolução gerada na recepção. Procedimentos: Liberacao miofascial, Mobilizacao articular.',
    targetPatientName: 'João Silva',
    targetPatientId: 'p1',
    module: 'Prontuário',
  },
  {
    id: 'log_103',
    timestamp: '2026-08-03 07:45',
    authorName: 'Rômulo Chaves',
    authorRole: 'admin',
    action: 'Criação de Template de Evolução',
    details: 'Criou o template "Reabilitação Pós-Operatório de LCA / Joelho" no sistema.',
    module: 'Templates',
  },
  {
    id: 'log_104',
    timestamp: '2026-08-02 16:30',
    authorName: 'Rômulo Chaves',
    authorRole: 'admin',
    action: 'Aprovação de Autocadastro',
    details: 'Aprovou a solicitação de cadastro de Dra. Mariana Costa com perfil Fisioterapeuta.',
    module: 'Equipe',
  },
];

export function useAuditState() {
  const [logs, setLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('jc_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('jc_audit_logs', JSON.stringify(logs));
    } catch (err) {
      console.error('Failed to save audit logs:', err);
    }
  }, [logs]);

  const addAuditLog = (logData: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: formattedDate,
      ...logData,
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  const clearAuditLogs = () => {
    setLogs([]);
  };

  return {
    logs,
    addAuditLog,
    clearAuditLogs,
  };
}
