import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
        className="flex flex-col items-center"
      >
        {/* Logo with filling animation */}
        <div className="relative h-20 w-40 flex items-center justify-center overflow-hidden">
          {/* Base logo in light gray */}
          <img
            src="/assets/Logo-Sapphire.svg"
            alt="Sapphire"
            className="absolute inset-0 h-full w-full object-contain opacity-10"
            style={{ filter: "grayscale(1)" }}
          />
          {/* Filling logo in blue - clipped from bottom */}
          <motion.div
            initial={{ height: "0%" }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] as any, repeat: Infinity, repeatType: "reverse", repeatDelay: 0.3 }}
            className="absolute bottom-0 left-0 right-0 overflow-hidden"
          >
            <img
              src="/assets/Logo-Sapphire.svg"
              alt="Sapphire"
              className="absolute bottom-0 left-0 h-20 w-40 object-contain object-bottom"
            />
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
