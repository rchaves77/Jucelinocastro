import React, { useState } from 'react';
import { ClinicTask, TaskPriority, TaskStatus, User, Patient } from '../../types';
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Send,
  Trash2,
  Edit2,
  UserCheck,
  Search,
  Filter,
  Sparkles,
  Calendar,
  Phone,
  MessageSquare,
  ShieldCheck,
  X,
  CheckCheck,
} from 'lucide-react';
import { openWhatsApp } from '../../utils/whatsappMessages';

interface TasksManagementDashboardProps {
  tasks: ClinicTask[];
  currentUser: User;
  users: User[];
  patients: Patient[];
  onAddTask: (task: Omit<ClinicTask, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: ClinicTask) => void;
  onDeleteTask: (id: string) => void;
  onToggleTaskStatus: (id: string) => void;
}

export const TasksManagementDashboard: React.FC<TasksManagementDashboardProps> = ({
  tasks,
  currentUser,
  users,
  patients,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTaskStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendente' | 'concluida'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [assignedFilter, setAssignedFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ClinicTask | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToUserId: currentUser.id,
    assignedToUserName: currentUser.name,
    priority: 'media' as TaskPriority,
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '12:00',
    patientId: '',
    patientName: '',
    notifyAssigned: true,
  });

  const openNewTaskModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      assignedToUserId: currentUser.role === 'secretary' ? 'all' : currentUser.id,
      assignedToUserName: currentUser.role === 'secretary' ? 'Equipe da Recepção' : currentUser.name,
      priority: 'media',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '12:00',
      patientId: '',
      patientName: '',
      notifyAssigned: true,
    });
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: ClinicTask) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedToUserId: task.assignedToUserId,
      assignedToUserName: task.assignedToUserName,
      priority: task.priority,
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      dueTime: task.dueTime || '12:00',
      patientId: task.patientId || '',
      patientName: task.patientName || '',
      notifyAssigned: task.notifyAssigned,
    });
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: formData.title,
        description: formData.description,
        assignedToUserId: formData.assignedToUserId,
        assignedToUserName: formData.assignedToUserName,
        priority: formData.priority,
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        patientId: formData.patientId || undefined,
        patientName: formData.patientName || undefined,
        notifyAssigned: formData.notifyAssigned,
      });
    } else {
      onAddTask({
        title: formData.title,
        description: formData.description,
        assignedToUserId: formData.assignedToUserId,
        assignedToUserName: formData.assignedToUserName,
        assignedByUserId: currentUser.id,
        assignedByUserName: currentUser.name,
        priority: formData.priority,
        status: 'pendente',
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        patientId: formData.patientId || undefined,
        patientName: formData.patientName || undefined,
        notifyAssigned: formData.notifyAssigned,
      });
    }

    setIsModalOpen(false);
  };

  const handleNotifyViaWhatsApp = (task: ClinicTask) => {
    const assignedUser = users.find((u) => u.id === task.assignedToUserId);
    const targetPhone = assignedUser?.phone || '5568992449425';
    const text = `📋 *LEMBRETE DE TAREFA - JUCELINO CASTRO FISIOTERAPIA*\n\n` +
      `Olá, *${task.assignedToUserName}*!\n\n` +
      `Foi atribuída a você a seguinte tarefa:\n` +
      `📌 *${task.title}*\n` +
      `${task.description ? `📝 ${task.description}\n` : ''}` +
      `⏰ *Prazo:* ${task.dueDate || 'Hoje'} às ${task.dueTime || '18:00'}\n` +
      `🔥 *Prioridade:* ${task.priority.toUpperCase()}\n` +
      `${task.patientName ? `👤 *Paciente relacionado:* ${task.patientName}\n` : ''}` +
      `\nAtribuído por: *${task.assignedByUserName}*\n` +
      `_Sistema Clínico Jucelino Castro Fisioterapia_`;

    openWhatsApp({ phone: targetPhone, text });
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedToUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.patientName && task.patientName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

    const matchesAssigned =
      assignedFilter === 'all'
        ? true
        : assignedFilter === 'mine'
        ? task.assignedToUserId === currentUser.id || task.assignedToUserId === 'all'
        : task.assignedToUserId === assignedFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
  });

  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === 'pendente').length;
  const urgentCount = tasks.filter((t) => t.status === 'pendente' && (t.priority === 'urgente' || t.priority === 'alta')).length;
  const completedCount = tasks.filter((t) => t.status === 'concluida').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 p-6 text-slate-100 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              Gestão Operacional & Lembretes
            </span>
            {urgentCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30 animate-pulse">
                <AlertTriangle className="h-3 w-3" /> {urgentCount} Urgentes
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-100">Tarefas da Recepção & Equipe</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Crie tarefas operacionais, atribua lembretes para a secretária ou fisioterapeutas com notificações reais no painel e no WhatsApp.
          </p>
        </div>

        <button
          onClick={openNewTaskModal}
          className="flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[3]" /> Nova Tarefa
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-slate-400 font-medium">Total de Tarefas</div>
          <div className="text-2xl font-black text-slate-100 mt-1">{totalCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Pendentes
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1">{pendingCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-red-400 font-medium flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> Urgentes / Altas
          </div>
          <div className="text-2xl font-black text-red-400 mt-1">{urgentCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Concluídas
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{completedCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Todas ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('pendente')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'pendente'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Pendentes ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('concluida')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === 'concluida'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Concluídas ({completedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por título, responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Secondary filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Filter className="h-3.5 w-3.5" /> Filtrar por:
          </div>

          {/* Responsável Filter */}
          <select
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todos os Responsáveis</option>
            <option value="mine">👤 Minhas Tarefas ({currentUser.name})</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>

          {/* Prioridade Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="urgente">🚨 Urgente</option>
            <option value="alta">⚠️ Alta</option>
            <option value="media">🔵 Média</option>
            <option value="baixa">⚪ Baixa</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center border border-slate-700">
              <CheckCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Nenhuma tarefa encontrada</h3>
              <p className="text-xs text-slate-400 mt-1">
                Todas as tarefas desse filtro foram concluídas ou você pode criar uma nova.
              </p>
            </div>
            <button
              onClick={openNewTaskModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Criar Tarefa
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'concluida';
            const priorityBadge = {
              urgente: 'bg-red-500/20 text-red-400 border-red-500/30',
              alta: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
              media: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
              baixa: 'bg-slate-700/50 text-slate-400 border-slate-600',
            }[task.priority];

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-400 opacity-75'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200 shadow-md'
                }`}
              >
                {/* Left: Checkbox + Content */}
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => onToggleTaskStatus(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                    title={isCompleted ? 'Marcar como Pendente' : 'Marcar como Concluída'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-500 hover:text-emerald-400" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm font-bold ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </h3>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${priorityBadge}`}
                      >
                        {task.priority}
                      </span>

                      {task.patientName && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/60 text-blue-300 border border-blue-800/60">
                          👤 {task.patientName}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Atribuído para:</span>
                        <strong className="text-slate-200">{task.assignedToUserName}</strong>
                      </div>

                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-emerald-400" />
                          <span>Prazo: {task.dueDate} {task.dueTime ? `às ${task.dueTime}` : ''}</span>
                        </div>
                      )}

                      <div className="text-slate-500">
                        Por: {task.assignedByUserName}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleNotifyViaWhatsApp(task)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
                    title="Enviar aviso formatado no WhatsApp do responsável"
                  >
                    <Send className="h-3.5 w-3.5" /> WhatsApp
                  </button>

                  <button
                    onClick={() => openEditTaskModal(task)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Editar Tarefa"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="Excluir Tarefa"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Plus className="h-4 w-4 stroke-[3]" />
                </div>
                <h3 className="font-bold text-slate-100 text-base">
                  {editingTask ? 'Editar Tarefa' : 'Nova Tarefa & Lembrete'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-5 space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Confirmar lista de pacientes da tarde"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Descrição / Detalhes
                </label>
                <textarea
                  rows={3}
                  placeholder="Orientações e instruções para a execução da tarefa..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Assignee & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Atribuir para *
                  </label>
                  <select
                    value={formData.assignedToUserId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId === 'all') {
                        setFormData({
                          ...formData,
                          assignedToUserId: 'all',
                          assignedToUserName: 'Toda a Equipe',
                        });
                      } else {
                        const userObj = users.find((u) => u.id === selectedId);
                        setFormData({
                          ...formData,
                          assignedToUserId: selectedId,
                          assignedToUserName: userObj ? userObj.name : 'Equipe',
                        });
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">🌐 Toda a Equipe / Recepção</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role === 'secretary' ? 'Recepção' : u.role === 'physio' ? 'Fisioterapeuta' : 'Admin'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="urgente">🚨 Urgente (Imediato)</option>
                    <option value="alta">⚠️ Alta (Hoje)</option>
                    <option value="media">🔵 Média</option>
                    <option value="baixa">⚪ Baixa</option>
                  </select>
                </div>
              </div>

              {/* Due Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Data Limite
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Horário Limite
                  </label>
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Associated Patient (Optional) */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Paciente Relacionado (Opcional)
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) => {
                    const patId = e.target.value;
                    const patObj = patients.find((p) => p.id === patId);
                    setFormData({
                      ...formData,
                      patientId: patId,
                      patientName: patObj ? patObj.name : '',
                    });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Nenhum paciente vinculado</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (CPF: {p.cpf})
                    </option>
                  ))}
                </select>
              </div>

              {/* Notification Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-notify"
                  checked={formData.notifyAssigned}
                  onChange={(e) => setFormData({ ...formData, notifyAssigned: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-500 h-4 w-4 bg-slate-800 border-slate-700"
                />
                <label htmlFor="chk-notify" className="text-slate-300 font-semibold cursor-pointer">
                  Disparar notificação real no painel do responsável
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all shadow-md cursor-pointer"
                >
                  {editingTask ? 'Atualizar Tarefa' : 'Salvar Tarefa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
