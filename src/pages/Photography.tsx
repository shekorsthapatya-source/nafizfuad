import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import armenianChurch from "@/assets/armenian-church.jpeg";
import cuAuditorium from "@/assets/chittagong-university-auditorium.jpeg";

const photos = [
  {
    title: "Armenian Church",
    location: "Dhaka",
    year: "2025",
    camera: "Nikon D3500",
    image: armenianChurch,
    description: "The historic Armenian Church in Old Dhaka, showcasing colonial-era architecture with its distinctive white and gold façade, arched corridors, and towering spire.",
  },
  {
    title: "Chittagong University Auditorium",
    location: "Chittagong",
    year: "2024",
    camera: "Nikon D3500",
    image: cuAuditorium,
    description: "The brutalist red-brick auditorium of Chittagong University — bold geometric forms rising against the sky, a testament to modernist architecture in Bangladesh.",
  },
];

const Photography = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-6 lg:px-12 flex items-center h-16 gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              aria-label="Back to home"
            >
              <ArrowLeft size={20} />
            </button>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="font-display text-xl tracking-widest cursor-pointer group"
            >
              <span className="font-extralight transition-opacity duration-300 group-hover:opacity-60">NAFIZ</span>{" "}
              <span className="font-medium transition-opacity duration-300 group-hover:opacity-60">FUAD</span>
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16">
          <section className="py-24 lg:py-32 bg-secondary/40">
            <div className="container mx-auto px-6 lg:px-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Gallery</p>
                <h1 className="text-3xl md:text-5xl font-display font-light">Photography</h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {photos.map((photo, i) => (
                  <motion.div
                    key={photo.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="pt-2 pb-1">
                      <h3 className="font-display text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                        {photo.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{photo.location} · {photo.year}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </div>
      </div>

      {/* Photo Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
              className="bg-background border border-border max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-medium">{selectedPhoto.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedPhoto.location} · {selectedPhoto.year}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{selectedPhoto.camera}</p>
                </div>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-8">{selectedPhoto.description}</p>

              <div className="overflow-hidden">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Photography;
