-- ============================================================
-- CRM Eva Luz Vendas — Atualizações de Schema
-- Execute este arquivo no SQL Editor do Supabase
-- (em ordem, do topo ao fim)
-- ============================================================

-- ── Novas colunas em contacts ─────────────────────────────────

ALTER TABLE contacts ADD COLUMN IF NOT EXISTS cpf TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS nf_link TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;

-- ── Nova coluna em tasks ──────────────────────────────────────

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tipo TEXT
  CHECK (tipo IN ('ligacao','whatsapp','reuniao','email','outro'));

-- ── Trigger: atualiza last_contacted_at ao registrar histórico ─

CREATE OR REPLACE FUNCTION update_last_contacted()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE contacts SET last_contacted_at = NOW() WHERE id = NEW.contact_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_last_contacted_trigger ON contact_history;
CREATE TRIGGER update_last_contacted_trigger
  AFTER INSERT ON contact_history
  FOR EACH ROW EXECUTE FUNCTION update_last_contacted();

-- ── Tabela: propostas ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS propostas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  valor DECIMAL(10,2),
  metodo_pagamento TEXT CHECK (metodo_pagamento IN (
    'pix','cartao_credito','cartao_debito','boleto','dinheiro','transferencia'
  )),
  parcelas INTEGER DEFAULT 1,
  cpf TEXT,
  notas TEXT,
  status TEXT DEFAULT 'enviada' CHECK (status IN ('rascunho','enviada','aceita','recusada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

ALTER TABLE propostas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "propostas_select" ON propostas FOR SELECT TO authenticated USING (true);
CREATE POLICY "propostas_insert" ON propostas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "propostas_update" ON propostas FOR UPDATE TO authenticated USING (true);
CREATE POLICY "propostas_delete" ON propostas FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── Tabela: financeiro ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS financeiro (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receber','pagar')),
  categoria TEXT,
  descricao TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente','pago','vencido','cancelado')),
  metodo_pagamento TEXT CHECK (metodo_pagamento IN (
    'pix','cartao_credito','cartao_debito','boleto','dinheiro','transferencia','outro'
  )),
  parcelas INTEGER DEFAULT 1,
  parcela_atual INTEGER DEFAULT 1,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

ALTER TABLE financeiro ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fin_select" ON financeiro FOR SELECT TO authenticated USING (true);
CREATE POLICY "fin_insert" ON financeiro FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "fin_update" ON financeiro FOR UPDATE TO authenticated USING (true);
CREATE POLICY "fin_delete" ON financeiro FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Trigger: marca status "vencido" automaticamente
CREATE OR REPLACE FUNCTION mark_overdue_financeiro()
RETURNS void AS $$
BEGIN
  UPDATE financeiro
  SET status = 'vencido'
  WHERE status = 'pendente' AND data_vencimento < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- ── Tabela: invited_emails (para convite de colaboradores) ────

CREATE TABLE IF NOT EXISTS invited_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'colaborador' CHECK (role IN ('admin','colaborador')),
  invited_by UUID REFERENCES profiles(id),
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE invited_emails ENABLE ROW LEVEL SECURITY;
-- SELECT liberado para anon (necessário para signup.html verificar o token antes do login)
CREATE POLICY "invite_anon_select"  ON invited_emails FOR SELECT TO anon        USING (true);
CREATE POLICY "invite_auth_select"  ON invited_emails FOR SELECT TO authenticated USING (true);
CREATE POLICY "invite_insert" ON invited_emails FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "invite_update" ON invited_emails FOR UPDATE TO authenticated USING (true);
