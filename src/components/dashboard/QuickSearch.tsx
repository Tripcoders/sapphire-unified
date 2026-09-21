import { useState } from "react";
import { Search, User, FileText, Hash, Shield } from "lucide-react";

export function QuickSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [val, setVal] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div className="sapphire-card p-6">
      <h3 className="text-[15px] font-bold text-slate-900">Quick Search</h3>
      <div className="mt-4 flex gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2563eb] transition-colors" />
          <input
            value={val}
            onChange={(e) => { setVal(e.target.value); onSearch(e.target.value); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search for customers by ID number, passport number, policy or quote number..."
            className="w-full h-[48px] rounded-[16px] border-2 border-[#F1F5F9] bg-white pl-10 pr-4 text-sm font-medium placeholder:text-slate-400 outline-none hover:border-slate-300 focus:border-[#2563eb] focus:ring-0 transition-all"
          />
        </div>
        <button
          onClick={() => onSearch(val)}
          className="h-[48px] px-6 rounded-[16px] bg-[#2563eb] text-white text-sm font-semibold inline-flex items-center gap-2"
        >
          <Search className="h-4 w-4" /> Search
        </button>
      </div>

      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 transition-all ${focused ? "opacity-100" : "opacity-80"}`}>
        {[
          { icon: User, label: "ID number" },
          { icon: FileText, label: "Lead ID" },
          { icon: Hash, label: "Quote number" },
          { icon: Shield, label: "Policy number" },
        ].map((it) => (
          <button
            key={it.label}
            onClick={() => setVal(it.label)}
            className="flex items-center gap-2 rounded-[16px] bg-slate-50 border-2 border-[#F1F5F9] px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-white hover:border-[#F1F5F9] hover:text-slate-900 transition-colors"
          >
            <it.icon className="h-4 w-4 text-slate-500" /> {it.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 mr-1">Most Recent</span>
        <span className="h-4 w-px bg-slate-200" />
        <button className="rounded-full bg-slate-900 text-white px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" /> Quote
        </button>
        <button className="rounded-full bg-white border-2 border-[#F1F5F9] px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 inline-flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5" /> Policy
        </button>
      </div>
    </div>
  );
}




