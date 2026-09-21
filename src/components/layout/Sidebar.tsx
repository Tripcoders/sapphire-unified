import { motion, AnimatePresence } from "framer-motion";
import { SolarIcons, featureMeta } from "@/components/icons/SolarIcons";
import { useAuth } from "@/context/AuthContext";
import { LogOut, ChevronLeft } from "lucide-react";
import { useState } from "react";

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
  const [hovered, setHovered] = useState<string | null>(null);

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex h-full flex-col bg-white">
      {/* header */}
      <div className={`flex items-center gap-3 px-4 h-[70px] border-b border-slate-100 shrink-0 ${collapsed && !isMobile ? "justify-center px-2" : ""}`}>
        {collapsed && !isMobile ? (
          <img src="/assets/icon-sapphire-logo.svg" alt="Sapphire" className="h-7 w-7 object-contain shrink-0" />
        ) : (
          <img src="/assets/Logo-Sapphire-horizontal.svg" alt="Sapphire" className="h-7 w-auto object-contain" />
        )}
        {!isMobile && (
          <button
            onClick={onToggle}
            className={`ml-auto h-8 w-8 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors ${collapsed ? "ml-0" : ""}`}
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        )}
        {isMobile && (
          <button onClick={onMobileClose} className="ml-auto h-8 w-8 rounded-[16px] bg-slate-100 flex items-center justify-center">
            <SolarIcons.Close size={16} />
          </button>
        )}
      </div>

      {/* nav */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {featureMeta.map((f) => {
          const isActive = active === f.id;
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => { onChange(f.id); if (isMobile) onMobileClose(); }}
              onMouseEnter={() => setHovered(f.id)}
              onMouseLeave={() => setHovered(null)}
              className={`w-full flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all group relative ${
                isActive
                  ? "bg-[#2563eb] text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              } ${collapsed && !isMobile ? "justify-center px-2" : ""}`}
            >
              <span
                className={`h-9 w-9 rounded-[16px] flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-50 group-hover:bg-white border border-slate-100"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-slate-600"} />
              </span>
              {(!collapsed || isMobile) && (
                <div className="min-w-0 flex-1">
                  <p className={`text-[13.5px] font-semibold leading-none ${isActive ? "text-white" : "text-slate-800"}`}>{f.label}</p>
                  <p className={`text-[11px] font-medium truncate ${isActive ? "text-white/70" : "text-slate-500"}`}>{f.desc}</p>
                </div>
              )}
              {isActive && !collapsed && <span className="h-2 w-2 rounded-full bg-white/90 shrink-0" />}
              {/* tooltip when collapsed */}
              {collapsed && !isMobile && hovered === f.id && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-[68px] top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-[16px]"
                >
                  {f.label}
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      {/* user */}
      <div className={`p-3 border-t border-slate-100 ${collapsed && !isMobile ? "px-2" : ""}`}>
        <div className={`flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-3 ${collapsed && !isMobile ? "justify-center" : ""}`}>
          <div className="h-9 w-9 rounded-[16px] bg-[#2563eb] text-white flex items-center justify-center text-xs font-bold shrink-0">
            {user?.avatar}
          </div>
          {(!collapsed || isMobile) && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[11px] font-mono text-slate-500">{user?.cNumber}</p>
              </div>
              <button onClick={logout} className="h-8 w-8 rounded-[16px] bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-200 transition-colors">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        {(!collapsed || isMobile) && <p className="text-[11px] text-slate-400 text-center mt-2 font-medium">{user?.role} â€¢ {user?.branch}</p>}
      </div>
    </div>
  );

  return (
    <>
      {/* desktop */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col shrink-0 sticky top-0 h-screen border-r border-slate-100 bg-white overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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





