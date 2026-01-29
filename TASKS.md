# Implementation Tasks

## Phase 1: Project Scaffolding and Tooling ✅

- [x] Initialize Next.js 15 project with TypeScript, Tailwind, ESLint, App Router, src dir
- [x] Configure Prettier (120 char, single quotes, trailing commas, 2-space indent)
- [x] Configure ESLint (next/core-web-vitals, next/typescript, prettier, no-unused-vars)
- [x] Add format scripts to package.json
- [x] Create docker-compose.yml for PostgreSQL 16
- [x] Create .env and .env.example with DATABASE_URL
- [x] Install Prisma and create schema with Loan model and enums
- [x] Create Prisma client singleton (src/lib/db.ts)
- [x] Run database migration
- [x] Update CLAUDE.md commands to yarn

## Phase 2: shadcn/ui and Shared Infrastructure ✅

- [x] Initialize shadcn/ui
- [x] Add required shadcn components (button, card, table, input, select, badge, dialog, sonner, skeleton, separator, dropdown-menu, label)
- [x] Install react-hook-form, @hookform/resolvers, zod
- [x] Create TypeScript types (src/lib/types/index.ts)
- [x] Create Zod validation schema (src/lib/schemas/loan.ts)
- [x] Add utility functions (formatCurrency, formatDate, calculateMonthlyPayment, generateLoanNumber)

## Phase 3: Data Layer ✅

- [x] Create data access functions (src/lib/data/loans.ts) — getDashboardStats, getLoans, getLoan
- [x] Create server actions (src/lib/actions/loan.ts) — createLoan, updateLoan, deleteLoan
- [x] Create seed script (prisma/seed.ts) and seed database (12 loans)

## Phase 4: Layout, Dashboard, and Error Pages ✅

- [x] Create root layout with font, Toaster, nav (src/app/layout.tsx)
- [x] Create Header component (src/app/components/Header.tsx)
- [x] Create StatCard component (src/app/components/StatCard.tsx)
- [x] Create LoanStatusBadge component (src/app/components/LoanStatusBadge.tsx)
- [x] Create dashboard page (src/app/page.tsx)
- [x] Create dashboard loading skeleton (src/app/loading.tsx)
- [x] Create global 404 page (src/app/not-found.tsx)
- [x] Create global error boundary (src/app/global-error.tsx)

## Phase 5: Loan List Page ✅

- [x] Create loan list page (src/app/loans/page.tsx)
- [x] Create LoanDataTable component (src/app/components/LoanDataTable.tsx)
- [x] Create LoanFilters component (src/app/components/LoanFilters.tsx)
- [x] Create useDebounce hook (src/app/hooks/useDebounce.ts)

## Phase 6: Loan Form (Create and Edit)

- [ ] Create LoanForm component (src/app/components/LoanForm.tsx)
- [ ] Create loan creation page (src/app/loans/new/page.tsx)
- [ ] Create loan edit page (src/app/loans/[id]/edit/page.tsx)

## Phase 7: Loan Detail, Polish, and Documentation

- [ ] Create loan detail page (src/app/loans/[id]/page.tsx)
- [ ] Create DeleteLoanDialog component (src/app/components/DeleteLoanDialog.tsx)
- [ ] Create detail page loading/not-found/error files
- [ ] Add hover transitions, focus-visible rings, aria-labels
- [ ] Verify mobile responsiveness at 320px
- [ ] Create README.md with setup instructions
- [ ] Final CLAUDE.md update

## Notes

- **Prisma 7 standard setup:**
  - Generator: `prisma-client` with `output = "../generated/prisma"` (project root, not in `src/`)
  - Config: `prisma.config.ts` at project root with `env('DATABASE_URL')` + `import 'dotenv/config'`
  - Client: requires `@prisma/adapter-pg` + `pg` driver adapter (no `datasourceUrl` on constructor)
  - Imports: `@/generated/prisma/client` (via tsconfig alias `@/generated/*` → `./generated/*`); seed uses relative `../generated/prisma/client`
  - `generated/` is gitignored, prettierignored, and eslint-ignored; regenerated via `postinstall: prisma generate`
- Using Zod 4 (use `error` instead of `required_error` in schema params)
- Using Yarn 4.12.0 via corepack, Node 24 via nvm (.nvmrc)
- `packageManager` field in package.json set to `yarn@4.12.0`
- shadcn/ui components installed to src/app/components/ui/
