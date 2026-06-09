-- ============================================================
-- CRM Eva Luz Vendas — Schema Supabase
-- Cole este conteúdo completo no SQL Editor do Supabase
-- ============================================================

-- Perfis de usuários (vinculados ao auth.users do Supabase)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'colaborador' CHECK (role IN ('admin', 'colaborador')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contatos / Prospects / Alunos
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  instagram TEXT,
  facebook TEXT,
  other_social TEXT,
  source TEXT DEFAULT 'instagram' CHECK (source IN (
    'instagram', 'youtube', 'facebook', 'google',
    'hotmart', 'indicacao', 'trafego_pago', 'outro'
  )),
  funnel_stage TEXT DEFAULT 'abordagem' CHECK (funnel_stage IN (
    'abordagem', 'sondagem', 'apresentacao', 'negociacao',
    'follow_up', 'vendas_efetivadas', 'pos_vendas',
    'indicacao', 'trafego_pago', 'sem_interesse', 'reativar'
  )),
  client_type TEXT CHECK (client_type IN (
    'pragmatico', 'analitico', 'consensual', 'inovador',
    'desconfiado', 'conservador', 'estraga_prazeres', 'economico'
  )),
  sensory_system TEXT CHECK (sensory_system IN ('visual', 'auditivo', 'sinestesico')),
  disc_profile TEXT CHECK (disc_profile IN ('executor', 'comunicador', 'planejador', 'analista')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Histórico de interações com o contato
CREATE TABLE contact_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  type TEXT DEFAULT 'whatsapp' CHECK (type IN (
    'whatsapp', 'ligacao', 'email', 'reuniao', 'outro'
  )),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Tarefas com cadência
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  due_time TIME,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'concluida', 'atrasada')),
  reminder_email BOOLEAN DEFAULT FALSE,
  whatsapp_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Métricas: contatos feitos, cotações enviadas, vendas efetivadas
CREATE TABLE metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('contato', 'cotacao', 'venda')),
  value DECIMAL(10,2),
  date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- Profiles: leitura pública para autenticados, atualização do próprio perfil
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Contacts: todos os autenticados lêem e escrevem; só admin deleta
CREATE POLICY "contacts_select" ON contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "contacts_insert" ON contacts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "contacts_update" ON contacts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "contacts_delete" ON contacts FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Contact History: todos lêem e inserem; dono deleta
CREATE POLICY "history_select" ON contact_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "history_insert" ON contact_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "history_delete" ON contact_history FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- Tasks: todos lêem, inserem e atualizam; dono deleta
CREATE POLICY "tasks_select" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "tasks_insert" ON tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tasks_update" ON tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "tasks_delete" ON tasks FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- Metrics: todos lêem e inserem
CREATE POLICY "metrics_select" ON metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "metrics_insert" ON metrics FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- Trigger: atualiza updated_at automaticamente em contacts
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Função para atualizar tarefas atrasadas automaticamente
-- ============================================================

CREATE OR REPLACE FUNCTION mark_overdue_tasks()
RETURNS void AS $$
BEGIN
  UPDATE tasks
  SET status = 'atrasada'
  WHERE status = 'pendente'
    AND due_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;
