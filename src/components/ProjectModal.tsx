import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type GalleryItem = { src: string; caption: string };
type Credit = { label: string; value: string };

interface ProjectModalProps {
  project: {
    title: string;
    description: string;
    longDescription?: string;
    location: string;
    year: string;
    category: string;
    status?: string;
    size?: string;
    credits?: Credit[];
    image: string;
    gallery?: GalleryItem[];
  } | null;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      setShowFullDescription(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  if (!project) return null;

  const descriptionText = project.longDescription || project.description;
  const isLongText = descriptionText.length > 300;
  const displayText = showFullDescription ? descriptionText : descriptionText.slice(0, 300);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm" onClick={onClose} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-[60] w-12 h-12 flex items-center justify-center bg-foreground text-background hover:bg-foreground/80 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="relative z-[55] max-w-5xl mx-auto px-6 py-20">
          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 overflow-hidden bg-muted"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="font-display text-3xl md:text-4xl font-light leading-tight">
              {project.title}
            </h2>
          </motion.div>

          {/* Metadata block */}
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

          {/* Description with show more/less */}
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

          {/* Gallery */}
          <div className="space-y-4">
            {(project.gallery || []).map((item, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.08 }}
                className="relative"
              >
                <div className="overflow-hidden bg-muted">
                  <img
                    src={item.src}
                    alt={item.caption}
                    className="w-full h-auto object-cover"
                    loading={i > 1 ? "lazy" : "eager"}
                  />
                </div>
                <figcaption className="mt-3 mb-8 text-sm text-muted-foreground tracking-wide">
                  {item.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const MetaRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-1.5">
    <span className="font-semibold text-foreground">{label}:</span>
    <span className="text-muted-foreground">{value}</span>
  </div>
);

export default ProjectModal;
