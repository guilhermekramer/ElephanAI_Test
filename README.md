# Rick and Morty - Catálogo de Personagens

Aplicação web para explorar e favoritar personagens da série Rick and Morty, consumindo a [Rick and Morty API](https://rickandmortyapi.com/).

---

## Como Rodar o Projeto

### Pré-requisitos

- **Docker** e **Docker Compose**

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/guilhermekramer/ElephanAI_Test.git
cd ElephanAI_Test
```

### Passo 2: Buildar e Iniciar a Aplicação

```bash
docker-compose up --build
```

Pronto! A aplicação estará disponível em:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **MongoDB**: localhost:27017

Para rodar em segundo plano (modo detached):

```bash
docker-compose up --build -d
```

Para parar a aplicação:

```bash
docker-compose down
```

---

## Execução Local (Desenvolvimento)

Se preferir rodar o projeto localmente sem Docker (útil para desenvolvimento):

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm**
- **MongoDB** (local ou via Docker)

### Passo 1: Subir o MongoDB

```bash
docker-compose up -d mongo
```

### Passo 2: Configurar Variáveis de Ambiente

**Backend** - Crie o arquivo `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017
PORT=8080
```

**Frontend** - Crie o arquivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
VITE_RICK_AND_MORTY_API=https://rickandmortyapi.com/api
```

### Passo 3: Instalar Dependências e Iniciar

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Arquitetura do Software

O projeto segue uma arquitetura **cliente-servidor** com separação clara entre frontend e backend.

### Estrutura de Pastas

```
ElephanAI_Test/
├── backend/                    # API REST (Node.js + Fastify)
│   ├── src/
│   │   ├── controllers/        # Controladores (lógica de requisição/resposta)
│   │   ├── repository/         # Camada de acesso a dados (MongoDB)
│   │   ├── database/           # Configuração de conexão com banco
│   │   ├── routes/             # Definição das rotas da API
│   │   └── server.ts           # Ponto de entrada do servidor
│   └── __tests__/              # Testes unitários do backend
│
├── frontend/                   # Aplicação Web (React + Vite)
│   ├── src/
│   │   ├── api/                # Configuração de chamadas HTTP (Axios)
│   │   ├── components/         # Componentes React reutilizáveis
│   │   ├── hooks/              # Custom Hooks (useFavorites, useCharacters, etc.)
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── types/              # Definições de tipos TypeScript
│   │   └── services/           # Serviços auxiliares
│   └── __tests__/              # Testes unitários do frontend
│
└── docker-compose.yml          # Orquestração dos containers
```

### Padrões de Arquitetura

**Backend:**
- **Repository Pattern**: Separação entre lógica de negócio e acesso a dados
- **Controller Pattern**: Gerenciamento de requisições HTTP
- **Dependency Injection**: Injeção do banco de dados nos repositórios

**Frontend:**
- **Component-Based Architecture**: Componentes React isolados e reutilizáveis
- **Custom Hooks**: Encapsulamento de lógica de estado e efeitos colaterais
- **React Query**: Gerenciamento de estado do servidor e cache

---

## Stack Tecnológica

### Backend

| Tecnologia | Descrição |
|------------|-----------|
| **Node.js** | Runtime JavaScript server-side |
| **TypeScript** | Superset tipado de JavaScript |
| **Fastify** | Framework web de alta performance |
| **MongoDB** | Banco de dados NoSQL orientado a documentos |
| **Jest** | Framework de testes |

### Frontend

| Tecnologia | Descrição |
|------------|-----------|
| **React 19** | Biblioteca para construção de interfaces |
| **TypeScript** | Tipagem estática |
| **Vite** | Build tool e dev server ultra-rápido |
| **Tailwind CSS** | Framework CSS utility-first |
| **React Query** | Gerenciamento de estado assíncrono |
| **Axios** | Cliente HTTP |
| **React Router** | Roteamento client-side |
| **Radix UI** | Componentes de UI acessíveis |
| **Jest + Testing Library** | Testes unitários e de componentes |

### Infraestrutura

| Tecnologia | Descrição |
|------------|-----------|
| **Docker** | Containerização |
| **Docker Compose** | Orquestração de múltiplos containers |

---

## Executando os Testes

O projeto possui testes unitários tanto no backend quanto no frontend.

### Testes do Backend

```bash
cd backend
npm test
```

**Cobertura dos testes:**
- `favoritesRepository.test.ts` - Testes da camada de repositório
- `favoritesController.test.ts` - Testes dos controladores

Os testes do backend utilizam **mongodb-memory-server** para criar uma instância em memória do MongoDB, permitindo testes isolados sem dependência de banco externo.

### Testes do Frontend

```bash
cd frontend
npm test
```

**Cobertura dos testes:**
- `useFavorites.test.tsx` - Testes do hook de favoritos
- `useCharacters.test.tsx` - Testes do hook de personagens
- `useDebounce.test.ts` - Testes do hook de debounce
- `CharacterCard.test.tsx` - Testes do componente de card

Os testes do frontend utilizam **React Testing Library** para testar componentes de forma que simula a interação do usuário.

### Executar Todos os Testes

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/favorites` | Lista todos os personagens favoritos |
| `POST` | `/favorites` | Adiciona um personagem aos favoritos |
| `DELETE` | `/favorites/:id` | Remove um personagem dos favoritos |

---

## Licença

Este projeto foi desenvolvido como parte de um teste técnico.
