# CRM Eva Luz Vendas — Plano de Implementação

> **Para execução:** Use superpowers:subagent-driven-development para implementar tarefa por tarefa.

**Goal:** Construir um CRM web completo para gestão de prospects e alunos da Formação IMPAR, com funil de vendas, cadência, perfil comportamental e relatórios.

**Architecture:** Multi-page web app (HTML/CSS/JS vanilla) com Supabase como backend (banco de dados + autenticação) e Netlify para hospedagem. Cada página carrega utilitários compartilhados via tags `<script>` e verifica sessão no load. Navegação injetada via `nav.js`.

**Tech Stack:** HTML5, CSS3, JavaScript ES6+, Supabase JS v2 (CDN), EmailJS v4 (CDN), html2canvas 1.4.1 (CDN)

---

## Estrutura de Arquivos

```
C:\Users\Eva\CRM-EVALUZ\
├── index.html           # Login (pública, redireciona se já logado)
├── dashboard.html       # Dashboard com stats, agenda do dia, funil resumido
├── contatos.html        # Lista + Kanban de contatos por etapa do funil
├── contato.html         # Detalhe do contato: perfil, histórico, tarefas
├── tarefas.html         # Central de tarefas com cadência automática
├── relatorios.html      # Métricas: contatos, cotações, vendas, conversão
├── objecoes.html        # Guia rápido das 15 objeções (consulta durante contato)
├── admin.html           # Gestão de usuários (admin Eva apenas)
├── SETUP.html           # Instruções passo a passo de configuração
├── css/
│   └── styles.css       # Design system Eva Luz (cores, tipografia, componentes)
├── js/
│   ├── config.js        # Credenciais Supabase + EmailJS (usuário preenche)
│   ├── auth.js          # checkSession(), login(), logout(), getUser()
│   ├── nav.js           # injectNav() — injeta sidebar em todas as páginas
│   └── utils.js         # formatPhone(), formatDate(), showToast(), openWhatsApp()
└── schema.sql           # CREATE TABLE + RLS policies para copiar no Supabase
```

---

## Tabelas Supabase

```
profiles       → id, name, role(admin|colaborador), created_at
contacts       → id, name, phone, email, instagram, facebook, other_social,
                 source, funnel_stage, client_type, sensory_system,
                 disc_profile, notes, created_at, updated_at, created_by
contact_history→ id, contact_id, type, notes, created_at, created_by
tasks          → id, contact_id, title, description, due_date, due_time,
                 status, reminder_email, whatsapp_message, created_at, created_by
metrics        → id, contact_id, type(contato|cotacao|venda), value,
                 date, notes, created_at, created_by
```

---

## Paleta e Design

```css
--primary:      #001F3F   /* azul marinho — fundos, nav, headers */
--accent:       #B87333   /* cobre/ouro — CTAs, destaques, ícones */
--white:        #FFFFFF   /* fundo principal */
--sage:         #768474   /* verde sálvia — depoimentos, equilíbrio */
--bg:           #f4f6f9   /* fundo das páginas internas */
--text-dark:    #001F3F
--text-muted:   #6c757d
--border:       #e0e6ed
--success:      #2ecc71
--danger:       #e74c3c
--warning:      #f39c12
```

Font: Inter (Google Fonts) — substituto de Telegraf

---

## Etapas do Funil (em ordem)

1. abordagem
2. sondagem
3. apresentacao
4. negociacao
5. follow_up
6. vendas_efetivadas
7. pos_vendas
8. indicacao
9. trafego_pago
10. sem_interesse
11. reativar

---

## Tarefa 1 — schema.sql + Estrutura do Banco

**Arquivo:** `C:\Users\Eva\CRM-EVALUZ\schema.sql`

- [ ] Criar tabela `profiles` com campos id (FK auth.users), name, role, created_at
- [ ] Criar tabela `contacts` com todos os campos do perfil comportamental
- [ ] Criar tabela `contact_history` com FK para contacts
- [ ] Criar tabela `tasks` com FK para contacts, campos de data/hora, status e whatsapp_message
- [ ] Criar tabela `metrics` com FK para contacts e type check
- [ ] Habilitar RLS em todas as tabelas
- [ ] Criar policies: leitura para autenticados, escrita para autenticados, exclusão para admin
- [ ] Criar trigger `updated_at` na tabela contacts
- [ ] Verificar: copiar o SQL no Supabase SQL Editor e executar sem erros

---

## Tarefa 2 — css/styles.css (Design System Completo)

**Arquivo:** `C:\Users\Eva\CRM-EVALUZ\css\styles.css`

