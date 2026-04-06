import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { photos as hardcodedPhotos } from "@/data/photos";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type DbPhoto = {
  id: string; title: string; slug: string; location: string; year: string;
  camera: string; image_url: string | null; description: string;
};

const Photography = () => {
  const navigate = useNavigate();
  const [dbPhotos, setDbPhotos] = useState<DbPhoto[]>([]);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    supabase.from("photography").select("*").order("position", { ascending: true }).order("created_at", { ascending: false })
      .then(({ data }) => setDbPhotos((data as DbPhoto[]) || []));
  }, []);

  const dbSlugs = new Set(dbPhotos.map((p) => p.slug));
  const allPhotos = [
    ...dbPhotos.map((p) => {
      const hc = hardcodedPhotos.find(h => h.slug === p.slug);
      return { title: p.title, slug: p.slug, location: p.location, year: p.year, image: p.image_url || hc?.image || "" };
    }),
    ...hardcodedPhotos.filter((p) => !dbSlugs.has(p.slug)).map((p) => ({ title: p.title, slug: p.slug, location: p.location, year: p.year, image: p.image })),
  ];

  const handleImageError = (slug: string) => {
    setBrokenImages(prev => new Set(prev).add(slug));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <section className="py-24 lg:py-32 bg-secondary/40">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Gallery</p>
              <h1 className="text-3xl md:text-5xl font-display font-light">Photography</h1>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allPhotos.filter(p => p.image && !brokenImages.has(p.slug)).map((photo, i) => (
                <motion.div key={photo.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }} className="group cursor-pointer" onClick={() => navigate(`/photography/${photo.slug}`)}>
                  <div className="aspect-square overflow-hidden">
                    <img src={photo.image} alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"
                      onError={() => handleImageError(photo.slug)} />
                  </div>
                  <div className="pt-2 pb-1">
                    <h3 className="font-display text-sm font-medium text-foreground group-hover:text-accent transition-colors">{photo.title}</h3>
                    <p className="text-xs text-muted-foreground">{photo.location} · {photo.year}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default Photography;
