import { useQuery } from "@tanstack/react-query";
import { fetchPolicies } from "@/lib/db";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCards() {
  const { data, isLoading } = useQuery({ queryKey: ["policies-stats"], queryFn: fetchPolicies });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="sapphire-card p-5">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-7 w-20 mb-2" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    );
  }

  const total = data?.length ?? 0;
  const activePolicies = data?.filter(p => p.type === "Policy" && p.status === "Active").length ?? 0;
  const quotes = data?.filter(p => p.type === "Quote").length ?? 0;
  const leads = data?.filter(p => p.type === "Lead").length ?? 0;
  const commission = data?.reduce((s, p) => s + p.premiumCents * 0.12, 0) ?? 0;

  const stats = [
    { label: "Total Policies", value: total.toLocaleString(), change: "+12.5%", trend: "up" as const, sub: `${activePolicies} active` },
    { label: "Active Quotes", value: quotes.toString(), change: "+8.2%", trend: "up" as const, sub: "awaiting approval" },
    { label: "Leads Today", value: leads.toString(), change: "-3.1%", trend: "down" as const, sub: "pipeline" },
    { label: "Commission YTD", value: `R ${(commission/100).toLocaleString("en-ZA",{maximumFractionDigits:0})}`, change: "+15.3%", trend: "up" as const, sub: "12% avg" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="sapphire-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{s.label}</p>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold border ${s.trend === "up" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}>
              {s.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {s.change}
            </span>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 mt-3">{s.value}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
