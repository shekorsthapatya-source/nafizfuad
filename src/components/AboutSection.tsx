import { motion } from "framer-motion";
import nafizPortrait from "@/assets/nafiz-portrait.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={nafizPortrait}
                alt="Md. Nafiz Fuad - Architect"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-accent/30 -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">About</p>
            <h2 className="text-3xl md:text-4xl font-display font-light mb-8 leading-snug">
              Hi, I am{" "}
              <span className="font-semibold italic">Md. Nafiz Fuad</span>
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                (IDEB: 71732). My journey in architecture is defined by a commitment to creating
                spaces that don't just exist but resonate. I believe in the power of humble
                materials and thoughtful craftsmanship to tell stories of light, shadow, and human
                connection.
              </p>
              <p>
                With a background working alongside visionary teams at Chinta Sthapatya and Dream
                House Builders, I've honed a hands-on approach that bridges the gap between digital
                precision and on-site implementation. My work is a continuous exploration of how
                Bengali cultural heritage can be distilled into minimal, contemporary forms.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
