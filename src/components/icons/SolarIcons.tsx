import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  ClipboardList,
  UserPlus,
  BarChart3,
  FolderOpen,
  Settings2,
  Bell,
  HelpCircle,
  Calendar,
  Menu,
  X,
  Search,
  Plus,
  Filter,
  ChevronDown,
  Eye,
  EyeOff,
  Info,
  LogOut,
  Home,
  FilePlus,
  Briefcase,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

// Solar-style thick outlined icons
// We emulate Solar BoldDuotone/Outline thick stroke with lucide + heavier strokeWidth

export const solarIconProps: LucideProps = {
  strokeWidth: 1.85,
  size: 22,
};

export const SolarIcons = {
  Dashboard: (p: LucideProps) => <LayoutDashboard {...solarIconProps} {...p} />,
  Home: (p: LucideProps) => <Home {...solarIconProps} {...p} />,
  Customers: (p: LucideProps) => <Users {...solarIconProps} {...p} />,
  Quotes: (p: LucideProps) => <FileText {...solarIconProps} {...p} />,
  Policies: (p: LucideProps) => <ShieldCheck {...solarIconProps} {...p} />,
  Claims: (p: LucideProps) => <ClipboardList {...solarIconProps} {...p} />,
  Leads: (p: LucideProps) => <UserPlus {...solarIconProps} {...p} />,
  Analytics: (p: LucideProps) => <BarChart3 {...solarIconProps} {...p} />,
  Documents: (p: LucideProps) => <FolderOpen {...solarIconProps} {...p} />,
  Calendar: (p: LucideProps) => <Calendar {...solarIconProps} {...p} />,
  Settings: (p: LucideProps) => <Settings2 {...solarIconProps} {...p} />,
  Briefcase: (p: LucideProps) => <Briefcase {...solarIconProps} {...p} />,
  Bell: (p: LucideProps) => <Bell {...solarIconProps} {...p} />,
  Help: (p: LucideProps) => <HelpCircle {...solarIconProps} {...p} />,
  Search: (p: LucideProps) => <Search {...solarIconProps} strokeWidth={1.9} {...p} />,
  Menu: (p: LucideProps) => <Menu {...solarIconProps} {...p} />,
  Close: (p: LucideProps) => <X {...solarIconProps} {...p} />,
  Plus: (p: LucideProps) => <Plus {...solarIconProps} {...p} />,
  Filter: (p: LucideProps) => <Filter {...solarIconProps} {...p} />,
  NewQuote: (p: LucideProps) => <FilePlus {...solarIconProps} {...p} />,
};

export const featureMeta = [
  { id: "dashboard", label: "Dashboard", desc: "Overview & KPIs", icon: SolarIcons.Dashboard },
  { id: "customers", label: "Customers", desc: "Search & manage", icon: SolarIcons.Customers },
  { id: "quotes", label: "Quotes", desc: "Drafts & sent", icon: SolarIcons.Quotes },
  { id: "policies", label: "Policies", desc: "Active covers", icon: SolarIcons.Policies },
  { id: "claims", label: "Claims", desc: "New & tracking", icon: SolarIcons.Claims },
  { id: "leads", label: "Leads", desc: "Pipeline", icon: SolarIcons.Leads },
  { id: "analytics", label: "Analytics", desc: "Commission & reports", icon: SolarIcons.Analytics },
  { id: "documents", label: "Documents", desc: "Files & vault", icon: SolarIcons.Documents },
  { id: "calendar", label: "Calendar", desc: "Tasks & follow-ups", icon: SolarIcons.Calendar },
  { id: "settings", label: "Settings", desc: "Agent & prefs", icon: SolarIcons.Settings },
];
