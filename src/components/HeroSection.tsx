import { motion } from "framer-motion";
import portfolioCover from "@/assets/portfolio-cover.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={portfolioCover}
          alt="Portfolio cover - brick architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90 md:from-background/70 md:via-background/40 md:to-background/80" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm tracking-[0.3em] uppercase text-foreground/70 mb-4"
        >
          Md. Nafiz Fuad's
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight leading-none mb-6"
        >
          PORTFOLIO
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="w-24 h-px bg-accent mx-auto mb-4"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="text-sm tracking-[0.2em] uppercase text-foreground/60 mb-10"
        >
          Selected Works
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="flex items-center justify-center gap-6"
        >
          <a
            href="#projects"
            className="px-8 py-3 bg-primary text-primary-foreground text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors duration-300"
          >
            View Works
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border border-foreground/30 text-foreground text-sm tracking-widest uppercase hover:bg-foreground/5 transition-colors duration-300"
          >
            Inquiry
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-px h-12 bg-foreground/40"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
