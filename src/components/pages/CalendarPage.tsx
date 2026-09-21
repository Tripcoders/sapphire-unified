import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTasks, toggleTaskDone } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Search, Plus, Clock, CheckCircle2, Circle, Filter, ChevronLeft, ChevronRight, Phone, AlertTriangle, Users } from "lucide-react";

export function CalendarPage() {
  const { data, isLoading, refetch } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });
  const [q,setQ]=useState("");
  const [type,setType]=useState("All");
  const [priority,setPriority]=useState("All");
  const [selectedDate,setSelectedDate]=useState(new Date().toISOString().slice(0,10));
  const [showNew,setShowNew]=useState(false);

  const filtered = useMemo(()=>{
    if(!data) return [];
    let out=[...data];
    if(q){ const s=q.toLowerCase(); out=out.filter(t=> t.title.toLowerCase().includes(s) || t.customer.toLowerCase().includes(s));}
    if(type!=="All") out=out.filter(t=>t.type===type);
    if(priority!=="All") out=out.filter(t=>t.priority===priority);
    return out;
  },[data,q,type,priority]);

  const dayTasks = filtered.filter(t=> t.date===selectedDate);
  const todayStr = new Date().toISOString().slice(0,10);
  const weekDays = useMemo(()=>{
    const base = new Date(selectedDate);
    const start = new Date(base); start.setDate(base.getDate()- start.getDay() + 1); // Monday
    return Array.from({length:7}).map((_,i)=>{ const d=new Date(start); d.setDate(start.getDate()+i); return d; });
  },[selectedDate]);

  const handleToggle = (id:string)=>{
    toggleTaskDone(id);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? Array.from({length:3}).map((_,i)=><div key={i} className="sapphire-card p-5"><Skeleton className="h-6 w-20"/></div>) : [
          {label:"Today", value: data?.filter(t=>t.date===todayStr && !t.done).length ?? 0, sub:`${data?.filter(t=>t.done).length ?? 0} done`, icon: Clock, cls:"bg-blue-50 text-blue-700 border-blue-100"},
          {label:"High Priority", value: data?.filter(t=>t.priority==="High" && !t.done).length ?? 0, icon: AlertTriangle, cls:"bg-red-50 text-red-700 border-red-100"},
          {label:"Overdue", value: data?.filter(t=> t.date < todayStr && !t.done).length ?? 0, icon: Calendar, cls:"bg-amber-50 text-amber-700 border-amber-100"},
        ].map(s=>(
          <div key={s.label} className="sapphire-card p-5 flex justify-between items-center">
            <div><p className="text-xs font-bold tracking-widest text-slate-500 uppercase">{s.label}</p><p className="text-2xl font-bold mt-2 text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{(s as any).sub || "needs attention"}</p></div>
            <span className={`h-9 w-9 rounded-[16px] flex items-center justify-center border ${s.cls}`}><s.icon className="h-4.5 w-4.5"/></span>
          </div>
        ))}
      </div>

      <div className="sapphire-card p-6">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <h3 className="text-[15px] font-bold flex items-center gap-2"><Calendar className="h-4.5 w-4.5 text-[#2563eb]"/> Calendar & Follow-ups — Outlook synced</h3>
          <button onClick={()=>setShowNew(true)} className="h-10 px-5 rounded-[16px] bg-[#2563eb] text-white text-sm font-bold inline-flex items-center gap-2"><Plus className="h-4 w-4"/> New Task</button>
        </div>
        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#2563eb]"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tasks, customers..." className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] pl-10 pr-4 text-sm font-medium outline-none focus:border-[#2563eb]"/>
          </div>
          <select value={type} onChange={e=>setType(e.target.value)} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-4 text-sm font-semibold"><option value="All">All types</option><option>Renewal</option><option>Callback</option><option>KYC Follow-up</option><option>Claim Update</option><option>Meeting</option></select>
          <select value={priority} onChange={e=>setPriority(e.target.value)} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-4 text-sm font-semibold"><option value="All">All priorities</option><option>High</option><option>Medium</option><option>Low</option></select>
        </div>

        {/* Week strip */}
        <div className="mt-6 grid grid-cols-7 gap-2">
          {weekDays.map(d=>{
            const iso=d.toISOString().slice(0,10);
            const isSelected=iso===selectedDate;
            const isToday=iso===todayStr;
            const count = filtered.filter(t=>t.date===iso).length;
            return (
              <button key={iso} onClick={()=>setSelectedDate(iso)} className={`rounded-2xl border-2 p-3 text-center transition-all ${isSelected?"bg-slate-900 text-white border-slate-900": isToday?"bg-blue-50 border-blue-200 text-blue-700":"bg-white border-[#F1F5F9] hover:bg-slate-50"}`}>
                <p className="text-[11px] font-bold tracking-widest uppercase">{d.toLocaleDateString("en-GB",{weekday:"short"})}</p>
                <p className="text-lg font-bold mt-1">{d.getDate()}</p>
                <p className="text-[11px] font-semibold mt-1">{count} tasks</p>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={()=>setSelectedDate(new Date(Date.now()-24*60*60*1000).toISOString().slice(0,10))} className="h-8 w-8 rounded-[16px] bg-white border flex items-center justify-center"><ChevronLeft className="h-4 w-4"/></button>
          <p className="text-sm font-bold">{new Date(selectedDate).toLocaleDateString("en-GB",{weekday:"long", day:"2-digit", month:"long", year:"numeric"})}</p>
          <button onClick={()=>setSelectedDate(new Date(Date.now()+24*60*60*1000).toISOString().slice(0,10))} className="h-8 w-8 rounded-[16px] bg-white border flex items-center justify-center"><ChevronRight className="h-4 w-4"/></button>
          <button onClick={()=>setSelectedDate(todayStr)} className="ml-auto h-8 px-3 rounded-full bg-[#2563eb] text-white text-xs font-bold">Today</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 sapphire-card p-6">
          <h4 className="text-sm font-bold text-slate-900">Tasks for {new Date(selectedDate).toLocaleDateString("en-GB",{day:"2-digit", month:"short"})} • {dayTasks.length}</h4>
          <div className="mt-4 space-y-2">
            {isLoading ? Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-16 w-full"/>) : dayTasks.length===0 ? <div className="py-12 text-center"><p className="text-sm font-bold text-slate-700">No tasks for this day</p><p className="text-xs text-slate-500">Enjoy the calm — or add a follow-up.</p></div> :
              dayTasks.map(t=>(
                <motion.div key={t.id} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} className={`rounded-2xl border-2 p-4 flex gap-3 items-start ${t.done?"bg-slate-50 border-slate-100 opacity-60":"bg-white border-[#F1F5F9] hover:border-[#2563eb]/20"}`}>
                  <button onClick={()=>handleToggle(t.id)} className={`mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${t.done?"bg-emerald-500 border-emerald-500 text-white":"bg-white border-slate-200"}`}>
                    {t.done ? <CheckCircle2 className="h-4 w-4"/> : <Circle className="h-3 w-3 text-slate-300"/>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 items-center">
                      <p className={`text-sm font-bold truncate ${t.done?"line-through text-slate-500":"text-slate-900"}`}>{t.title}</p>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold border ${t.priority==="High"?"bg-red-50 text-red-700 border-red-100": t.priority==="Medium"?"bg-amber-50 text-amber-700 border-amber-100":"bg-slate-100"}`}>{t.priority}</span>
                      <span className="inline-flex rounded-full bg-slate-100 border px-2 py-0.5 text-[11px] font-bold">{t.type}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2"><Users className="h-3 w-3"/> {t.customer} • <Clock className="h-3 w-3"/> {t.time}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button className="h-8 w-8 rounded-[16px] bg-[#2563eb] text-white flex items-center justify-center"><Phone className="h-3.5 w-3.5"/></button>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </div>

        <div className="sapphire-card p-6">
          <h4 className="text-sm font-bold">Upcoming</h4>
          <div className="mt-4 space-y-2 max-h-[420px] overflow-auto pr-1">
            {filtered.slice(0,8).map(t=>(
              <div key={t.id} className={`rounded-2xl border p-3 flex gap-3 ${t.date===selectedDate?"bg-blue-50 border-blue-200":"bg-white border-[#F1F5F9]"}`}>
                <div className="text-center min-w-[52px]">
                  <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">{new Date(t.date).toLocaleDateString("en-GB",{month:"short"})}</p>
                  <p className="text-lg font-bold">{new Date(t.date).getDate()}</p>
                  <p className="text-[11px] font-semibold">{t.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{t.title}</p>
                  <p className="text-xs text-slate-500 truncate">{t.customer}</p>
                  <span className={`inline-flex mt-1 rounded-full px-2 py-0.5 text-[11px] font-bold border ${t.priority==="High"?"bg-red-50 text-red-700 border-red-100":"bg-slate-100"}`}>{t.type} • {t.priority}</span>
                </div>
                {t.done && <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1"/>}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-100 p-3">
            <p className="text-xs font-bold text-amber-800">Renewals due this week: {filtered.filter(t=>t.type==="Renewal").length}</p>
            <p className="text-xs text-amber-700">Call 3 clients today to prevent lapse.</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showNew && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowNew(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"/>
            <motion.div initial={{opacity:0, scale:0.96, y:12}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.96, y:12}} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[480px] sapphire-card z-50 overflow-hidden">
              <div className="px-6 py-5 border-b border-[#F1F5F9] flex justify-between items-center"><h3 className="font-bold">New Task</h3><button onClick={()=>setShowNew(false)} className="h-8 w-8 rounded-[16px] bg-slate-50 border flex items-center justify-center">✕</button></div>
              <div className="p-6 space-y-3">
                <input placeholder="Title — e.g. Call Nomsa for renewal" className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm outline-none focus:border-[#2563eb]"/>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" defaultValue={selectedDate} className="h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm"/>
                  <input type="time" defaultValue="09:00" className="h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select className="h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm"><option>Renewal</option><option>Callback</option><option>KYC Follow-up</option></select>
                  <select className="h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm"><option>High</option><option>Medium</option><option>Low</option></select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={()=>setShowNew(false)} className="flex-1 h-11 rounded-[16px] bg-white border-2 border-[#F1F5F9] font-semibold text-sm">Cancel</button>
                  <button onClick={()=>setShowNew(false)} className="flex-1 h-11 rounded-[16px] bg-[#2563eb] text-white font-semibold text-sm">Add Task</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
