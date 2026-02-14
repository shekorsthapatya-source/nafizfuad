import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import projectScreenOfLife from "@/assets/project-screen-of-life.jpg";
import projectBhuiyanNibash from "@/assets/project-bhuiyan-nibash.jpg";
import projectMuslimMosque from "@/assets/project-muslim-mosque.jpg";
import projectShahiEidgah from "@/assets/project-shahi-eidgah.jpg";
import projectChakuliRenovation from "@/assets/project-chakuli-renovation.jpg";

const categories = ["All", "Residential", "Cultural", "Religious"];

const projects = [
  {
    title: "The Screen of Life",
    description: "Designed to treat west side facade and create a semi privacy wall using innovative brick construction methods.",
    location: "Dhaka, Bangladesh",
    year: "2023",
    category: "Residential",
    image: projectScreenOfLife,
  },
  {
    title: "Bhuiyan Nibash",
    description: "A cooler space design featuring 10\" walls, blending traditional materiality with modern thermal comfort.",
    location: "Rangpur, Bangladesh",
    year: "2024",
    category: "Residential",
    image: projectBhuiyanNibash,
  },
  {
    title: "Muslim Mosque",
    description: "A place for finding peace and communicating with the creator through thoughtful minimalist visualisation.",
    location: "Visualisation",
    year: "2024",
    category: "Religious",
    image: projectMuslimMosque,
  },
  {
    title: "Shahi Eid-gah",
    description: "Jay-namaz design with brick and concrete, featuring modular holes for temporary shading solutions.",
    location: "Flooring Design",
    year: "2023",
    category: "Religious",
    image: projectShahiEidgah,
  },
  {
    title: "Chakuli Renovation",
    description: "Renovation project surrounded by heavy trees, blending functionality with memory-making architectural spaces.",
    location: "Nagaon, Rajshahi",
    year: "2023",
    category: "Cultural",
    image: projectChakuliRenovation,
  },
];

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 lg:py-32 bg-secondary/40">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Portfolio</p>
          <h2 className="text-3xl md:text-5xl font-display font-light">Selected Works</h2>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-sm tracking-wide transition-colors duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden mb-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-display text-lg font-medium mb-1">{project.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/70 tracking-wide">
                  <span>{project.location}</span>
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  <span>{project.year}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectsSection;
