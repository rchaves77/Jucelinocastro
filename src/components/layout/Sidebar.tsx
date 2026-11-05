import React, { useState } from 'react';
import { ClinicLogo } from '../common/ClinicLogo';
import {
  Calendar,
  Users,
  BarChart3,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck,
  MessageCircle,
  Star,
  FileCheck,
  X,
  ListTodo,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'agenda'
  | 'pacientes'
  | 'tarefas'
  | 'analytics'
  | 'online-booking'
  | 'chat'
  | 'equipe';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  userRole: string;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenValidationModal?: () => void;
  onOpenPendingApprovals?: () => void;
  onOpenAuditLog?: () => void;
  onOpenWhatsAppDispatch?: () => void;
  onOpenGoogleReview?: () => void;
  onOpenSupabaseModal?: () => void;
  pendingCount?: number;
  pendingTasksCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  userRole,
  isOpen = false,
  onClose,
  onOpenValidationModal,
  onOpenPendingApprovals,
  onOpenAuditLog,
  onOpenWhatsAppDispatch,
  onOpenGoogleReview,
  onOpenSupabaseModal,
  pendingCount = 0,
  pendingTasksCount = 0,
}) => {
  const [showValidator, setShowValidator] = useState(() => {
    return localStorage.getItem('jc_show_validator') !== 'false';
  });

  const toggleValidator = () => {
    const nextState = !showValidator;
    setShowValidator(nextState);
    localStorage.setItem('jc_show_validator', String(nextState));
  };

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    if (onClose) onClose();
  };

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Painel Principal',
      icon: LayoutDashboard,
      roles: ['admin', 'physio', 'secretary'],
    },
    {
      id: 'agenda' as ActiveTab,
      label: 'Agenda & Horários',
      icon: Calendar,
      roles: ['admin', 'physio', 'secretary'],
      badge: 'Hoje',
    },
    {
      id: 'pacientes' as ActiveTab,
      label: 'Pacientes & Prontuários',
      icon: Users,
      roles: ['admin', 'physio', 'secretary'],
    },
    {
      id: 'tarefas' as ActiveTab,
      label: 'Tarefas & Lembretes',
      icon: ListTodo,
      roles: ['admin', 'physio', 'secretary'],
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
    },
    {
      id: 'equipe' as ActiveTab,
      label: 'Gestão de Equipe & Perfis',
      icon: ShieldCheck,
      roles: ['admin', 'secretary'],
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Analytics & Relatórios',
      icon: BarChart3,
      roles: ['admin'],
    },
    {
      id: 'chat' as ActiveTab,
      label: 'Chat Interno',
      icon: MessageSquare,
      roles: ['admin', 'physio', 'secretary'],
    },
    {
      id: 'online-booking' as ActiveTab,
      label: 'Agendamento Online',
      icon: Globe,
      roles: ['admin', 'physio', 'secretary'],
      highlight: true,
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 select-none shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-64 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Close Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 lg:hidden bg-slate-950/60">
          <ClinicLogo variant="sidebar" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            title="Fechar Menu"
          >
            <X className="h-5 w-5 text-rose-400" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navegação Clínica
          </div>

          {navItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-slate-300'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? 'bg-slate-950/20 text-slate-950'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.highlight && !isActive && (
                    <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}

          {/* Separator & Tools Section */}
          <div className="pt-4 pb-1 px-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-800 mt-3">
            <span>Ferramentas & Ações</span>
            <button
              onClick={toggleValidator}
              className="text-[10px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 normal-case font-medium transition-colors cursor-pointer"
              title={showValidator ? 'Ocultar Validador do Menu' : 'Exibir Validador no Menu'}
            >
              {showValidator ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              <span>{showValidator ? 'Ocultar' : 'Mostrar'}</span>
            </button>
          </div>

          {/* Validator Menu Item */}
          {showValidator && onOpenValidationModal && (
            <button
              onClick={() => {
                onOpenValidationModal();
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="h-4 w-4 text-emerald-400" />
                <span>Validar Declaração</span>
              </div>
              <span className="text-[10px] text-emerald-300 font-mono">QR</span>
            </button>
          )}

          {/* Quick Tools Buttons */}
          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {onOpenPendingApprovals && (
              <button
                onClick={() => {
                  onOpenPendingApprovals();
                  if (onClose) onClose();
                }}
                className="flex items-center gap-1.5 p-2 rounded-xl text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Aprovações</span>
                {pendingCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-bold px-1 rounded-full text-[9px]">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}

            {onOpenWhatsAppDispatch && (
              <button
                onClick={() => {
                  onOpenWhatsAppDispatch();
                  if (onClose) onClose();
                }}
                className="flex items-center gap-1.5 p-2 rounded-xl text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Disparador</span>
              </button>
            )}

            {onOpenAuditLog && userRole === 'admin' && (
              <button
                onClick={() => {
                  onOpenAuditLog();
                  if (onClose) onClose();
                }}
                className="flex items-center gap-1.5 p-2 rounded-xl text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <Shield className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span className="truncate">Auditoria</span>
              </button>
            )}

            {onOpenGoogleReview && (
              <button
                onClick={() => {
                  onOpenGoogleReview();
                  if (onClose) onClose();
                }}
                className="flex items-center gap-1.5 p-2 rounded-xl text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span className="truncate">Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer / Branding */}
        <div className="p-3 m-2 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <ClinicLogo variant="sidebar" />
          <div className="text-[11px] font-medium border-t border-slate-800 pt-2 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-300">Última atualização:</span>
              <span className="text-emerald-300 font-mono font-semibold">15/10/2026 às 15:50</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-300">Feito por:</span>
              <span className="text-emerald-300 font-bold">Rômulo Chaves - @ClienteBox</span>
            </div>
            <div className="pt-1 text-[10px] text-slate-400 text-center font-medium">
              Jucelino Castro Fisioterapia • v2026
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
