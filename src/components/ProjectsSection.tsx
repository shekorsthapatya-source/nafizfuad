import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectModal from "./ProjectModal";

import projectBhuiyanNibash from "@/assets/project-bhuiyan-nibash.jpg";
import projectMuslimMosque from "@/assets/project-muslim-mosque.jpg"; // kept for potential use
import projectShahiEidgah from "@/assets/project-shahi-eidgah.jpg";
import chakuliCollageRender from "@/assets/chakuli-collage-render.jpg";
import chakuliComparison from "@/assets/chakuli-renovation-comparison.jpg";
import chakuliElevations from "@/assets/chakuli-elevations.jpg";

import bhuiyanScreenDetail from "@/assets/bhuiyan-screen-detail.jpg";
import bhuiyanScreenCollage from "@/assets/bhuiyan-screen-collage.jpg";
import bhuiyanArchedDoor from "@/assets/bhuiyan-arched-door.jpg";
import bhuiyanBrickCorridor from "@/assets/bhuiyan-brick-corridor.jpg";
import bhuiyanConstructionCollage from "@/assets/bhuiyan-construction-collage.jpg";
import bhuiyanLakeside from "@/assets/bhuiyan-lakeside.webp";
import mosqueFrontView from "@/assets/mosque-front-view.jpg";
import mosqueAerialView from "@/assets/mosque-aerial-view.jpg";
import mosquePrayerCorridor from "@/assets/mosque-prayer-corridor.jpg";

import eidgahCourtyard from "@/assets/eidgah-courtyard.jpg";
import eidgahBrickCutting from "@/assets/eidgah-brick-cutting.jpg";
import eidgahBambooDetail from "@/assets/eidgah-bamboo-detail.jpg";
import eidgahPattern from "@/assets/eidgah-pattern.jpg";
import interiorLiving1 from "@/assets/interior-living-1.jpg";
import interiorLiving2 from "@/assets/interior-living-2.jpg";
import interiorBedroom from "@/assets/interior-bedroom.jpg";
import betarChamber from "@/assets/betar-directors-chamber.jpg";

const categories = ["All", "Residential", "Cultural", "Religious", "Interior"];