- [ ] Definir variáveis CSS com paleta Eva Luz
- [ ] Reset CSS e base tipográfica com Inter
- [ ] Layout: `.app-layout` (sidebar + main-content)
- [ ] Sidebar: `.sidebar` com logo, nav links, user info, logout
- [ ] Componentes: `.card`, `.btn`, `.btn-primary`, `.btn-accent`, `.btn-ghost`
- [ ] Formulários: `.form-group`, `.form-control`, `.form-select`
- [ ] Funil Kanban: `.kanban-board`, `.kanban-col`, `.kanban-card`
- [ ] Badges de etapa com cores por estágio
- [ ] Tags de perfil DISC, tipo cliente, sistema representativo
- [ ] Timeline de histórico: `.timeline`, `.timeline-item`
- [ ] Toast notifications: `.toast`, `.toast-success`, `.toast-error`
- [ ] Modal: `.modal-overlay`, `.modal`
- [ ] Tabelas responsivas: `.table-responsive`
- [ ] Responsividade mobile (sidebar colapsa em hamburger)
- [ ] Verificar: abrir qualquer HTML no browser e checar layout em 375px e 1280px

---

## Tarefa 3 — js/config.js + js/auth.js + js/nav.js + js/utils.js

**Arquivos:** `C:\Users\Eva\CRM-EVALUZ\js\`

- [ ] **config.js:** exportar `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY` como constantes com valor `'PREENCHER'`
- [ ] **config.js:** exportar `supabase` — cliente Supabase inicializado com as credenciais
- [ ] **auth.js:** `checkSession()` — verifica se há sessão ativa, redireciona para index.html se não houver
- [ ] **auth.js:** `getUser()` — retorna dados do usuário logado (nome, role)
- [ ] **auth.js:** `logout()` — encerra sessão e redireciona para index.html
- [ ] **nav.js:** `injectNav(activePage)` — insere HTML da sidebar no elemento `#sidebar` com link ativo destacado
- [ ] **nav.js:** incluir todos os 7 links: Dashboard, Contatos, Tarefas, Relatórios, Objeções, Admin (só admin), e botão Sair
- [ ] **utils.js:** `formatPhone(phone)` — formata número para exibição
- [ ] **utils.js:** `formatDate(dateStr)` — formata data para pt-BR
- [ ] **utils.js:** `showToast(message, type)` — exibe notificação flutuante (success|error|warning)
- [ ] **utils.js:** `openWhatsApp(phone, message)` — abre wa.me com mensagem pré-preenchida
- [ ] **utils.js:** `getFunnelLabel(stage)` — retorna label em pt-BR para cada etapa
- [ ] **utils.js:** `getDiscLabel(disc)`, `getClientTypeLabel(type)`, `getSensoryLabel(s)` — labels de perfil
- [ ] **utils.js:** `getTriggersByProfile(clientType, disc)` — retorna array de gatilhos sugeridos
- [ ] Verificar: incluir scripts numa página de teste e chamar `showToast('teste', 'success')`

---

## Tarefa 4 — index.html (Login)

**Arquivo:** `C:\Users\Eva\CRM-EVALUZ\index.html`

- [ ] Layout centralizado com fundo azul marinho e logo Eva Luz
- [ ] Campos: email, senha, botão "Entrar"
- [ ] Chamar `supabase.auth.signInWithPassword()` no submit
- [ ] Se login OK: buscar perfil do usuário em `profiles`, salvar em localStorage, redirecionar para dashboard.html
- [ ] Se login falhar: `showToast('Email ou senha incorretos', 'error')`
- [ ] Se já há sessão ativa: redirecionar para dashboard.html automaticamente
- [ ] Link "Esqueci a senha" que chama `supabase.auth.resetPasswordForEmail()`
- [ ] Verificar: abrir no browser, tentar login com credenciais erradas (erro), tentar com corretas (redireciona)

---

## Tarefa 5 — dashboard.html

**Arquivo:** `C:\Users\Eva\CRM-EVALUZ\dashboard.html`

- [ ] Chamar `checkSession()` no load
- [ ] Chamar `injectNav('dashboard')` no load
- [ ] **Cards de métricas (linha superior):**
  - Total de contatos ativos
  - Contatos por estágio atual (mini funil)
  - Tarefas para hoje (contagem)
  - Vendas efetivadas no mês
- [ ] **Agenda do Dia:** buscar tasks com `due_date = hoje` e `status = pendente`, listar com botão WhatsApp para cada uma
- [ ] **Funil Resumido:** contar contatos por etapa e exibir barras horizontais com percentual
- [ ] **Últimos Contatos Adicionados:** lista dos 5 mais recentes com link para detalhe
- [ ] **Alerta de Tarefas Atrasadas:** badge vermelho se há tasks com `status = atrasada`
- [ ] Verificar: dados aparecem corretamente após login

---

## Tarefa 6 — contatos.html (Lista + Kanban)

**Arquivo:** `C:\Users\Eva\CRM-EVALUZ\contatos.html`

