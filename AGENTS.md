# AGENTS.md

## Visão geral

Este repositório contém uma API REST. É uma aplicação Node.js escrita em TypeScript e construída com NestJS.

## Tecnologias utilizadas

- Node.js e TypeScript (ES2023)
- NestJS 11, com Express como plataforma HTTP
- PostgreSQL, acessado por Prisma 7 e pelo adaptador `@prisma/adapter-pg`
- Passport e JWT para autenticação
- `bcrypt` para hash e comparação de senhas
- `class-validator` e `class-transformer` para validação e transformação de DTOs
- Swagger (`@nestjs/swagger`) para documentação HTTP, disponível em `/docs`
- Jest, `ts-jest`, `@nestjs/testing` e Supertest para testes
- ESLint e Prettier
- Docker Compose para o PostgreSQL local

## Arquitetura e organização

O projeto é um monólito modular NestJS. As funcionalidades existentes são organizadas por domínio em `src/user`, `src/auth`; o módulo raiz é `src/app.module.ts`.

Cada domínio segue esta separação de responsabilidades:

```text
Controller -> Service -> Repository -> PrismaService -> PostgreSQL
```

- Controllers definem os endpoints, recebem DTOs e aplicam guards.
- Services contêm regras de negócio, autorização e tratamento de erros HTTP.
- Repositories encapsulam as consultas e alterações feitas com Prisma.
- DTOs ficam em `dto/` e incluem modelos de entrada e de resposta.
- `PrismaService`, em `src/prisma`, é global e é a única integração compartilhada com o banco.

Ao criar uma nova funcionalidade, mantenha essa estrutura: módulo, controller, service, repository e DTOs dentro de `src/<dominio>/`. Registre o módulo no `AppModule` quando necessário.

## Convenções de código

- Escreva código em TypeScript e use injeção de dependências do NestJS.
- Mantenha controllers finos: delegue regras de negócio aos services e acesso a dados aos repositories.
- Use DTOs para payloads HTTP e os decoradores de `class-validator` já adotados no projeto. A aplicação usa `ValidationPipe` global com `whitelist`, `forbidNonWhitelisted` e `transform`.
- Use `class-transformer` e DTOs de resposta para não expor campos internos, especialmente `password`.
- Use as exceções do NestJS (`NotFoundException`, `ConflictException`, `UnauthorizedException`, etc.) para erros de domínio e HTTP.
- Preserve os imports absolutos iniciados por `src/` onde já forem usados.
- Ao expor ou modificar endpoints, atualize os decoradores Swagger coerentemente com o controller.
- Siga a configuração de ESLint e Prettier existente. O script `npm run lint` usa `--fix`, portanto execute-o apenas quando a alteração automática de arquivos for desejada.

## Testes

- Testes unitários ficam próximos ao código em `src/**/*.spec.ts`.
- Testes E2E ficam em `test/**/*.e2e-spec.ts` e usam a configuração `test/jest-e2e.json`.
- Use `@nestjs/testing` para montar o módulo de teste.
- Em testes de service, faça mock dos repositories e de dependências externas como `bcrypt` e `JwtService`; não dependa do banco real.
- Para toda regra de negócio nova ou modificada, cubra o fluxo de sucesso e os erros relevantes.
- Comandos disponíveis: `npm test`, `npm run test:cov` e `npm run test:e2e`.

## Banco de dados

- O banco é PostgreSQL e a fonte de verdade do modelo é `prisma/schema.prisma`.
- O `DATABASE_URL` é obrigatório para inicializar `PrismaService`; não codifique credenciais ou URLs de conexão no código.
- Faça alterações de modelo no schema Prisma e crie uma migration correspondente em `prisma/migrations`; não altere migrations já aplicadas.
- Acesse o Prisma somente a partir de repositories, por meio de `PrismaService`.
- Preserve relações, índices e regras de integridade já definidos, como unicidade de e-mail, token de convite e associação usuário-grupo.
- O ambiente local de banco é descrito em `docker-compose.yml` e usa as variáveis `DB_USER`, `DB_PASSWORD` e `DB_NAME`.

## Segurança

- Proteja endpoints que dependem de identidade com `JwtAuthGuard` e use `AuthenticatedRequest` para obter o usuário autenticado.
- Mantenha o segredo JWT em `JWT_SECRET`; nunca o inclua no repositório.
- Armazene senhas exclusivamente como hash usando `bcrypt`; nunca retorne nem registre senha em respostas ou logs.
- Antes de alterar ou remover recursos de grupo, mantenha as verificações de autorização existentes no service.
- Não exponha variáveis de ambiente, tokens de convite ou dados sensíveis além do necessário para cada endpoint.

## Repositories

- Cada repository deve ser responsável apenas pelo acesso aos dados de sua própria entidade/domínio.
- Antes de criar uma consulta a outra entidade dentro de um repository, verifique se já existe um repository responsável por ela.
- Services podem coordenar múltiplos repositories por injeção de dependência.
- Evite duplicar queries Prisma que já estejam implementadas em outro repository.

## Git

- Mantenha commits pequenos e focados em uma única mudança lógica.
- Não inclua arquivos de ambiente, credenciais, tokens, artefatos de build (`dist/`) ou cobertura (`coverage/`) em commits.
- Não reescreva o histórico compartilhado, não faça `git reset --hard` e não use force push sem autorização explícita.
- Antes de abrir um commit ou PR, execute os testes relevantes à alteração e reporte qualquer falha preexistente ou não resolvida.

## Encoding e idioma

- Todos os arquivos de código-fonte devem utilizar UTF-8.
- Textos em português devem utilizar caracteres acentuados normalmente.
- Não utilizar sequências Unicode escapadas (`\uXXXX`) quando o caractere puder ser escrito diretamente.
- Exemplo: usar `Usuário não faz parte do grupo` em vez de `Usu\u00e1rio n\u00e3o faz parte do grupo`.

## Refatoração e extração de métodos

- Evite criar métodos auxiliares apenas para reduzir visualmente o tamanho de outro método.
- Não extraia uma lógica para um método separado quando ela for utilizada apenas uma ou duas vezes, salvo quando houver uma justificativa clara de legibilidade, responsabilidade ou complexidade.
- Como regra geral, extraia lógica repetida para um método reutilizável somente quando houver 3 ou mais ocorrências da mesma lógica no código.
- Antes de criar um método auxiliar, verifique se a abstração realmente reduz duplicação ou melhora significativamente a compreensão do código.
- Prefira manter lógicas simples e utilizadas uma única vez diretamente no fluxo principal.
- Exceções são permitidas quando a extração for necessária para separar responsabilidades, facilitar testes ou tornar uma lógica complexa significativamente mais legível.