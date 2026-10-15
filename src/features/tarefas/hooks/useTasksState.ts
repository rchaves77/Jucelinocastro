import { useState, useEffect, useCallback } from 'react';
import { ClinicTask, TaskPriority, TaskStatus } from '../../../types';

const STORAGE_KEY = 'jc_clinic_tasks';

const INITIAL_TASKS: ClinicTask[] = [
  {
    id: 'task_1',
    title: 'Confirmar lista de pacientes da tarde',
    description: 'Entrar em contato via WhatsApp com os pacientes agendados das 13:30 às 17:30 para confirmar comparecimento.',
    assignedToUserId: 'all',
    assignedToUserName: 'Katiuscia (Recepção)',
    assignedByUserId: 'u_jucelino',
    assignedByUserName: 'Dr. Jucelino Castro',
    priority: 'alta',
    status: 'pendente',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '12:30',
    createdAt: new Date().toISOString(),
    notifyAssigned: true,
  },
  {
    id: 'task_2',
    title: 'Separar ficha e exames de paciente com pós-operatório',
    description: 'Deixar na bancada da Sala 01 a ressonância magnética e exames do paciente de Quiropraxia.',
    assignedToUserId: 'u_jucelino',
    assignedToUserName: 'Dr. Jucelino Castro',
    assignedByUserId: 'u_sec',
    assignedByUserName: 'Katiuscia Braga Castro',
    priority: 'urgente',
    status: 'pendente',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '14:00',
    patientName: 'Carlos Eduardo Santos',
    createdAt: new Date().toISOString(),
    notifyAssigned: true,
  },
  {
    id: 'task_3',
    title: 'Repor lençóis descartáveis e toalhas na Sala 02',
    description: 'Higienização e reposição de materiais de maca e eletroterapia.',
    assignedToUserId: 'all',
    assignedToUserName: 'Equipe da Recepção',
    assignedByUserId: 'u_admin',
    assignedByUserName: 'Rômulo Chaves',
    priority: 'media',
    status: 'concluida',
    dueDate: new Date().toISOString().split('T')[0],
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    notifyAssigned: false,
  },
];

interface UseTasksStateProps {
  onTaskCreatedNotification?: (title: string, message: string, targetUserId?: string) => void;
}

export function useTasksState({ onTaskCreatedNotification }: UseTasksStateProps = {}) {
  const [tasks, setTasks] = useState<ClinicTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Error saving tasks to localStorage', err);
    }
  }, [tasks]);

  const addTask = useCallback((
    taskData: Omit<ClinicTask, 'id' | 'createdAt'>
  ) => {
    const newTask: ClinicTask = {
      ...taskData,
      id: 'task_' + Date.now(),
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    // Trigger notification if notifyAssigned is true
    if (newTask.notifyAssigned && onTaskCreatedNotification) {
      const priorityLabel = newTask.priority === 'urgente' ? '🚨 [URGENTE] ' : newTask.priority === 'alta' ? '⚠️ [ALTA] ' : '';
      onTaskCreatedNotification(
        `${priorityLabel}Nova Tarefa: ${newTask.title}`,
        `Atribuída para ${newTask.assignedToUserName} por ${newTask.assignedByUserName}. ${newTask.description || ''}`,
        newTask.assignedToUserId
      );
    }

    return newTask;
  }, [onTaskCreatedNotification]);

  const updateTask = useCallback((updated: ClinicTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus: TaskStatus = t.status === 'concluida' ? 'pendente' : 'concluida';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'concluida' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  }, []);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };
}
