import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings2, User, ShieldCheck, Bell, Palette, Building2, Key, LogOut, Save, Smartphone, Mail } from "lucide-react";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState("Light");
  const [landing, setLanding] = useState("All Activity");
  const [emailOnLead, setEmailOnLead] = useState(true);
  const [smsOnRenewal, setSmsOnRenewal] = useState(false);

  return (
    <div className="space-y-6 max-w-[900px]">
      <div className="sapphire-card overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] relative">
          <div className="absolute -bottom-10 left-6 flex items-center gap-4">
            <div className="h-20 w-20 rounded-[24px] bg-white border-4 border-white shadow-xl flex items-center justify-center text-xl font-bold text-[#2563eb]">{user?.avatar}</div>
            <div className="pt-10">
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-sm text-white/80 font-mono">{user?.cNumber} • {user?.branch}</p>
            </div>
          </div>
          <span className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-bold text-white border border-white/20">{user?.role}</span>
        </div>
        <div className="pt-14 p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4">
            <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase flex items-center gap-1.5"><Mail className="h-3.5 w-3.5"/> Email</p>
            <p className="text-sm font-semibold text-slate-900 mt-1 truncate">{user?.email}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4">
            <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5"/> Phone</p>
            <p className="text-sm font-semibold text-slate-900 mt-1">{user?.phone}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4">
            <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5"/> Branch</p>
            <p className="text-sm font-semibold text-slate-900 mt-1">{user?.branch}</p>
            <p className="text-xs text-slate-500">{user?.branchCode}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="sapphire-card p-6">
          <h3 className="text-sm font-bold flex items-center gap-2"><Palette className="h-4 w-4 text-[#2563eb]"/> Appearance & Preferences</h3>
          <div className="mt-5 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700">Theme</label>
              <div className="flex gap-2 mt-2">
                {["Light","Dark"].map(t=>(
                  <button key={t} onClick={()=>setTheme(t)} className={`flex-1 h-11 rounded-[16px] font-bold text-sm border-2 ${theme===t ? "bg-slate-900 text-white border-slate-900" : "bg-white border-[#F1F5F9] text-slate-600 hover:bg-slate-50"}`}>
                    {t} {t==="Dark" && "(soon)"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Default Landing Tab</label>
              <select value={landing} onChange={e=>setLanding(e.target.value)} className="mt-2 w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-3 text-sm font-medium outline-none focus:border-[#2563eb]">
                <option>All Activity</option><option>Policies</option><option>Quotes</option><option>Customers</option><option>Claims</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">Where you land after login.</p>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700">Density</label>
              <div className="mt-2 flex gap-2">
                <button className="flex-1 h-10 rounded-[16px] bg-[#2563eb] text-white text-xs font-bold">Comfortable</button>
                <button className="flex-1 h-10 rounded-[16px] bg-white border-2 border-[#F1F5F9] text-xs font-bold">Compact</button>
              </div>
            </div>
          </div>
        </div>

        <div className="sapphire-card p-6">
          <h3 className="text-sm font-bold flex items-center gap-2"><Bell className="h-4 w-4 text-[#2563eb]"/> Notifications</h3>
          <div className="mt-5 space-y-4">
            {[
              {label:"Email on new lead", desc:"Get email when a lead is assigned", val: emailOnLead, setter: setEmailOnLead},
              {label:"SMS on renewal due", desc:"Daily digest for renewals < 7 days", val: smsOnRenewal, setter: setSmsOnRenewal},
            ].map(row=>(
              <label key={row.label} className="flex items-center justify-between rounded-2xl border-2 border-[#F1F5F9] p-4 hover:bg-slate-50 cursor-pointer">
                <div>
                  <p className="text-sm font-bold text-slate-900">{row.label}</p>
                  <p className="text-xs text-slate-500">{row.desc}</p>
                </div>
                <button onClick={()=>row.setter(!row.val)} className={`h-6 w-11 rounded-full p-1 transition-colors ${row.val?"bg-[#2563eb]":"bg-slate-200"}`}>
                  <motion.span animate={{x: row.val? 20:0}} className="block h-4 w-4 rounded-full bg-white shadow"/>
                </button>
              </label>
            ))}
            <label className="flex items-center justify-between rounded-2xl border-2 border-[#F1F5F9] p-4 opacity-60">
              <div><p className="text-sm font-bold">Push notifications</p><p className="text-xs text-slate-500">Browser + mobile (soon)</p></div>
              <span className="h-6 w-11 rounded-full bg-slate-200 p-1"><span className="block h-4 w-4 rounded-full bg-white"/></span>
            </label>
          </div>
        </div>

        <div className="sapphire-card p-6">
          <h3 className="text-sm font-bold flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600"/> Security</h3>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 flex gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5"/>
              <div><p className="text-sm font-bold text-emerald-900">Session secure</p><p className="text-xs text-emerald-700">POPIA compliant • Encrypted at rest • Last login just now</p></div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Change Password</label>
              <input type="password" placeholder="Current password" className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm outline-none focus:border-[#2563eb]"/>
              <input type="password" placeholder="New password" className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm outline-none focus:border-[#2563eb]"/>
              <button className="w-full h-10 rounded-[16px] bg-slate-900 text-white text-sm font-bold">Update Password</button>
            </div>
            <button className="w-full h-10 rounded-[16px] bg-white border-2 border-[#F1F5F9] text-sm font-bold flex items-center justify-center gap-2"><Key className="h-4 w-4"/> Manage API Keys</button>
          </div>
        </div>

        <div className="sapphire-card p-6">
          <h3 className="text-sm font-bold flex items-center gap-2"><Settings2 className="h-4 w-4 text-slate-600"/> Agent & System</h3>
          <div className="mt-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4"><p className="text-[11px] font-bold uppercase text-slate-500">C-Number</p><p className="font-mono font-bold mt-1">{user?.cNumber}</p></div>
              <div className="rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4"><p className="text-[11px] font-bold uppercase text-slate-500">Role</p><p className="font-bold mt-1 text-sm">{user?.role}</p></div>
            </div>
            <div className="rounded-2xl border-2 border-[#F1F5F9] p-4">
              <p className="text-xs font-bold text-slate-700">Branch assignment</p>
              <select defaultValue={user?.branchCode} className="mt-2 w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-3 text-sm">
                <option value="JHB_CENTRAL">Johannesburg Central</option>
                <option value="CPT_WATERFRONT">Cape Town Waterfront</option>
                <option value="DBN_NORTH">Durban North</option>
                <option value="PTA_CENTRAL">Pretoria Central</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">Requires manager approval to change.</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 h-11 rounded-[16px] bg-[#2563eb] text-white font-bold text-sm inline-flex items-center justify-center gap-2"><Save className="h-4 w-4"/> Save changes</button>
              <button onClick={logout} className="h-11 px-5 rounded-[16px] bg-white border-2 border-red-100 text-red-600 font-bold text-sm inline-flex items-center gap-2"><LogOut className="h-4 w-4"/> Sign out</button>
            </div>
            <p className="text-center text-xs text-slate-400">Sapphire v2.0 • Internal Product of The Standard Bank Stanlib Group • Agent {user?.cNumber} • {user?.branch}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
