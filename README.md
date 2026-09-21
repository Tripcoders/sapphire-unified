# Sapphire Unified — Standard Bank Internal Insurance Platform

Merged `Sapphire Login Screen` + `Sapphire insurance policies` into **one Vite + React + TanStack Query** codebase per first instruction.

## Quick Start
```bash
cd "Sapphire Unified"
yarn install
yarn dev      # http://localhost:5173
yarn build    # production build ✓ 443kb gz 135kb
```

## Auth (Internal Tool)
- **C-Number** `C + 7 digits` (e.g. `C1234567`) or `*@standardbank.co.za` + password → `src/lib/auth.ts:18`
- Test accounts (tap chip to fill `src/components/auth/AuthPage.tsx:254`):
  - `C1234567` / `Sapphire123` — Tal Hassal — Senior Consultant — JHB Central
  - `C7654321` / `Test1234` — Noluthando Dlamini — CPT Waterfront
  - `C8472910` / `Sapphire2024` — James Mitchell — DBN North
  - `C0000001` / `Admin123!` — Admin — Head Office
- Session stored `localStorage:sapphire_user` via `AuthContext.tsx:7`, agent `cNumber` shown in sidebar, topbar, footer, settings.

## Database Schema `src/lib/schema.ts:8` / `src/lib/db.ts:10`
**Tables:** `agents` (UNIQUE cNumber/email), `customers` (UNIQUE idNumber), `products` (VEH_COMPREHENSIVE etc.), `policies` (STI Policy|Quote|Lead, UNIQUE number POL/QT/LD), `claims`, `commissions`, `activities`, `documents`.
Seed: 60 customers + 64 policies persisted `localStorage`, linked via `agentId/customerId/productCode`, premiums `R 450–3,950`, channels Branch/Digital/Call Centre/Broker. See `ARCHITECTURE.md` for ER, indexes, relations.

## Design System `DESIGN.md` / `src/index.css:48`
- **Radius 24px** `--radius:1.5rem`, **soft shadow** `0 2px 8px + 0 8px 24px + 0 1px 3px` (`.sapphire-card`), border `rgba(226,232,240,.8)`
- **Typography:** `Plus Jakarta Sans` headings (−0.02em) + `Inter` body, `-webkit-font-smoothing: antialiased`
- **Colors:** `primary #2563eb`, `background #f8fafc`, `card #fff`, `border #e2e8f0`
- **Motion:** `cubic-bezier(0.22,1,0.36,1)`, 220–350ms, `scale .96→1 + y 12` for modals/dropdowns

### Component Library `src/components/ui/`
`Button` (primary/secondary/ghost), `Input` (52px, 16px radius, hover/focus ring), `Card`/`CardHeader`, `Badge` (Policy/Quote/Lead), `Modal` (24px, backdrop blur, `AnimatePresence`), `Dropdown` (24px), `Select`, `Skeleton` — all built on tokens.

### Icons — Solar Thick Outlined `src/components/icons/SolarIcons.tsx:12`
`strokeWidth 1.85, size 22`, pill 9px bg. Mapping `featureMeta`:
- Dashboard/Home, Customers/Users, Quotes/Document, Policies/ShieldCheck, Claims/ClipboardList, Leads/UserPlus, Analytics/BarChart3, Documents/FolderOpen, Calendar, Settings/Settings2
- Sidebar `src/components/layout/Sidebar.tsx:18` — 280/80 collapse with tooltip, drawer `x -280` + overlay blur. Topbar drawer icon `src/components/layout/Topbar.tsx:25` toggles collapse on desktop, drawer on mobile.

## Dashboard `src/App.tsx:18`
- **Shell:** `QueryClientProvider` + `AuthProvider` + `Sidebar` + `Topbar` (70px sticky) + `max-w-[1440px] p-6 grid gap-6`
- **StatsCards.tsx:7** — TanStack `["policies-stats"]` + skeleton, 4 KPIs (Total, Quotes, Leads, Commission YTD) derived from policies.
- **QuickSearch.tsx:8** — 48px input `hover:border`/`focus:ring`, filter chips (ID/Lead/Quote/Policy)
- **RecentActivity.tsx:22** — TanStack `["policies"]` 750ms delay + 6 skeleton rows `src/components/ui/skeleton.tsx:1`, tabs All/Quotes/Policies/Leads with counts, 8/page pagination, `Filter` dropdown (24px, Channel/Status), `ArrowUpDown` sort, `AnimatePresence` row `y 6` animation, mobile stacked + desktop 7-col grid, actions `MoreHorizontal`.
- **Modals.tsx:6** — Detail (customer, opened, channel, premium), New Quote (Product/ID/Channel), Settings — all `sapphire-card` + `scale .96` motion.

## Verification
- `yarn build` passes (TS + Vite), no mockData legacy imports, all interactions animated, agent number flows through entire app.
