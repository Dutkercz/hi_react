# Hotel Cris — Front-end

Aplicação web para apoiar a gestão de hospedagens do Hotel Cris. A interface reúne a consulta de quartos e ocupações, o cadastro e a busca de clientes e ferramentas administrativas para acompanhar indicadores e manter quartos e tarifas.

## Funcionalidades

- Visão geral dos quartos, com detalhes de cada unidade.
- Quadro mensal de ocupação, com seleção de mês e indicação de dias livres ou ocupados.
- Cadastro de clientes e consulta de clientes por nome, CPF ou CNPJ.
- Login, área da conta e atualização da imagem de perfil.
- Área administrativa protegida, com indicadores, gráficos e gestão de quartos.
- Cadastro de funcionários e atualização dos preços das diárias por quantidade de hóspedes.
- Interface adaptável a dispositivos móveis e suporte a temas.

## Tecnologias

- React 19 e TypeScript
- Vite
- Tailwind CSS 4 e componentes shadcn/ui
- React Router para navegação
- TanStack Query para consultas e cache de dados
- Axios para comunicação com a API
- React Hook Form e Zod para formulários e validação
- Vitest, Testing Library e jsdom para testes

## Requisitos

- Node.js compatível com a versão do Vite utilizada pelo projeto.
- npm.
- API do sistema disponível para as operações que dependem do servidor.

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Opcionalmente, configure a URL da API em um arquivo `.env.local` na raiz:

   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```

   Se essa variável não for definida, a aplicação usa `http://localhost:8080/api/v1`.

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   O Vite exibirá no terminal o endereço local para abrir no navegador.

## Executar com Docker

O `Dockerfile` usa um build em duas etapas: compila a aplicação com Node.js e serve os arquivos estáticos com Nginx. O arquivo `nginx.conf` configura o fallback para `index.html`, necessário para o funcionamento das rotas da aplicação.

Com o Docker instalado e em execução, rode os comandos a seguir na raiz do repositório:

```bash
docker build -t hotel-cris-frontend .
docker run --rm -p 3000:80 hotel-cris-frontend
```

Depois, acesse [http://localhost:3000](http://localhost:3000). A porta `3000` é a porta local escolhida para acessar o front-end; dentro do contêiner, o Nginx continua ouvindo na porta `80`. O contêiner executa apenas o front-end; a API precisa estar disponível separadamente. A URL `VITE_API_URL` é incorporada à aplicação durante o build. Como o Dockerfile atual não declara um argumento de build para essa variável, a aplicação usa o valor padrão (`http://localhost:8080/api/v1`); para usar outra URL, ajuste o Dockerfile para recebê-la durante a compilação.

## Comandos disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Executa a verificação de tipos e gera a versão de produção em `dist/`. |
| `npm run preview` | Serve localmente a versão gerada em `dist/`. |
| `npm run lint` | Executa o ESLint. |
| `npm run typecheck` | Verifica os tipos TypeScript. |
| `npm run format` | Formata arquivos `.ts` e `.tsx` com Prettier. |
| `npm exec vitest run` | Executa os testes automatizados. |

## Estrutura do projeto

```text
src/
├── components/   # Componentes reutilizáveis e áreas da aplicação
├── context/      # Contextos React, incluindo autenticação
├── hooks/        # Hooks de estado, formulários e consultas
├── pages/        # Páginas e rotas da aplicação
├── schemas/      # Esquemas de validação com Zod
├── service/      # Comunicação com a API
├── types/        # Tipos TypeScript
├── App.tsx       # Rotas principais
└── main.tsx      # Inicialização da aplicação
```

## API e autenticação

As chamadas HTTP são centralizadas em `src/service/axiosService.ts`. Configure `VITE_API_URL` para apontar para a API usada no ambiente. O fluxo de autenticação utiliza token de acesso e renovação de sessão por cookie; as operações administrativas exigem autenticação.

O repositório do back-end está em [github.com/Dutkercz/hi_spring](https://github.com/Dutkercz/hi_spring). Consulte o README desse repositório para ver o passo a passo de configuração e execução do back-end.

> Variáveis `VITE_*` são incluídas no bundle do navegador. Não coloque senhas, chaves privadas ou outros segredos nelas.
