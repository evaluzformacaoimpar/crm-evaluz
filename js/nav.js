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
      </a>
      <div class="nav-section-label">Análise</div>
      <a href="relatorios.html" class="nav-link ${activePage === 'relatorios' ? 'active' : ''}">
        <span class="nav-icon">📈</span> Relatórios
      </a>
      <a href="agenda.html" class="nav-link ${activePage === 'agenda' ? 'active' : ''}">
        <span class="nav-icon">📅</span> Agenda
      </a>
      <a href="objecoes.html" class="nav-link ${activePage === 'objecoes' ? 'active' : ''}">
        <span class="nav-icon">💬</span> Objeções
      </a>
      <a href="gatilhos.html" class="nav-link ${activePage === 'gatilhos' ? 'active' : ''}">
        <span class="nav-icon">⚡</span> Gatilhos
      </a>
      ${isAdmin ? `
      <div class="nav-section-label">Administração</div>
      <a href="admin.html" class="nav-link ${activePage === 'admin' ? 'active' : ''}">
        <span class="nav-icon">⚙️</span> Usuários
      </a>` : ''}
    </nav>
    <div class="sidebar-user">
      <div class="user-name">${user?.name || 'Usuário'}</div>
      <div class="user-role">${user?.role === 'admin' ? 'Administradora' : 'Colaborador(a)'}</div>
      <button class="btn-logout" onclick="logout()">
        <span>🚪</span> Sair
      </button>
    </div>
  `;
  setupMobileNav();
}

function setupMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebar-overlay');

  if (!hamburger || !sidebar) return;

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }
}
