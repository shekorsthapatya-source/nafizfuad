import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProjectModalProps {
  project: {
    title: string;
    description: string;
    longDescription?: string;
    location: string;
    year: string;
    category: string;
    image: string;
    gallery?: string[];
  } | null;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  if (!project) return null;

  const allImages = [project.image, ...(project.gallery || [])];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-foreground/80 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="relative bg-background max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-sm text-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Image gallery */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={allImages[currentImage]}
                alt={project.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/70 backdrop-blur-sm text-foreground hover:bg-background/90 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/70 backdrop-blur-sm text-foreground hover:bg-background/90 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentImage ? "bg-accent" : "bg-background/50"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 text-xs text-muted-foreground tracking-wide mb-4">
              <span>{project.category}</span>
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>{project.location}</span>
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>{project.year}</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-light mb-6">{project.title}</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              {project.longDescription || project.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectModal;