- [ ] Chamar `checkSession()` + `injectNav('contatos')`
- [ ] Toggle view: Lista (tabela) ou Kanban (colunas)
- [ ] **Vista Kanban:** uma coluna por etapa do funil (11 colunas com scroll horizontal)
  - Cada card mostra: nome, telefone (ícone WhatsApp clicável), etapa, tipo de cliente
  - Drag-and-drop entre colunas (atualiza `funnel_stage` no Supabase)
- [ ] **Vista Lista:** tabela com colunas Nome, Telefone, Etapa, Origem, DISC, Ações
- [ ] Barra de busca por nome ou telefone (filtro em tempo real)
- [ ] Filtros: por etapa, por origem, por tipo de cliente
- [ ] Botão "Novo Contato" abre modal com formulário completo:
  - Dados básicos: nome, telefone, email
  - Redes sociais: Instagram, Facebook, outro
  - Origem: dropdown com todas as opções
  - Tipo de cliente: dropdown com os 8 tipos
  - Sistema representativo: dropdown VAK
  - Perfil DISC: dropdown
  - Etapa inicial do funil: dropdown
  - Notas iniciais
- [ ] Ao salvar: inserir em `contacts` com `created_by = user.id`
- [ ] Cada contato tem ações: Ver detalhes, Editar, Deletar (admin) 
- [ ] Verificar: criar contato, mover no Kanban, buscar por nome

---

## Tarefa 7 — contato.html (Detalhe do Contato)

**Arquivo:** `C:\Users\Eva\CRM-EVALUZ\contato.html`

- [ ] Recebe `?id=UUID` na URL
- [ ] Chamar `checkSession()` + `injectNav('contatos')`
- [ ] **Header do contato:** nome, etapa atual (badge colorido), botão WhatsApp direto, botão Editar
- [ ] **Aba Perfil:**
  - Dados de contato (phone, email, redes sociais com links clicáveis)
  - Tipo de cliente com descrição de como agir (carregar de utils.js)
  - Sistema representativo com dicas de abordagem
  - Perfil DISC com orientações
  - **Gatilhos sugeridos automaticamente** com base no perfil (de utils.js)
  - Campo de notas editável inline
- [ ] **Aba Histórico:**
  - Timeline de todos os contatos anteriores
  - Botão "Registrar Contato": tipo (WhatsApp/Ligação/Email/Reunião), nota, data
  - Inserir em `contact_history`
- [ ] **Aba Tarefas:**
  - Listar tasks desse contato (pendentes e concluídas)
  - Botão "Nova Tarefa" com formulário: título, descrição, data, hora, mensagem WhatsApp pré-preenchida, lembrete email (checkbox)
  - Botão "Concluir" em cada task
  - Botão WhatsApp na task abre `openWhatsApp()` com mensagem salva
  - **Cadência Automática:** ao criar tarefa com "usar cadência IMPAR", sugere datas dias 1, 3, 6, 10, 15, 30 e cria todas de uma vez
- [ ] **Painel de Objeções Rápido:** botão "Ver Objeções" abre sidebar lateral com as 15 objeções
- [ ] Registrar contato em `metrics` com type='contato' ao salvar histórico
- [ ] Verificar: navegar da lista para o detalhe, registrar histórico, criar tarefa com cadência

---

## Tarefa 8 — tarefas.html (Central de Tarefas)

**Arquivo:** `C:\Users\Eva\CRM-EVALUZ\tarefas.html`

- [ ] Chamar `checkSession()` + `injectNav('tarefas')`
- [ ] **Seções:**
  - Atrasadas (vermelho, badge de contagem no nav)
  - Para hoje (destaque)
  - Próximos 7 dias
  - Todas (com paginação)
- [ ] Cada task mostra: nome do contato (link), descrição, data/hora, botão WhatsApp, botão Concluir
- [ ] Filtros: por status, por data, por responsável
- [ ] Ao clicar "Concluir": atualiza `status = concluida` no Supabase + mostra toast
- [ ] **Lembrete por Email:** ao carregar, verificar tasks do dia com `reminder_email = true` e enviar via EmailJS (uma vez por sessão, usando flag em sessionStorage)
- [ ] Verificar: tasks aparecem nas seções corretas, concluir task atualiza lista

---

## Tarefa 9 — relatorios.html (Relatórios e Métricas)

**Arquivo:** `C:\Users\Eva\CRM-EVALUZ\relatorios.html`

- [ ] Chamar `checkSession()` + `injectNav('relatorios')`
- [ ] **Período:** filtro por mês/ano (padrão: mês atual)
- [ ] **Cards principais:**
  - Total de contatos feitos no período
  - Total de cotações enviadas
  - Total de vendas efetivadas
  - Taxa de conversão (vendas / contatos × 100)
