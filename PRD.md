# Loan Management Application - Product Requirements Document

## Overview

A full-stack Next.js application that enables lenders to create, view, and manage loans. The MVP focuses on core CRUD operations with a polished, accessible UI.

## Tech Stack

- **Language:** TypeScript (strict mode)
- **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui
- **Backend:** Next.js Server Actions
- **Database:** PostgreSQL with Prisma ORM
- **Linting/Formatting:** ESLint, Prettier
- **Validation:** Zod (shared schemas for client and server)

## Data Model

### Loan

| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Primary key |
| loanNumber | String (auto) | Human-readable identifier (e.g., LN-00001), auto-generated |
| purpose | Enum | PERSONAL, MORTGAGE, AUTO, BUSINESS, OTHER |
| borrowerName | String | Full name of borrower |
| borrowerEmail | String | Contact email |
| amount | Decimal | Loan principal amount |
| interestRate | Decimal | Annual interest rate (%) |
| term | Int | Loan duration in months |
| status | Enum | PENDING, ACTIVE, PAID, DEFAULTED |
| startDate | DateTime | Loan start date |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Record update timestamp |

## Pages & Routes

### 1. Dashboard (`/`)

- Displays summary metrics derived from existing loan data:
  - Total number of loans
  - Total portfolio value (sum of all loan amounts)
  - Loans by status (count per status, displayed as stat cards)
- Recent loans table (last 5 created, each linking to its detail page)
- Quick navigation link to `/loans` for full list
- "Create Loan" shortcut button

### 2. Loan List Page (`/loans`)

- Displays all loans in a table (shadcn `DataTable`)
- Columns: Loan Number, Borrower Name, Purpose, Amount, Interest Rate, Term, Status, Start Date
- Sortable columns, search/filter by borrower name and status
- "Create Loan" button navigates to `/loans/new`
- Clicking a row navigates to `/loans/[id]`
- Empty state when no loans exist

### 3. Loan Detail Page (`/loans/[id]`)

- Shows all loan fields in a structured layout
- Displays computed values: monthly payment, total repayment
- Actions: Edit (navigates to `/loans/[id]/edit`), Delete (with confirmation dialog)
- Back navigation to list

### 4. Create Loan Page (`/loans/new`)

- Form with validated fields for all editable loan fields
- Client-side validation (required fields, min/max values, email format)
- Server-side validation via Server Action
- Success: redirect to loan detail page
- Error: display inline error messages

### 5. Edit Loan Page (`/loans/[id]/edit`)

- Same form as create, pre-populated with existing data
- Same validation rules
- Success: redirect to loan detail page

## Server Actions (Mutations)

Server actions use the `"use server"` directive and handle data mutations. They are called from client components via form submissions or event handlers.

| Action | Description |
|--------|-------------|
| `createLoan(data)` | Validates input with Zod, inserts a new loan, redirects to detail page |
| `updateLoan(id, data)` | Validates input with Zod, updates an existing loan, redirects to detail page |
| `deleteLoan(id)` | Deletes a loan by ID, redirects to list page |

## Data Access Functions (Queries)

Plain async functions in `lib/data/` — not server actions. Called directly from Server Components at render time. No `"use server"` directive needed since Server Components run on the server by default.

| Function | Called From | Description |
|----------|-------------|-------------|
| `getDashboardStats()` | Dashboard (`page.tsx`) | Returns total count, portfolio value, counts by status, recent loans |
| `getLoans(filters?)` | Loan List page (`page.tsx`) | Returns filtered/sorted loan list |
| `getLoan(id)` | Loan Detail page (`page.tsx`) | Returns a single loan or null |

## Validation Rules

- **loanNumber**: Auto-generated, not user-editable
- **purpose**: Required, must be valid enum value
- **borrowerName**: Required, 2-100 characters
- **borrowerEmail**: Required, valid email format
- **amount**: Required, > 0, max 10,000,000
- **interestRate**: Required, 0.01-100
- **term**: Required, 1-360 months
- **startDate**: Required, valid date
- **status**: Required, must be valid enum value

## UI/UX Requirements

