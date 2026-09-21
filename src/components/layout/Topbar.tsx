import { SolarIcons } from "@/components/icons/SolarIcons";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Bell, LogOut, Settings as SettingsIcon, User } from "lucide-react";

export function Topbar({
  onMenu,
  onNewQuote,
  onNewClaim,
  title,
  onSearch,
}: {
  onMenu: () => void;
  onNewQuote: () => void;
  onNewClaim: () => void;
  title: string;
  onSearch: (q: string) => void;
}) {
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header className="h-[70px] bg-white border-b border-[#F1F5F9] sticky top-0 z-30 flex items-center gap-4 px-4 lg:px-6">
      <button onClick={onMenu} className="lg:hidden h-9 w-9 rounded-[16px] bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
        <SolarIcons.Menu size={18} />
      </button>

      <div className="hidden lg:flex items-center gap-3">
        <button onClick={onMenu} className="h-9 w-9 rounded-[16px] bg-slate-50 border border-slate-200 hidden lg:flex items-center justify-center text-slate-600 hover:bg-slate-100">
          <SolarIcons.Menu size={18} />
        </button>
        <h1 className="text-[18px] font-bold tracking-tight text-slate-900">{title}</h1>
      </div>

      <div className="flex-1 flex justify-center max-w-[560px] mx-auto hidden md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="Search for customers, quotes, or policies..."
            className="w-full h-10 rounded-[16px] bg-slate-50 border-2 border-[#F1F5F9] pl-10 pr-4 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-[#2563eb] focus:ring-0 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button onClick={onNewClaim} className="hidden sm:flex h-9 px-4 rounded-[16px] border border-[#2563eb] text-[#2563eb] text-sm font-semibold items-center gap-2 hover:bg-blue-50 transition-colors">
          <Plus className="h-4 w-4" /> New Claim
        </button>
        <button onClick={onNewQuote} className="h-9 px-4 rounded-[16px] bg-[#2563eb] text-white text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> <span className="hidden sm:inline">New Quote</span><span className="sm:hidden">Quote</span>
        </button>

        <div className="relative">
          <button onClick={() => setShowNotif(!showNotif)} className="h-9 w-9 rounded-[16px] bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 relative">
            <SolarIcons.Bell size={18} />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">3</span>
          </button>
          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                className="absolute right-0 mt-2 w-80 sapphire-card p-2 z-50 overflow-hidden"
              >
                <div className="px-3 py-2 border-b border-[#F1F5F9]">
                  <p className="text-sm font-bold text-slate-900">Notifications</p>
                  <p className="text-xs text-slate-500">3 unread</p>
                </div>
                <div className="py-2 space-y-1">
                  {[
                    { t: "Quote QT-200045 approved", d: "Thabo Mbeki â€¢ 2 min ago", c: "bg-emerald-500" },
                    { t: "New lead assigned to you", d: "Nomsa Nkosi â€¢ 1 hour ago", c: "bg-blue-500" },
                    { t: "Policy renewal due", d: "POL-100112 â€¢ Tomorrow", c: "bg-amber-500" },
                  ].map((n) => (
                    <div key={n.t} className="flex gap-3 px-3 py-2.5 rounded-[16px] hover:bg-slate-50">
                      <span className={`h-2 w-2 rounded-full mt-2 shrink-0 ${n.c}`} />
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{n.t}</p>
                        <p className="text-xs text-slate-500">{n.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="h-9 w-9 rounded-[16px] bg-white border border-slate-200 hidden sm:flex items-center justify-center text-slate-700 hover:bg-slate-50">
          <SolarIcons.Help size={18} />
        </button>

        <div ref={profileRef} className="relative">
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 transition-colors">
            <div className="h-8 w-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-xs font-bold">{user?.avatar}</div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">{user?.name}</p>
              <p className="text-[11px] text-slate-500 font-mono">{user?.cNumber}</p>
            </div>
            <SolarIcons.Close size={14} className={`hidden lg:block text-slate-400 transition-transform ${showProfile ? "rotate-180" : "rotate-90"}`} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                className="absolute right-0 mt-2 w-72 sapphire-card p-2 z-50"
              >
                <div className="rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-[16px] bg-white/20 flex items-center justify-center font-bold">{user?.avatar}</div>
                    <div>
                      <p className="text-sm font-bold">{user?.name}</p>
                      <p className="text-xs text-white/80 font-mono">{user?.cNumber}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-white/90">
                    <p className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> {user?.role}</p>
                    <p className="flex items-center gap-2"><SettingsIcon className="h-3.5 w-3.5" /> {user?.branch}</p>
                    <p className="text-white/70">{user?.email}</p>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-[16px] hover:bg-slate-50 text-sm font-medium text-slate-700">
                    <SettingsIcon className="h-4 w-4" /> Settings & preferences
                  </button>
                  <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-[16px] hover:bg-red-50 text-sm font-medium text-red-600">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}






