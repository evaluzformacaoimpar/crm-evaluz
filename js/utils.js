// ============================================================
// CRM Eva Luz Vendas — Utilitários Globais
// ============================================================

// ── Formatação ──────────────────────────────────────────────

function formatPhone(phone) {
  if (!phone) return '';
  const d = phone.replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return phone;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR');
}

function formatDateTime(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

// ── Labels de Perfil ─────────────────────────────────────────

const FUNNEL_LABELS = {
  abordagem:         { label: 'Abordagem',          color: 'stage-abordagem' },
  sondagem:          { label: 'Sondagem',            color: 'stage-sondagem' },
  apresentacao:      { label: 'Apresentação',        color: 'stage-apresentacao' },
  negociacao:        { label: 'Negociação',          color: 'stage-negociacao' },
  follow_up:         { label: 'Follow-up',           color: 'stage-follow_up' },
  vendas_efetivadas: { label: 'Vendas Efetivadas',   color: 'stage-vendas_efetivadas' },
  pos_vendas:        { label: 'Pós Vendas',          color: 'stage-pos_vendas' },
  indicacao:         { label: 'Indicação',           color: 'stage-indicacao' },
  trafego_pago:      { label: 'Tráfego Pago',        color: 'stage-trafego_pago' },
  sem_interesse:     { label: 'Sem Interesse',       color: 'stage-sem_interesse' },
  reativar:          { label: 'Reativar Contato',    color: 'stage-reativar' },
};

const DISC_DATA = {
  executor: {
    label: 'Executor (D)',
    tag: 'tag-disc-executor',
    icon: '🔴',
    descricao: 'Direto, dominante, controlador. Odeia perda de tempo.',
    como_agir: 'Seja objetivo. Vá direto ao benefício principal. Deixe ele decidir.',
  },
  comunicador: {
    label: 'Comunicador (I)',
    tag: 'tag-disc-comunicador',
    icon: '🟡',
    descricao: 'Entusiasmado, sociável, emocional. Compra pela conexão.',
    como_agir: 'Construa rapport forte. Use história. Mostre o lado social do produto.',
  },
  planejador: {
    label: 'Planejador (S)',
    tag: 'tag-disc-planejador',
    icon: '🟢',
    descricao: 'Calmo, leal, avesso a risco. Precisa de segurança.',
    como_agir: 'Seja paciente. Mostre garantias e estabilidade. Nunca pressione.',
  },
  analista: {
    label: 'Analista (C)',
    tag: 'tag-disc-analista',
    icon: '🔵',
    descricao: 'Detalhista, crítico, lógico. Quer dados e processo.',
    como_agir: 'Tenha provas, números e lógica. Explique com precisão e sem rodeios.',
  },
};

const CLIENT_TYPE_DATA = {
  pragmatico: {
    label: 'Pragmático',
    descricao: 'Objetivo, direto, odeia enrolação.',
    como_agir: 'Vá direto ao ponto. Mostre ROI. Quer solução rápida.',
  },
  analitico: {
    label: 'Analítico',
    descricao: 'Quer dados, comparativos, provas. Demora para decidir.',
    como_agir: 'Tenha números e depoimentos sólidos.',
  },
  consensual: {
    label: 'Consensual',
    descricao: 'Precisa ouvir outras pessoas antes de decidir.',
    como_agir: 'Traga casos de clientes parecidos com ele.',
  },
  inovador: {
    label: 'Inovador',
    descricao: 'Ama novidade, tendência e ser o primeiro.',
    como_agir: 'Mostre o que há de mais moderno e exclusivo.',
  },
  desconfiado: {
    label: 'Desconfiado',
    descricao: 'Questiona tudo. Testa você antes de abrir.',
    como_agir: 'Seja transparente. Cite desvantagens também.',
  },
  conservador: {
    label: 'Conservador',
    descricao: 'Quer segurança. Muda devagar. Fica no que conhece.',
    como_agir: 'Não pressione. Mostre histórico e garantias.',
  },
  estraga_prazeres: {
    label: 'Estraga-prazeres',
    descricao: 'Critica tudo. Usa objeção como escudo.',
    como_agir: 'Não reaja. Pergunte mais. Escute sem defender.',
  },
  economico: {
    label: 'Econômico',
    descricao: 'O preço é sempre o foco. Quer sentir que ganhou.',
    como_agir: 'Mostre valor antes do preço. Use âncora de preço.',
  },
};

const SENSORY_DATA = {
  visual: {
    label: 'Visual',
    tag: 'tag-vak-visual',
    icon: '👁️',
    descricao: 'Fala rápido, pede fotos e PDFs, julga pela aparência.',
    como_agir: 'Use imagens, vídeos, PDF bonito. Linguagem visual: veja, olha, imagine a cena.',
  },
  auditivo: {
    label: 'Auditivo',
    tag: 'tag-vak-auditivo',
    icon: '👂',
    descricao: 'Gosta de ligação, manda áudio, faz perguntas sequenciais.',
    como_agir: 'Prepare uma explicação clara, em passos. Use: ouça, soa bem, faz sentido ouvir.',
  },
  sinestesico: {
    label: 'Sinestésico',
    tag: 'tag-vak-sinestesico',
    icon: '🤝',
    descricao: 'Fala devagar, decide pela sensação, pede depoimentos.',
    como_agir: 'Faça ele imaginar o sentimento. Use: imagine, como você se sentiria, a sensação é de...',
  },
};

const SOURCE_LABELS = {
  instagram:    'Instagram',
  youtube:      'YouTube',
  facebook:     'Facebook',
  google:       'Google',
  hotmart:      'Hotmart',
  indicacao:    'Indicação',
  trafego_pago: 'Tráfego Pago',
  outro:        'Outro',
};

function getFunnelLabel(stage)   { return FUNNEL_LABELS[stage]?.label     || stage; }
function getFunnelColor(stage)   { return FUNNEL_LABELS[stage]?.color     || 'badge-gray'; }
function getDiscLabel(disc)      { return DISC_DATA[disc]?.label          || disc; }
function getClientTypeLabel(t)   { return CLIENT_TYPE_DATA[t]?.label      || t; }
function getSensoryLabel(s)      { return SENSORY_DATA[s]?.label          || s; }
function getSourceLabel(s)       { return SOURCE_LABELS[s]                || s; }

function funnelBadge(stage) {
  if (!stage) return '';
  const color = getFunnelColor(stage);
  return `<span class="badge ${color}">${getFunnelLabel(stage)}</span>`;
}

// ── Gatilhos sugeridos por perfil ────────────────────────────

function getTriggersByProfile(clientType, disc) {
  const triggers = [];
  const typeMap = {
    pragmatico:       ['Escassez', 'Especificidade', 'Comparação'],
    analitico:        ['Prova Social', 'Especificidade', 'Garantia'],
    consensual:       ['Prova Social', 'Pertencimento', 'História'],
    inovador:         ['Novidade', 'Antecipação', 'Pertencimento'],
    desconfiado:      ['Autoridade', 'Garantia', 'Prova Social'],
    conservador:      ['Garantia', 'Autoridade', 'Prova Social'],
    estraga_prazeres: ['Reciprocidade', 'Especificidade', 'Prova Social'],
    economico:        ['Comparação', 'Especificidade', 'Escassez'],
  };
  const discMap = {
    executor:    ['Escassez', 'Especificidade', 'Urgência'],
    comunicador: ['História', 'Pertencimento', 'Antecipação'],
    planejador:  ['Garantia', 'Prova Social', 'Autoridade'],
    analista:    ['Especificidade', 'Autoridade', 'Prova Social'],
  };
  if (clientType && typeMap[clientType]) triggers.push(...typeMap[clientType]);
  if (disc && discMap[disc]) triggers.push(...discMap[disc]);
  return [...new Set(triggers)].slice(0, 5);
}

// ── WhatsApp ─────────────────────────────────────────────────

function openWhatsApp(phone, message) {
  if (!phone) { showToast('Telefone não cadastrado', 'error'); return; }
  const digits  = phone.replace(/\D/g, '');
  const number  = digits.startsWith('55') ? digits : `55${digits}`;
  const encoded = encodeURIComponent(message || '');
  window.open(`https://wa.me/${number}?text=${encoded}`, '_blank');
}

// ── Toast Notifications ───────────────────────────────────────

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Modal Helpers ─────────────────────────────────────────────

function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) { el.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) { el.style.display = 'none'; document.body.style.overflow = ''; }
}

