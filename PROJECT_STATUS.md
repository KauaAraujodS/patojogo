# Status do projeto

Atualizado em `10 de abril de 2026`.

## O que foi entregue

- Base do app em `Next.js 16`, `React 19`, `TypeScript` e `Tailwind CSS 4`
- Integracao com `Supabase SSR`
- Projeto remoto do Supabase vinculado ao repo
- Variaveis de ambiente preparadas em `.env.example`
- Design system inicial com cores, tipografia, botoes e inputs
- Fluxo de `login` e `cadastro` conectado ao `Supabase Auth`
- Captura de `nome`, `telefone`, `email` e `senha`
- Schema do banco com tabela `profiles`, progresso e pontuacao
- Script para exportar todos os participantes em lote
- Tela autenticada com shell de app mobile-first
- Menu inferior com cinco abas
- Aba `Jogar` pronta com dois modos visuais
- Abas `Extras`, `Loja`, `Ranking` e `Conta` propositalmente vazias
- Fundacao inicial do `Quiz guiado` integrada ao App Router
- Selecao de nivel com `Iniciante`, `Intermediario` e `Avancado`
- Overview por nivel com requisitos, recompensas e progresso
- Primeira rota de questao seed para iniciar o fluxo tecnico
- Hook local de progresso do quiz preparado para futura sincronizacao
- Banco inicial seed com questoes tipadas e helpers de progressao

## Fluxo atual do usuario

1. O participante entra pela tela de autenticacao.
2. No cadastro, o app salva os dados basicos da conta.
3. Depois do login, o usuario cai no shell principal do app.
4. A home autenticada abre na aba `Jogar`.
5. O app ja mostra progresso e pontuacao vindos do perfil.

## Arquivos principais

- `app/page.tsx`
- `components/auth/auth-panel.tsx`
- `components/game/game-shell.tsx`
- `components/auth/sign-out-button.tsx`
- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/typography.tsx`
- `lib/design-system.ts`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/proxy.ts`
- `lib/database.types.ts`
- `supabase/migrations/20260409181525_create_profiles_and_progress.sql`
- `scripts/export-participants.mjs`
- `app/jogar/quiz-guiado/page.tsx`
- `app/jogar/quiz-guiado/[level]/page.tsx`
- `app/jogar/quiz-guiado/[level]/questao/page.tsx`
- `components/game/quiz/*`
- `data/questions.ts`
- `hooks/useQuizProgress.ts`
- `utils/quizHelpers.ts`

## Banco de dados atual

- Projeto: `patojogo`
- Ref: `dvtbmjjfyjspbigyemjr`
- Tabela principal de app: `profiles`
- Campos usados no fluxo atual:
  - `full_name`
  - `phone`
  - `email`
  - `progress_step`
  - `score`

## O que ainda nao foi construido

- Fluxo completo de resposta do quiz
- Tela real de desafio
- Loja
- Ranking funcional
- Conta com edicao de perfil
- Regras reais de pontuacao
- Persistencia do quiz no Supabase

## Proximo passo recomendado

Construir a primeira questao funcional do `Quiz guiado`:

- selecionar nivel
- entrar no overview
- responder questao
- validar resposta
- mostrar feedback

## Git

Branches de referencia:

- `main`: base estavel
- `develop`: base de trabalho
- `feature/auth-onboarding`: branch que concentrou as entregas de hoje

Se alguem novo entrar no projeto agora, pode puxar a `main` para ter tudo que foi feito ate aqui.
