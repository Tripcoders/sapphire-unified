# Sapphire — Design System v2.0
`Standard Bank • Stanlib Group` — Internal Insurance Tool for Consultants

> Single source of truth derived from Figma `AccessAccount` + `FinalSapphireWithFinalSidebarWithshadow` and rebuilt as code tokens.

## 1. Philosophy
- **Trustworthy & Airy** — bank-grade credibility with soft, human UI (rounded 24px, gentle shadows, ample whitespace)
- **Consultant-first** — sub-2 clicks to search, quote, or file; agent `C-Number` always visible
- **Motion with purpose** — 220–350ms, `cubic-bezier(0.22,1,0.36,1)` (ease-out-expo) for entrances, scale + opacity for modals

## 2. Tokens
### Color
| Token | Value | Use |
|-------|-------|-----|
| `primary` | `#2563eb` | CTAs, active nav, focus ring |
| `primaryDeep` | `#0033aa` / `#00319c` | Sidebar accent, gradients |
| `background` | `#f8fafc` | App canvas |
| `card` | `#ffffff` | Cards |
| `border` | `#e2e8f0` | Dividers, card border `rgba(226,232,240,.8)` |
| `foreground` | `#0f172a` | Headings |
| `muted` | `#64748b` | Secondary text |
| `success` | `#00c897`/`#10b981` | Policy Active |
| `warning` | `#f59e0b` | Pending |
| `danger` | `#ef4444` | Cancelled |

### Radius & Shadows
- **Radius**: `--radius: 1.5rem` (24px) for cards/modals/dropdowns. Inputs 12–16px, pills 9999.
- **Soft shadow**: `0 2px 8px rgba(15,23,42,.04), 0 8px 24px rgba(15,23,42,.03), 0 1px 3px rgba(15,23,42,.05)` (`.sapphire-card`). Hover lifts to `0 4px 16px + 0 12px 32px`.

### Typography
- **Headings**: `Plus Jakarta Sans` 600–700, `-0.02em` tracking. Fallback `Inter`.
- **Body**: `Inter` 14–15px / 20–24px, `500` labels, `600` values. Mono for `C-Number` / policy numbers (`font-mono`).
- Smoothing: `-webkit-font-smoothing: antialiased`

### Motion
- `fadeInUp`: `opacity 0→1 + y 12px`, 300ms
- `scaleIn`: `scale .96→1`, 300ms for modals/dropdowns
- `shimmer`: skeleton, `drawer`: `x -280 → 0`, `sidebar collapse`: width `280↔80`, `hover` scale `1.01`, `tap` `0.99`

## 3. Components (all 24px, soft shadow, animated)
- **Card** `.sapphire-card` — white, 24px, 1px `slate-100` border. Used for QuickSearch, RecentActivity, Stats, Modals.
- **Button** — Primary `#2563eb` 52px, 16px radius, `shadow-blue-500/20`, hover `#1d4ed8` + scale 1.01. Secondary white/border, ghost slate-50.
- **Input** — 48–52px, 16px radius, `border-slate-100` (2px), hover `slate-200`, focus `ring-4 primary/10`, icon chip 28px rounded-xl.
- **Modal** — centered, max-w 520–560, `sapphire-card`, `AnimatePresence scale .96 + y 12`, backdrop `slate-900/40 blur-sm`
- **Dropdown** — absolute, `sapphire-card p-4`, same motion as modal, 24px, filter chips inside
- **Badge** — pill, `blue-50/emerald-50/amber-50` + border + `h-1.5 dot`
- **Skeleton** — `animate-pulse bg-slate-200 rounded-xl`
- **Sidebar** — 280 collapsed 80, `SolarIcons` 22px stroke 1.85, active `bg-primary text-white shadow`, inactive `hover:bg-slate-50`
- **Topbar** — 70px sticky, `border-slate-200`, search 40px `bg-slate-50 → white` on focus

## 4. Iconography — Solar Thick Outlined
Emulated via `lucide-react` `strokeWidth 1.85`. Mapping (see `src/components/icons/SolarIcons.tsx:18`):
- Dashboard → Home | Customers → UsersGroup | Quotes → Document | Policies → ShieldCheck | Claims → ClipboardList | Leads → UserPlus | Analytics → BarChart3 | Documents → FolderOpen | Calendar → Calendar | Settings → Settings2
- Each 22px, 9px pill bg, `rounded-xl` chip in sidebar

## 5. Layout
- Desktop: Sidebar 280/80 + Topbar 70 + content `max-w-[1440px] p-6` grid `gap-6`
- Mobile: Drawer overlay `slate-900/30 blur-sm`, `x -280`
- Tables: header `bg-slate-50/70 text-[11px] tracking-widest`, rows `hover:bg-slate-50/70`, pagination `bg-slate-50/40`

## 6. Data & States
- TanStack Query keys: `["policies"]`, `["customers"]`, `["claims"]`, `["activities"]` — 750ms mock delay + skeleton 6 rows
- Empty: centered `No results`, pagination shows `Page 1 of N`

## 7. Accessibility
- Focus rings 4px primary/10, keyboard navigable, `aria-hidden` on decorative vectors

## 8. File Map
- Tokens/CSS → `src/index.css`
- Schema → `src/lib/schema.ts`, `src/lib/db.ts`
- Icons → `src/components/icons/SolarIcons.tsx`
- Layout → `src/components/layout/Sidebar.tsx`, `Topbar.tsx`
- Auth → `src/components/auth/AuthPage.tsx`
