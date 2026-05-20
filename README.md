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

## Run

Start the Alpha backend first:

```bash
cd /home/digierve/abDev/examples/project-alpha-nest-prototype
npm run start:dev
```

Then start this UI:

```bash
cd /home/digierve/abDev/examples/project-beta-ui-prototype
npm install
npm run dev
```

Open:

- UI: `http://localhost:3002`
- Alpha Swagger: `http://localhost:3001/docs`

## Notes

- This MVP is intentionally Alpha-compatible.
- The Beta brief talks about `users` and `locations`, while this continuation still consumes Alpha's `mothers`-based contract.
