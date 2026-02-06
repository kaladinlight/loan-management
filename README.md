# Loan Management

[![CI](https://github.com/kaladinlight/loan-management/actions/workflows/ci.yml/badge.svg)](https://github.com/kaladinlight/loan-management/actions/workflows/ci.yml)

A full-stack Next.js application for creating, viewing, and managing loans.

## Tech Stack

- **TypeScript** (strict mode)
- **Next.js 16** (App Router), React 19, Tailwind CSS 4, shadcn/ui
- **PostgreSQL 16** with Prisma 7 (`@prisma/adapter-pg` driver adapter)
- **Zod 4** for validation
- **ESLint** + **Prettier** for linting/formatting

## Prerequisites

- Node.js 24+ (see `.nvmrc`)
- Docker (for PostgreSQL) or a local PostgreSQL 16 instance
- Corepack enabled (`corepack enable`) for Yarn 4

## Getting Started

```bash
# Use the correct Node version
nvm use

# Enable Corepack for Yarn 4
corepack enable

# Install dependencies (also runs prisma generate via postinstall)
yarn install

# Start PostgreSQL
docker compose up -d

# Copy environment variables
cp .env.example .env

# Run database migrations
yarn prisma:migrate

# Seed the database with sample data
npx prisma db seed

# Start dev server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `yarn dev`             | Start dev server                         |
| `yarn build`           | Production build                         |
| `yarn start`           | Start production server                  |
| `yarn lint`            | Run ESLint (includes formatting checks)  |
| `yarn lint:fix`        | Fix lint and formatting issues           |
| `yarn test`            | Run unit tests                           |
| `yarn test:watch`      | Run tests in watch mode                  |
| `yarn test:coverage`   | Run tests with coverage report           |
| `yarn clean`           | Remove .next, node_modules, and generated |
| `yarn prisma:generate` | Regenerate Prisma client                 |
| `yarn prisma:migrate`  | Run database migrations                  |
| `yarn prisma:studio`   | Open Prisma Studio GUI                   |
| `yarn prisma:seed`     | Seed database with sample data           |
| `docker compose up -d` | Start PostgreSQL container               |

## Project Structure

```
src/
  app/              # Routing, pages, UI, components, hooks
    components/     # App components
    components/ui/  # shadcn/ui primitives
    hooks/          # Custom React hooks
  lib/
    actions/        # Server actions (mutations)
    data/           # Data access functions (queries)
    schemas/        # Zod validation schemas
    types/          # TypeScript type definitions
    db.ts           # Prisma client singleton
    utils.ts        # Shared utility functions
generated/prisma/   # Auto-generated Prisma client (gitignored)
prisma/
  schema.prisma     # Database schema
  seed.ts           # Seed script
prisma.config.ts    # Prisma configuration
```

## Environment Variables

Copy `.env.example` to `.env` and update as needed:

| Variable       | Description                  | Default                                                                       |
| -------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/loan_management?schema=public` |
