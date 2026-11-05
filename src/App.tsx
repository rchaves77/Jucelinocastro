import React, { useState } from 'react';
import {
  UserRole,
  User,
  ChatMessage,
  Appointment,
  Patient,
  AttendanceCertificate,
} from './types';
import { mockChatMessages } from './db/mockDb';
import { Header } from './components/layout/Header';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { ImageZoomModal } from './components/common/ImageZoomModal';
import { ChatDrawer } from './components/chat/ChatDrawer';
import { ToastProvider } from './components/common/Toast';
import { AgendaProvider, useAgenda } from './features/agenda/context/AgendaContext';
import { PatientProvider, usePatients } from './features/pacientes/context/PatientContext';
import { useUserState } from './features/equipe/hooks/useUserState';
import { useEvolutionTemplates } from './features/templates/hooks/useEvolutionTemplates';
import { useAuditState } from './features/audit/hooks/useAuditState';
import { useCertificateState } from './features/certificates/hooks/useCertificateState';
import { useNotificationState } from './features/notifications/hooks/useNotificationState';
import { useTasksState } from './features/tarefas/hooks/useTasksState';

// Features
import { AdminDashboard } from './features/dashboards/AdminDashboard';
import { PhysioDashboard } from './features/dashboards/PhysioDashboard';
import { SecretaryDashboard } from './features/dashboards/SecretaryDashboard';
import { AdvancedAgendaDashboard } from './features/agenda/AdvancedAgendaDashboard';
import { PatientManagementDashboard } from './features/pacientes/PatientManagementDashboard';
import { PatientPortal } from './features/pacientes/PatientPortal';
import { OnlineBooking } from './features/agendamento-online/OnlineBooking';
import { AnalyticsDashboard } from './features/analytics/AnalyticsDashboard';
import { TeamManagementDashboard } from './features/equipe/TeamManagementDashboard';
import { TasksManagementDashboard } from './features/tarefas/TasksManagementDashboard';
import { LoginOverlay } from './features/auth/LoginOverlay';
import { GoogleReviewModal } from './components/common/GoogleReviewModal';
import { WhatsAppDispatchModal } from './components/common/WhatsAppDispatchModal';
import { PendingApprovalsModal } from './features/equipe/components/PendingApprovalsModal';
import { AuditLogModal } from './features/audit/components/AuditLogModal';
import { CertificateModal } from './features/certificates/components/CertificateModal';
import { ValidationPageModal } from './features/certificates/components/ValidationPageModal';
import { UserProfileModal } from './features/equipe/components/UserProfileModal';
import { SupabaseConfigModal } from './components/common/SupabaseConfigModal';
import { PublicLandingPage } from './features/public/PublicLandingPage';
import { QuickPatientConfirmationModal } from './features/agenda/components/QuickPatientConfirmationModal';
import { SystemUpdateBadge } from './components/common/SystemUpdateBadge';

