# patojogo

Repositorio base do projeto.

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

## Supabase

Projeto remoto vinculado:

- nome: `patojogo`
- ref: `dvtbmjjfyjspbigyemjr`

Arquivos versionados do Supabase:

- `supabase/config.toml`
- `supabase/.gitignore`

Arquivos sensiveis ficam fora do Git em `supabase/.temp`.

## Colaboracao

Leia [CONTRIBUTING.md](./CONTRIBUTING.md) antes de abrir branch nova ou PR.
