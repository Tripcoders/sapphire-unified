import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPolicies } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { FileText, Plus, Search, Filter, ArrowUpDown, MoreHorizontal, ChevronLeft, ChevronRight, Send, Copy, FileCheck, Clock, XCircle } from "lucide-react";

export function QuotesPage({ globalSearch, onSelect }: { globalSearch: string; onSelect: (r:any)=>void }) {
  const { data, isLoading } = useQuery({ queryKey: ["policies"], queryFn: fetchPolicies });
  const [q, setQ] = useState("");
  const search = globalSearch || q;
  const [status, setStatus] = useState("All");
  const [channel, setChannel] = useState("All");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize=8;

  const quotes = useMemo(()=> data?.filter(p=>p.type==="Quote") ?? [],[data]);
  const filtered = useMemo(()=>{
    let out=[...quotes];
    if(status!=="All") out=out.filter(p=>p.status===status);
    if(channel!=="All") out=out.filter(p=>p.channel===channel);
    if(search){ const s=search.toLowerCase(); out=out.filter(p=>p.customerName.toLowerCase().includes(s)||p.number.toLowerCase().includes(s)||p.productName.toLowerCase().includes(s)||p.idNumber.includes(s)); }
    out.sort((a,b)=> sortDir==="desc" ? b.number.localeCompare(a.number) : a.number.localeCompare(b.number));
    return out;
  },[quotes, status, channel, search, sortDir]);
  const totalPages=Math.ceil(filtered.length/pageSize);
  const pageData=filtered.slice((page-1)*pageSize, page*pageSize);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? Array.from({length:3}).map((_,i)=><div key={i} className="sapphire-card p-5"><Skeleton className="h-4 w-24"/></div>) : [
          {label:"Drafts", value: quotes.filter(q=>q.status==="Pending").length, icon: Clock, color:"bg-amber-50 text-amber-700 border-amber-100"},
          {label:"Sent / Quoted", value: quotes.filter(q=>q.status==="Quoted").length, icon: Send, color:"bg-blue-50 text-blue-700 border-blue-100"},
          {label:"Cancelled", value: quotes.filter(q=>q.status==="Cancelled").length, icon: XCircle, color:"bg-red-50 text-red-700 border-red-100"},
        ].map(s=>(
          <div key={s.label} className="sapphire-card p-5 flex justify-between items-center">
            <div><p className="text-xs font-bold tracking-widest text-slate-500 uppercase">{s.label}</p><p className="text-2xl font-bold mt-2 text-slate-900">{s.value}</p></div>
            <span className={`h-10 w-10 rounded-[16px] flex items-center justify-center border ${s.color}`}><s.icon className="h-5 w-5"/></span>
          </div>
        ))}
      </div>

      <div className="sapphire-card p-6">
        <div className="flex flex-wrap justify-between gap-3 items-center">
          <h3 className="text-[15px] font-bold text-slate-900 flex items-center gap-2"><FileText className="h-4.5 w-4.5 text-[#2563eb]"/> Quotes — Drafts & Sent</h3>
          <button className="h-10 px-5 rounded-[16px] bg-[#2563eb] text-white text-sm font-bold inline-flex items-center gap-2"><Plus className="h-4 w-4"/> New Quote</button>
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#2563eb]"/>
            <input value={q} onChange={e=>{setQ(e.target.value); setPage(1)}} placeholder="Search quotes by customer, number, product..." className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white pl-10 pr-4 text-sm font-medium outline-none focus:border-[#2563eb]"/>
          </div>
          <select value={status} onChange={e=>{setStatus(e.target.value); setPage(1)}} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-4 text-sm font-semibold"><option value="All">All statuses</option><option>Quoted</option><option>Pending</option><option>Cancelled</option><option>Expired</option></select>
          <select value={channel} onChange={e=>{setChannel(e.target.value); setPage(1)}} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-4 text-sm font-semibold"><option value="All">All channels</option><option>Branch</option><option>Digital</option><option>Call Centre</option><option>Broker</option></select>
        </div>
      </div>

      <div className="sapphire-card overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#F1F5F9] overflow-x-auto">
          <span className="text-xs font-bold text-slate-700">Filters:</span>
          <button onClick={()=>setStatus("All")} className={`h-7 px-3 rounded-full text-xs font-bold border ${status==="All"?"bg-slate-900 text-white border-slate-900":"bg-white"}`}>All</button>
          {["Quoted","Pending","Cancelled"].map(s=>(
            <button key={s} onClick={()=>setStatus(s)} className={`h-7 px-3 rounded-full text-xs font-bold border ${status===s?"bg-[#2563eb] text-white border-[#2563eb]":"bg-white hover:bg-slate-50"}`}>{s}</button>
          ))}
          <span className="ml-auto text-xs text-slate-500">{filtered.length} quotes</span>
        </div>

        <div className="hidden lg:grid grid-cols-[110px_170px_130px_150px_115px_120px_100px] gap-0 bg-slate-50/70 border-b border-[#F1F5F9] text-[11px] font-bold tracking-widest text-slate-500">
          <div className="px-6 py-3">TYPE</div>
          <div className="px-4 py-3 flex items-center gap-1">CUSTOMER <ArrowUpDown className="h-3 w-3 cursor-pointer" onClick={()=>setSortDir(d=>d==="asc"?"desc":"asc")}/></div>
          <div className="px-4 py-3">DATE</div>
          <div className="px-4 py-3">QUOTE NO.</div>
          <div className="px-4 py-3">CHANNEL</div>
          <div className="px-4 py-3">PREMIUM</div>
          <div className="px-4 py-3 text-right">ACTIONS</div>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading ? Array.from({length:6}).map((_,i)=><div key={i} className="px-6 py-4"><Skeleton className="h-4 w-full"/></div>) : pageData.length===0 ? <div className="py-16 text-center"><p className="text-sm font-bold">No quotes found</p></div> :
            pageData.map(r=>(
              <motion.div key={r.id} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} onClick={()=>onSelect(r)} className="px-6 py-3.5 hover:bg-slate-50/70 cursor-pointer grid lg:grid-cols-[110px_170px_130px_150px_115px_120px_100px] gap-2 lg:gap-0 items-center">
                <div className="hidden lg:block"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${r.status==="Quoted"?"bg-blue-50 text-blue-700 border-blue-100": r.status==="Pending"?"bg-amber-50 text-amber-700 border-amber-100":"bg-red-50 text-red-700 border-red-100"}`}><span className="h-1.5 w-1.5 rounded-full bg-current"/> Quote</span></div>
                <div className="hidden lg:block"><p className="text-sm font-bold text-slate-900 truncate">{r.customerName}</p><p className="text-xs text-slate-500 truncate">{r.productName}</p></div>
                <div className="hidden lg:block text-sm text-slate-700">{r.dateOpenedDisplay}</div>
                <div className="hidden lg:block"><p className="text-sm font-mono font-bold">{r.number}</p><p className="text-xs text-slate-500">{r.status}</p></div>
                <div className="hidden lg:block"><span className="inline-flex rounded-full bg-slate-100 border-2 border-[#F1F5F9] px-2.5 py-1 text-xs font-semibold">{r.channel}</span></div>
                <div className="hidden lg:block text-sm font-bold text-slate-900">{r.premiumDisplay}<span className="text-xs font-medium text-slate-500"> /mo</span></div>
                <div className="hidden lg:flex justify-end gap-1.5">
                  <button title="Duplicate" onClick={e=>{e.stopPropagation()}} className="h-8 w-8 rounded-[16px] bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white"><Copy className="h-3.5 w-3.5"/></button>
                  <button title="Convert to Policy" onClick={e=>{e.stopPropagation()}} className="h-8 px-2.5 rounded-[16px] bg-[#2563eb] text-white text-xs font-bold inline-flex items-center gap-1"><FileCheck className="h-3.5 w-3.5"/> Convert</button>
                </div>
                {/* mobile */}
                <div className="lg:hidden col-span-full">
                  <div className="flex justify-between items-center"><span className="rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 text-xs font-bold">Quote • {r.status}</span><span className="text-xs text-slate-500">{r.dateOpenedDisplay}</span></div>
                  <p className="text-sm font-bold mt-1">{r.customerName} — {r.productName}</p>
                  <p className="text-xs font-mono text-slate-600">{r.number} • {r.premiumDisplay}/mo • {r.channel}</p>
                  <div className="flex gap-2 mt-2"><button className="flex-1 h-8 rounded-[16px] bg-[#2563eb] text-white text-xs font-bold">Convert to Policy</button><button className="h-8 w-8 rounded-[16px] bg-white border flex items-center justify-center"><Send className="h-3.5 w-3.5"/></button></div>
                </div>
              </motion.div>
            ))
          }
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F1F5F9] bg-slate-50/40">
          <p className="text-xs text-slate-600">Showing <span className="font-bold">{pageData.length}</span> of {filtered.length} quotes</p>
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
