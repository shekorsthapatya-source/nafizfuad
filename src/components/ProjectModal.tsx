import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

type GalleryItem = { src: string; caption: string };

interface ProjectModalProps {
  project: {
    title: string;
    description: string;
    longDescription?: string;
    location: string;
    year: string;
    category: string;
    image: string;
    gallery?: GalleryItem[];
  } | null;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  if (!project) return null;

  const allImages: GalleryItem[] = [
    { src: project.image, caption: project.title },
    ...(project.gallery || []),
  ];

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

        {/* Close button - fixed */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-[60] w-12 h-12 flex items-center justify-center bg-foreground text-background hover:bg-foreground/80 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Content - editorial scroll layout */}
        <div className="relative z-[55] max-w-5xl mx-auto px-6 py-20">
          {/* Project header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 text-xs text-muted-foreground tracking-[0.15em] uppercase mb-6">
              <span>{project.category}</span>
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>{project.location}</span>
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>{project.year}</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-light mb-8 leading-tight">
              {project.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl text-base md:text-lg">
              {project.longDescription || project.description}
            </p>
          </motion.div>

          {/* Editorial image gallery - full bleed, stacked with captions */}
          <div className="space-y-4">
            {allImages.map((item, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
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

export default ProjectModal;
