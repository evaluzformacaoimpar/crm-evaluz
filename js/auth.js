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
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (data) {
    localStorage.setItem('crm_user', JSON.stringify(data));
  }
  return data;
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
    window.location.href = 'painel.html';
  }
  return result;
}
