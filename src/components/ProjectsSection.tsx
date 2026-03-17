import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectModal from "./ProjectModal";

import projectScreenOfLife from "@/assets/project-screen-of-life.jpg";
import projectBhuiyanNibash from "@/assets/project-bhuiyan-nibash.jpg";
import projectMuslimMosque from "@/assets/project-muslim-mosque.jpg";
import projectShahiEidgah from "@/assets/project-shahi-eidgah.jpg";
import projectChakuliRenovation from "@/assets/project-chakuli-renovation.jpg";

import screenOfLifeDetail from "@/assets/screen-of-life-detail.jpg";
import screenOfLifeArchway from "@/assets/screen-of-life-archway.jpg";
import screenOfLifeEnd from "@/assets/screen-of-life-end.jpg";
import screenSittingGarden from "@/assets/screen-sitting-garden.jpg";
import screenCourtyard from "@/assets/screen-courtyard.jpg";
import bhuiyanInterior from "@/assets/bhuiyan-nibash-interior.jpg";
import bhuiyanElevations from "@/assets/bhuiyan-elevations.jpg";
import bhuiyanDining from "@/assets/bhuiyan-dining.jpg";
import bhuiyanConstruction from "@/assets/bhuiyan-construction.jpg";
import bhuiyanLivingSpace from "@/assets/bhuiyan-living-space.jpg";
import bhuiyanHangingStair from "@/assets/bhuiyan-hanging-stair.jpg";
import bhuiyanDining2 from "@/assets/bhuiyan-dining-2.jpg";
import bhuiyanWindowView from "@/assets/bhuiyan-window-view.jpg";
import bhuiyanDining3 from "@/assets/bhuiyan-dining-3.jpg";
import bhuiyanDining4 from "@/assets/bhuiyan-dining-4.jpg";
import bhuiyanArchway from "@/assets/bhuiyan-archway.jpg";
import bhuiyanArchway2 from "@/assets/bhuiyan-archway-2.jpg";
import mosqueDetail from "@/assets/mosque-detail.jpg";
import mosqueViews from "@/assets/mosque-views.jpg";
import mosqueExterior from "@/assets/mosque-exterior.jpg";
import mosquePrayer from "@/assets/mosque-prayer.jpg";
import chakuliDetail from "@/assets/chakuli-detail.jpg";
import eidgahDetail from "@/assets/eidgah-detail.jpg";
import eidgahConstruction from "@/assets/eidgah-construction.jpg";
import interiorLiving1 from "@/assets/interior-living-1.jpg";
import interiorLiving2 from "@/assets/interior-living-2.jpg";
import interiorBedroom from "@/assets/interior-bedroom.jpg";

const categories = ["All", "Residential", "Cultural", "Religious", "Interior"];

const projects = [
  {
    title: "The Screen of Life",
    description: "Designed to treat west side facade and create a semi privacy wall using innovative brick construction methods.",
    longDescription: "This screen was designed to treat west side facade and create a semi privacy wall for the user. It was built in a critical & innovative construction method. The most important thing in this project was the screen and the archway at the entry. It acts like a theatre of light. Where lights and shadows are playing drama and conveying different expressions all along the day. Birds rest on this screen and sing their song. Creating an interesting story with harmony of light and music of nature.",
    location: "Dhaka, Bangladesh",
    year: "2023",
    category: "Residential",
    image: projectScreenOfLife,
    gallery: [
      { src: screenOfLifeArchway, caption: "Archway Entry" },
      { src: screenSittingGarden, caption: "Sitting Garden" },
      { src: screenCourtyard, caption: "Courtyard" },
      { src: screenOfLifeDetail, caption: "Screen Detail" },
      { src: screenOfLifeEnd, caption: "End View" },
    ],
  },
  {
    title: "Bhuiyan Nibash",
    description: "A cooler space design featuring 10\" walls, blending traditional materiality with modern thermal comfort.",
    longDescription: "Bhuiyan Nibash's property and attributes like 10\" wall and its construction method made it a cooler space. Always up to 6° cooler than outside temperature. A place like Rangpur (northern part of Bangladesh), where weather is always extreme, this kind of attributes are required for sure.",
    location: "Rangpur, Bangladesh",
    year: "2024",
    category: "Residential",
    image: projectBhuiyanNibash,
    gallery: [
      { src: bhuiyanLivingSpace, caption: "Living Space" },
      { src: bhuiyanHangingStair, caption: "Hanging Stair" },
      { src: bhuiyanArchway, caption: "Archway — The Main Entry" },
      { src: bhuiyanArchway2, caption: "Brick Archway Details" },
      { src: bhuiyanDining2, caption: "Dining Space" },
      { src: bhuiyanWindowView, caption: "Window View" },
      { src: bhuiyanDining3, caption: "Dining Space" },
      { src: bhuiyanDining4, caption: "Dining & Living" },
      { src: bhuiyanInterior, caption: "Interior" },
      { src: bhuiyanDining, caption: "Dining" },
      { src: bhuiyanConstruction, caption: "Construction" },
      { src: bhuiyanElevations, caption: "Elevations" },
    ],
  },
  {
    title: "Muslim Mosque",
    description: "A place for finding peace and communicating with the creator through thoughtful minimalist visualisation.",
    longDescription: "A mosque is a place for finding peace and communicating with the creator. I tried to create that feeling in these visualisations. The design explores the interplay of brick, light, and open space to evoke a sense of spiritual tranquility.",
    location: "Visualisation",
    year: "2024",
    category: "Religious",
    image: projectMuslimMosque,
    gallery: [
      { src: mosqueExterior, caption: "Exterior Visualization" },
      { src: mosquePrayer, caption: "Prayer Space" },
      { src: mosqueDetail, caption: "Detail" },
      { src: mosqueViews, caption: "Views" },
    ],
  },
  {
    title: "Shahi Eid-gah",
    description: "Jay-namaz design with brick and concrete, featuring modular holes for temporary shading solutions.",
    longDescription: "I designed this floor as 'Jay-namaz' with brick and concrete and gave some holes for bamboos to make temporary shadings on occasions. And made sure wastage as less as possible.",
    location: "Flooring Design",
    year: "2023",
    category: "Religious",
    image: projectShahiEidgah,
    gallery: [
      { src: eidgahDetail, caption: "Floor Detail" },
      { src: eidgahConstruction, caption: "Construction" },
    ],
  },
  {
    title: "Chakuli Renovation",
    description: "Renovation project surrounded by heavy trees, blending functionality with memory-making architectural spaces.",
    longDescription: "It was a renovation project located at Chakuli, Nagaon, Rajshahi. It was also a west-faced building, surrounded by heavy layers of trees. Because it was a vacation house, I tried to blend functionality and memory-making spaces.",
    location: "Nagaon, Rajshahi",
    year: "2023",
    category: "Cultural",
    image: projectChakuliRenovation,
    gallery: [
      { src: chakuliDetail, caption: "Detail" },
    ],
  },
];

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <>
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
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors duration-500" />
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <h3 className="font-display text-lg font-medium text-white mb-1">{project.title}</h3>
                      <p className="text-sm text-white/80 leading-relaxed mb-2 line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between text-xs text-white/70 tracking-wide">
                        <span>{project.location}</span>
                        <span>{project.year}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};

export default ProjectsSection;
