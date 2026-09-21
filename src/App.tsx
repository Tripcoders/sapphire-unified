import { useEffect, useState, useTransition, useCallback, useMemo } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SapphireAuthView as AccessAccount } from "@/components/auth/SapphireAuthView";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { DetailModal, NewQuoteModal, SettingsModal } from "@/components/dashboard/Modals";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { featureMeta } from "@/components/icons/SolarIcons";
import type { PolicyRecord } from "@/lib/schema";
import { motion, AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Pages
import { DashboardPage } from "@/components/pages/DashboardPage";
import { CustomersPage } from "@/components/pages/CustomersPage";
import { QuotesPage } from "@/components/pages/QuotesPage";
import { PoliciesPage } from "@/components/pages/PoliciesPage";
import { ClaimsPage } from "@/components/pages/ClaimsPage";
import { LeadsPage } from "@/components/pages/LeadsPage";
import { AnalyticsPage } from "@/components/pages/AnalyticsPage";
import { DocumentsPage } from "@/components/pages/DocumentsPage";
import { CalendarPage } from "@/components/pages/CalendarPage";
import { SettingsPage } from "@/components/pages/SettingsPage";

const qc = new QueryClient();

function Shell() {
  const { isAuthenticated } = useAuth();
  const [booting, setBooting] = useState(true);
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PolicyRecord | null>(null);
  const [showNewQuote, setShowNewQuote] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleNavigate = useCallback((id: string) => {
    // Non-blocking navigation: UI (button active state, hover) paints immediately
    // Heavy page mount (table, charts) is marked as transition so handler doesn't block for 223ms
    startTransition(() => setActive(id));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1100);
    return () => clearTimeout(t);
  }, []);

  if (booting) return <LoadingScreen />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-white overflow-auto">
        <AccessAccount />
      </div>
    );
  }

  const title = useMemo(() => active === "dashboard" ? "Insurance Policies" : (featureMeta.find((f) => f.id === active)?.label ?? "Insurance Policies"), [active]);

  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return <DashboardPage search={search} onSearch={setSearch} onSelect={setSelected} />;
      case "customers":
        return <CustomersPage globalSearch={search} />;
      case "quotes":
        return <QuotesPage globalSearch={search} onSelect={setSelected} />;
      case "policies":
        return <PoliciesPage globalSearch={search} onSelect={setSelected} />;
      case "claims":
        return <ClaimsPage />;
      case "leads":
        return <LeadsPage globalSearch={search} onSelect={setSelected} />;
      case "analytics":
        return <AnalyticsPage />;
      case "documents":
        return <DocumentsPage globalSearch={search} />;
      case "calendar":
        return <CalendarPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <div className="sapphire-card p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900 capitalize">{title}</h2>
            <p className="text-sm text-slate-500 mt-2">View and manage {title.toLowerCase()} records.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar
        active={active}
        onChange={handleNavigate}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          onMenu={() => {
            if (typeof window !== "undefined" && window.innerWidth >= 1024) setCollapsed((v) => !v);
            else setMobileOpen((v) => !v);
          }}
          onNewQuote={() => setShowNewQuote(true)}
          onNewClaim={() => setShowNewQuote(true)}
          title={title}
          onSearch={setSearch}
        />

        <main className="flex-1 p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[1440px] mx-auto space-y-6"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-6 py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
          Sapphire v2.0 • Internal Product of The Standard Bank Stanlib Group • Agent {useAuth().user?.cNumber} • {useAuth().user?.branch}
        </footer>
      </div>

      <DetailModal record={selected} open={!!selected} onClose={() => setSelected(null)} />
      <NewQuoteModal open={showNewQuote} onClose={() => setShowNewQuote(false)} />
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </QueryClientProvider>
  );
}
