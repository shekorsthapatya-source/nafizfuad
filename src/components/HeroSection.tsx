import { motion } from "framer-motion";
import portfolioCover from "@/assets/portfolio-cover.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src={portfolioCover}
          alt="Nafiz Fuad architecture portfolio — brick facade detail"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0f0f0f]/85" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
        {/* Thin uppercase label */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-hero text-[11px] tracking-[0.5em] uppercase text-white/40 font-light mb-8"
        >
          Architecture &amp; Design
        </motion.p>

        {/* Main heading — ExtraLight italic */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-hero text-5xl md:text-7xl lg:text-[6.5rem] font-extralight italic tracking-[0.08em] leading-[1.1] text-white mb-4"
        >
          Nafiz Fuad
        </motion.h1>

        {/* Thin divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="w-16 h-px bg-white/20 mx-auto mb-5"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="font-hero text-[11px] tracking-[0.4em] uppercase text-white/35 font-light mb-14"
        >
          Selected Works
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="flex items-center justify-center gap-5"
        >
          <a
            href="#projects"
            className="px-7 py-2.5 border border-white/20 text-white/80 text-[11px] tracking-[0.3em] uppercase font-hero font-light hover:bg-white/5 hover:border-white/40 transition-all duration-500"
          >
            View Works
          </a>
          <a
            href="#contact"
            className="px-7 py-2.5 border border-white/10 text-white/50 text-[11px] tracking-[0.3em] uppercase font-hero font-light hover:text-white/80 hover:border-white/30 transition-all duration-500"
          >
            Inquiry
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-px h-10 bg-white/15"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
