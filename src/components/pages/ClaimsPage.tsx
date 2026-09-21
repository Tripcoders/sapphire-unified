import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchClaims } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Search, Plus, Filter, ArrowUpDown, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, Clock, Ban, Eye, FileText } from "lucide-react";

const statusSteps: Record<string, number> = { Open: 0, Assessing: 1, Approved: 2, Paid: 3, Rejected: 3 };
const statusColor: Record<string,string> = {
  Open: "bg-slate-100 text-slate-700 border-slate-200",
  Assessing: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-blue-50 text-blue-700 border-blue-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

export function ClaimsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["claims"], queryFn: fetchClaims });
  const [q,setQ]=useState("");
  const [status,setStatus]=useState("All");
  const [page,setPage]=useState(1);
  const pageSize=8;
  const [showNew,setShowNew]=useState(false);
  const [detail,setDetail]=useState<any>(null);

  const filtered = useMemo(()=>{
    if(!data) return [];
    let out=[...data];
    if(status!=="All") out=out.filter(c=>c.status===status);
    if(q){ const s=q.toLowerCase(); out=out.filter(c=> c.claimNumber.toLowerCase().includes(s) || c.description.toLowerCase().includes(s));}
    return out;
  },[data,q,status]);
  const totalPages=Math.ceil(filtered.length/pageSize);
  const pageData=filtered.slice((page-1)*pageSize, page*pageSize);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? Array.from({length:4}).map((_,i)=><div key={i} className="sapphire-card p-5"><Skeleton className="h-6 w-20"/></div>) : [
          {label:"Open Claims", value: data?.filter(c=>c.status==="Open").length ?? 0, icon: AlertTriangle, cls:"bg-amber-50 text-amber-700 border-amber-100"},
          {label:"Assessing", value: data?.filter(c=>c.status==="Assessing").length ?? 0, icon: Clock, cls:"bg-blue-50 text-blue-700 border-blue-100"},
          {label:"Approved", value: data?.filter(c=>c.status==="Approved").length ?? 0, icon: CheckCircle2, cls:"bg-emerald-50 text-emerald-700 border-emerald-100"},
          {label:"Total Exposure", value:`R ${((data?.reduce((s,c)=>s+c.amountCents,0) ?? 0)/100).toLocaleString("en-ZA",{maximumFractionDigits:0})}`, icon: ClipboardList, cls:"bg-slate-900 text-white border-slate-900"},
        ].map(s=>(
          <div key={s.label} className="sapphire-card p-5">
            <div className="flex justify-between"><p className="text-xs font-bold tracking-widest text-slate-500 uppercase">{s.label}</p><span className={`h-9 w-9 rounded-[16px] flex items-center justify-center border ${s.cls}`}><s.icon className="h-4.5 w-4.5"/></span></div>
            <p className="text-2xl font-bold text-slate-900 mt-3">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="sapphire-card p-6">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <h3 className="text-[15px] font-bold flex items-center gap-2"><ClipboardList className="h-4.5 w-4.5 text-[#2563eb]"/> Claims — New & Tracking</h3>
          <button onClick={()=>setShowNew(true)} className="h-10 px-5 rounded-[16px] bg-[#2563eb] text-white text-sm font-bold inline-flex items-center gap-2"><Plus className="h-4 w-4"/> New Claim</button>
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#2563eb]"/>
            <input value={q} onChange={e=>{setQ(e.target.value); setPage(1)}} placeholder="Search claim number or description..." className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] pl-10 pr-4 text-sm font-medium outline-none focus:border-[#2563eb]"/>
          </div>
          <select value={status} onChange={e=>{setStatus(e.target.value); setPage(1)}} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-4 text-sm font-semibold"><option value="All">All statuses</option><option>Open</option><option>Assessing</option><option>Approved</option><option>Paid</option><option>Rejected</option></select>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["All","Open","Assessing","Approved","Paid"].map(s=>(
            <button key={s} onClick={()=>{setStatus(s); setPage(1)}} className={`h-7 px-3 rounded-full text-xs font-bold border whitespace-nowrap ${status===s?"bg-slate-900 text-white border-slate-900":"bg-white hover:bg-slate-50"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="sapphire-card overflow-hidden">
        <div className="hidden lg:grid grid-cols-[130px_1fr_120px_130px_110px_100px] gap-0 bg-slate-50/70 border-b border-[#F1F5F9] text-[11px] font-bold tracking-widest text-slate-500">
          <div className="px-6 py-3">CLAIM NO.</div>
          <div className="px-4 py-3">DESCRIPTION</div>
          <div className="px-4 py-3">LODGED</div>
          <div className="px-4 py-3">AMOUNT</div>
          <div className="px-4 py-3">STATUS</div>
          <div className="px-4 py-3 text-right">ACTIONS</div>
        </div>
        <div className="divide-y divide-slate-100">
          {isLoading ? Array.from({length:6}).map((_,i)=><div key={i} className="px-6 py-4"><Skeleton className="h-4 w-full"/></div>) : pageData.length===0 ? <div className="py-16 text-center"><p className="text-sm font-bold">No claims</p></div> :
            pageData.map(c=>(
              <motion.div key={c.id} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} onClick={()=>setDetail(c)} className="px-6 py-4 hover:bg-slate-50/70 cursor-pointer grid lg:grid-cols-[130px_1fr_120px_130px_110px_100px] gap-2 lg:gap-0 items-center">
                {/* progress mini */}
                <div className="hidden lg:block">
                  <p className="text-sm font-mono font-bold text-slate-900">{c.claimNumber}</p>
                  <div className="flex gap-1 mt-1">
                    {["Open","Assessing","Approved","Paid"].map((step,i)=>(
                      <span key={step} className={`h-1.5 flex-1 rounded-full ${i <= statusSteps[c.status] ? "bg-[#2563eb]" : "bg-slate-200"}`}/>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:block pr-4"><p className="text-sm font-medium text-slate-800 line-clamp-1">{c.description}</p><p className="text-xs text-slate-500">Policy {c.policyId} • {c.customerId}</p></div>
                <div className="hidden lg:block text-sm text-slate-700">{new Date(c.dateLodged).toLocaleDateString("en-GB",{day:"2-digit", month:"short", year:"numeric"})}</div>
                <div className="hidden lg:block text-sm font-bold text-slate-900">R {(c.amountCents/100).toLocaleString("en-ZA")}</div>
                <div className="hidden lg:block"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold border ${statusColor[c.status]}`}>{c.status}</span></div>
                <div className="hidden lg:flex justify-end"><button className="h-8 w-8 rounded-[16px] bg-white border flex items-center justify-center"><Eye className="h-3.5 w-3.5"/></button></div>

                <div className="lg:hidden col-span-full">
                  <div className="flex justify-between items-center"><span className="font-mono font-bold text-sm">{c.claimNumber}</span><span className={`rounded-full px-2 py-0.5 text-xs font-bold border ${statusColor[c.status]}`}>{c.status}</span></div>
                  <p className="text-sm font-medium mt-1 line-clamp-2">{c.description}</p>
                  <div className="flex gap-1 mt-2">{["Open","Assessing","Approved","Paid"].map((step,i)=><span key={step} className={`h-1.5 flex-1 rounded-full ${i <= statusSteps[c.status] ? "bg-[#2563eb]" : "bg-slate-200"}`}/>)}</div>
                  <p className="text-xs text-slate-500 mt-2">{new Date(c.dateLodged).toLocaleDateString("en-GB")} • <span className="font-bold text-slate-900">R {(c.amountCents/100).toLocaleString("en-ZA")}</span></p>
                </div>
              </motion.div>
            ))
          }
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F1F5F9] bg-slate-50/40">
          <p className="text-xs text-slate-600">Showing <span className="font-bold">{pageData.length}</span> of {filtered.length}</p>
          <div className="flex items-center gap-2">
            <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="h-9 w-9 rounded-[16px] bg-white border flex items-center justify-center disabled:opacity-40"><ChevronLeft className="h-4 w-4"/></button>
            <span className="text-xs font-bold">Page {page} of {totalPages||1}</span>
            <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="h-9 w-9 rounded-[16px] bg-white border flex items-center justify-center disabled:opacity-40"><ChevronRight className="h-4 w-4"/></button>
          </div>
        </div>
      </div>

      {/* New Claim Modal */}
      <AnimatePresence>
        {showNew && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowNew(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"/>
            <motion.div initial={{opacity:0, scale:0.96, y:12}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.96, y:12}} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[520px] sapphire-card z-50 overflow-hidden">
              <div className="px-6 py-5 border-b border-[#F1F5F9] flex justify-between items-center"><h3 className="font-bold">New Claim</h3><button onClick={()=>setShowNew(false)} className="h-8 w-8 rounded-[16px] bg-slate-50 border flex items-center justify-center">✕</button></div>
              <div className="p-6 space-y-3">
                <input placeholder="Policy number (POL-...)" className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm outline-none focus:border-[#2563eb]"/>
                <input placeholder="Claim amount (R)" className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm outline-none focus:border-[#2563eb]"/>
                <textarea placeholder="Incident description..." rows={3} className="w-full rounded-[16px] border-2 border-[#F1F5F9] p-3 text-sm outline-none focus:border-[#2563eb]"/>
                <select className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm"><option>Incident: Accident</option><option>Theft</option><option>Fire</option><option>Flood</option></select>
                <div className="flex gap-2 pt-2">
                  <button onClick={()=>setShowNew(false)} className="flex-1 h-11 rounded-[16px] bg-white border-2 border-[#F1F5F9] font-semibold text-sm">Cancel</button>
                  <button onClick={()=>setShowNew(false)} className="flex-1 h-11 rounded-[16px] bg-[#2563eb] text-white font-semibold text-sm">Lodge Claim</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Detail */}
      <AnimatePresence>
        {detail && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setDetail(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"/>
            <motion.div initial={{opacity:0, scale:0.96, y:12}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.96, y:12}} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[520px] sapphire-card z-50 overflow-hidden">
              <div className="px-6 py-5 border-b border-[#F1F5F9] flex justify-between items-center">
                <div><p className="text-xs font-bold tracking-widest text-slate-500 uppercase">Claim {detail.claimNumber}</p><p className="text-sm font-bold mt-1">{detail.description}</p></div>
                <button onClick={()=>setDetail(null)} className="h-8 w-8 rounded-[16px] bg-slate-50 border flex items-center justify-center">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  {["Open","Assessing","Approved","Paid"].map((s,i)=>(
                    <div key={s} className={`flex-1 rounded-[16px] border-2 p-3 text-center ${i <= statusSteps[detail.status] ? "bg-[#2563eb] text-white border-[#2563eb]" : "bg-slate-50 border-[#F1F5F9] text-slate-400"}`}>
                      <p className="text-[11px] font-bold">{s}</p>
                      <p className="text-xs mt-1">{i <= statusSteps[detail.status] ? "✓" : "○"}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4"><p className="text-[11px] font-bold uppercase text-slate-500">Amount</p><p className="font-bold mt-1">R {(detail.amountCents/100).toLocaleString("en-ZA")}</p></div>
                  <div className="rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4"><p className="text-[11px] font-bold uppercase text-slate-500">Lodged</p><p className="font-bold mt-1">{new Date(detail.dateLodged).toLocaleDateString("en-GB")}</p></div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 h-11 rounded-[16px] bg-[#2563eb] text-white font-bold text-sm">Update Status</button>
                  <button onClick={()=>setDetail(null)} className="flex-1 h-11 rounded-[16px] bg-white border-2 border-[#F1F5F9] font-bold text-sm">Close</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
