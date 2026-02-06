# Loan Management Application

## Tech Stack

- TypeScript (strict mode), Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui
- PostgreSQL 16 with Prisma 7 ORM (driver adapter: `@prisma/adapter-pg`)
- Zod 4 for validation
- ESLint + Prettier for linting/formatting
- Yarn 4, Node 24

## Project Structure

```
src/
  app/              # Routing, pages, UI, components, hooks
    components/     # App components
    components/ui/  # shadcn/ui primitives
    hooks/          # Custom React hooks
  lib/              # Server-side logic
    actions/        # Server actions (mutations, "use server")
    data/           # Data access functions (queries)
    schemas/        # Zod validation schemas
    types/          # TypeScript type definitions
    db.ts           # Prisma client singleton
    utils.ts        # Shared utility functions
generated/prisma/   # Auto-generated Prisma client (gitignored)
prisma/
  schema.prisma     # Database schema and generator config
  seed.ts           # Database seed script
prisma.config.ts    # Prisma configuration (project root)
```

## Prisma 7 Notes

- Generator: `prisma-client` with output to `generated/prisma` (project root, gitignored)
- Import from `@/generated/prisma/client` (not `@prisma/client`); tsconfig alias maps `@/generated/*` to `./generated/*`
- PrismaClient requires `PrismaPg` adapter — see `src/lib/db.ts`
- Config file (`prisma.config.ts`) lives at project root, uses `env('DATABASE_URL')` + `import 'dotenv/config'`
- Seed script uses relative import: `../generated/prisma/client`

## Zod 4 Notes

- Use `error` instead of `required_error` in schema params
- e.g. `z.enum([...], { error: 'Field is required' })`

## Workflow

- Do not run `yarn lint` or `yarn build` after making changes — the dev server handles this automatically

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
- `yarn prisma:generate` — regenerate Prisma client
- `yarn prisma:migrate` — run database migrations
- `yarn prisma:studio` — open Prisma Studio GUI
- `yarn prisma:seed` — seed the database
- `docker compose up -d` — start PostgreSQL
