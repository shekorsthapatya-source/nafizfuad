import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getPhotoBySlug } from "@/data/photos";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import { useState, useEffect } from "react";

const PhotoDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    supabase.from("photography").select("*").eq("slug", slug).maybeSingle().then(({ data }) => {
      if (data) {
        setPhoto({
          title: data.title, slug: data.slug, location: data.location,
          year: data.year, camera: data.camera, image: data.image_url || "",
          description: data.description,
        });
      } else {
        const hc = getPhotoBySlug(slug);
        if (hc) setPhoto(hc);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;

  if (!photo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display mb-4">Photo not found</h1>
          <button onClick={() => navigate("/photography")} className="text-accent hover:underline">Back to Photography</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
          <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
            onClick={() => navigate("/photography")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
            <ArrowLeft size={16} /> Back to Photography
          </motion.button>

          {photo.image && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="mb-12 overflow-hidden bg-muted cursor-pointer" onClick={() => setLightboxOpen(true)}>
              <img src={photo.image} alt={`${photo.title} — photographed in ${photo.location}, ${photo.year} with ${photo.camera}`} className="w-full h-auto object-cover" />
            </motion.div>
          )}

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-4xl font-light leading-tight mb-4">{photo.title}</motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="mb-10 space-y-1 text-sm">
            <p className="text-muted-foreground">{photo.location} · {photo.year}</p>
            <p className="text-muted-foreground text-xs">{photo.camera}</p>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground leading-relaxed text-base max-w-3xl">{photo.description}</motion.p>
        </div>
        <Footer />
      </div>

      {lightboxOpen && (
        <Lightbox images={[{ src: photo.image, caption: photo.title }]} currentIndex={0}
          onClose={() => setLightboxOpen(false)} onNavigate={() => {}} />
      )}
    </div>
  );
};

export default PhotoDetail;