- [ ] **Funil de Conversão:** barra por etapa mostrando quantos contatos estão em cada fase
- [ ] **Evolução Mensal:** tabela comparando contatos, cotações e vendas dos últimos 6 meses
- [ ] **Contatos por Origem:** lista com contagem (Instagram, YouTube, etc.)
- [ ] **Registrar Cotação/Venda:** botão que abre modal: selecionar contato, tipo (cotação/venda), valor (opcional), data
- [ ] Verificar: métricas aparecem após registrar cotação e venda pelo modal

---

## Tarefa 10 — objecoes.html (Guia de Objeções)

**Arquivo:** `C:\Users\Eva\CRM-EVALUZ\objecoes.html`

- [ ] Chamar `checkSession()` + `injectNav('objecoes')`
- [ ] Todas as 15 objeções em cards expansíveis (accordion)
- [ ] Cada card: objeção (título), como responder, técnica utilizada
- [ ] Barra de busca para filtrar por palavra-chave
- [ ] Layout pensado para uso no celular durante contato (fonte grande, cards espaçados)
- [ ] As 15 objeções completas com conteúdo do documento original da Eva
- [ ] Verificar: buscar "caro", card expande com resposta completa

---

## Tarefa 11 — admin.html (Gestão de Usuários)

**Arquivo:** `C:\Users\Eva\CRM-EVALUZ\admin.html`

- [ ] Chamar `checkSession()` + verificar se `role === 'admin'` (redirecionar se não for)
- [ ] `injectNav('admin')`
- [ ] Lista de usuários cadastrados (nome, email, role, data de criação)
- [ ] Botão "Convidar Colaborador": chama `supabase.auth.admin.inviteUserByEmail()` — inserir email e nome, role padrão 'colaborador'
- [ ] Botão "Alterar Role": toggle entre admin e colaborador
- [ ] Botão "Desativar" usuário
- [ ] Verificar: como admin, convidar email teste, ver na lista

---

## Tarefa 12 — SETUP.html (Instruções de Configuração)

**Arquivo:** `C:\Users\Eva\CRM-EVALUZ\SETUP.html`

- [ ] Página standalone (sem sidebar, sem auth)
- [ ] Identidade visual Eva Luz (azul marinho, cobre)
- [ ] **Passo 1:** Criar conta no Supabase (com screenshots descritivos)
- [ ] **Passo 2:** Criar projeto no Supabase, copiar URL e anon key
- [ ] **Passo 3:** Executar schema.sql no SQL Editor do Supabase
- [ ] **Passo 4:** Criar primeiro usuário admin via Authentication > Users
- [ ] **Passo 5:** Inserir perfil admin manualmente via Table Editor
- [ ] **Passo 6:** Preencher js/config.js com as credenciais
- [ ] **Passo 7:** Criar conta no Netlify com Gmail
- [ ] **Passo 8:** Arrastar pasta CRM-EVALUZ para Netlify (deploy)
- [ ] **Passo 9 (opcional):** Configurar EmailJS para lembretes por email
- [ ] Verificar: seguir as instruções do zero e conseguir fazer login no sistema

---

## Self-Review

**Cobertura da spec:**
- [x] Integração WhatsApp (click-to-chat) — Tarefa 6, 7, 8
- [x] Paleta Eva Luz — Tarefa 2
- [x] Integração Hotmart (placeholder no campo origem) — Tarefa 6
- [x] Dashboard de fácil leitura — Tarefa 5
- [x] 11 etapas do funil — Tarefa 6 (Kanban)
- [x] Metodologia das 8 etapas da venda — Guia no contato.html
- [x] Dados do cliente + redes sociais — Tarefa 6, 7
- [x] 8 tipos de cliente com como agir — Tarefa 7 (utils.js)
- [x] Sistema VAK — Tarefa 3 + 7
- [x] Perfil DISC — Tarefa 3 + 7
- [x] Gatilhos sugeridos por perfil — Tarefa 3 + 7
- [x] Histórico de contatos — Tarefa 7
- [x] Lista de tarefas com data/hora — Tarefa 7, 8
- [x] Cadência de contatos (dias 1,3,6,10,15,30) — Tarefa 7
- [x] Lembretes das 15 objeções — Tarefa 10 + sidebar no contato
- [x] Registro de quantidades (contatos, cotações, vendas) — Tarefa 9
- [x] Lembrete por email — Tarefa 8 (EmailJS)
- [x] Lembrete por WhatsApp (click-to-open) — Tarefa 7, 8
- [x] Lembrete in-system — Tarefa 5 (agenda do dia), 8
- [x] Multi-usuário com roles — Tarefa 3, 11
- [x] Multi-device (hosted no Netlify) — Tarefa 12

**Pendências identificadas:** Nenhuma. Todas as funcionalidades do documento original estão cobertas.
