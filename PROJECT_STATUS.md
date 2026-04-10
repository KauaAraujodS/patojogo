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
- Sistema completo do `Quiz guiado` integrado ao App Router
- Selecao de nivel com desbloqueio progressivo
- Overview por nivel com requisitos, progresso, revisao e estatisticas
- Sessao real de quiz com:
  - respostas
  - feedback imediato
  - dicas com custo
  - pulo de questoes
  - pontuacao
  - moedas
- Telas de resultado final, revisao de respostas e estatisticas gerais
- Persistencia local do quiz com sincronizacao para o `Supabase`
- Banco completo com `90` questoes:
  - `30` iniciante
  - `30` intermediario
  - `30` avancado
- Suporte aos tipos:
  - multipla escolha
  - identificacao visual
  - verdadeiro/falso
  - associacao
  - ordenacao
  - discursiva
- Sistema de conquistas e progresso por nivel

## Fluxo atual do usuario

1. O participante entra pela tela de autenticacao.
2. No cadastro, o app salva os dados basicos da conta.
3. Depois do login, o usuario cai no shell principal do app.
4. A home autenticada abre na aba `Jogar`.
5. Ao entrar em `Quiz guiado`, o usuario escolhe o nivel.
6. O app executa a rodada completa, salva o resultado e sincroniza com o banco.
7. O participante pode revisar respostas, consultar estatisticas e acumular pontos/moedas.

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
- `app/jogar/quiz-guiado/[level]/resultado/page.tsx`
- `app/jogar/quiz-guiado/[level]/revisao/page.tsx`
- `app/jogar/quiz-guiado/estatisticas/page.tsx`
- `components/game/quiz/*`
- `data/questions.ts`
- `hooks/useQuizProgress.ts`
- `utils/quizHelpers.ts`
- `lib/quiz/client.ts`
- `lib/quiz/server.ts`
- `supabase/migrations/20260410094000_create_quiz_progress_tables.sql`

## Banco de dados atual

- Projeto: `patojogo`
- Ref: `dvtbmjjfyjspbigyemjr`
- Tabela principal de app: `profiles`
- Tabelas do quiz:
  - `quiz_progress`
  - `quiz_attempts`
- Campos usados no fluxo atual:
  - `full_name`
  - `phone`
  - `email`
  - `progress_step`
  - `score`
  - `coins`

## O que ainda nao foi construido

- Tela real de desafio
- Loja
- Ranking funcional
- Conta com edicao de perfil

## Proximo passo recomendado

Construir o modo `Desafio relampago` e depois ligar o ranking final da palestra:

- placar global
- posicao do participante
- premiacao final

## Git

Branches de referencia:

- `main`: base estavel
- `develop`: base de trabalho
- `feature/quiz-guiado-page`: branch atual do quiz guiado

Se alguem novo entrar no projeto agora, pode puxar a `main` para ter tudo que foi feito ate aqui.
