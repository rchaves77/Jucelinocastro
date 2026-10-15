import React, { useState, useEffect } from 'react';
import { UserRole, User, ChatMessage, Appointment, Patient, AttendanceCertificate } from './types';
import { mockChatMessages } from './db/mockDb';
import { Header } from './components/layout/Header';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { ImageZoomModal } from './components/common/ImageZoomModal';
import { ChatDrawer } from './components/chat/ChatDrawer';
import { usePatientState } from './features/pacientes/hooks/usePatientState';
import { useAgendaState } from './features/agenda/hooks/useAgendaState';
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

export default function App() {
  const {
    users,
    activeUsers,
    pendingUsers,
    registerUser,
    approveUser,
    rejectUser,
    getPhysios,
    updateUser,
  } = useUserState();

  // Evolution Templates, Audit & Certificate States
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useEvolutionTemplates();
  const { logs, addAuditLog, clearAuditLogs } = useAuditState();
  const { certificates, generateCertificate, getCertificateById } = useCertificateState();

  // Real Notifications State
  const {
    notifications,
    addNotification,
    toggleRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  } = useNotificationState();

  // Real Tasks System for Secretary & Staff
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  } = useTasksState({
    onTaskCreatedNotification: (title, message, targetUserId) => {
      addNotification({
        title,
        message,
        type: 'task',
        targetUserId,
        linkTab: 'tarefas',
      });
    },
  });

  // Find Rômulo Chaves (admin) as default user, or first active user
  const initialUser = users.find((u) => u.name.includes('Rômulo')) || activeUsers[0] || users[0];
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
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

  // Certificate Modals State
  const [activeCertificate, setActiveCertificate] = useState<AttendanceCertificate | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationInitialCode, setValidationInitialCode] = useState('');

  // Check URL query parameters for validation link (e.g. ?validar=JC-DECL-2026-8801)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('validar');
    if (code) {
      setValidationInitialCode(code);
      setIsValidationModalOpen(true);
    }
  }, []);

  // Authentication / System Lock state
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Dynamic Data Hooks
  const {
    patients,
    allPatients,
    handleConfirmPatientAttendance,
  } = usePatientState();

  const { appointments, handleCreateOrUpdate } = useAgendaState();

  // Pending Confirmations for Today
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingConfirmationsCount = appointments.filter(
    (a) => a.date === todayStr && a.status !== 'confirmed' && a.status !== 'completed'
  ).length;

  // Handler for generating Attendance Certificate for an appointment
  const handleGenerateCertificateForAppointment = (app: Appointment) => {
    const patientObj = allPatients.find((p) => p.id === app.patientId);
    const cert = generateCertificate({
      patientId: app.patientId,
      patientName: app.patientName,
      patientCpf: patientObj?.cpf || '123.456.789-00',
      appointmentDate: app.date,
      timeSlot: app.timeSlot,
      physioName: app.physioName,
      receptionistName: currentUser.name,
    });

    addAuditLog({
      authorName: currentUser.name,
      authorRole: currentUser.role,
      action: 'Emissão de Declaração',
      details: `Emitiu declaração de comparecimento para o(a) paciente ${app.patientName} (${app.timeSlot}). Declaração ${cert.id} emitida com QR Code.`,
      targetPatientName: app.patientName,
      targetPatientId: app.patientId,
      module: 'Atendimento/Recepção',
    });

    setActiveCertificate(cert);
    setIsCertificateModalOpen(true);
  };

  // Handler for Reception confirming patient presence (triggers auto-evolution, certificate generation + audit log!)
  const handleConfirmAttendance = (app: Appointment) => {
    // 1. Update appointment status to 'confirmed'
    handleCreateOrUpdate({ ...app, status: 'confirmed' });

    // 2. Trigger automatic evolution entry in patient's medical record
    handleConfirmPatientAttendance(app.patientId, {
      timeSlot: app.timeSlot,
      type: app.type,
      physioName: app.physioName,
    });

    // 3. Real notification
    addNotification({
      title: 'Presença Confirmada',
      message: `Paciente ${app.patientName} confirmado hoje às ${app.timeSlot} (${app.physioName}).`,
      type: 'confirmation',
      linkTab: 'agenda',
    });

    // 4. Generate Certificate of Attendance (Declaração de Comparecimento) with QR Code
    handleGenerateCertificateForAppointment(app);
  };

  // Global Image Zoom Modal State
  const [zoomModalData, setZoomModalData] = useState<{
    isOpen: boolean;
    title: string;
    imageUrl: string;
    category?: string;
    date?: string;
    notes?: string;
  }>({
    isOpen: false,
    title: '',
    imageUrl: '',
  });

  // Patient Prontuário direct navigation state
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Global Quick Modal triggers
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [openPatientModal, setOpenPatientModal] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    const matchingUser = users.find((u) => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    } else {
      const fallbackUser: User = {
        id: `user_${role}`,
        name: role === 'admin' ? 'Rômulo Chaves' : role === 'physio' ? 'Dr. Jucelino Castro' : 'Katiuscia Braga Castro',
        email: 'acesso@jcfisioterapia.com.br',
        role,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      };
      setCurrentUser(fallbackUser);
    }

    setActiveTab('dashboard');
  };

  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setIsLocked(false);
    setActiveTab('dashboard');
  };

  const handleOpenZoomImage = (
    title: string,
    imageUrl: string,
    category?: string,
    date?: string,
    notes?: string
  ) => {
    setZoomModalData({
      isOpen: true,
      title,
      imageUrl,
      category,
      date,
      notes,
    });
  };

  const handleSendMessage = (content: string) => {
    const newMsg: ChatMessage = {
      id: `c_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      content,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const navigateToPatientRecord = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('pacientes');
  };

  if (isLocked) {
    return (
      <div className="relative min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
        {/* Public Presentation Landing Page */}
        <PublicLandingPage
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onOpenValidationModal={() => {
            setValidationInitialCode('');
            setIsValidationModalOpen(true);
          }}
        />

        {/* Login Modal for Staff & Team Access */}
        <LoginOverlay
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          users={users}
          pendingCount={pendingUsers.length}
          onRegisterUser={(userData) => {
            registerUser(userData);
          }}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsLocked(false);
            setIsLoginModalOpen(false);
          }}
        />

        {/* Public / Reception Certificate Validation Portal */}
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

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header
          currentUser={currentUser}
          users={users}
          onRoleChange={handleRoleChange}
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
          unreadChatCount={0}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          pendingConfirmationsCount={pendingConfirmationsCount}
          onOpenPatientConfirmation={() => setIsPatientConfirmationOpen(true)}
          notifications={notifications}
          onMarkAllNotificationsRead={() => markAllAsRead(currentUser.id)}
          onToggleNotificationRead={toggleRead}
          onDeleteNotification={deleteNotification}
          onClearNotifications={clearNotifications}
          onSelectNotification={(notif) => {
            if (notif.linkTab) {
              setActiveTab(notif.linkTab as ActiveTab);
            }
          }}
        />

      <div className="flex flex-1">
        {/* Sidebar */}
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
          onOpenValidationModal={() => {
            setValidationInitialCode('');
            setIsValidationModalOpen(true);
          }}
          onOpenPendingApprovals={() => setIsPendingModalOpen(true)}
          onOpenAuditLog={() => setIsAuditModalOpen(true)}
          onOpenWhatsAppDispatch={() => {
            setSelectedWhatsAppPatient(null);
            setIsWhatsAppOpen(true);
          }}
          onOpenGoogleReview={() => setIsGoogleReviewOpen(true)}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          pendingCount={pendingUsers.length}
          pendingTasksCount={tasks.filter((t) => t.status === 'pendente' && (t.assignedToUserId === 'all' || t.assignedToUserId === currentUser.id)).length}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {currentUser.role === 'patient' && activeTab !== 'online-booking' ? (
            <PatientPortal
              patients={patients}
              appointments={appointments}
              onZoomImage={handleOpenZoomImage}
              onGoToBooking={() => setActiveTab('online-booking')}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && currentUser.role === 'admin' && (
                <AdminDashboard
                  patients={patients}
                  appointments={appointments}
                  onNavigateToAgenda={() => setActiveTab('agenda')}
                  onNavigateToPatients={() => setActiveTab('pacientes')}
                  onNavigateToAnalytics={() => setActiveTab('analytics')}
                  onOpenNewAppointment={() => {
                    setActiveTab('agenda');
                    setOpenAppointmentModal(true);
                  }}
                  onOpenNewPatient={() => {
                    setActiveTab('pacientes');
                    setOpenPatientModal(true);
                  }}
                />
              )}

              {activeTab === 'dashboard' && currentUser.role === 'physio' && (
                <PhysioDashboard
                  patients={patients}
                  appointments={appointments}
                  onNavigateToAgenda={() => setActiveTab('agenda')}
                  onNavigateToPatients={() => setActiveTab('pacientes')}
                  onSelectPatient={navigateToPatientRecord}
                  onOpenNewPatient={() => {
                    setActiveTab('pacientes');
                    setOpenPatientModal(true);
                  }}
                />
              )}

              {activeTab === 'dashboard' && currentUser.role === 'secretary' && (
                <SecretaryDashboard
                  appointments={appointments}
                  onNavigateToAgenda={() => setActiveTab('agenda')}
                  onNavigateToPatients={() => setActiveTab('pacientes')}
                  onNavigateToTasks={() => setActiveTab('tarefas')}
                  onOpenNewAppointment={() => {
                    setActiveTab('agenda');
                    setOpenAppointmentModal(true);
                  }}
                  onOpenNewPatient={() => {
                    setActiveTab('pacientes');
                    setOpenPatientModal(true);
                  }}
                  onOpenWhatsAppDispatch={() => {
                    setSelectedWhatsAppPatient(null);
                    setIsWhatsAppOpen(true);
                  }}
                  onConfirmAttendance={handleConfirmAttendance}
                  userName={currentUser.name}
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

              {activeTab === 'equipe' && currentUser.role !== 'physio' && (
                <TeamManagementDashboard
                  currentUser={currentUser}
                  onSwitchUser={handleSwitchUser}
                />
              )}

              {activeTab === 'agenda' && (
                <AdvancedAgendaDashboard
                  onViewPatientRecord={navigateToPatientRecord}
                  externalOpenModal={openAppointmentModal}
                  onCloseExternalModal={() => setOpenAppointmentModal(false)}
                  physios={getPhysios()}
                  onGenerateCertificate={handleGenerateCertificateForAppointment}
                  onOpenWhatsAppConfirmations={() => {
                    setSelectedWhatsAppPatient(null);
                    setIsWhatsAppOpen(true);
                  }}
                />
              )}

              {activeTab === 'pacientes' && (
                <PatientManagementDashboard
                  onZoomImage={handleOpenZoomImage}
                  selectedPatientIdParam={selectedPatientId}
                  externalOpenModal={openPatientModal}
                  onCloseExternalModal={() => setOpenPatientModal(false)}
                  currentUser={currentUser}
                  templates={templates}
                  onAddTemplate={addTemplate}
                  onUpdateTemplate={updateTemplate}
                  onDeleteTemplate={deleteTemplate}
                  onAddAuditLog={addAuditLog}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsDashboard patients={patients} appointments={appointments} />
              )}

              {activeTab === 'online-booking' && <OnlineBooking />}

              {activeTab === 'chat' && (
                <div className="max-w-2xl mx-auto bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl text-center">
                  <h2 className="text-lg font-bold text-slate-100 mb-2">Chat Interno da Equipe</h2>
                  <p className="text-xs text-slate-400 mb-4">
                    Abra o painel lateral de chat clicando no ícone no topo da página.
                  </p>
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors shadow-md"
                  >
                    Abrir Chat Flutuante
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      </div>

      {/* Pending Approvals Admin Modal */}
      <PendingApprovalsModal
        isOpen={isPendingModalOpen}
        onClose={() => setIsPendingModalOpen(false)}
        pendingUsers={pendingUsers}
        onApproveUser={(userId, role) => {
          approveUser(userId, role);
        }}
        onRejectUser={(userId) => {
          rejectUser(userId);
        }}
      />

      {/* Reusable Image Zoom Modal */}
      <ImageZoomModal
        isOpen={zoomModalData.isOpen}
        onClose={() => setZoomModalData((prev) => ({ ...prev, isOpen: false }))}
        title={zoomModalData.title}
        imageUrl={zoomModalData.imageUrl}
        category={zoomModalData.category}
        date={zoomModalData.date}
        notes={zoomModalData.notes}
      />

      {/* Internal Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        currentUser={currentUser}
      />

      {/* Google Review Share Modal */}
      <GoogleReviewModal
        isOpen={isGoogleReviewOpen}
        onClose={() => setIsGoogleReviewOpen(false)}
      />

      {/* WhatsApp Dispatcher Modal */}
      <WhatsAppDispatchModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        patients={allPatients}
        appointments={appointments}
        initialPatient={selectedWhatsAppPatient}
      />

      {/* Audit Log Admin Modal */}
      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={logs}
        onClearLogs={clearAuditLogs}
        currentUserRole={currentUser.role}
      />

      {/* User Profile & Password Management Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={(updatedData) => {
          updateUser(currentUser.id, updatedData);
          setCurrentUser((prev) => ({ ...prev, ...updatedData }));
          addAuditLog({
            authorName: currentUser.name,
            authorRole: currentUser.role,
            action: 'Atualização de Perfil/Senha',
            details: `Usuário ${currentUser.name} atualizou suas informações de perfil / senha secreta.`,
            module: 'Equipe',
          });
        }}
      />

      {/* Declaração de Comparecimento Modal (Generated on Reception Confirmation) */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        certificate={activeCertificate}
        onOpenValidation={(code) => {
          setValidationInitialCode(code);
          setIsValidationModalOpen(true);
        }}
      />

      {/* Quick Patient Confirmation Modal from Header */}
      <QuickPatientConfirmationModal
        isOpen={isPatientConfirmationOpen}
        onClose={() => setIsPatientConfirmationOpen(false)}
        appointments={appointments}
        onConfirmAttendance={handleConfirmAttendance}
        onNavigateToAgenda={() => {
          setIsPatientConfirmationOpen(false);
          setActiveTab('agenda');
        }}
      />

      {/* Public / Reception Certificate Validation Portal */}
      <ValidationPageModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        certificates={certificates}
        initialCode={validationInitialCode}
        onLookupCertificate={getCertificateById}
      />

      {/* Mobile Floating Action Button for Quick Patient Scheduling */}
      {!isLocked && (
        <button
          onClick={() => {
            setActiveTab('agenda');
            setOpenAppointmentModal(true);
          }}
          className="sm:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3.5 font-bold text-slate-950 shadow-2xl hover:bg-emerald-400 active:scale-95 transition-all"
          title="Novo Agendamento Rápido"
        >
          <span className="text-xl font-black">+</span>
          <span className="text-xs">Agendar</span>
        </button>
      )}

      {/* Bottom-left persistent System Update & Author Badge */}
      <SystemUpdateBadge />
    </div>
  );
}

