# patojogo

Base do projeto em `Next.js 16 + TypeScript + Supabase`.

## Stack

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Supabase SSR`

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Ambiente

Arquivos:

- `.env.example`
- `.env.local`

Variaveis principais:

```bash
NEXT_PUBLIC_APP_NAME=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## Supabase

Projeto remoto vinculado:

- nome: `patojogo`
- ref: `dvtbmjjfyjspbigyemjr`

Arquivos versionados:

- `supabase/config.toml`
- `supabase/.gitignore`

Arquivos sensiveis ficam fora do Git em `supabase/.temp`.

## Branches

- `main`: versao estavel
- `develop`: base de trabalho do time
- `feature/*`: novas funcionalidades
- `fix/*`: ajustes pequenos
- `hotfix/*`: correcao urgente

## Fluxo do time

1. Atualize a `develop`.
2. Crie uma branch nova saindo dela.
3. Trabalhe so na sua branch.
4. Suba a branch para o GitHub.
5. Abra um Pull Request para `develop`.
6. Depois do merge, atualize sua `develop` local.

## Comandos mais usados

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-tarefa
git add .
git commit -m "feat: descreve a mudanca"
git push -u origin feature/nome-da-tarefa
```

Depois do merge:

```bash
git checkout develop
git pull origin develop
```

## Colaboracao

Leia [CONTRIBUTING.md](./CONTRIBUTING.md) antes de abrir branch nova ou PR.