const AppContent: React.FC = () => {
  // --- ESTADOS GLOBAIS ---
  const {
    users = [],
    activeUsers = [],
    pendingUsers = [],
    registerUser,
    approveUser,
    rejectUser,
    getPhysios,
    updateUser,
  } = useUserState();

  const { templates = [], addTemplate, updateTemplate, deleteTemplate } = useEvolutionTemplates();
  const { logs = [], addAuditLog, clearAuditLogs } = useAuditState();
  const { certificates = [], generateCertificate, getCertificateById } = useCertificateState();

  const {
    notifications = [],
    addNotification,
    toggleRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  } = useNotificationState();

  const { tasks = [], addTask, updateTask, deleteTask, toggleTaskStatus } = useTasksState({
    onTaskCreatedNotification: (title, message, targetUserId) => {
      addNotification({ title, message, type: 'task', targetUserId, linkTab: 'tarefas' });
    },
  });

  // PatientProvider — lista completa, sem filtro de busca global
  const { allPatients = [], handleConfirmPatientAttendance } = usePatients();

  // AgendaProvider — fonte única de verdade da agenda
  const { appointments, allAppointments, handleCreateOrUpdate } = useAgenda();

  // --- ESTADOS DE INTERFACE ---
  const initialUser =
    users.find((u) => u?.name?.includes('Rômulo')) || activeUsers[0] || users[0] || null;

  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGoogleReviewOpen, setIsGoogleReviewOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isPatientConfirmationOpen, setIsPatientConfirmationOpen] = useState(false);
  const [selectedWhatsAppPatient, setSelectedWhatsAppPatient] = useState<Patient | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<AttendanceCertificate | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationInitialCode, setValidationInitialCode] = useState('');
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [openPatientModal, setOpenPatientModal] = useState(false);

  // --- LÓGICA DE NEGÓCIO ---
  const todayStr = new Date().toISOString().split('T')[0];

  // Usa a lista completa — a filtrada esconde cancelados e faltas
  const pendingConfirmationsCount = (allAppointments || []).filter(
    (a) => a.date === todayStr && a.status !== 'confirmed' && a.status !== 'completed'
  ).length;

  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setIsLocked(false);
    setIsLoginModalOpen(false);
    setActiveTab('dashboard');
  };

  const handleConfirmAttendance = (app: Appointment) => {
    handleCreateOrUpdate({ ...app, status: 'confirmed' });
    handleConfirmPatientAttendance(app.patientId, {
      timeSlot: app.timeSlot,
      type: app.type,
      physioName: app.physioName,
    });
    addNotification({
      title: 'Presença Confirmada',
      message: `Paciente ${app.patientName} confirmado.`,
      type: 'confirmation',
      linkTab: 'agenda',
    });
  };

  const navigateToPatientRecord = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('pacientes');
  };

  // --- RENDERIZAÇÃO ---

  // 1. ESTADO BLOQUEADO (LANDING PAGE)
  if (isLocked) {
    return (
      <div className="relative min-h-screen bg-white font-sans antialiased">
        <PublicLandingPage
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onOpenValidationModal={() => {
            setValidationInitialCode('');
            setIsValidationModalOpen(true);
          }}
        />
        <LoginOverlay
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          users={users}
          pendingCount={pendingUsers.length}
          onRegisterUser={registerUser}
          onLoginSuccess={handleSwitchUser}
        />
        <ValidationPageModal
          isOpen={isValidationModalOpen}
          onClose={() => setIsValidationModalOpen(false)}
          certificates={certificates}
          initialCode={validationInitialCode}
          onLookupCertificate={getCertificateById}
        />
      </div>
    );
  }

  // 2. GUARDA DEFENSIVA: sem usuário logado, volta para a landing page
  if (!currentUser) {
    return (
      <div className="relative min-h-screen bg-white font-sans antialiased">
        <PublicLandingPage
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onOpenValidationModal={() => {
            setValidationInitialCode('');
            setIsValidationModalOpen(true);
          }}
        />
        <LoginOverlay
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          users={users}
          pendingCount={pendingUsers.length}
          onRegisterUser={registerUser}
          onLoginSuccess={handleSwitchUser}
        />
      </div>
    );
  }

  // 3. SISTEMA INTERNO (LOGADO)
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      <Header
        currentUser={currentUser}
        users={users}
        onRoleChange={(role) => {
          const u = users.find((x) => x.role === role);
          if (u) setCurrentUser(u);
          setActiveTab('dashboard');
        }}
        onOpenNewAppointment={() => {
          setActiveTab('agenda');
          setOpenAppointmentModal(true);
        }}
        onOpenNewPatient={() => {
          setActiveTab('pacientes');
          setOpenPatientModal(true);
        }}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onLogout={() => setIsLocked(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        pendingConfirmationsCount={pendingConfirmationsCount}
        onOpenPatientConfirmation={() => setIsPatientConfirmationOpen(true)}
        notifications={notifications}
        onMarkAllNotificationsRead={() => markAllAsRead(currentUser.id)}
        onToggleNotificationRead={toggleRead}
        onDeleteNotification={deleteNotification}
        onClearNotifications={clearNotifications}
        onSelectNotification={(notif) => {
          if (notif.linkTab) setActiveTab(notif.linkTab as ActiveTab);
        }}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab !== 'pacientes') setSelectedPatientId(null);
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }}
          userRole={currentUser.role}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenPendingApprovals={() => setIsPendingModalOpen(true)}
          onOpenAuditLog={() => setIsAuditModalOpen(true)}
          onOpenWhatsAppDispatch={() => setIsWhatsAppOpen(true)}
          onOpenGoogleReview={() => setIsGoogleReviewOpen(true)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          onOpenValidationModal={() => {
            setValidationInitialCode('');
            setIsValidationModalOpen(true);
          }}
          pendingCount={pendingUsers.length}
          pendingTasksCount={(tasks || []).filter((t) => t.status === 'pendente').length}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {currentUser.role === 'patient' && activeTab !== 'online-booking' ? (
            <PatientPortal
              patients={allPatients}
              appointments={appointments}
              onGoToBooking={() => setActiveTab('online-booking')}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && currentUser.role === 'admin' && (
                <AdminDashboard
                  patients={allPatients}
                  appointments={appointments}
                  onNavigateToAgenda={() => setActiveTab('agenda')}
                  onNavigateToPatients={() => setActiveTab('pacientes')}
                  onNavigateToAnalytics={() => setActiveTab('analytics')}
                />
              )}

              {activeTab === 'dashboard' && currentUser.role === 'physio' && (
                <PhysioDashboard
                  patients={allPatients}
                  appointments={appointments}
                  onSelectPatient={navigateToPatientRecord}
                />
              )}

              {activeTab === 'dashboard' && currentUser.role === 'secretary' && (
                <SecretaryDashboard
                  appointments={appointments}
                  onConfirmAttendance={handleConfirmAttendance}
                  userName={currentUser.name}
                  onNavigateToAgenda={() => setActiveTab('agenda')}
                />
              )}

              {activeTab === 'tarefas' && (
                <TasksManagementDashboard
                  tasks={tasks}
                  currentUser={currentUser}
                  users={users}
                  patients={allPatients}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onToggleTaskStatus={toggleTaskStatus}
                />
              )}

              {activeTab === 'agenda' && (
                <AdvancedAgendaDashboard
                  onViewPatientRecord={navigateToPatientRecord}
                  physios={getPhysios()}
                  onGenerateCertificate={generateCertificate}
                />
              )}

              {activeTab === 'pacientes' && (
                <PatientManagementDashboard
                  selectedPatientIdParam={selectedPatientId}
                  currentUser={currentUser}
                  templates={templates}
                  onAddAuditLog={addAuditLog}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsDashboard patients={allPatients} appointments={appointments} />
              )}

              {activeTab === 'equipe' && (
                <TeamManagementDashboard
                  currentUser={currentUser}
                  onSwitchUser={handleSwitchUser}
                />
              )}

              {activeTab === 'online-booking' && <OnlineBooking />}
            </>
          )}
        </main>
      </div>

      {/* Modais Globais */}
      <ImageZoomModal />
      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
      <WhatsAppDispatchModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        patients={allPatients}
        appointments={appointments}
      />
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={logs}
        onClearLogs={clearAuditLogs}
        currentUserRole={currentUser.role}
      />
      <PendingApprovalsModal
        isOpen={isPendingModalOpen}
        onClose={() => setIsPendingModalOpen(false)}
        pendingUsers={pendingUsers}
        onApproveUser={approveUser}
        onRejectUser={rejectUser}
      />
      <SystemUpdateBadge />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AgendaProvider>
        <PatientProvider>
          <AppContent />
        </PatientProvider>
      </AgendaProvider>
    </ToastProvider>
  );
}
