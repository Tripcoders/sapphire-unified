import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";

export function Modal({ open, onClose, title, subtitle, children, maxW = "560px" }: { open: boolean; onClose: () => void; title: string; subtitle?: string; children: React.ReactNode; maxW?: string }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] z-50 sapphire-card overflow-hidden flex flex-col max-h-[90vh]" style={{ maxWidth: maxW }}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div><p className="text-xs font-bold tracking-widest text-slate-500 uppercase">{subtitle}</p><h3 className="text-[17px] font-bold text-slate-900 mt-0.5">{title}</h3></div>
              <button onClick={onClose} className="h-9 w-9 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-white"><X className="h-4 w-4"/></button>
            </div>
            <div className="p-6 overflow-auto">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



