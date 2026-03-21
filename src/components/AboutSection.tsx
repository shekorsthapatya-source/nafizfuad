import { motion } from "framer-motion";
import nafizAbout from "@/assets/nafiz-about.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[auto_1fr] gap-10 lg:gap-14 items-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="aspect-[3/4] w-56 md:w-64 mx-auto overflow-hidden">
              <img
                src={nafizAbout}
                alt="Mohammad Obaidullah"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-sm text-muted-foreground mb-1">Hi, I am</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-1">
              NAFIZ FUAD
            </h2>
            <p className="text-sm text-muted-foreground mb-5">IDEB: 71732</p>

            <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
