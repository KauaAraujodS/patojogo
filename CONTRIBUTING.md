# Guia de colaboracao

## Regra principal

Ninguem faz alteracao direto na `main`.

## Estrutura

- `main`: producao
- `develop`: integracao do time
- `feature/*`: funcionalidades
- `fix/*`: correcoes pequenas
- `hotfix/*`: correcoes urgentes

## Antes de comecar qualquer tarefa

```bash
git checkout develop
git pull origin develop
```

## Criar branch nova

```bash
git checkout -b feature/nome-da-tarefa
```

Exemplos:

- `feature/tela-login`
- `feature/dashboard-inicial`
- `fix/erro-navbar`

## Durante o trabalho

Use commits pequenos e claros:

```bash
git add .
git commit -m "feat: cria tela de login"
```

## Subir branch

```bash
git push -u origin feature/nome-da-tarefa
```

## Abrir Pull Request

- `base`: `develop`
- `compare`: sua branch

So depois do merge a mudanca entra na base do time.

## Atualizar seu codigo com o do outro dev

Sempre antes de continuar trabalho:

```bash
git checkout develop
git pull origin develop
```

Se voce ja estiver numa branch aberta e a `develop` mudou:

```bash
git checkout develop
git pull origin develop
git checkout feature/nome-da-tarefa
git merge develop
```

Se der conflito, resolva no codigo, depois:

```bash
git add .
git commit -m "chore: merge develop into feature/nome-da-tarefa"
```

## Fechando uma tarefa

Depois que o PR for mergeado:

```bash
git checkout develop
git pull origin develop
git branch -d feature/nome-da-tarefa
```

Se quiser remover a branch remota depois:

```bash
git push origin --delete feature/nome-da-tarefa
```

## Regras para nao se atropelar

- cada pessoa trabalha na propria branch
- nunca usar a mesma branch para duas tarefas diferentes
- nunca commitar direto na `main`
- sempre atualizar a `develop` antes de criar branch nova
- abrir PR para revisar antes de juntar mudancas
