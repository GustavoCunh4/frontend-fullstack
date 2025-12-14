# Frontend (React + TypeScript + Vite)

SPA responsavel pelas telas publicas (cadastro/login) e pela area logada protegida com JWT. O app consome o backend deste repositorio via Fetch API, mantem o token no `localStorage` e derruba automaticamente a sessao quando o JWT expira ou retorna `401`.

## Como rodar
```bash
cd frontend
npm install
cp .env.example .env
# ajuste VITE_API_BASE_URL, VITE_HELP_LINK e VITE_STATUS_LINK conforme o backend desejado
npm run dev
```

### Scripts
- `npm run dev` – desenvolvimento com Vite.
- `npm run build` – compila a SPA (verifique Node >= 20.19 ou 22.x).
- `npm run preview` – sobe o build para smoke local.

## Variaveis de ambiente (`.env`)
- `VITE_API_BASE_URL`: URL base do backend (troque entre Postgres/Mongo para os dois deploys exigidos).
- `VITE_HELP_LINK`: link exibido em todos os toasts de sucesso/erro (requisito de "ToastLinks").
- `VITE_STATUS_LINK`: link exibido nos skeletons/carregamentos (requisito de "LoadingLinks").

## Principais features
- Contexto de autenticao com decodificacao do `exp` do JWT, refresh automatico de estado e logout forçado quando o token vence.
- Forms controlados para cadastro/login e para o CRUD de tarefas, com validacao basica e feedback visual (`react-hot-toast` + links externos).
- `ProtectedRoute` com `react-router-dom` que bloqueia `/dashboard` ate validar o token em memoria/localStorage.
- Dashboard responsivo com:
  - filtro combinavel por status, prioridade, titulo e data;
  - formulario reutilizavel para criar/editar tarefas;
  - tabela responsiva com botoes de edicao/remoção e confirmacao;
  - overlay de carregamento com link externo de status para cada requisicao longa.

## Estrutura resumida
- `src/api/*` – wrappers de Fetch para auth e tasks.
- `src/contexts/AuthContext.tsx` – armazenamento e ciclo de vida do token JWT.
- `src/components/*` – formulários, filtros, tabela, guardas e utilitarios visuais.
- `src/pages/auth/*` – telas publicas de cadastro/login.
- `src/pages/dashboard/*` – area protegida com CRUD completo das tarefas.
- `src/utils/*` – formatadores de data, parse de JWT e helper de toasts.

## Deploy em dois domínios (Mongo + Postgres)
1. Importe este repo duas vezes no Vercel (ou outro host) apontando para `frontend/`.
2. Configure para cada deploy:
   - `VITE_API_BASE_URL` apontando para o backend correspondente.
   - `VITE_HELP_LINK` com o link da documentacao/deploy daquele backend.
   - `VITE_STATUS_LINK` com o status page ou observabilidade desejada.
3. Após publicar, referencie ambos os links finais + links dos dois backends no README raiz.
