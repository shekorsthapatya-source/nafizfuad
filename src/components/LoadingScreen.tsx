import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => setPhase(3), 2600);
    const t4 = setTimeout(() => onComplete(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <motion.div
      key="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="border border-border p-8 md:p-12 relative"
        >
          {/* Corner accents */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase >= 1 ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-0 left-0 w-6 h-px bg-accent origin-left"
          />
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: phase >= 1 ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-0 left-0 h-6 w-px bg-accent origin-top"
          />
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase >= 1 ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute bottom-0 right-0 w-6 h-px bg-accent origin-right"
          />
          <motion.span
            initial={{ scaleY: 0 }}
            animate={{ scaleY: phase >= 1 ? 1 : 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute bottom-0 right-0 h-6 w-px bg-accent origin-bottom"
          />

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 10 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-display text-2xl md:text-3xl tracking-[0.25em] text-foreground"
          >
            <span className="font-light">NAFIZ</span>{" "}
            <span className="font-semibold">FUAD</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase >= 1 ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-px bg-accent mt-4 origin-center"
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 text-xs tracking-[0.3em] uppercase text-muted-foreground"
        >
          Architect & Designer
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
