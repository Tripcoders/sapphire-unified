# Sapphire Unified — Architecture & Database Mapping

## 1. Overview
Sapphire is Standard Bank's internal insurance consultant tool (v2.0) handling Quotes → Policies → Claims across vehicle, property, life and business products. The unified codebase merges `Sapphire Login Screen` and `Sapphire insurance policies` into a single Vite + React + TanStack Query app with a mocked Postgres layer.

## 2. Folder Structure
```
src/
  design-system/        → DESIGN.md, tokens (index.css)
  lib/
    schema.ts           → DB schema, enums, ER + seed helpers
    db.ts               → mock DB (localStorage) + TanStack fetchers
    auth.ts             → C-Number validation, TEST_ACCOUNTS, Agent mapping
    api.ts              → barrel for query fns
    utils.ts            → cn()
  context/
    AuthContext.tsx     → agent session (localStorage sapphire_user)
  components/
    ui/                 → Button, Input, Card, Badge, Modal, Dropdown, Select, Skeleton (all 24px + soft shadow)
    icons/SolarIcons.tsx→ Solar thick outlined (lucide stroke 1.85) + featureMeta
    layout/             → Sidebar (280/80 + drawer), Topbar (70px sticky)
    auth/AuthPage.tsx   → signin/signup, animated, test accounts
    dashboard/          → StatsCards, QuickSearch, RecentActivity, Modals
    shared/LoadingScreen.tsx
  hooks/use-mobile.ts
  App.tsx               → Shell with QueryClientProvider + AuthProvider + routing by active tab
```

## 3. Database Schema (see `src/lib/schema.ts`)
**Tables:**
- `agents` — PK id, UNIQUE cNumber `C\d{7}`, UNIQUE email, FK branchCode, role enum
- `customers` — PK id, UNIQUE idNumber (13-digit SA ID), FK assignedAgentId
- `products` — PK code, category, basePremium, commissionRate
- `policies` — STI table (type Policy|Quote|Lead), UNIQUE number (POL/QT/LD), FK customerId/agentId/productCode, status, premiumCents, branchCode, dateOpened
- `claims` — PK id, UNIQUE claimNumber, FK policyId/customerId/agentId, status
- `commissions` — PK id, FK agentId/policyId, month YYYY-MM, premiumCents, commissionCents
- `activities` — PK id, type enum, FK agentId/customerId/policyId, createdAt
- `documents` — PK id, FK customerId/policyId, S3 key

**Indexes:** `agents(cNumber,email)`, `customers(idNumber,fullName)`, `policies(number,customerId,agentId,type+status,dateOpened DESC)`.

**Seed:** `seedCustomers(60)` + `seedPolicies(64)` with realistic SA IDs, premiums `R 450–3,950`, channels Branch/Digital/Call Centre/Broker. Persisted in `localStorage` keys `sapphire_mock_*`.

## 4. Auth Flow
- Form: `C1234567` or `*@standardbank.co.za` + password → `validateLogin()` checks `TEST_ACCOUNTS` (mapped from `agents` table).
- On success: `AuthContext.login()` stores `AgentUser` (id, cNumber, name, email, role, branch, avatar, phone) in `localStorage sapphire_user`.
- Agent number displayed everywhere: sidebar footer, topbar profile dropdown (gradient card), settings modal, footer bar `Agent C1234567 • JHB_CENTRAL`.

## 5. Data Fetching
- TanStack Query keys: `["policies"]`, `["policies-stats"]`, `["customers"]`, `["claims"]`, `["activities"]`
- Each fetcher has 400–750ms artificial delay to demo skeleton (`RecentActivity.tsx:26`, `StatsCards.tsx:7`).
- Filtering/search/pagination done client-side with `useMemo` + `searchPolicies()` helper.

## 6. Design System
- Tokens, radius 24px, shadows, typography defined in `DESIGN.md` and `src/index.css`.
- Components consume `.sapphire-card` and `Button/Input` primitives.
- Motion: `framer-motion` with `ease [0.22,1,0.36,1]`, 220–350ms.

## 7. Animations & Interactions
- LoadingScreen: rotate + shimmer
- AuthPage: split-screen slide + form stagger `y 16→0`, input `hover:border + focus:ring-4`, button `scale 1.01/0.99`, test-account chip hover
- Sidebar: width `280→80` spring, tooltip on hover when collapsed, drawer `x -280` with `backdrop-blur`
- Modals/Dropdowns: `scale .96 + y 12` + backdrop `slate-900/40 blur-sm`
- Table: `AnimatePresence` row `y 6` stagger, pagination disabled states, filter dropdown same modal motion
