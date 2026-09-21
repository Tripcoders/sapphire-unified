import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPolicies } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp, TrendingDown, Award, Users, Wallet, Percent, ArrowUpRight } from "lucide-react";

export function AnalyticsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["policies"], queryFn: fetchPolicies });

  const analytics = useMemo(()=>{
    if(!data) return null;
    const policies = data.filter(p=>p.type==="Policy");
    const quotes = data.filter(p=>p.type==="Quote");
    const leads = data.filter(p=>p.type==="Lead");
    const commission = data.reduce((s,p)=> s + p.premiumCents*0.12,0);
    const byChannel = ["Branch","Digital","Call Centre","Broker"].map(ch=>({ch, count: data.filter(p=>p.channel===ch).length, premium: data.filter(p=>p.channel===ch).reduce((s,p)=>s+p.premiumCents,0)}));
    const byProduct = ["Comprehensive Vehicle","Home Building","Business Insurance","Personal Liability","Travel Cover"].map(prod=>({prod, count: data.filter(p=>p.productName===prod).length}));
    const monthly = ["Jan","Feb","Mar","Apr","May","Jun"].map((m,i)=>({m, value: 40000 + Math.floor(Math.random()*60000) + i*8000}));
    const max = Math.max(...monthly.map(x=>x.value));
    return { policies, quotes, leads, commission, byChannel, byProduct, monthly, max, conversion: (quotes.filter(q=>q.status==="Quoted").length / Math.max(1, leads.length+quotes.length) *100).toFixed(1) };
  },[data]);

  if(isLoading) return <div className="grid grid-cols-4 gap-4">{Array.from({length:4}).map((_,i)=><div key={i} className="sapphire-card p-5"><Skeleton className="h-20 w-full"/></div>)}</div>;
  if(!analytics) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {label:"Commission YTD", value:`R ${(analytics.commission/100).toLocaleString("en-ZA",{maximumFractionDigits:0})}`, change:"+15.3%", trend:"up", sub:"12% avg rate", icon: Wallet},
          {label:"Conversion Rate", value:`${analytics.conversion}%`, change:"+2.4%", trend:"up", sub:"quotes → policies", icon: Percent},
          {label:"Active Policies", value: analytics.policies.filter(p=>p.status==="Active").length.toString(), change:"+8.2%", trend:"up", sub:"in force", icon: Award},
          {label:"Avg Quote Time", value:"8.4 min", change:"-12%", trend:"down-good", sub:"vs last month", icon: BarChart3},
        ].map(s=>(
          <div key={s.label} className="sapphire-card p-5">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">{s.label}</p>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold border ${s.trend==="up"?"bg-emerald-50 text-emerald-700 border-emerald-100" : s.trend==="down-good"?"bg-emerald-50 text-emerald-700 border-emerald-100":"bg-red-50 text-red-700 border-red-100"}`}>
                {s.trend==="up" ? <TrendingUp className="h-3 w-3"/> : s.trend==="down-good" ? <TrendingDown className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>} {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-3">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 sapphire-card p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#2563eb]"/> Commission by Month</h3>
            <button className="h-8 px-3 rounded-full bg-slate-900 text-white text-xs font-bold">Export CSV</button>
          </div>
          <div className="mt-6 flex items-end gap-2 h-[180px]">
            {analytics.monthly.map(m=>(
              <div key={m.m} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center" style={{height: "140px"}}>
                  <div className="w-full max-w-[56px] rounded-t-2xl bg-gradient-to-t from-[#2563eb] to-[#60a5fa] border border-blue-200 flex items-end justify-center pb-2" style={{height: `${(m.value/analytics.max)*100}%`, minHeight:"24px"}}>
                    <span className="text-[10px] font-bold text-white hidden sm:inline">R{(m.value/1000).toFixed(0)}k</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600">{m.m}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-[#2563eb] mt-1"/> Standard Bank commission • YTD <span className="font-bold text-slate-900 ml-auto">R {(analytics.commission/100/6).toLocaleString("en-ZA",{maximumFractionDigits:0})}/mo avg</span></div>
        </div>

        <div className="sapphire-card p-6">
          <h3 className="text-sm font-bold text-slate-900">Branch Performance</h3>
          <div className="mt-4 space-y-3">
            {analytics.byChannel.map(b=>(
              <div key={b.ch} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between"><p className="text-sm font-semibold text-slate-800">{b.ch}</p><p className="text-xs font-bold text-slate-600">{b.count} deals</p></div>
                  <div className="h-2 rounded-full bg-slate-100 mt-1.5 overflow-hidden"><div className="h-full bg-[#2563eb] rounded-full" style={{width:`${(b.count/ Math.max(1, Math.max(...analytics.byChannel.map(x=>x.count)) ))*100}%`}}/></div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700">R {(b.premium/100).toLocaleString("en-ZA",{maximumFractionDigits:0})}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4">
            <p className="text-xs font-bold text-slate-700 flex items-center gap-2"><Award className="h-3.5 w-3.5 text-amber-500"/> Top Branch</p>
            <p className="text-sm font-bold mt-1">Johannesburg Central — 41% of volume</p>
            <p className="text-xs text-slate-500">Best conversion: Call Centre 38%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="sapphire-card p-6">
          <h3 className="text-sm font-bold text-slate-900">Product Mix</h3>
          <div className="mt-4 space-y-2">
            {analytics.byProduct.map(p=>(
              <div key={p.prod} className="flex items-center gap-3 rounded-[16px] border-2 border-[#F1F5F9] px-4 py-3 hover:bg-slate-50">
                <span className="h-8 w-8 rounded-[16px] bg-[#2563eb]/10 flex items-center justify-center text-[#2563eb] font-bold text-xs">{p.prod.split(" ").map(w=>w[0]).slice(0,2).join("")}</span>
                <p className="flex-1 text-sm font-semibold text-slate-800">{p.prod}</p>
                <span className="text-sm font-bold">{p.count}</span>
                <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center"><ArrowUpRight className="h-3 w-3"/></span>
              </div>
            ))}
          </div>
        </div>

        <div className="sapphire-card p-6">
          <h3 className="text-sm font-bold text-slate-900">KPIs & Goals</h3>
          <div className="mt-4 space-y-4">
            {[
              {k:"Monthly target", v:"R 450,000", pct:68, color:"bg-[#2563eb]"},
              {k:"Policies sold (Sep)", v:"37", pct:74, color:"bg-emerald-500"},
              {k:"KYC pass rate", v:"96.2%", pct:96, color:"bg-violet-500"},
            ].map(row=>(
              <div key={row.k}>
                <div className="flex justify-between"><p className="text-sm font-semibold text-slate-700">{row.k}</p><p className="text-sm font-bold">{row.v}</p></div>
                <div className="h-2.5 rounded-full bg-slate-100 mt-2 overflow-hidden"><div className={`h-full rounded-full ${row.color}`} style={{width:`${row.pct}%`}}/></div>
                <p className="text-xs text-slate-500 mt-1">{row.pct}% of goal</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            <button className="flex-1 h-10 rounded-[16px] bg-[#2563eb] text-white text-sm font-bold">View Full Report</button>
            <button className="flex-1 h-10 rounded-[16px] bg-white border-2 border-[#F1F5F9] text-sm font-bold">Share with Manager</button>
          </div>
        </div>
      </div>
    </div>
  );
}