const projects = [
  {
    title: "Bhuiyan Nibash — A Harmonious Family Retreat",
    description: "A cooler space design featuring 10\" walls, blending traditional materiality with modern thermal comfort.",
    longDescription: "Bhuiyan Nibash is a residential haven located in Rangpur, Mahigonj, thoughtfully designed for a joint family dynamic. Although primarily inhabited by the parents, the space caters to their children who frequently visit. Nestled amidst the serene landscape, this dwelling offers respite from the demands of daily life, enabling the family to reconnect and rejuvenate.\n\nThe site's proximity to a dusty and heat-emitting rice field, situated on its southern side, posed a unique challenge. To mitigate this issue, we strategically positioned the building to shield the living spaces from dust and excessive heat. Simultaneously, we harnessed the prevailing southeastern air flow by introducing a central courtyard. This innovative design choice not only improves air circulation but also creates a visually captivating focal point for the entire property.\n\nIn response to the sun's intense heat from the west, we devised an ingenious solution — a perforated brick wall. This feature acts as a shield against the harsh western sun while facilitating continuous airflow. As a result, the bedrooms on the western side enjoy refreshing verandas, offering an ideal balance between natural light, ventilation, and thermal comfort.",
    location: "Rangpur",
    year: "2022",
    status: "Completed",
    category: "Residential",
    size: "6300 SFT",
    credits: [
      { label: "Principal Architect", value: "Mahmudul Gani Kanak" },
      { label: "Lead Architect", value: "Ahsan Habib" },
      { label: "Design Team", value: "Shihab Ahmed, Arif Mahtab Kabir Onjon" },
      { label: "Engineer", value: "Nesar Ahmed, MD. Nasir Patowary" },
      { label: "Engineer", value: "MD. Nafiz Fuad" },
    ],
    image: bhuiyanLakeside,
    gallery: [
      { src: bhuiyanScreenCollage, caption: "Brick Screen Details" },
      { src: bhuiyanScreenDetail, caption: "Screen Detail — Looking Up" },
      { src: bhuiyanArchedDoor, caption: "Arched Door Entry" },
      { src: bhuiyanBrickCorridor, caption: "Brick Corridor" },
      { src: bhuiyanConstructionCollage, caption: "Construction Progress" },
    ],
  },
  {
    title: "Muslim Mosque",
    description: "A place for finding peace and communicating with the creator through thoughtful minimalist visualisation.",
    longDescription: "A mosque is a place for finding peace and communicating with the creator. I tried to create that feeling in these visualisations. The design explores the interplay of brick, light, and open space to evoke a sense of spiritual tranquility.",
    location: "Visualisation",
    year: "2026",
    category: "Religious",
    credits: [
      { label: "Designer", value: "MD. Nafiz Fuad" },
    ],
    image: mosqueFrontView,
    gallery: [
      { src: mosqueAerialView, caption: "Aerial View" },
      { src: mosquePrayerCorridor, caption: "Prayer Corridor" },
    ],
  },
  {
    title: "Shahi Eid-gah",
    description: "Jay-namaz design with brick and concrete, featuring modular holes for temporary shading solutions.",
    longDescription: "I designed this floor as 'Jay-namaz' with brick and concrete and gave some holes for bamboos to make temporary shadings on occasions. And made sure wastage as less as possible.",
    location: "Flooring Design",
    year: "2023",
    category: "Religious",
    role: "Designer",
    image: eidgahCourtyard,
    gallery: [
      { src: eidgahPattern, caption: "Brick Pattern Detail" },
      { src: eidgahBrickCutting, caption: "Brick Cutting & Layout Method" },
      { src: eidgahBambooDetail, caption: "Bamboo Hole & Cover Detail" },
    ],
  },
  {
    title: "Chakuli Renovation",
    description: "Renovation project surrounded by heavy trees, blending functionality with memory-making architectural spaces.",
    longDescription: "It was a renovation project located at Chakuli, Nagaon, Rajshahi. It was also a west-faced building, surrounded by heavy layers of trees. Because it was a vacation house, I tried to blend functionality and memory-making spaces.",
    location: "Nagaon, Rajshahi",
    year: "2023",
    category: "Cultural",
    role: "Designer",
    image: chakuliCollageRender,
    gallery: [
      { src: chakuliComparison, caption: "Renovation vs Existing" },
      { src: chakuliElevations, caption: "Elevation Drawings" },
    ],
  },
  {
    title: "Sage & Saffron",
    description: "Vibrant interior design featuring bold color palettes, curated art walls, and warm material textures.",
    longDescription: "This residential interior project explores the intersection of vibrant color theory and minimalist structure. By pairing deep sage green surfaces with high-saturation orange accents, the space achieves a balanced energy that is both calming and stimulating. The design features a curated gallery wall and custom wooden millwork, emphasizing a \"refined-maximalist\" aesthetic for modern urban living.",
    location: "Dhaka, Bangladesh",
    year: "2026",
    category: "Interior",
    role: "Designer",
    image: interiorLiving1,
    gallery: [
      { src: interiorLiving2, caption: "Living Area — Full View" },
      { src: interiorBedroom, caption: "Bedroom" },
    ],
  },
  {
    title: "Bangladesh Betar Directors Chamber",
    description: "Interior design exploring verticality and light to maximize a narrow executive space with reflective glass and continuous wall features.",
    longDescription: "This interior project explores the use of verticality and light to maximize a narrow executive space. By integrating reflective glass elements and a continuous wall feature, the design creates a sense of depth and transparency. The furniture selection focuses on ergonomics and classic executive styling, ensuring the space serves as both a private workstation and a professional reception area. The vertical wall battens on the right draw the eye upward, making the ceiling feel higher. Since it's designed for a radio station, the materials—wood, fabric sofa, and textured flooring—were chosen to suggest a soft acoustic environment appropriate for a broadcaster. The contrast between the dark wooden doors and desk against bright white walls creates a clean-cut, professional look.",
    location: "Bangladesh Betar, Sayed Mahbub Morshed Rd, Dhaka 1207",
    year: "2026",
    category: "Interior",
    role: "Designer",
    image: betarChamber,
    gallery: [],
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
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="pt-2 pb-1">
                    <h3 className="font-display text-sm font-medium text-foreground group-hover:text-accent transition-colors">{project.title}</h3>
                    <p className="text-xs text-muted-foreground">{project.year}</p>
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
