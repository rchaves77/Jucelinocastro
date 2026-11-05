import { Patient, Appointment, User, ChatMessage, ClinicMetrics } from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Rômulo Chaves',
    email: 'romulochaves77@gmail.com',
    role: 'admin',
    password: '123',
    specialty: 'Administrador Clínico & Gestão Integrada',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'u2',
    name: 'Dr. Jucelino Castro',
    email: 'jucelino.castro@jcfisioterapia.com.br',
    role: 'physio',
    password: '123',
    crefito: 'CREFITO-3/184920-F',
    specialty: 'Fisioterapia Ortopédica, Traumatologia & Quiropraxia',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'u3',
    name: 'Dra. Aline Castro',
    email: 'aline.castro@jcfisioterapia.com.br',
    role: 'physio',
    password: '123',
    crefito: 'CREFITO-3/209182-F',
    specialty: 'Pilates Clínico & Reabilitação Postural (RPG)',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78905?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'u4',
    name: 'Katiuscia Braga Castro',
    email: 'katiuscia.castro@jcfisioterapia.com.br',
    role: 'secretary',
    password: '123',
    specialty: 'Recepção, Atendimento & Gestão de Agenda',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
];

export const mockPatients: Patient[] = [];

export const mockAppointments: Appointment[] = [];

export const mockChatMessages: ChatMessage[] = [];

export const mockClinicMetrics: ClinicMetrics = {
  totalPatients: 0,
  activePatients: 0,
  monthlyRevenue: 0,
  attendanceRate: 100,
  monthlyAppointments: 0,
  topTreatments: [],
};

