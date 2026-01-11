# Project TODO

## Sistema de Perfil e Favoritos
- [x] Definir esquema de banco de dados para Times e Jogadores Favoritos
- [x] Criar tabelas no schema.ts (favoriteTeams, favoritePlayers)
- [x] Executar migração do banco de dados (pnpm db:push)
- [x] Criar helpers de banco de dados em server/db.ts
- [x] Implementar procedimentos tRPC para favoritos (adicionar, remover, listar)
- [x] Criar página de Perfil do Usuário (client/src/pages/Profile.tsx)
- [x] Adicionar botões de "Favoritar" na interface (times e jogadores)
- [x] Atualizar rotas no App.tsx para incluir /perfil
- [x] Adicionar link de Perfil no menu principal (Layout.tsx)
- [x] Testar funcionalidade completa de favoritos

## Jogos de Hoje (Onde Assistir)

- [x] Atualizar footballApi.ts para incluir informações de broadcast (canais de TV)
- [x] Criar método getTodayMatches() no serviço de API
- [x] Criar componente TodayMatchesWidget para exibir na Home
- [x] Criar página TodayMatches (/jogos-de-hoje) com lista completa
- [x] Adicionar rota /jogos-de-hoje no App.tsx
- [x] Adicionar link no menu principal (Layout.tsx)
- [x] Integrar TodayMatchesWidget na página Home

## Filtro de Campeonatos (Jogos de Hoje)

- [x] Adicionar estado de filtro na página TodayMatches
- [x] Criar botões de filtro por liga (Todos, Brasileirão, Premier League, La Liga, etc.)
- [x] Implementar lógica de filtragem dos jogos
- [x] Adicionar indicador visual do filtro ativo

## CMS com Assistente de IA

- [x] Criar esquema de banco de dados para artigos (articles table)
- [x] Adicionar campos: título, conteúdo, categoria, imagem, slug, autor, data
- [x] Executar migração do banco de dados
- [x] Criar helpers de banco de dados para artigos (CRUD)
- [x] Implementar procedimentos tRPC para artigos
- [x] Integrar API Groq (IA gratuita) no backend
- [x] Criar serviço de geração de conteúdo com IA
- [x] Criar página /admin com lista de artigos
- [x] Criar página /admin/novo-artigo com editor
- [x] Adicionar botão "Gerar com IA" no editor
- [x] Atualizar Home para exibir artigos do banco
- [x] Atualizar NewsDetail para buscar do banco
- [x] Criar sistema de slugs únicos para URLs amigáveis
- [x] Adicionar rotas do Admin no App.tsx
- [x] Adicionar link "Admin" no menu de navegação
- [x] Testar fluxo completo: criar artigo com IA → publicar → visualizar na Home → abrir detalhes