function closeModalOnOverlay(e) {
  if (e.target === e.currentTarget) closeModal(e.currentTarget.id);
}

// ── Geração de Cadência (dias 1,3,6,10,15,30) ─────────────────

function generateCadenceDates(startDate) {
  const base = new Date(startDate + 'T00:00:00');
  const days = [1, 3, 6, 10, 15, 30];
  return days.map(d => {
    const dt = new Date(base);
    dt.setDate(dt.getDate() + (d - 1));
    return { day: d, date: dt.toISOString().split('T')[0] };
  });
}

const CADENCE_STEP_LABELS = {
  1:  'Abordagem inicial',
  3:  'Envio de valor',
  6:  'Retomada gentil',
  10: 'Urgência real',
  15: 'Último contato',
  30: 'Reativação',
};

// As tarefas de cadência são identificadas pelo título gerado em
// generateCadenceDates(), ex: "Dia 6: Retomada gentil". Não há coluna própria
// no banco marcando "isso é uma cadência" — o título é o único identificador.
function getCadenceDay(title) {
  const m = /^Dia (\d+):/.exec(title || '');
  return m ? parseInt(m[1], 10) : null;
}

function isCadenceTask(task) {
  return getCadenceDay(task.title) !== null;
}

// Recebe todas as tarefas de um contato e retorna o progresso da cadência
// IMPAR (quantas das 6 etapas já foram concluídas e qual é a etapa atual).
// Retorna null se o contato não tiver nenhuma cadência iniciada.
function getCadenceProgress(tasks) {
  const steps = (tasks || [])
    .filter(isCadenceTask)
    .sort((a, b) => getCadenceDay(a.title) - getCadenceDay(b.title));
  if (!steps.length) return null;

  const done    = steps.filter(t => t.status === 'concluida').length;
  const total   = steps.length;
  const current = steps.find(t => t.status !== 'concluida') || steps[steps.length - 1];

  return {
    steps,
    done,
    total,
    current,
    percent:    Math.round((done / total) * 100),
    isComplete: done === total,
  };
}

