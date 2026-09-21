import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPolicies } from "@/lib/db";
import { motion } from "framer-motion";
import { UserPlus, Search, Plus, Phone, Mail, ChevronRight, Filter, Clock, Flame, Award } from "lucide-react";

type Stage = "New" | "Contacted" | "Qualified" | "Quoted" | "Converted";
const stages: Stage[] = ["New","Contacted","Qualified","Quoted","Converted"];
const stageColor: Record<Stage,string> = {
  New: "bg-slate-100 border-slate-200 text-slate-700",
  Contacted: "bg-blue-50 border-blue-200 text-blue-700",
  Qualified: "bg-amber-50 border-amber-200 text-amber-700",
  Quoted: "bg-violet-50 border-violet-200 text-violet-700",
  Converted: "bg-emerald-50 border-emerald-200 text-emerald-700",
};

export function LeadsPage({ globalSearch, onSelect }: { globalSearch:string; onSelect:(r:any)=>void}) {
  const { data } = useQuery({ queryKey: ["policies"], queryFn: fetchPolicies });
  const [q,setQ]=useState("");
  const search=globalSearch||q;
  const [filterStage,setFilterStage]=useState<Stage | "All">("All");

  const leads = useMemo(()=> data?.filter(p=>p.type==="Lead") ?? [],[data]);
  // mock stage assignment deterministic by hash of id
  const staged = useMemo(()=> leads.map((l,i)=> ({...l, stage: stages[i % stages.length] as Stage, score: 40 + (i*13)%60 })),[leads]);

  const filtered = useMemo(()=>{
    let out=[...staged];
    if(search){ const s=search.toLowerCase(); out=out.filter(l=> l.customerName.toLowerCase().includes(s) || l.number.toLowerCase().includes(s) || l.productName.toLowerCase().includes(s));}
    if(filterStage!=="All") out=out.filter(l=> l.stage===filterStage);
    return out;
  },[staged, search, filterStage]);

  const counts = stages.map(s=> ({stage:s, count: staged.filter(x=>x.stage===s).length }));

  return (
    <div className="space-y-6">
      <div className="sapphire-card p-6">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <h3 className="text-[15px] font-bold flex items-center gap-2"><UserPlus className="h-4.5 w-4.5 text-[#2563eb]"/> Leads — Pipeline</h3>
          <button className="h-10 px-5 rounded-[16px] bg-[#2563eb] text-white text-sm font-bold inline-flex items-center gap-2"><Plus className="h-4 w-4"/> New Lead</button>
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#2563eb]"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search leads by name, LD- number, product..." className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] pl-10 pr-4 text-sm font-medium outline-none focus:border-[#2563eb]"/>
          </div>
          <select value={filterStage} onChange={e=>setFilterStage(e.target.value as any)} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-4 text-sm font-semibold"><option value="All">All stages</option>{stages.map(s=><option key={s} value={s}>{s}</option>)}</select>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {counts.map(c=>(
            <button key={c.stage} onClick={()=>setFilterStage(c.stage)} className={`rounded-[16px] border-2 p-3 text-center transition-all ${filterStage===c.stage ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50 border-[#F1F5F9]"}`}>
              <p className={`text-[11px] font-bold tracking-widest uppercase ${filterStage===c.stage?"text-white":"text-slate-500"}`}>{c.stage}</p>
              <p className="text-xl font-bold mt-1">{c.count}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {stages.map(stage=>(
          <div key={stage} className="sapphire-card p-3 flex flex-col min-h-[420px]">
            <div className="flex items-center justify-between px-2 py-2">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold border ${stageColor[stage]}`}>{stage}</span>
              <span className="text-xs font-bold text-slate-500">{staged.filter(x=>x.stage===stage).length}</span>
            </div>
            <div className="mt-2 space-y-3 flex-1 overflow-auto pr-1">
              {filtered.filter(l=>l.stage===stage).map(lead=>(
                <motion.div key={lead.id} layout initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} onClick={()=>onSelect(lead)} className="rounded-2xl bg-white border-2 border-[#F1F5F9] p-4 hover:border-[#2563eb]/30 hover:shadow-md cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div className="h-9 w-9 rounded-[16px] bg-[#2563eb]/10 border border-blue-100 flex items-center justify-center text-xs font-bold text-[#2563eb]">{lead.customerName.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${lead.score>75?"bg-emerald-50 text-emerald-700 border-emerald-100": lead.score>55?"bg-amber-50 text-amber-700 border-amber-100":"bg-slate-100 border-slate-200"}`}>{lead.score}% • {lead.score>75?"Hot":lead.score>55?"Warm":"Cold"}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 mt-3 truncate">{lead.customerName}</p>
                  <p className="text-xs text-slate-500 truncate">{lead.productName}</p>
                  <p className="text-xs font-mono font-semibold text-slate-700 mt-1">{lead.number}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500"><Clock className="h-3 w-3"/> {lead.dateOpenedDisplay}</div>
                  <div className="mt-3 flex gap-1.5">
                    <button onClick={e=>{e.stopPropagation();}} className="flex-1 h-8 rounded-[16px] bg-slate-900 text-white text-xs font-bold inline-flex items-center justify-center gap-1 group-hover:bg-[#2563eb]"> <Phone className="h-3 w-3"/> Call</button>
                    <button className="h-8 w-8 rounded-[16px] bg-white border border-[#F1F5F9] flex items-center justify-center"><Mail className="h-3.5 w-3.5"/></button>
                    <button className="h-8 w-8 rounded-[16px] bg-white border border-[#F1F5F9] flex items-center justify-center"><ChevronRight className="h-3.5 w-3.5"/></button>
                  </div>
                  {/* pipeline progress */}
                  <div className="flex gap-1 mt-3">
                    {stages.map((s,i)=>(
                      <span key={s} className={`h-1.5 flex-1 rounded-full ${stages.indexOf(lead.stage) >= i ? "bg-[#2563eb]" : "bg-slate-200"}`}/>
                    ))}
                  </div>
                </motion.div>
              ))}
              {filtered.filter(l=>l.stage===stage).length===0 && <p className="text-xs text-center text-slate-400 py-8">No leads in {stage}</p>}
            </div>
            <button className="mt-3 h-9 rounded-[16px] border-2 border-dashed border-[#F1F5F9] text-xs font-bold text-slate-600 hover:bg-slate-50">+ Add</button>
          </div>
        ))}
      </div>

      <div className="sapphire-card p-5 flex flex-wrap gap-4 items-center justify-between">
        <p className="text-xs text-slate-600">Pipeline velocity: <span className="font-bold">8.4 days avg</span> • Conversion <span className="font-bold">34.2%</span></p>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"><Award className="h-3.5 w-3.5"/> Top performer: Tal Hassal</span>
        </div>
      </div>
    </div>
  );
}
