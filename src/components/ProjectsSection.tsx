import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { projects as hardcodedProjects } from "@/data/projects";

type DbProject = {
  id: string; title: string; slug: string; description: string; location: string;
  year: string; category: string; image_url: string | null;
};

const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [dbProjects, setDbProjects] = useState<DbProject[]>([]);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from("projects").select("id,title,slug,description,location,year,category,image_url")
      .order("created_at", { ascending: false })
      .then(({ data }) => setDbProjects((data as DbProject[]) || []));
  }, []);

  const dbSlugs = new Set(dbProjects.map((p) => p.slug));
  const allProjects = [
    ...dbProjects.map((p) => {
      const hc = hardcodedProjects.find(h => h.slug === p.slug);
      return { title: p.title, slug: p.slug, description: p.description, location: p.location, year: p.year, category: p.category, image: p.image_url || hc?.image || "" };
    }),
    ...hardcodedProjects.filter((p) => !dbSlugs.has(p.slug)).map((p) => ({ title: p.title, slug: p.slug, description: p.description, location: p.location, year: p.year, category: p.category, image: p.image })),
  ];

  const allCategories = ["All", ...Array.from(new Set(allProjects.map((p) => p.category).filter(Boolean)))];
  const filtered = activeCategory === "All" ? allProjects : allProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 lg:py-32 bg-secondary/40">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Portfolio</p>
            <h2 className="text-3xl md:text-5xl font-sans font-normal">Selected Works</h2>
          </div>
          <div className="flex gap-1 flex-wrap">
            {allCategories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors duration-300 ${activeCategory === cat ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.filter(p => p.image && !brokenImages.has(p.slug)).map((project, i) => (
              <motion.div key={project.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }} className="group cursor-pointer" onClick={() => navigate(`/projects/${project.slug}`)}>
                <div className="aspect-square overflow-hidden">
                  <img src={project.image} alt={`${project.title} — ${project.category} project in ${project.location}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"
                    onError={() => setBrokenImages(prev => new Set(prev).add(project.slug))} />
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
  );
};

export default ProjectsSection;
