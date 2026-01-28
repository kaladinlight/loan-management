# Loan Management

A full-stack Next.js application for creating, viewing, and managing loans.

## Tech Stack

- **TypeScript** (strict mode)
- **Next.js 16** (App Router), React 19, Tailwind CSS 4, shadcn/ui
- **PostgreSQL** with Prisma 7
- **Zod** for validation
- **ESLint** + **Prettier** for linting/formatting

## Prerequisites

- Node.js 24+ (see `.nvmrc`)
- PostgreSQL (or use Docker Compose)
- Yarn 4

## Getting Started

```bash
# Use the correct Node version
nvm use

# Install dependencies
yarn install

# Start PostgreSQL
docker compose up -d

# Copy environment variables
cp .env.example .env

# Run database migrations
yarn prisma:migrate

# Start dev server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command                | Description               |
| ---------------------- | ------------------------- |
| `yarn dev`             | Start dev server          |
| `yarn build`           | Production build          |
| `yarn lint`            | Run ESLint                |
| `yarn format`          | Format code with Prettier |
| `yarn format:check`    | Check formatting          |
| `yarn prisma:generate` | Regenerate Prisma client  |
| `yarn prisma:migrate`  | Run database migrations   |
| `yarn prisma:studio`   | Open Prisma Studio GUI    |
| `docker compose up -d` | Start PostgreSQL          |

## Project Structure

```
src/
  app/              # Routing, pages, UI, components, hooks
  lib/
    actions/        # Server actions (mutations)
    data/           # Data access functions (queries)
    schemas/        # Zod validation schemas
    types/          # TypeScript type definitions
    db.ts           # Prisma client singleton
prisma/
  schema.prisma     # Database schema
  prisma.config.ts  # Prisma configuration
```
