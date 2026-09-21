import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPolicies } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Filter, Calendar, CreditCard, MoreHorizontal, ChevronLeft, ChevronRight, ArrowUpDown, Bell, AlertCircle, CheckCircle2 } from "lucide-react";

export function PoliciesPage({ globalSearch, onSelect }: { globalSearch:string; onSelect:(r:any)=>void}) {
  const { data, isLoading } = useQuery({ queryKey: ["policies"], queryFn: fetchPolicies });
  const [q,setQ]=useState("");
  const search=globalSearch||q;
  const [status,setStatus]=useState("All");
  const [channel,setChannel]=useState("All");
  const [sortDir,setSortDir]=useState<"asc"|"desc">("desc");
  const [page,setPage]=useState(1);
  const pageSize=8;

  const policies = useMemo(()=> data?.filter(p=>p.type==="Policy") ?? [],[data]);
  const filtered = useMemo(()=>{
    let out=[...policies];
    if(status!=="All") out=out.filter(p=>p.status===status);
    if(channel!=="All") out=out.filter(p=>p.channel===channel);
    if(search){ const s=search.toLowerCase(); out=out.filter(p=>p.customerName.toLowerCase().includes(s)||p.number.toLowerCase().includes(s)||p.productName.toLowerCase().includes(s)||p.idNumber.includes(s));}
    out.sort((a,b)=> sortDir==="desc" ? b.number.localeCompare(a.number) : a.number.localeCompare(b.number));
    return out;
  },[policies,status,channel,search,sortDir]);
  const totalPages=Math.ceil(filtered.length/pageSize);
  const pageData=filtered.slice((page-1)*pageSize, page*pageSize);

  const active = policies.filter(p=>p.status==="Active").length;
  const pending = policies.filter(p=>p.status==="Pending").length;
  const expired = policies.filter(p=>p.status==="Expired").length;
  const renewalDue = Math.floor(active*0.18);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? Array.from({length:4}).map((_,i)=><div key={i} className="sapphire-card p-5"><Skeleton className="h-6 w-20"/></div>) : [
          {label:"Active Covers", value:active, sub:"in force", icon: CheckCircle2, cls:"bg-emerald-50 text-emerald-700 border-emerald-100"},
          {label:"Pending Issue", value:pending, sub:"awaiting UW", icon: AlertCircle, cls:"bg-amber-50 text-amber-700 border-amber-100"},
          {label:"Renewal Due (30d)", value:renewalDue, sub:"action needed", icon: Bell, cls:"bg-blue-50 text-blue-700 border-blue-100"},
          {label:"Total Premium /mo", value:`R ${(policies.reduce((s,p)=>s+p.premiumCents,0)/100).toLocaleString("en-ZA",{maximumFractionDigits:0})}`, sub:`${policies.length} policies`, icon: CreditCard, cls:"bg-slate-900 text-white border-slate-900"},
        ].map(s=>(
          <div key={s.label} className="sapphire-card p-5">
            <div className="flex justify-between"><p className="text-xs font-bold tracking-widest text-slate-500 uppercase">{s.label}</p><span className={`h-9 w-9 rounded-[16px] flex items-center justify-center border ${s.cls}`}><s.icon className="h-4.5 w-4.5"/></span></div>
            <p className="text-2xl font-bold text-slate-900 mt-3">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="sapphire-card p-6">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <h3 className="text-[15px] font-bold flex items-center gap-2"><ShieldCheck className="h-4.5 w-4.5 text-emerald-600"/> Active Covers & Policies</h3>
          <div className="flex gap-2">
            <button className="h-10 px-4 rounded-[16px] border border-emerald-200 text-emerald-700 font-semibold text-sm bg-emerald-50">Renewals ({renewalDue})</button>
            <button className="h-10 px-5 rounded-[16px] bg-[#2563eb] text-white text-sm font-bold">New Policy</button>
          </div>
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#2563eb]"/>
            <input value={q} onChange={e=>{setQ(e.target.value); setPage(1)}} placeholder="Search policy number, customer, product..." className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] pl-10 pr-4 text-sm font-medium outline-none focus:border-[#2563eb]"/>
          </div>
          <select value={status} onChange={e=>{setStatus(e.target.value); setPage(1)}} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-4 text-sm font-semibold"><option value="All">All statuses</option><option>Active</option><option>Pending</option><option>Expired</option><option>Cancelled</option></select>
          <select value={channel} onChange={e=>{setChannel(e.target.value); setPage(1)}} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-4 text-sm font-semibold"><option value="All">All channels</option><option>Branch</option><option>Digital</option><option>Call Centre</option><option>Broker</option></select>
        </div>
      </div>

      <div className="sapphire-card overflow-hidden">
        <div className="hidden lg:grid grid-cols-[110px_170px_130px_150px_110px_120px_100px] gap-0 bg-slate-50/70 border-b border-[#F1F5F9] text-[11px] font-bold tracking-widest text-slate-500">
          <div className="px-6 py-3">TYPE</div>
          <div className="px-4 py-3 flex items-center gap-1">CUSTOMER <ArrowUpDown className="h-3 w-3 cursor-pointer" onClick={()=>setSortDir(d=>d==="asc"?"desc":"asc")}/></div>
          <div className="px-4 py-3">ISSUED</div>
          <div className="px-4 py-3">POLICY NO.</div>
          <div className="px-4 py-3">CHANNEL</div>
          <div className="px-4 py-3">STATUS</div>
          <div className="px-4 py-3 text-right">ACTIONS</div>
        </div>
        <div className="divide-y divide-slate-100">
          {isLoading ? Array.from({length:6}).map((_,i)=><div key={i} className="px-6 py-4"><Skeleton className="h-4 w-full"/></div>) : pageData.length===0 ? <div className="py-16 text-center"><p className="text-sm font-bold">No policies</p></div> :
            pageData.map(r=>(
              <motion.div key={r.id} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} onClick={()=>onSelect(r)} className="px-6 py-3.5 hover:bg-slate-50/70 cursor-pointer grid lg:grid-cols-[110px_170px_130px_150px_110px_120px_100px] gap-2 lg:gap-0 items-center">
                <div className="hidden lg:block"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${r.status==="Active"?"bg-emerald-50 text-emerald-700 border-emerald-100": r.status==="Pending"?"bg-amber-50 text-amber-700 border-amber-100":"bg-slate-100"}`}><span className="h-1.5 w-1.5 rounded-full bg-current"/> Policy</span></div>
                <div className="hidden lg:block"><p className="text-sm font-bold truncate">{r.customerName}</p><p className="text-xs text-slate-500 truncate">{r.productName}</p></div>
                <div className="hidden lg:block text-sm text-slate-700">{r.dateOpenedDisplay}</div>
                <div className="hidden lg:block"><p className="text-sm font-mono font-bold">{r.number}</p><p className="text-xs text-slate-500">{r.premiumDisplay}/mo</p></div>
                <div className="hidden lg:block"><span className="inline-flex rounded-full bg-slate-100 border-2 border-[#F1F5F9] px-2.5 py-1 text-xs font-semibold">{r.channel}</span></div>
                <div className="hidden lg:block">{r.status==="Active"?<span className="inline-flex rounded-full bg-emerald-600 text-white px-2.5 py-1 text-xs font-bold">Active</span>:<span className="inline-flex rounded-full bg-amber-100 text-amber-800 px-2.5 py-1 text-xs font-bold">{r.status}</span>}</div>
                <div className="hidden lg:flex justify-end gap-1.5"><button className="h-8 w-8 rounded-[16px] bg-white border flex items-center justify-center hover:bg-slate-900 hover:text-white"><Calendar className="h-3.5 w-3.5"/></button><button className="h-8 w-8 rounded-[16px] bg-white border flex items-center justify-center"><MoreHorizontal className="h-3.5 w-3.5"/></button></div>

                <div className="lg:hidden col-span-full">
                  <div className="flex justify-between"><span className={`rounded-full px-2 py-0.5 text-xs font-bold border ${r.status==="Active"?"bg-emerald-50 text-emerald-700 border-emerald-100":"bg-amber-50 text-amber-700 border-amber-100"}`}>Policy • {r.status}</span><span className="text-xs text-slate-500">{r.dateOpenedDisplay}</span></div>
                  <p className="text-sm font-bold mt-1">{r.customerName} — {r.productName}</p>
                  <p className="text-xs font-mono text-slate-600">{r.number} • {r.premiumDisplay}/mo • {r.channel}</p>
                  <div className="flex gap-2 mt-2"><button className="flex-1 h-8 rounded-[16px] bg-emerald-600 text-white text-xs font-bold">View Cover</button><button className="h-8 px-3 rounded-[16px] bg-white border text-xs font-bold">Renew</button></div>
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
    </div>
  );
}