// ── EmailJS Reminder ──────────────────────────────────────────

async function sendEmailReminder(toEmail, toName, contactName, taskTitle, dueDate) {
  if (typeof emailjs === 'undefined') return;
  if (EMAILJS_SERVICE_ID === 'COLE_AQUI_SEU_SERVICE_ID') return;
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:     toEmail,
      to_name:      toName,
      contact_name: contactName,
      task_title:   taskTitle,
      due_date:     formatDate(dueDate),
    }, EMAILJS_PUBLIC_KEY);
  } catch (e) {
    console.warn('EmailJS não configurado ou erro ao enviar:', e);
  }
}

// ── Seletor de Perfil (HTML helpers) ─────────────────────────

function buildSelect(id, options, value, placeholder = 'Selecione...') {
  const opts = options.map(o =>
    `<option value="${o.value}" ${o.value === value ? 'selected' : ''}>${o.label}</option>`
  ).join('');
  return `
    <select id="${id}" name="${id}" class="form-select">
      <option value="">${placeholder}</option>
      ${opts}
    </select>`;
}

const FUNNEL_OPTIONS = Object.entries(FUNNEL_LABELS).map(([v,d]) => ({ value: v, label: d.label }));
const DISC_OPTIONS   = Object.entries(DISC_DATA).map(([v,d])   => ({ value: v, label: d.label }));
const CLIENT_OPTIONS = Object.entries(CLIENT_TYPE_DATA).map(([v,d]) => ({ value: v, label: d.label }));
const SENSORY_OPTIONS= Object.entries(SENSORY_DATA).map(([v,d]) => ({ value: v, label: d.label }));
const SOURCE_OPTIONS = Object.entries(SOURCE_LABELS).map(([v,l]) => ({ value: v, label: l }));
