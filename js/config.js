// ============================================================
// CRM Eva Luz Vendas — Configuração
// Preencha com suas credenciais do Supabase e EmailJS
// Veja SETUP.html para instruções detalhadas
// ============================================================

const SUPABASE_URL      = 'https://expdhmuyeyzivvbtvopp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4cGRobXV5ZXl6aXZ2YnR2b3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NDMzNDgsImV4cCI6MjA5NjUxOTM0OH0.rJGwCUTWD0-5ko846YeeNtxpp1g_KPZ2LvfL71HAcIw';

// EmailJS (opcional — para lembretes por email)
const EMAILJS_SERVICE_ID  = 'service_aisuwsk';
const EMAILJS_TEMPLATE_ID = 'template_tsi7fus';
const EMAILJS_PUBLIC_KEY  = 'TlH9VKiqO4DsfUiKZ';

// Cliente Supabase global
let supabase = null;
try {
  const _mod = window.supabase || window.Supabase;
  if (_mod && typeof _mod.createClient === 'function') {
    supabase = _mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch(e) {
  console.error('Erro ao inicializar Supabase:', e);
}
