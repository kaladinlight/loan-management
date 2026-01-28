# Loan Management Application

## Tech Stack

- TypeScript (strict mode), Next.js (App Router), React, Tailwind CSS, shadcn/ui
- PostgreSQL with Prisma ORM
- Zod for validation
- ESLint + Prettier for linting/formatting

## Project Structure

```
src/
  app/          # Routing, pages, UI, components, hooks
  lib/          # Server-side logic: actions/, data/, schemas/, types/, db.ts
prisma/         # Prisma schema
```

- `app/` — pages, layouts, components (`components/`, `components/ui/`), hooks (`hooks/`)
- `lib/actions/` — server actions (mutations only, `"use server"` directive)
- `lib/data/` — data access functions (queries, called from Server Components)
- `lib/schemas/` — Zod validation schemas (shared between client and server)
- `lib/types/` — TypeScript type definitions

## Code Standards

- No `any` types — use proper typing or `unknown` with narrowing
- Explicit return types on exported functions and server actions
- Interfaces for object shapes, type aliases for unions/utilities
- Default to Server Components; only use `"use client"` when interactivity is needed
- One component per file, named exports, file name matches component name
- Validate all server action inputs with Zod before database operations
- Prettier: 120 char width, single quotes, trailing commas, 2-space indent

## Commands

- `yarn dev` — start dev server
- `yarn build` — production build
- `yarn lint` — run ESLint
- `yarn format` — format code with Prettier
- `yarn format:check` — check formatting
- `npx prisma migrate dev` — run database migrations
- `npx prisma generate` — regenerate Prisma client
- `docker compose up -d` — start PostgreSQL
