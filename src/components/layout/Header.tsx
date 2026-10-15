import React, { useState, useRef, useEffect } from 'react';
import { UserRole, User, ClinicNotification } from '../../types';
import {
  Bell,
  Search,
  MessageSquare,
  Lock,
  UserCog,
  CheckCheck,
  Clock,
  ShieldCheck,
  X,
  Menu,
  Globe,
  UserCheck,
  ListTodo,
  AlertTriangle,
  Trash2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { ClinicLogo } from '../common/ClinicLogo';

interface HeaderProps {
  currentUser: User;
  users?: User[];
  onRoleChange: (role: UserRole) => void;
  onOpenNewAppointment: () => void;
  onOpenNewPatient: () => void;
  onToggleChat: () => void;
  onOpenProfileModal?: () => void;
  unreadChatCount?: number;
  onLogout?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  pendingConfirmationsCount?: number;
  onOpenPatientConfirmation?: () => void;
  notifications?: ClinicNotification[];
  onMarkAllNotificationsRead?: () => void;
  onToggleNotificationRead?: (id: string) => void;
  onDeleteNotification?: (id: string) => void;
  onClearNotifications?: () => void;
  onSelectNotification?: (notif: ClinicNotification) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  users = [],
  onRoleChange,
  onOpenNewAppointment,
  onOpenNewPatient,
  onToggleChat,
  onOpenProfileModal,
  unreadChatCount = 0,
  onLogout,
  isSidebarOpen = false,
  onToggleSidebar,
  pendingConfirmationsCount = 0,
  onOpenPatientConfirmation,
  notifications = [],
  onMarkAllNotificationsRead,
  onToggleNotificationRead,
  onDeleteNotification,
  onClearNotifications,
  onSelectNotification,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const userNotifications = notifications.filter(
    (n) => !n.targetUserId || n.targetUserId === 'all' || n.targetUserId === currentUser.id
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/95 px-3 md:px-6 backdrop-blur-md">
      <div className="flex items-center gap-2 lg:gap-4">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/80 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 transition-all cursor-pointer shrink-0 shadow-sm"
          title={isSidebarOpen ? 'Fechar Menu' : 'Abrir Menu (Menu Sanduíche)'}
          aria-label="Menu Principal Sanduíche"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <ClinicLogo variant="header" onLogoClick={onOpenProfileModal} />

        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar paciente ou CPF..."
            className="w-full rounded-full border border-slate-800 bg-slate-800/80 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Patient Confirmation Button with Dynamic Red Badge - Only for Admin & Secretary */}
        {onOpenPatientConfirmation && (currentUser.role === 'admin' || currentUser.role === 'secretary') && (
          <button
            id="btn-confirm-patients"
            onClick={onOpenPatientConfirmation}
            className={`relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm ${
              pendingConfirmationsCount > 0
                ? 'border-red-500/60 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-400 ring-1 ring-red-500/30'
                : 'border-slate-800 bg-slate-800/80 text-emerald-400 hover:bg-slate-800'
            }`}
            title="Confirmar Presença dos Pacientes de Hoje (Acesso Recepção & ADM)"
          >
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Confirmar Pacientes</span>
            {pendingConfirmationsCount > 0 ? (
              <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-red-500 text-[11px] font-black text-white animate-pulse shadow-sm shadow-red-950/60">
                {pendingConfirmationsCount}
              </span>
            ) : (
              <span className="hidden md:inline-flex h-2 w-2 rounded-full bg-emerald-400" title="Todos confirmados" />
            )}
          </button>
        )}

        <button
          onClick={onOpenNewAppointment}
          className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-sm hover:bg-emerald-400 transition-colors cursor-pointer"
          title="Agendar Consulta"
        >
          <span className="text-sm font-black">+</span>
          <span className="hidden xs:inline">Agendar</span>
        </button>

        <button
          id="btn-toggle-chat"
          onClick={onToggleChat}
          className="relative rounded-full border border-slate-800 bg-slate-800/80 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          title="Chat Interno da Clínica"
        >
          <MessageSquare className="h-4 w-4" />
          {unreadChatCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
              {unreadChatCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="btn-notifications"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative rounded-full border border-slate-800 bg-slate-800/80 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            title="Notificações Reais do Sistema"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-slate-900"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-4 z-50 text-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-bold text-xs text-slate-100">
                    Notificações Reais {unreadCount > 0 ? `(${unreadCount})` : ''}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  {unreadCount > 0 && onMarkAllNotificationsRead && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <CheckCheck className="h-3.5 w-3.5" /> Lidas
                    </button>
                  )}
                  {userNotifications.length > 0 && onClearNotifications && (
                    <button
                      onClick={onClearNotifications}
                      className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {userNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
                    <Sparkles className="h-5 w-5 text-slate-500 mx-auto mb-1.5" />
                    Nenhuma notificação pendente no momento.
                  </div>
                ) : (
                  userNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (onToggleNotificationRead) onToggleNotificationRead(notif.id);
                        if (onSelectNotification) onSelectNotification(notif);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        !notif.read
                          ? 'border-emerald-500/40 bg-emerald-950/20 text-slate-100 shadow-sm'
                          : 'border-slate-800/80 bg-slate-950/40 text-slate-300 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                          {notif.type === 'task' ? (
                            <ListTodo className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          ) : notif.type === 'appointment' ? (
                            <Calendar className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          ) : (
                            <UserCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          )}
                          {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                          )}
                          <span>{notif.title}</span>
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2 sm:pl-3">
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 text-left p-1 rounded-xl hover:bg-slate-800 transition-colors group cursor-pointer"
            title="Meu Perfil"
          >
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover border-2 border-emerald-500 shadow-sm group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-200 truncate max-w-[120px] group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                <span>{currentUser.name}</span>
                <UserCog className="h-3 w-3 text-slate-400 group-hover:text-emerald-400" />
              </div>
              <span className="text-[10px] text-slate-400 block font-medium">Perfil & Senha</span>
            </div>
          </button>

          {/* Role switcher strictly for Administrator (Rômulo) */}
          {currentUser.role === 'admin' && (
            <select
              id="role-switcher-select"
              value={currentUser.role}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="hidden xl:block bg-slate-800 border border-slate-700 text-[10px] font-bold text-emerald-400 rounded-md px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              title="Alternar Papel de Acesso (Exclusivo Administrador)"
            >
              <option value="admin" className="bg-slate-900 text-slate-200">Administrador (Rômulo)</option>
              <option value="physio" className="bg-slate-900 text-slate-200">Fisioterapeuta</option>
              <option value="secretary" className="bg-slate-900 text-slate-200">Secretária (Katiuscia)</option>
            </select>
          )}

          {onLogout && (
            <div className="flex items-center gap-1">
              <button
                onClick={onLogout}
                className="rounded-xl border border-teal-500/30 bg-teal-950/40 px-2.5 py-1.5 text-teal-300 hover:bg-teal-900/60 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Voltar para o Site Público"
              >
                <Globe className="h-3.5 w-3.5 text-teal-400" />
                <span className="hidden sm:inline">Site Público</span>
              </button>

              <button
                onClick={onLogout}
                className="rounded-xl border border-slate-800 bg-slate-800 p-2 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-colors flex items-center gap-1 text-xs cursor-pointer"
                title="Bloquear / Sair"
              >
                <Lock className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
