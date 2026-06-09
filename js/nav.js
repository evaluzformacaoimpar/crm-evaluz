// ============================================================
// CRM Eva Luz Vendas — Navegação Lateral
// ============================================================


async function injectNav(activePage) {
  const user = getUser();
  const container = document.getElementById('sidebar');
  if (!container) return;


  let overdueBadge = '';
  try {
    const today = new Date().toISOString().split('T')[0];
    const { count } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'atrasada');
    if (count > 0) overdueBadge = `<span class="nav-badge">${count}</span>`;
  } catch (e) {}


  const isAdmin = user?.role === 'admin';


  container.innerHTML = `
    <div class="sidebar-logo">
      <div class="logo-text">Eva Luz</div>
      <div class="logo-sub">CRM Vendas</div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section-label">Principal</div>
      <a href="painel.html" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}">
        <span class="nav-icon">📊</span> Dashboard
      </a>
      <a href="contatos.html" class="nav-link ${activePage === 'contatos' ? 'active' : ''}">
        <span class="nav-icon">👥</span> Contatos
      </a>
      <a href="tarefas.html" class="nav-link ${activePage === 'tarefas' ? 'active' : ''}">
        <span class="nav-icon">✅</span> Tarefas ${overdueBadge}
