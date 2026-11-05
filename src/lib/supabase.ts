import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://cvfxnjdlbzalmimrntjz.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZnhuamRsYnphbG1pbXJudGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3ODE4NTAsImV4cCI6MjEwMTM1Nzg1MH0.DYNbzmGMfJ9r0xdKix3tndt5RhjKntoCC54Co3JWD0s';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL Schema script helper for setting up tables in Supabase Dashboard SQL Editor
 */
export const SUPABASE_SQL_SETUP = `
-- ====================================================================
-- SCRIPT DE CRIAÇÃO E POVOAMENTO - JUCELINO CASTRO FISIOTERAPIA (SUPABASE NUVEM)
-- Cole este script no SQL Editor do seu Supabase (https://supabase.com/dashboard)
-- e clique em "RUN".
-- ====================================================================

-- 1. TABELA DE USUÁRIOS E EQUIPE (LOGINS & PERFIS)
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL, -- 'admin', 'physio', 'secretary', 'patient'
  specialty TEXT,
  crefito TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active',
  password TEXT DEFAULT '123',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE PACIENTES & PRONTUÁRIOS
CREATE TABLE IF NOT EXISTS pacientes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cpf TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  birth_date TEXT,
  gender TEXT,
  address TEXT,
  photo_url TEXT,
  assigned_physio_id TEXT,
  assigned_physio_name TEXT,
  main_complaint TEXT,
  status TEXT DEFAULT 'Ativo',
  anamnesis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE AGENDAMENTOS
CREATE TABLE IF NOT EXISTS agendamentos (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES pacientes(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_phone TEXT,
  physio_id TEXT NOT NULL,
  physio_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  type TEXT NOT NULL,
  room TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed', -- 'confirmed', 'completed', 'canceled', 'pending'
  price NUMERIC DEFAULT 180,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DESABILITAR RLS OU ADICIONAR POLÍTICA PÚBLICA PARA API ANON
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acesso total usuarios" ON usuarios;
CREATE POLICY "Acesso total usuarios" ON usuarios FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total pacientes" ON pacientes;
CREATE POLICY "Acesso total pacientes" ON pacientes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total agendamentos" ON agendamentos;
CREATE POLICY "Acesso total agendamentos" ON agendamentos FOR ALL USING (true) WITH CHECK (true);

-- 5. SEED INICIAL DE USUÁRIOS / LOGINS
INSERT INTO usuarios (id, name, email, role, specialty, crefito, avatar_url, status, password)
VALUES 
  ('u1', 'Rômulo Chaves', 'romulochaves77@gmail.com', 'admin', 'Administrador Clínico & Gestão Integrada', NULL, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', 'active', '123'),
  ('u2', 'Dr. Jucelino Castro', 'jucelino.castro@jcfisioterapia.com.br', 'physio', 'Fisioterapia Ortopédica, Traumatologia & Quiropraxia', 'CREFITO-3/184920-F', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80', 'active', '123'),
  ('u3', 'Dra. Aline Castro', 'aline.castro@jcfisioterapia.com.br', 'physio', 'Pilates Clínico & Reabilitação Postural (RPG)', 'CREFITO-3/209182-F', 'https://images.unsplash.com/photo-1594824813566-88855ce78905?w=300&auto=format&fit=crop&q=80', 'active', '123'),
  ('u4', 'Katiuscia Braga Castro', 'katiuscia.castro@jcfisioterapia.com.br', 'secretary', 'Recepção, Atendimento & Gestão de Agenda', NULL, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80', 'active', '123')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED INICIAL DE PACIENTES
INSERT INTO pacientes (id, name, cpf, phone, email, birth_date, gender, address, photo_url, assigned_physio_id, assigned_physio_name, main_complaint, status)
VALUES
  ('p1', 'Maria Oliveira Silva', '123.456.789-00', '(11) 98765-4321', 'maria.silva@email.com', '1985-04-12', 'Feminino', 'Av. Paulista, 1000 - São Paulo/SP', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80', 'u2', 'Dr. Jucelino Castro', 'Dor lombar crônica e irradiação para o ciático', 'Ativo'),
  ('p2', 'Carlos Eduardo Lima', '987.654.321-11', '(11) 91234-5678', 'carlos.lima@email.com', '1990-08-25', 'Masculino', 'Rua Augusta, 450 - São Paulo/SP', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', 'u2', 'Dr. Jucelino Castro', 'Cervicalgia decorrente de má postura no trabalho', 'Ativo')
ON CONFLICT (id) DO NOTHING;
`;
