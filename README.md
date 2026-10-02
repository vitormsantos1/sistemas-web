Passo a Passo para rodar o projeto
1. Clonar o repositório
2. Rodar npm install
3. Copiar .env.example para .env
4. Rodar docker compose up -d
5. Rodar npx prisma generate
6. Rodar npx prisma migrate dev
7. Rodar npm run start:dev

Decisões arquiteturais:
- Separação entre controller, service e repository.
- Controllers recebem e tratam as requisições HTTP, Services concentram as regras de negócio e Repositories são responsáveis pelo acesso e comunicação com a camada de persistência/banco de dados.
- Arquitetura monolítica
- Separação das funcionalidades em módulos, como users e auth.
- Uso de banco relacional para persistência dos usuários e dados relacionados à autenticação.
- Uso do Prisma para comunicação com o banco de dados.
- Autenticação via JWT. Após login é gerado um token JWT, o token é utilizado para identificar usuários autenticados nas rotas protegidas.
- Proteção de senha utilizadon bcrypt para hash antes da persistência e comparação segura durante o login.
- Uso de DTOs para entrada de dados (class-validator e class-transformer)
- Utilização do jest para realização de testes unitários
- Swagger utilizado para documentar e visualizar os endpoints da API.
