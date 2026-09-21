import { motion, AnimatePresence } from "framer-motion";
import type { PolicyRecord } from "@/lib/schema";
import { X, Shield, User, FileText, CreditCard, Calendar, Building2 } from "lucide-react";
import { useState } from "react";

export function DetailModal({
  record,
  open,
  onClose,
}: {
  record: PolicyRecord | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !record) return null;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[560px] max-h-[90vh] overflow-hidden sapphire-card z-50 flex flex-col"
          >
            <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">{record.type} Details</p>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{record.number}</h3>
                <p className="text-xs text-slate-500">{record.productName}</p>
              </div>
              <button onClick={onClose} className="h-9 w-9 rounded-[16px] bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-auto">
              <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={User} label="Customer" value={record.customerName} sub={record.idNumber} />
                <InfoCard icon={Calendar} label="Opened" value={record.dateOpenedDisplay} sub={record.status} />
                <InfoCard icon={Building2} label="Channel" value={record.channel} sub="Standard Bank" />
                <InfoCard icon={CreditCard} label="Premium" value={record.premiumDisplay} sub="Monthly" />
              </div>
              <div className="rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2"><FileText className="h-4 w-4 text-[#2563eb]" /> Policy Summary</h4>
                <p className="text-xs leading-relaxed text-slate-600 mt-2">
                  This {record.type.toLowerCase()} for <span className="font-semibold text-slate-900">{record.customerName}</span> was opened on {record.dateOpenedDisplay} via {record.channel}. 
                  Cover: <span className="font-semibold">{record.productName}</span> — {record.premiumDisplay}/mo. 
                  Status is <span className="font-bold">{record.status}</span>. All KYC verified.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 h-11 rounded-[16px] bg-[#2563eb] text-white font-semibold text-sm hover:bg-[#1d4ed8]">View Full File</button>
                <button onClick={onClose} className="flex-1 h-11 rounded-[16px] bg-white border-2 border-[#F1F5F9] font-semibold text-sm hover:bg-slate-50">Close</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-white border-2 border-[#F1F5F9] p-3.5">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="h-7 w-7 rounded-[16px] bg-slate-50 border-2 border-[#F1F5F9] flex items-center justify-center"><Icon className="h-3.5 w-3.5" /></span>
        <span className="text-[11px] font-bold tracking-wide uppercase">{label}</span>
      </div>
      <p className="text-sm font-bold text-slate-900 mt-2 truncate">{value}</p>
      <p className="text-xs text-slate-500 truncate">{sub}</p>
    </div>
  );
}

export function NewQuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [type, setType] = useState("Comprehensive Vehicle");
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[520px] sapphire-card z-50 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">New Quote</h3>
              <button onClick={onClose} className="h-8 w-8 rounded-[16px] bg-slate-50 border border-slate-200 flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Product</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] bg-white px-3 text-sm font-medium outline-none focus:border-[#2563eb] focus:ring-0">
                  <option>Comprehensive Vehicle</option>
                  <option>Home Building</option>
                  <option>Home Contents</option>
                  <option>Life Cover</option>
                  <option>Funeral Plan</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">ID Number</label>
                  <input placeholder="e.g. 900101..." className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-0" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Channel</label>
                  <select className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm">
                    <option>Branch</option>
                    <option>Digital</option>
                    <option>Call Centre</option>
                    <option>Broker</option>
                  </select>
                </div>
              </div>
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 flex gap-2">
                <Shield className="h-4 w-4 text-[#2563eb] mt-0.5" />
                <p className="text-xs leading-relaxed text-slate-700">Sapphire will auto-verify KYC and pre-fill customer data from Core Banking.</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={onClose} className="flex-1 h-11 rounded-[16px] bg-white border-2 border-[#F1F5F9] font-semibold text-sm">Cancel</button>
                <button onClick={onClose} className="flex-1 h-11 rounded-[16px] bg-[#2563eb] text-white font-semibold text-sm">Create Quote</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[520px] sapphire-card z-50 overflow-hidden">
            <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Settings & Preferences</h3>
              <button onClick={onClose} className="h-8 w-8 rounded-[16px] bg-slate-50 border flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700">Theme</label>
                <div className="flex gap-2">
                  <button className="flex-1 h-11 rounded-[16px] bg-slate-900 text-white font-semibold text-sm">Light</button>
                  <button className="flex-1 h-11 rounded-[16px] bg-white border-2 border-[#F1F5F9] font-semibold text-sm text-slate-600">Dark (soon)</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Default Landing Tab</label>
                <select className="w-full h-11 rounded-[16px] border-2 border-[#F1F5F9] px-3 text-sm">
                  <option>All Activity</option>
                  <option>Policies</option>
                  <option>Quotes</option>
                </select>
              </div>
              <div className="rounded-2xl bg-slate-50 border-2 border-[#F1F5F9] p-4">
                <p className="text-xs font-semibold text-slate-700">Notifications</p>
                <label className="flex items-center justify-between mt-3">
                  <span className="text-sm text-slate-600">Email on new lead</span>
                  <span className="h-6 w-10 rounded-full bg-[#2563eb] relative"><span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" /></span>
                </label>
              </div>
              <button onClick={onClose} className="w-full h-11 rounded-[16px] bg-[#2563eb] text-white font-semibold text-sm">Save changes</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}




