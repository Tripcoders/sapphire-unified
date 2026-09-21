import { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SolarIcons, featureMeta } from "@/components/icons/SolarIcons";
import { useAuth } from "@/context/AuthContext";
import { LogOut, ChevronLeft } from "lucide-react";

// Memoized nav item — isolates re-render to only the active item, no hovered state
const SidebarNavItem = memo(function SidebarNavItem({
  id,
  label,
  desc,
  Icon,
  isActive,
  collapsed,
  isMobile,
  onNavigate,
}: {
  id: string;
  label: string;
  desc: string;
  Icon: React.ComponentType<any>;
  isActive: boolean;
  collapsed: boolean;
  isMobile: boolean;
  onNavigate: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(id)}
      aria-current={isActive ? "page" : undefined}
      className={`w-full flex items-center gap-3 rounded-2xl px-3 py-3 text-left group relative transition-colors duration-200 ease-out will-change-auto ${
        isActive ? "bg-[#2563eb] text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      } ${collapsed && !isMobile ? "justify-center px-2" : ""}`}
    >
      <span
        className={`h-9 w-9 rounded-[16px] flex items-center justify-center shrink-0 transition-colors duration-200 ${
          isActive ? "bg-white/20 text-white" : "bg-slate-50 group-hover:bg-white border border-slate-100"
        }`}
      >
        <Icon size={18} className={isActive ? "text-white" : "text-slate-600"} />
      </span>
      {(!collapsed || isMobile) && (
        <div className="min-w-0 flex-1">
          <p className={`text-[13.5px] font-semibold leading-none ${isActive ? "text-white" : "text-slate-800"}`}>{label}</p>
          <p className={`text-[11px] font-medium truncate ${isActive ? "text-white/70" : "text-slate-500"}`}>{desc}</p>
        </div>
      )}
      {isActive && !collapsed && <span className="h-2 w-2 rounded-full bg-white/90 shrink-0" aria-hidden="true" />}
      {/* CSS-only tooltip — no React state, no re-render on hover */}
      {collapsed && !isMobile && (
        <span
          className="pointer-events-none absolute left-[68px] top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-[16px] opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap shadow-lg"
          role="tooltip"
        >
          {label}
        </span>
      )}
    </button>
  );
});

export function Sidebar({
  active,
  onChange,
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: {
  active: string;
  onChange: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const { user, logout } = useAuth();

  // Stable callback — avoids recreating closure for each nav item
  const handleNavigate = useCallback(
    (id: string) => {
      // Yield to browser paint before heavy state update (prevents 223ms block)
      // App.tsx will wrap setActive in startTransition; here we also handle mobile drawer close
      // Use requestAnimationFrame to let click feedback paint first
      requestAnimationFrame(() => {
        onChange(id);
      });
      // Mobile drawer close is deferred to next frame to avoid double state batch blocking
      // onChange will trigger main content switch; we close drawer on next tick
    },
    [onChange]
  );

  const handleMobileNavigate = useCallback(
    (id: string) => {
      onChange(id);
      // Defer close to avoid blocking click handler — let UI paint active state first
      requestAnimationFrame(() => onMobileClose());
    },
    [onChange, onMobileClose]
  );

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex h-full flex-col bg-white">
      <div
        className={`flex items-center gap-3 px-4 h-[70px] border-b border-slate-100 shrink-0 ${collapsed && !isMobile ? "justify-center px-2" : ""}`}
      >
        {collapsed && !isMobile ? (
          <img src="/assets/icon-sapphire-logo.svg" alt="Sapphire" className="h-7 w-7 object-contain shrink-0" />
        ) : (
          <img src="/assets/Logo-Sapphire-horizontal.svg" alt="Sapphire" className="h-7 w-auto object-contain" />
        )}
        {!isMobile && (
          <button
            type="button"
            onClick={onToggle}
            className={`ml-auto h-8 w-8 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors duration-200 ${collapsed ? "ml-0" : ""}`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        )}
        {isMobile && (
          <button
            type="button"
            onClick={onMobileClose}
            className="ml-auto h-8 w-8 rounded-[16px] bg-slate-100 flex items-center justify-center"
            aria-label="Close navigation"
          >
            <SolarIcons.Close size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" aria-label="Primary">
        {featureMeta.map((f) => (
          <SidebarNavItem
            key={f.id}
            id={f.id}
            label={f.label}
            desc={f.desc}
            Icon={f.icon}
            isActive={active === f.id}
            collapsed={collapsed}
            isMobile={isMobile}
            onNavigate={isMobile ? handleMobileNavigate : handleNavigate}
          />
        ))}
      </nav>

      <div className={`p-3 border-t border-slate-100 ${collapsed && !isMobile ? "px-2" : ""}`}>
        <div
          className={`flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-3 ${collapsed && !isMobile ? "justify-center" : ""}`}
        >
          <div className="h-9 w-9 rounded-[16px] bg-[#2563eb] text-white flex items-center justify-center text-xs font-bold shrink-0">
            {user?.avatar}
          </div>
          {(!collapsed || isMobile) && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[11px] font-mono text-slate-500">{user?.cNumber}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="h-8 w-8 rounded-[16px] bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-200 transition-colors duration-200"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        {(!collapsed || isMobile) && (
          <p className="text-[11px] text-slate-400 text-center mt-2 font-medium">
            {user?.role} • {user?.branch}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col shrink-0 sticky top-0 h-screen border-r border-slate-100 bg-white overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-50 lg:hidden shadow-2xl flex flex-col"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
