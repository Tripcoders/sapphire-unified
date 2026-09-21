import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, ShieldCheck, AlertTriangle, Filter, Plus, Eye, Pencil, Trash2, Phone, Mail, ChevronLeft, ChevronRight, MoreHorizontal, BadgeCheck, XCircle } from "lucide-react";

export function CustomersPage({ globalSearch }: { globalSearch: string }) {
  const { data, isLoading } = useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
  const [q, setQ] = useState("");
  const search = globalSearch || q;
  const [kycFilter, setKycFilter] = useState<"All" | "Verified" | "Pending">("All");
  const [riskFilter, setRiskFilter] = useState<"All" | "LOW" | "MEDIUM" | "HIGH">("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [selected, setSelected] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    if (!data) return [];
    let out = [...data];
    if (search) {
      const s = search.toLowerCase();
      out = out.filter(c => c.fullName.toLowerCase().includes(s) || c.idNumber.includes(s) || c.phone.includes(s));
    }
    if (kycFilter !== "All") out = out.filter(c => kycFilter==="Verified" ? c.kycVerified : !c.kycVerified);
    if (riskFilter !== "All") out = out.filter(c => c.riskRating===riskFilter);
    return out;
  }, [data, search, kycFilter, riskFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page-1)*pageSize, page*pageSize);

  const stats = useMemo(()=>{
    if(!data) return null;
    return {
      total: data.length,
      verified: data.filter(c=>c.kycVerified).length,
      pending: data.filter(c=>!c.kycVerified).length,
      high: data.filter(c=>c.riskRating==="HIGH").length
    };
  },[data]);

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? Array.from({length:4}).map((_,i)=><div key={i} className="sapphire-card p-5"><Skeleton className="h-4 w-24 mb-3"/><Skeleton className="h-7 w-16"/></div>) : stats && [
          {label:"Total Customers", value: stats.total, sub:`${stats.verified} verified`, icon: Users, color:"text-[#2563eb] bg-blue-50 border-blue-100"},
          {label:"KYC Verified", value: stats.verified, sub:"compliant", icon: BadgeCheck, color:"text-emerald-700 bg-emerald-50 border-emerald-100"},
          {label:"KYC Pending", value: stats.pending, sub:"needs review", icon: XCircle, color:"text-amber-700 bg-amber-50 border-amber-100"},
          {label:"High Risk", value: stats.high, sub:"requires approval", icon: AlertTriangle, color:"text-red-700 bg-red-50 border-red-100"},
        ].map(s=>(
          <div key={s.label} className="sapphire-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">{s.label}</p>
              <span className={`h-9 w-9 rounded-[16px] flex items-center justify-center border ${s.color}`}><s.icon className="h-4.5 w-4.5"/></span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-3">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="sapphire-card p-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2"><Users className="h-4.5 w-4.5 text-[#2563eb]"/> Search & Manage Customers</h3>
          <button onClick={()=>setShowAdd(true)} className="h-10 px-5 rounded-[16px] bg-[#2563eb] text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#1d4ed8]"><Plus className="h-4 w-4"/> Add Customer</button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#2563eb]"/>
            <input value={q} onChange={e=>{setQ(e.target.value); setPage(1)}} placeholder="Search by name, ID number, phone..." className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white pl-10 pr-4 text-sm font-medium placeholder:text-slate-400 outline-none focus:border-[#2563eb] hover:border-slate-200 transition-all"/>
          </div>
          <select value={kycFilter} onChange={e=>{setKycFilter(e.target.value as any); setPage(1)}} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-[#2563eb]">
            <option value="All">All KYC</option>
            <option value="Verified">Verified only</option>
            <option value="Pending">Pending only</option>
          </select>
          <select value={riskFilter} onChange={e=>{setRiskFilter(e.target.value as any); setPage(1)}} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-[#2563eb]">
            <option value="All">All risk</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Filter className="h-3.5 w-3.5"/> {filtered.length} customers found
          {(kycFilter!=="All"||riskFilter!=="All") && <button onClick={()=>{setKycFilter("All"); setRiskFilter("All")}} className="ml-2 px-2.5 py-1 rounded-full bg-slate-900 text-white font-semibold">Clear</button>}
        </div>
      </div>

      {/* Table */}
      <div className="sapphire-card overflow-hidden">
        <div className="hidden lg:grid grid-cols-[180px_150px_150px_110px_90px_90px] gap-0 bg-slate-50/70 border-b border-[#F1F5F9] text-[11px] font-bold tracking-widest text-slate-500">
          <div className="px-6 py-3">CUSTOMER</div>
          <div className="px-4 py-3">ID NUMBER</div>
          <div className="px-4 py-3">CONTACT</div>
          <div className="px-4 py-3">KYC</div>
          <div className="px-4 py-3">RISK</div>
          <div className="px-4 py-3 text-right">ACTIONS</div>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading ? Array.from({length:6}).map((_,i)=>(
            <div key={i} className="px-6 py-4 flex gap-4 items-center"><Skeleton className="h-10 w-10 rounded-[16px]"/><Skeleton className="h-4 w-32"/><Skeleton className="h-4 w-24 ml-auto"/></div>
          )) : pageData.length===0 ? (
            <div className="py-16 text-center"><p className="text-sm font-bold text-slate-700">No customers found</p><p className="text-xs text-slate-500">Try different search or filters</p></div>
          ) : pageData.map(c=>(
            <motion.div key={c.id} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="px-6 py-3.5 hover:bg-slate-50/70 flex lg:grid lg:grid-cols-[180px_150px_150px_110px_90px_90px] gap-2 lg:gap-0 items-center cursor-pointer" onClick={()=>setSelected(c)}>
              <div className="flex items-center gap-3 lg:px-0 w-full lg:w-auto">
                <span className="h-10 w-10 rounded-[16px] bg-[#2563eb]/10 border border-blue-100 text-[#2563eb] font-bold flex items-center justify-center text-xs shrink-0">{c.name[0]}{c.surname[0]}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{c.fullName}</p>
                  <p className="text-xs text-slate-500 truncate">{new Date(c.dateOfBirth).toLocaleDateString("en-ZA")} • {c.assignedAgentId}</p>
                </div>
              </div>
              <div className="hidden lg:block text-xs font-mono font-semibold text-slate-700">{c.idNumber.slice(0,7)}…{c.idNumber.slice(-4)}</div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5"><Phone className="h-3 w-3 text-slate-400"/>{c.phone}</p>
                <p className="text-xs text-slate-500 truncate max-w-[140px]">{c.email || "— no email —"}</p>
              </div>
              <div className="hidden lg:block">{c.kycVerified ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 text-xs font-bold"><ShieldCheck className="h-3.5 w-3.5"/> Verified</span> : <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 text-xs font-bold"><AlertTriangle className="h-3.5 w-3.5"/> Pending</span>}</div>
              <div className="hidden lg:block"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold border ${c.riskRating==="HIGH" ? "bg-red-50 text-red-700 border-red-100" : c.riskRating==="MEDIUM" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}>{c.riskRating}</span></div>
              <div className="hidden lg:flex justify-end gap-1.5">
                <button onClick={e=>{e.stopPropagation(); setSelected(c)}} className="h-8 w-8 rounded-[16px] bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white"><Eye className="h-3.5 w-3.5"/></button>
                <button className="h-8 w-8 rounded-[16px] bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50"><Pencil className="h-3.5 w-3.5"/></button>
              </div>

              {/* mobile actions */}
              <div className="lg:hidden flex flex-col gap-1 w-full mt-1">
                <p className="text-xs font-mono text-slate-600">{c.idNumber}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {c.kycVerified ? <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 text-[11px] font-bold">Verified</span> : <span className="rounded-full bg-amber-50 text-amber-700 border px-2 py-0.5 text-[11px] font-bold">Pending KYC</span>}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold">{c.riskRating}</span>
                  <span className="text-xs text-slate-500 ml-auto">{c.phone}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F1F5F9] bg-slate-50/40">
          <p className="text-xs text-slate-600">Showing <span className="font-bold text-slate-900">{pageData.length}</span> of <span className="font-bold">{filtered.length}</span></p>
          <div className="flex items-center gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="h-9 w-9 rounded-[16px] bg-white border border-slate-200 flex items-center justify-center disabled:opacity-40"><ChevronLeft className="h-4 w-4"/></button>
            <span className="text-xs font-bold px-2">Page {page} of {totalPages||1}</span>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="h-9 w-9 rounded-[16px] bg-white border border-slate-200 flex items-center justify-center disabled:opacity-40"><ChevronRight className="h-4 w-4"/></button>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)} className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50"/>
            <motion.div initial={{x:400, opacity:0}} animate={{x:0, opacity:1}} exit={{x:400, opacity:0}} transition={{duration:0.32, ease:[0.22,1,0.36,1]}} className="fixed right-0 top-0 h-full w-[420px] max-w-[95vw] bg-white shadow-2xl z-50 flex flex-col">
              <div className="p-6 border-b border-[#F1F5F9] flex items-start justify-between">
                <div className="flex gap-3">
                  <span className="h-12 w-12 rounded-[16px] bg-[#2563eb] text-white font-bold flex items-center justify-center">{selected.name[0]}{selected.surname[0]}</span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selected.fullName}</h3>
                    <p className="text-xs font-mono text-slate-500">{selected.idNumber}</p>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-2"><Phone className="h-3 w-3"/>{selected.phone}</p>
                  </div>
                </div>
                <button onClick={()=>setSelected(null)} className="h-8 w-8 rounded-[16px] bg-slate-50 border flex items-center justify-center">✕</button>
              </div>
              <div className="p-6 space-y-4 overflow-auto flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4"><p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">KYC</p><p className="text-sm font-bold mt-1">{selected.kycVerified ? "Verified ✅" : "Pending review — documents needed"}</p></div>
                  <div className="rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4"><p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Risk</p><p className="text-sm font-bold mt-1">{selected.riskRating}</p></div>
                  <div className="rounded-2xl bg-white border-2 border-[#F1F5F9] p-4 col-span-2"><p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">Assigned Agent</p><p className="text-sm font-bold mt-1">{selected.assignedAgentId} • {selected.assignedAgentId==="agent_0" ? "Tal Hassal" : "Branch team"}</p></div>
                </div>
                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
                  <p className="text-xs font-bold text-[#2563eb]">Quick actions</p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button className="h-10 rounded-[16px] bg-[#2563eb] text-white text-xs font-bold">Create Quote</button>
                    <button className="h-10 rounded-[16px] bg-white border border-blue-200 text-xs font-bold">View Policies</button>
                    <button className="h-10 rounded-[16px] bg-white border border-slate-200 text-xs font-bold col-span-2">Upload KYC doc</button>
                  </div>
                </div>
                <button onClick={()=>setSelected(null)} className="w-full h-11 rounded-[16px] bg-slate-900 text-white font-bold text-sm">Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowAdd(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"/>
            <motion.div initial={{opacity:0, scale:0.96, y:12}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.96, y:12}} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[520px] sapphire-card z-50 overflow-hidden">
              <div className="px-6 py-5 border-b border-[#F1F5F9] flex justify-between items-center"><h3 className="font-bold">Add Customer</h3><button onClick={()=>setShowAdd(false)} className="h-8 w-8 rounded-[16px] bg-slate-50 border flex items-center justify-center">✕</button></div>
              <div className="p-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="First name" className="h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm outline-none focus:border-[#2563eb]"/>
                  <input placeholder="Surname" className="h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm outline-none focus:border-[#2563eb]"/>
                </div>
                <input placeholder="SA ID — 13 digits" className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm outline-none focus:border-[#2563eb]"/>
                <input placeholder="Phone +27 ..." className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm outline-none focus:border-[#2563eb]"/>
                <select className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm"><option>Risk: LOW</option><option>MEDIUM</option><option>HIGH</option></select>
                <div className="flex gap-2 pt-2">
                  <button onClick={()=>setShowAdd(false)} className="flex-1 h-11 rounded-[16px] bg-white border-2 border-[#F1F5F9] font-semibold text-sm">Cancel</button>
                  <button onClick={()=>setShowAdd(false)} className="flex-1 h-11 rounded-[16px] bg-[#2563eb] text-white font-semibold text-sm">Save customer</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
