// ============================================================
// CRM Eva Luz Vendas — Autenticação
// ============================================================

async function checkSession() {
  if (!supabase) return;
  const res = await supabase.auth.getSession();
  const session = res?.data?.session || null;
  if (!session) {
    window.location.href = 'index.html';
    return null;
  }
  const profile = await getProfile(session.user.id);
  return { session, profile };
}

async function getProfile(userId) {
  if (!supabase) return null;
  let { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!data) {
    data = await ensureProfile(userId);
  }

  if (data) {
    localStorage.setItem('crm_user', JSON.stringify(data));
  }
  return data;
}

// Cria a linha em profiles quando o usuário já está autenticado no Supabase
// mas nunca ganhou um perfil (ex: conta criada direto no painel do Supabase,
// sem passar pelo convite em signup.html). Sem essa linha, qualquer insert
// que grave created_by = userId falha com "violates foreign key constraint".
async function ensureProfile(userId) {
  const { data: sessionData } = await supabase.auth.getSession();
  const authUser = sessionData?.session?.user;
  if (!authUser || authUser.id !== userId) return null;

  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  const role = count ? 'colaborador' : 'admin';
  const name = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário';

  const { data: created, error } = await supabase
    .from('profiles')
    .insert({ id: userId, name, role })
    .select()
    .single();
  if (error) {
    console.error('Erro ao criar perfil automaticamente:', error);
    return null;
  }
  return created;
}

function getUser() {
  const stored = localStorage.getItem('crm_user');
  return stored ? JSON.parse(stored) : null;
}

async function logout() {
  if (supabase) await supabase.auth.signOut();
  localStorage.removeItem('crm_user');
  sessionStorage.clear();
  window.location.href = 'index.html';
}

async function requireAdmin() {
  const result = await checkSession();
  if (!result) return;
  if (result.profile?.role !== 'admin') {
    window.location.href = 'dashboard.html';
  }
  return result;
}
