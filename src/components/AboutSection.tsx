import { motion } from "framer-motion";
import nafizAbout from "@/assets/nafiz-about.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Portrait Image - large, editorial style like reference site */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[3/4] w-full overflow-hidden">
              <img
                src={nafizAbout}
                alt="Md. Nafiz Fuad"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pt-8"
          >
            <p className="text-sm text-muted-foreground mb-1">Hi, I am</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-1">
              MD. NAFIZ FUAD
            </h2>
            <p className="text-sm text-muted-foreground mb-6">IDEB: 71732</p>

            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
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

            {/* Experience */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xs tracking-[0.2em] uppercase text-accent font-semibold">Experience</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">Chinta Sthapatya</p>
                  <p className="text-muted-foreground">Designer · March 2023 – Present</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Dream House Builders</p>
                  <p className="text-muted-foreground">Designer · Oct 2022 – March 2023</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Universal Design Consultation & Construction</p>
                  <p className="text-muted-foreground">Draftsman (Intern) · Oct 2020 – March 2022</p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs tracking-[0.2em] uppercase text-accent font-semibold">Education</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium text-foreground">Bangladesh University</p>
                  <p className="text-muted-foreground">Bachelor of Architecture (Studying)</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Naogaon Polytechnic Institute</p>
                  <p className="text-muted-foreground">Diploma in Architecture & Interior Design · CGPA: 3.71/4.00</p>
                </div>
              </div>
            </div>

            {/* Software */}
            <div className="mt-6">
              <h3 className="text-xs tracking-[0.2em] uppercase text-accent font-semibold mb-3">Software</h3>
              <div className="flex flex-wrap gap-2">
                {["AutoCAD", "SketchUp", "3ds Max", "Vray", "D5", "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign"].map((sw) => (
                  <span key={sw} className="px-3 py-1 text-xs border border-border text-muted-foreground">
                    {sw}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
