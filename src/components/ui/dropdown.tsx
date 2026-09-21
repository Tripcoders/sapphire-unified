import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

export function Dropdown({ open, onClose, children, align = "right" }: { open: boolean; onClose: () => void; children: React.ReactNode; align?: "right"|"left" }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: 6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.98 }} transition={{ duration: 0.22, ease: [0.22,1,0.36,1] }} className={`absolute ${align==="right"?"right-0":"left-0"} mt-2 z-30 sapphire-card p-2`}>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
