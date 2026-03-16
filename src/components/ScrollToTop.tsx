import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-50 w-10 h-10 bg-foreground text-background flex items-center justify-center rounded-full hover:bg-muted-foreground transition-colors duration-300 group"
        >
          <ArrowUp
            size={18}
            strokeWidth={1.5}
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
