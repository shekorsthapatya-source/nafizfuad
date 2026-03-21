import { motion } from "framer-motion";
import { Home, Building2, Landmark, Leaf, Palette, MapPin } from "lucide-react";

const services = [
  { icon: Home, title: "Residential Architecture", description: "Custom homes and residential complexes designed for comfort, efficiency, and beauty." },
  { icon: Building2, title: "Commercial Design", description: "Office buildings, retail spaces, and corporate headquarters that reflect brand identity." },
  { icon: Landmark, title: "Cultural & Institutional", description: "Museums, cultural centers, and places of worship that honor heritage and serve communities." },
  { icon: Leaf, title: "Sustainable Design", description: "Environmentally responsible architecture incorporating green building practices." },
  { icon: Palette, title: "Interior Design", description: "Thoughtfully curated interiors with bespoke furniture, materials, and lighting." },
  { icon: MapPin, title: "Urban Planning", description: "Masterplanning for residential communities, mixed-use developments, and urban renewal." },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">What We Do</p>
          <h2 className="text-3xl md:text-5xl font-sans font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-xl">
            Comprehensive architectural solutions tailored to bring your vision to life with precision and artistry.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 border border-border hover:border-accent/40 transition-colors duration-500 group"
            >
              <service.icon
                size={28}
                strokeWidth={1.2}
                className="text-accent mb-5 group-hover:scale-110 transition-transform duration-300"
              />
              <h3 className="font-display text-lg font-medium mb-3">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
