import { cn } from "@/lib/utils";

const map: Record<string,string> = {
  Policy: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Quote: "bg-blue-50 text-blue-700 border-blue-100",
  Lead: "bg-amber-50 text-amber-700 border-amber-100",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Quoted: "bg-blue-50 text-blue-700 border-blue-100",
};

export function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
  const key = variant ?? String(children);
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold", map[key] ?? "bg-slate-50 text-slate-700 border-slate-100", className)}><span className="h-1.5 w-1.5 rounded-full bg-current"/>{children}</span>;
}


