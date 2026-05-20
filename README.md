# Project Beta UI Prototype

This is a standalone React and TypeScript UI prototype that continues directly from the Project Alpha NestJS backend.

## What It Demonstrates

- Alpha-to-Beta handoff using the existing NestJS API contract
- Mother-facing group discovery and apply flow
- Leader-facing application review flow
- Membership roster view

## Pages

- `/` overview
- `/groups` groups discovery
- `/groups/:groupId` group detail plus apply form
- `/applications` applications dashboard
- `/applications/:applicationId` application detail and review
- `/memberships` memberships roster

## API configuration

The UI reads `VITE_API_BASE_URL` from env files (see `.env.example`).

| Environment | Default base URL |
|-------------|------------------|
| Production / Docker | `https://abqd2pkatkuks607gntnz1rb.lanna.engineer` |
| Local dev | `/api` (proxied to `http://localhost:3001` via Vite) |

Coolify: set build arg `VITE_API_BASE_URL` if you need to override the deployed backend URL.

The NestJS API must allow browser CORS (see `project-alpha-nest-prototype` `create-app.ts`). Redeploy the backend after enabling CORS.

## Run

### Against the deployed Coolify API

```bash
cd /home/digierve/abDev/examples/project-beta-ui-prototype
npm install
npm run dev
```

Uses `.env` / production URL. Open `http://localhost:3002`.

### Against a local NestJS backend

Copy `.env.development` behavior (or set `VITE_API_BASE_URL=/api`), start Alpha, then start the UI:

```bash
cd /home/digierve/abDev/examples/project-alpha-nest-prototype
npm run start:dev
```

```bash
cd /home/digierve/abDev/examples/project-beta-ui-prototype
npm run dev -- --mode development
```

Open:

- UI: `http://localhost:3002`
- API Swagger: configured in the sidebar (from `VITE_API_BASE_URL`)

## Notes

- This MVP is intentionally Alpha-compatible.
- The Beta brief talks about `users` and `locations`, while this continuation still consumes Alpha's `mothers`-based contract.