- Responsive: mobile-first, works on 320px+ screens
- Accessible: semantic HTML, ARIA labels, keyboard navigation, focus management
- Loading states: skeleton loaders on data fetch
- Toast notifications on create/update/delete success
- Confirmation dialog before delete
- Subtle animations: page transitions, form feedback

## Error Handling

- Form validation errors displayed inline below fields
- Server errors displayed via toast notification
- 404 page for invalid loan IDs
- Graceful database connection error handling

## Code Standards

### TypeScript

- Strict mode enabled (`strict: true` in tsconfig)
- No `any` types — use proper typing or `unknown` with narrowing
- Explicit return types on exported functions and server actions
- Use interfaces for object shapes, type aliases for unions/utilities

### ESLint

- Extend `next/core-web-vitals` and `next/typescript`
- Enable `@typescript-eslint/recommended` rules
- Enforce `react-hooks/rules-of-hooks` and `react-hooks/exhaustive-deps`
- Disallow unused variables (`@typescript-eslint/no-unused-vars: error`)
- Enforce consistent imports (sort order, no duplicates)

### Prettier

- Printwidth: 120, single quotes, trailing commas, 2-space indent
- Run via ESLint integration (`eslint-config-prettier`)

### React / Next.js Best Practices

- **Server vs Client Components:** Default to Server Components; only add `"use client"` when the component needs interactivity (event handlers, hooks, browser APIs)
- **Server Actions:** Colocate in `actions/` directory with `"use server"` directive; validate all inputs with Zod before database operations
- **Component structure:** One component per file, named exports, file name matches component name
- **Custom hooks:** Extract reusable stateful logic into `hooks/` directory with `use` prefix
- **Forms:** Use `useActionState` for server action form state; use controlled components with React Hook Form for complex client validation
- **Error boundaries:** Implement `error.tsx` at route segment level
- **Loading UI:** Implement `loading.tsx` at route segment level with skeleton components
- **Metadata:** Use Next.js `generateMetadata` for page titles/descriptions
- **Images:** Use `next/image` for any images; use `next/font` for fonts

### Project Structure

`app/` contains routing, pages, and UI. `lib/` contains shared utilities and server-side logic. Both live under `src/`.

```
src/
  app/                        # Routing, pages, UI
    layout.tsx                # Root layout (html, body, providers, fonts)
    page.tsx                  # Dashboard page (/)
    not-found.tsx             # Global 404 page
    global-error.tsx          # Global error boundary
    loans/
      page.tsx                # Loan list page (/loans)
      new/
        page.tsx              # Create loan page
      [id]/
        page.tsx              # Loan detail page
        loading.tsx           # Detail page skeleton
        not-found.tsx         # Invalid loan ID 404
        error.tsx             # Detail page error boundary
        edit/
          page.tsx            # Edit loan page
    components/               # Shared UI components
      ui/                     # shadcn/ui primitives
    hooks/                    # Custom React hooks (useXxx)
  lib/                        # Shared utilities and server-side logic
    actions/                  # Server actions (mutations, "use server")
    data/                     # Data access functions (queries)
    schemas/                  # Zod validation schemas
    types/                    # TypeScript type definitions
    db.ts                     # Prisma client singleton
prisma/
  schema.prisma               # Prisma schema
```

## Documentation

### README.md

- Project overview and purpose
- Tech stack summary
- Prerequisites (Node.js, PostgreSQL)
- Setup instructions (clone, install, env config, database setup, prisma migrate, dev server)
- Available scripts (`dev`, `build`, `lint`, `format`)
- Project structure overview

## Nice to Have

- **Unit tests:** Jest for server-side logic (actions, data access, validation schemas, utility functions)
- **Integration tests:** React Testing Library for component rendering, form submissions, and page-level behavior
- **Test structure:** Mirror `src/` layout in a `__tests__/` directory or colocate with `.test.ts(x)` suffix

## MVP Scope Exclusions

- Authentication / authorization
- Pagination (acceptable for MVP with small dataset)
- Payment tracking / amortization schedules
- File attachments
- Audit logging
- Multi-currency support
