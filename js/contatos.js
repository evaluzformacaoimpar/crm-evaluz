// CRM Eva Luz Vendas — Contatos

(function () {

  'use strict';

  var allContacts = [];

  var deleteId    = null;

  var currentView = 'kanban';

  // ── Inicialização ─────────────────────────────────────────────────────────────

  async function init() {

    try { await checkSession(); } catch(e) { return; }

    try { await injectNav('contatos'); } catch(e) {}

    bindEvents();

    setView('kanban');

    await loadContacts();

  }

  function bindEvents() {

    var btnNovo = document.getElementById('btn-novo-contato');

    if (btnNovo) btnNovo.addEventListener('click', abrirNovoContato);

    var btnKanban = document.getElementById('btn-kanban');

    if (btnKanban) btnKanban.addEventListener('click', function() { setView('kanban'); });

    var btnLista = document.getElementById('btn-lista');

    if (btnLista) btnLista.addEventListener('click', function() { setView('lista'); });

    var busca = document.getElementById('busca');

    if (busca) { busca.addEventListener('input', renderView); busca.addEventListener('change', renderView); }

    var fe = document.getElementById('filtro-etapa');

    if (fe) { fe.addEventListener('change', renderView); }

    var fo = document.getElementById('filtro-origem');

    if (fo) { fo.addEventListener('change', renderView); }

    var btnFechar = document.getElementById('btn-fechar-modal');

    if (btnFechar) btnFechar.addEventListener('click', fecharModalContato);

    var btnCancelar = document.getElementById('btn-cancelar-modal');

    if (btnCancelar) btnCancelar.addEventListener('click', fecharModalContato);

    var btnSalvar = document.getElementById('btn-salvar-contato');

    if (btnSalvar) btnSalvar.addEventListener('click', salvarContato);

    var btnFecharDel = document.getElementById('btn-fechar-delete');

    if (btnFecharDel) btnFecharDel.addEventListener('click', function() { fecharModal('modal-delete'); });

    var btnCancelarDel = document.getElementById('btn-cancelar-delete');

    if (btnCancelarDel) btnCancelarDel.addEventListener('click', function() { fecharModal('modal-delete'); });

    var btnConfirmarDel = document.getElementById('btn-confirmar-delete');

    if (btnConfirmarDel) btnConfirmarDel.addEventListener('click', confirmarDelete);

    var modalContato = document.getElementById('modal-contato');

    if (modalContato) modalContato.addEventListener('click', function(e) {

      if (e.target === modalContato) fecharModalContato();

    });

    var modalDelete = document.getElementById('modal-delete');

    if (modalDelete) modalDelete.addEventListener('click', function(e) {

      if (e.target === modalDelete) fecharModal('modal-delete');

    });

    var chkAg = document.getElementById('c-agendar');

    if (chkAg) chkAg.addEventListener('change', function() {

      var ag = document.getElementById('agendamento-fields');

      if (ag) ag.style.display = this.checked ? 'block' : 'none';

      if (this.checked) {

        var d = document.getElementById('c-task-data');

        if (d && !d.value) d.value = todayISO();

      }

    });

  }

  // ── Modal helpers ─────────────────────────────────────────────────────

  function abrirModal(id) {

    var el = document.getElementById(id);

    if (el) { el.style.display = 'flex'; document.body.style.overflow = 'hidden'; }

  }

  function fecharModal(id) {

    var el = document.getElementById(id);

    if (el) { el.style.display = 'none'; document.body.style.overflow = ''; }

  }

  function fecharModalContato() {

    fecharModal('modal-contato');

    esconderErro();

  }

  function mostrarErro(msg) {

    var el = document.getElementById('modal-erro');

    if (el) { el.textContent = msg; el.style.display = 'block'; }

  }

  function esconderErro() {

    var el = document.getElementById('modal-erro');

    if (el) el.style.display = 'none';

  }

  // ── Carregamento de contatos ──────────────────────────────────────────────────────────

  async function loadContacts() {

    if (!supabase) { showToast('Banco de dados não inicializado', 'error'); return; }

    try {

      var result = await supabase.from('contacts').select('*').order('created_at', { ascending: false });

      if (result.error) {

        var msg = result.error.message || '';

        if (msg.indexOf('does not exist') !== -1) {

          showToast('Tabelas não encontradas. Execute o schema.sql no Supabase.', 'error');

        } else {

          showToast('Erro ao carregar contatos: ' + msg, 'error');

        }

        return;

      }

      allContacts = result.data || [];

      renderView();

    } catch (err) {

      showToast('Erro inesperado ao carregar contatos', 'error');

    }

  }

  // ── Views ─────────────────────────────────────────────────────────────────

  function setView(v) {

    currentView = v;

    var kanban = document.getElementById('view-kanban');

    var lista  = document.getElementById('view-lista');

    var btnK   = document.getElementById('btn-kanban');

    var btnL   = document.getElementById('btn-lista');

    if (kanban) kanban.style.display = v === 'kanban' ? 'flex' : 'none';

    if (lista)  lista.style.display  = v === 'lista'  ? 'block' : 'none';

    if (btnK)   btnK.className = 'btn btn-sm ' + (v === 'kanban' ? 'btn-primary' : 'btn-outline');

    if (btnL)   btnL.className = 'btn btn-sm ' + (v === 'lista'  ? 'btn-primary' : 'btn-outline');

    renderView();

  }

  function getFiltered() {

    var busca  = (document.getElementById('busca').value || '').toLowerCase();

    var etapa  = document.getElementById('filtro-etapa').value || '';

    var origem = document.getElementById('filtro-origem').value || '';

    return allContacts.filter(function(c) {

      var okBusca  = !busca  || (c.name  || '').toLowerCase().includes(busca) || (c.phone || '').includes(busca);

      var okEtapa  = !etapa  || c.funnel_stage === etapa;

      var okOrigem = !origem || c.source === origem;

      return okBusca && okEtapa && okOrigem;

    });

  }

  function renderView() {

    var filtered = getFiltered();

    if (currentView === 'kanban') renderKanban(filtered);

    else renderLista(filtered);

  }

  // ── Kanban ────────────────────────────────────────────────────────────────

  function renderKanban(contacts) {

    var board  = document.getElementById('view-kanban');

    var stages = Object.keys(FUNNEL_LABELS);

    var html   = '';

    stages.forEach(function(stage) {

      var items  = contacts.filter(function(c) { return c.funnel_stage === stage; });

      var cardsHtml = '';

      if (items.length === 0) {

        cardsHtml = '<div style="padding:8px;text-align:center;color:var(--text-muted);font-size:0.78rem;">Vazio</div>';

      } else {

        items.forEach(function(c) { cardsHtml += buildCard(c); });

      }

      html += '<div class="kanban-col" data-stage="' + stage + '">';

      html += '<div class="kanban-col-header">';

      html += '<span class="kanban-col-title">' + getFunnelLabel(stage) + '</span>';

      html += '<span class="kanban-count">' + items.length + '</span>';

      html += '</div>';

      html += cardsHtml;

      html += '</div>';

    });

    board.innerHTML = html;

    board.querySelectorAll('.kanban-col').forEach(function(col) {

      col.addEventListener('dragover', function(e) {

        e.preventDefault();

        col.classList.add('drag-over');

      });

      col.addEventListener('dragleave', function() {

        col.classList.remove('drag-over');

      });

      col.addEventListener('drop', function(e) {

        e.preventDefault();

        col.classList.remove('drag-over');

        dropCard(col.dataset.stage);

      });

    });

  }

  function buildCard(c) {

    var discTag  = c.disc_profile && DISC_DATA[c.disc_profile] ? DISC_DATA[c.disc_profile].tag : '';

    var discIcon = c.disc_profile && DISC_DATA[c.disc_profile] ? DISC_DATA[c.disc_profile].icon : '';

    var discLabel = c.disc_profile ? getDiscLabel(c.disc_profile) : '';

    var html = '<div class="kanban-card" draggable="true" data-id="' + c.id + '">';

    html += '<div class="kanban-card-name">' + escHtml(c.name) + '</div>';

    html += '<div class="kanban-card-meta">';

    html += '<span class="kanban-card-phone">' + formatPhone(c.phone) + '</span>';

    if (c.disc_profile) {

      html += '<span class="profile-tag ' + discTag + '" style="font-size:0.68rem;padding:2px 6px;">' + discIcon + ' ' + discLabel + '</span>';

    }

    html += '</div>';

    html += '<div class="kanban-card-actions">';

    if (c.phone) {

      html += '<button class="btn btn-whatsapp btn-sm btn-icon" data-phone="' + escHtml(c.phone) + '" data-action="whatsapp">💬</button>';

    }

    html += '<button class="btn btn-outline btn-sm btn-icon" data-id="' + c.id + '" data-action="editar">✏️</button>';

    html += '<button class="btn btn-danger btn-sm btn-icon" data-id="' + c.id + '" data-name="' + escHtml(c.name) + '" data-action="deletar">🗑️</button>';

    html += '</div>';

    html += '</div>';

    return html;

  }

  // ── Tabela lista ─────────────────────────────────────────────────────────────────

  function renderLista(contacts) {

    var tbody = document.getElementById('lista-body');

    if (!contacts.length) {

      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">Nenhum contato encontrado</td></tr>';

      return;

    }

    var html = '';

    contacts.forEach(function(c) {

      var discTag = c.disc_profile && DISC_DATA[c.disc_profile] ? DISC_DATA[c.disc_profile].tag : '';

      html += '<tr>';

      html += '<td><a href="contato.html?id=' + c.id + '" style="font-weight:600;color:var(--primary);">' + escHtml(c.name) + '</a></td>';

      html += '<td>' + formatPhone(c.phone) + '</td>';

      html += '<td>' + funnelBadge(c.funnel_stage) + '</td>';

      html += '<td><span class="badge badge-gray">' + getSourceLabel(c.source) + '</span></td>';

      html += '<td>' + (c.disc_profile ? '<span class="profile-tag ' + discTag + '">' + getDiscLabel(c.disc_profile) + '</span>' : '') + '</td>';

      html += '<td>' + (c.client_type ? '<span class="badge badge-gray">' + getClientTypeLabel(c.client_type) + '</span>' : '') + '</td>';

      html += '<td><div class="table-actions">';

      html += '<a href="contato.html?id=' + c.id + '" class="btn btn-primary btn-sm">Ver</a>';

      html += '<button class="btn btn-outline btn-sm btn-icon" data-id="' + c.id + '" data-action="editar">✏️</button>';

      if (c.phone) {

        html += '<button class="btn btn-whatsapp btn-sm btn-icon" data-phone="' + escHtml(c.phone) + '" data-action="whatsapp">💬</button>';

      }

      html += '<button class="btn btn-danger btn-sm btn-icon" data-id="' + c.id + '" data-name="' + escHtml(c.name) + '" data-action="deletar">🗑️</button>';

      html += '</div></td>';

      html += '</tr>';

    });

    tbody.innerHTML = html;

  }

  // ── Delegação de eventos ─────────────────────────────────────────────────────────────────

  document.addEventListener('click', function(e) {

    var btn = e.target.closest('[data-action]');

    if (!btn) return;

    var action = btn.dataset.action;

    var id     = btn.dataset.id;

    var name   = btn.dataset.name;

    var phone  = btn.dataset.phone;

    if (action === 'editar')  { e.stopPropagation(); abrirEdicao(id); }

    if (action === 'deletar') { e.stopPropagation(); pedirDelete(id, name); }

    if (action === 'whatsapp'){ e.stopPropagation(); openWhatsApp(phone, ''); }

    var card = e.target.closest('.kanban-card');

    if (card && !btn.dataset.action) {

      window.location.href = 'contato.html?id=' + card.dataset.id;

    }

  });

  document.addEventListener('click', function(e) {

    var card = e.target.closest('.kanban-card');

    if (!card) return;

    if (e.target.closest('[data-action]')) return;

    window.location.href = 'contato.html?id=' + card.dataset.id;

  });

  // ── Drag & Drop ─────────────────────────────────────────────────────────────────

  var dragId = null;

  document.addEventListener('dragstart', function(e) {

    var card = e.target.closest('.kanban-card');

    if (card) { dragId = card.dataset.id; e.dataTransfer.effectAllowed = 'move'; }

  });

  async function dropCard(newStage) {

    if (!dragId || !newStage) return;

    var result = await supabase.from('contacts').update({ funnel_stage: newStage }).eq('id', dragId);

    if (result.error) { showToast('Erro ao mover contato', 'error'); return; }

    var c = allContacts.find(function(x) { return x.id === dragId; });

    if (c) c.funnel_stage = newStage;

    renderView();

    showToast('Movido para ' + getFunnelLabel(newStage), 'success');

    dragId = null;

  }

  // ── Modal Novo / Editar ─────────────────────────────────────────────────────────────────

  function abrirNovoContato() {

    esconderErro();

    document.getElementById('modal-contato-title').textContent = 'Novo Contato';

    document.getElementById('contato-id').value = '';

    ['c-name','c-phone','c-email','c-instagram','c-facebook','c-other','c-notes'].forEach(function(id) {

      document.getElementById(id).value = '';

    });

    ['c-source','c-stage','c-type','c-sensory','c-disc'].forEach(function(id) {

      document.getElementById(id).value = '';

    });

    var chkReset = document.getElementById('c-agendar');

    if (chkReset) chkReset.checked = false;

    var agF = document.getElementById('agendamento-fields');

    if (agF) agF.style.display = 'none';

    ['c-task-data','c-task-hora','c-task-obs'].forEach(function(fid) {

      var el = document.getElementById(fid); if (el) el.value = '';

    });

    var tt = document.getElementById('c-task-tipo');

    if (tt) tt.value = 'Ligar';

    abrirModal('modal-contato');

  }

  function abrirEdicao(id) {

    var c = allContacts.find(function(x) { return x.id === id; });

    if (!c) return;

    esconderErro();

    document.getElementById('modal-contato-title').textContent = 'Editar Contato';

    document.getElementById('contato-id').value      = c.id;

    document.getElementById('c-name').value          = c.name || '';

    document.getElementById('c-phone').value         = c.phone || '';

    document.getElementById('c-email').value         = c.email || '';

    document.getElementById('c-instagram').value     = c.instagram || '';

    document.getElementById('c-facebook').value      = c.facebook || '';

    document.getElementById('c-other').value         = c.other_social || '';

    document.getElementById('c-notes').value         = c.notes || '';

    document.getElementById('c-source').value        = c.source || '';

    document.getElementById('c-stage').value         = c.funnel_stage || '';

    document.getElementById('c-type').value          = c.client_type || '';

    document.getElementById('c-sensory').value       = c.sensory_system || '';

    document.getElementById('c-disc').value          = c.disc_profile || '';

    abrirModal('modal-contato');

  }

  // ── Salvar ─────────────────────────────────────────────────────────────────

  async function salvarContato() {

    esconderErro();

    if (!supabase) {

      mostrarErro('Conexão com o banco de dados não está disponível. Recarregue a página.');

      return;

    }

    var btn  = document.getElementById('btn-salvar-contato');

    var name = document.getElementById('c-name').value.trim();

    if (!name) {

      mostrarErro('Nome completo é obrigatório.');

      return;

    }

    btn.textContent = 'Salvando...';

    btn.disabled    = true;

    var id = document.getElementById('contato-id').value;

    var payload = {

      name:           name,

      phone:          document.getElementById('c-phone').value.trim()     || null,

      email:          document.getElementById('c-email').value.trim()     || null,

      instagram:      document.getElementById('c-instagram').value.trim() || null,

      facebook:       document.getElementById('c-facebook').value.trim()  || null,

      other_social:   document.getElementById('c-other').value.trim()     || null,

      notes:          document.getElementById('c-notes').value.trim()     || null,

      source:         document.getElementById('c-source').value           || null,

      funnel_stage:   document.getElementById('c-stage').value            || 'abordagem',

      client_type:    document.getElementById('c-type').value             || null,

      sensory_system: document.getElementById('c-sensory').value          || null,

      disc_profile:   document.getElementById('c-disc').value             || null

    };

    var result;

    try {

      if (id) {

        result = await supabase.from('contacts').update(payload).eq('id', id);

      } else {

        result = await supabase.from('contacts').insert(payload).select('id');

      }

    } catch (err) {

      btn.textContent = 'Salvar Contato';

      btn.disabled    = false;

      mostrarErro('Erro inesperado: ' + (err.message || 'tente novamente'));

      return;

    }

    btn.textContent = 'Salvar Contato';

    btn.disabled    = false;

    if (result.error) {

      var msg = result.error.message || 'tente novamente';

      if (msg.indexOf('violates foreign key') !== -1) {

        msg = 'Perfil de usuário não encontrado no banco. Execute o schema.sql no Supabase para criar as tabelas e recarregue.';

      }

      if (msg.indexOf('does not exist') !== -1) {

        msg = 'Tabela não encontrada. Execute o schema.sql no Supabase SQL Editor para criar as tabelas.';

      }

      mostrarErro('Erro ao salvar: ' + msg);

      return;

    }

    var contatoId = id;

    if (!id && result.data && result.data[0]) contatoId = result.data[0].id;

    var chkSave = document.getElementById('c-agendar');

    if (chkSave && chkSave.checked && contatoId) {

      var tipoAg = (document.getElementById('c-task-tipo') || {}).value || 'Ligar';

      var dataAg = (document.getElementById('c-task-data') || {}).value;

      var horaAg = (document.getElementById('c-task-hora') || {}).value;

      var obsAg  = ((document.getElementById('c-task-obs') || {}).value || '').trim();

      if (dataAg) {

        var taskObj = {

          contact_id:    contatoId,

          title:         tipoAg + ': ' + name,

          description:   obsAg || null,

          due_date:      dataAg,

          due_time:      horaAg || null,

          status:        'pendente',

          reminder_email: false

        };

        var usr = getUser();

        if (usr) taskObj.created_by = usr.id;

        await supabase.from('tasks').insert(taskObj);

        showToast('Contato salvo e ligação agendada!', 'success');

      } else {

        showToast(id ? 'Contato atualizado!' : 'Contato adicionado!', 'success');

      }

    } else {

      showToast(id ? 'Contato atualizado!' : 'Contato adicionado!', 'success');

    }

    fecharModalContato();

    await loadContacts();

  }

  // ── Excluir ─────────────────────────────────────────────────────────────────

  function pedirDelete(id, name) {

    deleteId = id;

    var el = document.getElementById('delete-name');

    if (el) el.textContent = name;

    abrirModal('modal-delete');

  }

  async function confirmarDelete() {

    if (!deleteId) return;

    var result = await supabase.from('contacts').delete().eq('id', deleteId);

    if (result.error) { showToast('Erro ao excluir', 'error'); return; }

    showToast('Contato excluído', 'success');

    fecharModal('modal-delete');

    allContacts = allContacts.filter(function(c) { return c.id !== deleteId; });

    deleteId = null;

    renderView();

  }

  // ── Utilitário ─────────────────────────────────────────────────────────────────

  function escHtml(str) {

    if (!str) return '';

    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  }

  // ── Start ─────────────────────────────────────────────────────────────────

  init();

})();
