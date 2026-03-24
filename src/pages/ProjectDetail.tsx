import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getProjectBySlug } from "@/data/projects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import { useState } from "react";

const MetaRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-1.5">
    <span className="font-semibold text-foreground">{label}:</span>
    <span className="text-muted-foreground">{value}</span>
  </div>
);

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display mb-4">Project not found</h1>
          <button onClick={() => navigate("/projects")} className="text-accent hover:underline">
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const descriptionText = project.longDescription || project.description;
  const isLongText = descriptionText.length > 300;
  const displayText = showFullDescription ? descriptionText : descriptionText.slice(0, 300);

  // Build all images list: hero + gallery
  const allImages = [
    { src: project.image, caption: project.title },
    ...(project.gallery || []).map((g) => ({ src: g.src, caption: g.caption })),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 overflow-hidden bg-muted cursor-pointer"
            onClick={() => setLightboxIndex(0)}
          >
            <img src={project.image} alt={`${project.title} — ${project.category} architecture project in ${project.location}`} className="w-full h-auto object-cover" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-4xl font-light leading-tight mb-8"
          >
            {project.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10 space-y-1.5 text-sm"
          >
            <MetaRow label="Type" value={project.category} />
            {project.status && <MetaRow label="Status" value={project.status} />}
            <MetaRow label="Year" value={project.year} />
            {project.credits?.map((c, i) => (
              <MetaRow key={i} label={c.label} value={c.value} />
            ))}
            <MetaRow label="Location" value={project.location} />
            {project.size && <MetaRow label="Size" value={project.size} />}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16 max-w-3xl"
          >
            <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
              {displayText}{!showFullDescription && isLongText && "…"}
            </p>
            {isLongText && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-2 text-sm text-accent hover:underline"
              >
                {showFullDescription ? "Show Less" : "Show More"}
              </button>
            )}
          </motion.div>

          <div className="space-y-4">
            {(project.gallery || []).map((item, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="cursor-pointer"
                onClick={() => setLightboxIndex(i + 1)}
              >
                <div className="overflow-hidden bg-muted">
                  <img
                    src={item.src}
                    alt={item.caption || `${project.title} gallery image ${i + 1}`}
                    className="w-full h-auto object-cover"
                    loading={i > 1 ? "lazy" : "eager"}
                  />
                </div>
                {item.caption && (
                  <figcaption className="mt-3 mb-8 text-sm text-muted-foreground tracking-wide">
                    {item.caption}
                  </figcaption>
                )}
              </motion.figure>
            ))}
          </div>
        </div>
        <Footer />
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
