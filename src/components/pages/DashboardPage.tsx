import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickSearch } from "@/components/dashboard/QuickSearch";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import type { PolicyRecord } from "@/lib/schema";

export function DashboardPage({ search, onSearch, onSelect }: { search: string; onSearch:(q:string)=>void; onSelect:(r:PolicyRecord)=>void }) {
  return (
    <div className="space-y-6">
      <StatsCards />
      <QuickSearch onSearch={onSearch} />
      <RecentActivity search={search} onSelect={onSelect} />
    </div>
  );
}
