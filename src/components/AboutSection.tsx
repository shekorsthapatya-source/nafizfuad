import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import nafizAbout from "@/assets/nafiz-about.jpg";

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="py-16 lg:py-24 flex flex-col items-center justify-center">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1.4fr] border border-border overflow-hidden">
          {/* Left — Photo panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-card flex items-center justify-center p-8 lg:p-10"
          >
            <div className="aspect-[3/4] w-full max-w-[280px] overflow-hidden">
              <img
                src={nafizAbout}
                alt="MD. Nafiz Fuad"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </motion.div>

          {/* Right — Text panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="border-t lg:border-t-0 lg:border-l border-border p-8 lg:p-10 flex flex-col justify-center"
          >
            <p className="text-sm text-muted-foreground mb-1">Hi, I am</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-1 leading-tight">
              NAFIZ FUAD
            </h2>
            <p className="text-sm text-muted-foreground mb-6">IDEB: 71732</p>

            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm mb-8">
              <p>
                My journey in architecture is defined by a commitment to creating spaces that
                don't just exist but resonate. I believe in the power of humble materials and
                thoughtful craftsmanship to tell stories of light, shadow, and human connection.
              </p>
              <p>
                With a background working alongside visionary teams at Chinta Sthapatya and
                Dream House Builders, I've honed a hands-on approach that bridges the gap
                between digital precision and on-site implementation. My work is a continuous
                exploration of how Bengali cultural heritage can be distilled into minimal,
                contemporary forms.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/projects")}
                className="px-6 py-2.5 border border-border text-foreground text-sm tracking-wide hover:bg-accent hover:text-accent-foreground transition-colors duration-300 flex items-center gap-2 active:scale-[0.97]"
              >
                Projects <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/photography")}
                className="px-6 py-2.5 border border-border text-foreground text-sm tracking-wide hover:bg-accent hover:text-accent-foreground transition-colors duration-300 flex items-center gap-2 active:scale-[0.97]"
              >
                Photography <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
