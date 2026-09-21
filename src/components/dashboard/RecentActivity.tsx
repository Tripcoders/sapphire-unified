import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPolicies } from "@/lib/db";
import type { PolicyRecord } from "@/lib/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, Plus, MoreHorizontal, ArrowUpDown } from "lucide-react";

type Tab = "All" | "Quotes" | "Policies" | "Leads";

export function RecentActivity({
  search,
  onSelect,
}: {
  search: string;
  onSelect: (r: PolicyRecord) => void;
}) {
  const [tab, setTab] = useState<Tab>("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showFilter, setShowFilter] = useState(false);
  const [channelFilter, setChannelFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const { data, isLoading } = useQuery({ queryKey: ["policies"], queryFn: fetchPolicies });

  const filtered = useMemo(() => {
    if (!data) return [];
    let out = [...data];
    if (tab !== "All") {
      const map: Record<Tab, PolicyRecord["type"]> = { All: "Policy", Quotes: "Quote", Policies: "Policy", Leads: "Lead" };
      out = out.filter((r) => r.type === map[tab]);
    }
    if (channelFilter !== "All") out = out.filter((r) => r.channel === channelFilter);
    if (statusFilter !== "All") out = out.filter((r) => r.status === statusFilter);
    if (search) {
      const s = search.toLowerCase();
      out = out.filter(
        (r) =>
          r.customerName.toLowerCase().includes(s) ||
          r.number.toLowerCase().includes(s) ||
          r.idNumber.includes(s) ||
          r.productName.toLowerCase().includes(s)
      );
    }
    out.sort((a, b) => (sortDir === "desc" ? b.number.localeCompare(a.number) : a.number.localeCompare(b.number)));
    return out;
  }, [data, tab, search, sortDir, channelFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [tab, search, channelFilter, statusFilter]);

  return (
    <div className="sapphire-card overflow-hidden">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 border-b border-[#F1F5F9]">
        <h3 className="text-[15px] font-bold text-slate-900">Recent Activity</h3>
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button onClick={() => setShowFilter(!showFilter)} className={`h-9 px-4 rounded-[16px] border text-sm font-semibold inline-flex items-center gap-2 transition-all ${showFilter || channelFilter !== "All" || statusFilter !== "All" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-[#F1F5F9] text-slate-700 hover:bg-slate-50"}`}>
              <Filter className="h-4 w-4" /> Filter { (channelFilter !== "All" || statusFilter !== "All") && <span className="ml-1 h-2 w-2 rounded-full bg-[#2563eb]" /> }
            </button>
            <AnimatePresence>
              {showFilter && (
                <motion.div initial={{ opacity: 0, y: 6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.98 }} transition={{ duration: 0.22, ease: [0.22,1,0.36,1] }} className="absolute right-0 mt-2 w-72 sapphire-card p-4 z-30">
                  <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-3">Filters</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Channel</label>
                      <select value={channelFilter} onChange={(e)=>{setChannelFilter(e.target.value); setPage(1)}} className="mt-1 w-full h-10 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-3 text-sm font-medium outline-none focus:border-[#2563eb] focus:ring-0">
                        <option value="All">All channels</option>
                        <option value="Branch">Branch</option>
                        <option value="Digital">Digital</option>
                        <option value="Call Centre">Call Centre</option>
                        <option value="Broker">Broker</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Status</label>
                      <select value={statusFilter} onChange={(e)=>{setStatusFilter(e.target.value); setPage(1)}} className="mt-1 w-full h-10 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-3 text-sm font-medium outline-none focus:border-[#2563eb] focus:ring-0">
                        <option value="All">All statuses</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Expired">Expired</option>
                      </select>
                    </div>
                    <button onClick={()=>{setChannelFilter("All"); setStatusFilter("All"); setShowFilter(false)}} className="w-full h-9 rounded-[16px] bg-slate-50 border-2 border-[#F1F5F9] text-xs font-semibold text-slate-700 hover:bg-white">Clear filters</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="h-9 px-4 rounded-[16px] bg-[#2563eb] text-white text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Quote
          </button>
        </div>
      </div>

      {/* tabs */}
      <div className="flex items-center gap-1 px-6 border-b border-[#F1F5F9] overflow-x-auto">
        {(
          [
            ["All", filtered.length],
            ["Quotes", data?.filter((x) => x.type === "Quote").length ?? 0],
            ["Policies", data?.filter((x) => x.type === "Policy").length ?? 0],
            ["Leads", data?.filter((x) => x.type === "Lead").length ?? 0],
          ] as const
        ).map(([label, count]) => (
          <button
            key={label}
            onClick={() => setTab(label as Tab)}
            className={`relative h-[44px] px-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              tab === label ? "border-[#0033aa] text-[#0033aa]" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
            {label !== "All" && (
              <span className={`ml-2 inline-flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full text-[11px] font-bold ${tab === label ? "bg-[#0033aa]/10 text-[#0033aa]" : "bg-slate-100 text-slate-600"}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* table header */}
      <div className="hidden lg:grid grid-cols-[110px_170px_140px_170px_120px_150px_90px] gap-0 bg-slate-50/70 border-b border-[#F1F5F9] text-[11px] font-bold tracking-widest text-slate-500">
        <div className="px-6 py-3">TYPE</div>
        <div className="px-4 py-3 flex items-center gap-1">
          NAME <ArrowUpDown className="h-3 w-3 cursor-pointer" onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))} />
        </div>
        <div className="px-4 py-3">DATE OPENED</div>
        <div className="px-4 py-3">QUOTE/POLICY NO.</div>
        <div className="px-4 py-3">CHANNEL</div>
        <div className="px-4 py-3">ID NUMBER</div>
        <div className="px-4 py-3 text-right">ACTIONS</div>
      </div>

      {/* body */}
      <div className="divide-y divide-slate-100">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid lg:grid-cols-[110px_170px_140px_170px_120px_150px_90px] gap-3 px-6 py-4 items-center">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 ml-auto rounded-[16px]" />
            </div>
          ))
        ) : pageData.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-slate-700">No results found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting search or filters</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {pageData.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                onClick={() => onSelect(r)}
                className="grid lg:grid-cols-[110px_170px_140px_170px_120px_150px_90px] gap-2 lg:gap-0 px-6 py-3.5 items-center hover:bg-slate-50/70 cursor-pointer group"
              >
                {/* mobile stacked */}
                <div className="lg:hidden col-span-full flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold border ${badgeClasses(r.type)}`}>{r.type}</span>
                    <span className={`text-xs font-bold ${statusColor(r.status)}`}>{r.status}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{r.customerName}</p>
                  <p className="text-xs text-slate-500">{r.number} • {r.productName}</p>
                  <p className="text-xs text-slate-400">{r.dateOpenedDisplay} • {r.channel} • {r.idNumber}</p>
                </div>

                {/* desktop cells */}
                <div className="hidden lg:block">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${badgeClasses(r.type)}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" /> {r.type}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-slate-900 truncate">{r.customerName}</p>
                  <p className="text-xs text-slate-500 truncate">{r.productName}</p>
                </div>
                <div className="hidden lg:block text-sm font-medium text-slate-700">{r.dateOpenedDisplay}</div>
                <div className="hidden lg:block">
                  <p className="text-sm font-mono font-semibold text-slate-900">{r.number}</p>
                  <p className="text-xs font-semibold text-slate-500">{r.premiumDisplay} / mo</p>
                </div>
                <div className="hidden lg:block">
                  <span className="inline-flex rounded-full bg-slate-100 border-2 border-[#F1F5F9] px-2.5 py-1 text-xs font-semibold text-slate-700">{r.channel}</span>
                </div>
                <div className="hidden lg:block text-sm font-mono text-slate-700">{r.idNumber.slice(0, 7)}â€¦</div>
                <div className="hidden lg:flex justify-end">
                  <button className="h-8 w-8 rounded-[16px] bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-[#F1F5F9] bg-slate-50/40">
        <p className="text-xs font-medium text-slate-600">
          Showing <span className="font-bold text-slate-900">{pageData.length}</span> of <span className="font-bold text-slate-900">{filtered.length}</span> records
          {search && <span> for â€œ{search}â€</span>}
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-9 w-9 rounded-[16px] bg-white border border-slate-200 flex items-center justify-center text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold text-slate-700 px-2">
            Page {page} of {totalPages || 1}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="h-9 w-9 rounded-[16px] bg-white border border-slate-200 flex items-center justify-center text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <select value={pageSize} disabled className="hidden sm:block h-9 rounded-[16px] bg-white border border-slate-200 px-3 text-xs font-semibold text-slate-600">
            <option>8 per page</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function badgeClasses(t: string) {
  if (t === "Policy") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (t === "Quote") return "bg-blue-50 text-blue-700 border-blue-100";
  return "bg-amber-50 text-amber-700 border-amber-100";
}
function statusColor(s: string) {
  if (s === "Active") return "text-emerald-600";
  if (s === "Pending") return "text-amber-600";
  if (s === "Quoted") return "text-blue-600";
  if (s === "Expired") return "text-slate-500";
  return "text-red-600";
}






