# LedgerBloom

A responsive personal finance dashboard built as an assignment submission using Next.js, Bun, Zustand, shadcn/ui, Recharts, and Tailwind CSS.

The application focuses on three main workflows:

- viewing financial health through a dashboard overview
- managing transactions with filtering, search, sorting, and CRUD actions
- exploring monthly insights and spending patterns

This project uses mock transaction data and persists user interactions locally so the UI behaves like a small real-world product.

## Assignment Summary

This dashboard was built to demonstrate:

- clean frontend architecture with reusable components
- interactive data visualization
- role-based UI behavior
- local state management with persistence
- responsive design for desktop and mobile
- polished light and dark theme support

## Tech Stack

- `Bun`
  Fast package manager and runtime used for local development.
- `Next.js 16` with App Router
  Used for routing, layouts, page organization, and the overall application structure.
- `React 19`
  Used to build interactive client components.
- `Tailwind CSS v4`
  Used for styling, spacing, responsiveness, and theme-driven UI composition.
- `shadcn/ui` with Base UI primitives
  Used for accessible reusable components such as dialog, select, table, sidebar, and dropdown menu.
- `Recharts`
  Used for the dashboard and insights charts.
- `Zustand`
  Used for application state, filters, role management, and persisted transactions.
- `date-fns`
  Used for date formatting, month calculations, and time-based analytics.
- `Papa Parse`
  Used for CSV export.
- `lucide-react`
  Used for icons throughout the UI.

## Features

### 1. Dashboard Overview

- 4 summary cards:
  - Total Balance
  - Monthly Income
  - Monthly Expenses
  - Savings Rate
- Balance Trend chart for the last 6 months
- Spending Breakdown chart by category
- Animated summary cards on load
- Responsive card and chart layout for desktop and mobile

### 2. Transactions Section

- dedicated search bar above the ledger
- filter controls for:
  - date range
  - category
  - transaction type
  - sort order
- search works across:
  - description
  - category
  - type
  - tags
  - amount
  - date text
- table view for desktop
- card-based list view for mobile
- empty state when filters return no results
- CSV export support

### 3. Role-Based UI

Two roles are supported:

- `viewer`
  Read-only mode
- `admin`
  Full CRUD mode

Role switching is available from the header and is stored in Zustand with persistence.

Admin-only actions:

- add transaction
- edit transaction
- delete transaction

### 4. Insights Section

- highest spending category this month
- month-over-month expense comparison
- top 3 expense categories chart
- biggest single transaction this month
- savings rate trend across recent months

### 5. Persistence

Transactions and selected role are persisted to `localStorage` using Zustand `persist` middleware.

This means:

- transactions stay after refresh
- selected role stays after refresh
- mock data is only used as the initial seed

## Currency and Locale

The project uses Indian Rupee formatting throughout the app.

- currency: `INR`
- compact values: formatted with `en-IN`
- percentage and monthly summaries are derived from the mock transaction dataset

## Responsive Design

The dashboard was adjusted to work across screen sizes instead of only shrinking the desktop layout.

Key responsive decisions:

- mobile sidebar support
- stacked header layout on smaller screens
- dedicated mobile transaction cards
- chart heights reduced on smaller devices
- search separated from filters for better small-screen usability
- filter panel kept simpler on mobile to prevent broken layouts

## Theme Support

The app supports both light and dark themes using `next-themes`.

Theme behavior includes:

- synchronized semantic color tokens
- custom light theme with white sidebar
- refined dark theme with better contrast
- hydration-safe theme toggle rendering

## Project Structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── transactions/
│   │   └── page.tsx
│   └── insights/
│       └── page.tsx
├── components/
│   ├── dashboard/
│   ├── insights/
│   ├── layout/
│   ├── providers/
│   ├── transactions/
│   └── ui/
├── data/
│   └── mockData.ts
├── hooks/
│   └── useRole.ts
├── lib/
│   ├── exportUtils.ts
│   └── utils.ts
├── store/
│   └── useFinanceStore.ts
└── types/
    ├── index.ts
    └── papaparse.d.ts
```

## State Management Design

The central store is implemented in [src/store/useFinanceStore.ts](/F:/finance-dashboard/src/store/useFinanceStore.ts).

Store responsibilities:

- transaction list
- current user role
- active filters
- CRUD actions
- reset behavior
- derived helper functions for analytics

Core state shape:

```ts
{
  transactions: Transaction[]
  role: "admin" | "viewer"
  filters: {
    search: string
    category: Category | "all"
    type: "income" | "expense" | "all"
    dateRange: { from: string; to: string }
    sort: { field: "date" | "amount"; direction: "asc" | "desc" }
  }
}
```

## Data Model

Each transaction follows this structure:

```ts
type Transaction = {
  id: string
  date: string
  description: string
  amount: number
  category: Category
  type: "income" | "expense"
  tags?: string[]
}
```

The dataset in [src/data/mockData.ts](/F:/finance-dashboard/src/data/mockData.ts) contains 50+ mock transactions across multiple months and categories, including:

- Food
- Housing
- Transport
- Health
- Entertainment
- Salary
- Freelance

## UI/UX Decisions

This project intentionally avoids a plain starter-dashboard feel.

Key design choices:

- white sidebar in light mode for better visual separation
- softer panel surfaces instead of default flat cards everywhere
- semantic status colors instead of arbitrary hardcoded color use
- responsive mobile-first adjustments for transactions and header layout
- search moved above the ledger for better usability
- polished spacing and calmer surface hierarchy

## Bugs and Stability Fixes Addressed

During implementation, the following issues were identified and fixed:

- hydration mismatch from theme/date-dependent header rendering
- infinite update loop caused by derived Zustand subscription output
- dark/light theme inconsistency in shell styling
- sidebar light mode contrast glitch
- search matching too narrowly
- persisted role compatibility after role model changes
- mobile layout breakpoints causing cramped filter UI

## Getting Started

### Prerequisites

- Bun installed locally

Recommended:

- Bun `1.3+`

### Install

```bash
bun install
```

### Run Development Server

```bash
bun run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

### Other Commands

```bash
bun run lint
bunx tsc --noEmit
bun run build
```

Note:

- In this environment, `lint` and TypeScript verification passed successfully.
- Production builds may depend on local machine permissions and Next.js build behavior in the current OS environment.

## Submission Notes

This project demonstrates:

- feature completeness based on the assignment brief
- strong component separation
- reusable UI architecture
- meaningful responsive behavior
- persistent client-side state
- clear visual polish beyond a default scaffold

If reviewing this submission, the best pages to inspect are:

- `/` for overview metrics and charts
- `/transactions` for search, filters, sorting, mobile layout, and CRUD
- `/insights` for derived analytics and chart usage

## Author Notes

The project was built to balance implementation quality, usability, and assignment clarity.

The goal was not only to make the features work, but to present them in a structure that is easy to evaluate, easy to extend, and realistic as a small production-style frontend project.
