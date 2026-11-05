import React, { useState, useRef, useEffect } from 'react';
import { UserRole, User, ClinicNotification } from '../../types';
import {
  Bell,
  Search,
  MessageSquare,
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const userNotifications = (notifications || []).filter(
    (n) => !n.targetUserId || n.targetUserId === 'all' || n.targetUserId === currentUser.id
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900 px-3 md:px-6 backdrop-blur-md">

      {/* Esquerda: menu, logo e busca */}
      <div className="flex items-center gap-2 lg:gap-4">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 hover:text-emerald-300 hover:bg-slate-700 transition-all cursor-pointer shrink-0 shadow-sm"
          title={isSidebarOpen ? 'Fechar Menu' : 'Abrir Menu'}
          aria-label="Menu Principal"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <ClinicLogo variant="header" onLogoClick={onOpenProfileModal} />

        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar paciente ou CPF..."
            className="w-full rounded-full border border-slate-700 bg-slate-800 py-1.5 pl-8 pr-3 text-xs text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Direita: ações, notificações e perfil */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Confirmar pacientes */}
        {onOpenPatientConfirmation && (
          <button
            onClick={onOpenPatientConfirmation}
            className="relative flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
            title="Confirmar presença de pacientes"
          >
            <UserCheck className="h-4 w-4" />
            <span className="hidden lg:inline">Confirmar Pacientes</span>
            {pendingConfirmationsCount > 0 && (
              <span className="ml-0.5 rounded-full bg-amber-500 px-1.5 text-[10px] font-black text-slate-950">
                {pendingConfirmationsCount}
              </span>
            )}
          </button>
        )}

        {/* Novo agendamento */}
        <button
          onClick={onOpenNewAppointment}
          className="hidden sm:flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer shadow-md"
          title="Novo agendamento"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden lg:inline">Agendar</span>
        </button>

        {/* Novo paciente */}
        <button
          onClick={onOpenNewPatient}
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          title="Novo paciente"
        >
          <ListTodo className="h-4 w-4" />
          <span className="hidden lg:inline">Paciente</span>
        </button>

        {/* Chat */}
        <button
          onClick={onToggleChat}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          title="Chat interno"
        >
          <MessageSquare className="h-4 w-4" />
          {unreadChatCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white">
              {unreadChatCount}
            </span>
          )}
        </button>

        {/* Notificações */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            title="Notificações"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <h3 className="text-sm font-bold text-white">Notificações</h3>
                <div className="flex items-center gap-2">
                  {onMarkAllNotificationsRead && unreadCount > 0 && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                  {onClearNotifications && userNotifications.length > 0 && (
                    <button
                      onClick={onClearNotifications}
                      className="text-[11px] font-semibold text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
                      title="Limpar todas"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {userNotifications.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <Bell className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Nenhuma notificação</p>
                  </div>
                ) : (
                  userNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex items-start gap-3 border-b border-slate-800 px-4 py-3 hover:bg-slate-800 transition-colors ${
                        !notif.read ? 'bg-slate-800/50' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'task' ? (
                          <ListTodo className="h-4 w-4 text-sky-400" />
                        ) : notif.type === 'confirmation' ? (
                          <CheckCheck className="h-4 w-4 text-emerald-400" />
                        ) : notif.type === 'alert' ? (
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                        ) : (
                          <Clock className="h-4 w-4 text-slate-400" />
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (onToggleNotificationRead) onToggleNotificationRead(notif.id);
                          if (onSelectNotification) onSelectNotification(notif);
                          setIsNotificationsOpen(false);
                        }}
                        className="flex-1 text-left min-w-0 cursor-pointer"
                      >
                        <p
                          className={`text-xs leading-snug ${
                            !notif.read ? 'font-bold text-white' : 'font-medium text-slate-300'
                          }`}
                        >
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                      </button>

                      {onDeleteNotification && (
                        <button
                          onClick={() => onDeleteNotification(notif.id)}
                          className="shrink-0 rounded-lg p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-700 transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Perfil do usuário */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-2 py-1.5 hover:bg-slate-700 transition-colors cursor-pointer group"
          >
            <img
              src={
                currentUser.photoUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
              }
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover border-2 border-emerald-500 shadow-sm group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight capitalize">
                {currentUser.role === 'admin'
                  ? 'Administrador'
                  : currentUser.role === 'physio'
                  ? 'Fisioterapeuta'
                  : currentUser.role === 'secretary'
                  ? 'Secretária'
                  : currentUser.role}
              </p>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden z-50">
              <div className="border-b border-slate-800 px-4 py-3">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
              </div>

              <div className="p-1.5">
                {onOpenProfileModal && (
                  <button
                    onClick={() => {
                      onOpenProfileModal();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  >
                    <UserCog className="h-4 w-4 text-slate-400" />
                    Meu Perfil
                  </button>
                )}

                {users.length > 1 && (
                  <div className="mt-1 pt-1 border-t border-slate-800">
                    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Trocar Perfil
                    </p>
                    {users.slice(0, 4).map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onRoleChange(u.role);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${
                          u.id === currentUser.id
                            ? 'text-emerald-300 bg-emerald-500/10'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{u.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {onLogout && (
                  <button
                    onClick={() => {
                      onLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 mt-1 pt-2 border-t border-slate-800 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    Sair do Sistema
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Site público */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden xl:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
          title="Abrir site público"
        >
          <Globe className="h-4 w-4" />
          <span>Site Público</span>
        </a>
      </div>
    </header>
  );
};
