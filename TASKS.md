# Implementation Tasks

## Phase 1: Project Scaffolding and Tooling
- [ ] Initialize Next.js 15 project with TypeScript, Tailwind, ESLint, App Router, src dir
- [ ] Configure Prettier (120 char, single quotes, trailing commas, 2-space indent)
- [ ] Configure ESLint (next/core-web-vitals, next/typescript, prettier, no-unused-vars)
- [ ] Add format scripts to package.json
- [ ] Create docker-compose.yml for PostgreSQL 16
- [ ] Create .env and .env.example with DATABASE_URL
- [ ] Install Prisma and create schema with Loan model and enums
- [ ] Create Prisma client singleton (src/lib/db.ts)
- [ ] Run database migration
- [ ] Update CLAUDE.md commands to yarn

## Phase 2: shadcn/ui and Shared Infrastructure
- [ ] Initialize shadcn/ui
- [ ] Add required shadcn components (button, card, table, input, select, badge, dialog, sonner, skeleton, separator, dropdown-menu, label)
- [ ] Install react-hook-form, @hookform/resolvers, zod
- [ ] Create TypeScript types (src/lib/types/index.ts)
- [ ] Create Zod validation schema (src/lib/schemas/loan.ts)
- [ ] Add utility functions (formatCurrency, formatDate, calculateMonthlyPayment, generateLoanNumber)

## Phase 3: Data Layer
- [ ] Create data access functions (src/lib/data/loans.ts) — getDashboardStats, getLoans, getLoan
- [ ] Create server actions (src/lib/actions/loan.ts) — createLoan, updateLoan, deleteLoan
- [ ] Create seed script (prisma/seed.ts) and seed database

## Phase 4: Layout, Dashboard, and Error Pages
- [ ] Create root layout with font, Toaster, nav (src/app/layout.tsx)
- [ ] Create Header component (src/app/components/Header.tsx)
- [ ] Create StatCard component (src/app/components/StatCard.tsx)
- [ ] Create LoanStatusBadge component (src/app/components/LoanStatusBadge.tsx)
- [ ] Create dashboard page (src/app/page.tsx)
- [ ] Create dashboard loading skeleton (src/app/loading.tsx)
- [ ] Create global 404 page (src/app/not-found.tsx)
- [ ] Create global error boundary (src/app/global-error.tsx)

## Phase 5: Loan List Page
- [ ] Create loan list page (src/app/loans/page.tsx)
- [ ] Create LoanDataTable component (src/app/components/LoanDataTable.tsx)
- [ ] Create LoanFilters component (src/app/components/LoanFilters.tsx)
- [ ] Create useDebounce hook (src/app/hooks/useDebounce.ts)

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
