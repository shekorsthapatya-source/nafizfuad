import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getAwardBySlug } from "@/data/awards";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import { useState, useEffect } from "react";

type GalleryItem = { src: string; caption: string };

const AwardDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [award, setAward] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    supabase.from("awards").select("*").eq("slug", slug).maybeSingle().then(({ data }) => {
      if (data) {
        const hc = getAwardBySlug(slug);
        setAward({
          title: data.title, slug: data.slug, organization: data.organization,
          year: data.year, description: data.description, image: data.image_url || hc?.image || "",
          gallery: (data.gallery as GalleryItem[]) || hc?.gallery || [],
        });
      } else {
        const hc = getAwardBySlug(slug);
        if (hc) setAward(hc);
      }
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (award) document.title = `Nafiz Fuad | ${award.title}`;
    return () => { document.title = "Nafiz Fuad"; };
  }, [award]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;

  if (!award) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display mb-4">Award not found</h1>
          <button onClick={() => navigate("/awards")} className="text-accent hover:underline">Back to Awards</button>
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
            onClick={() => navigate("/awards")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
            <ArrowLeft size={16} /> Back to Awards
          </motion.button>

          {award.image && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="mb-12 overflow-hidden bg-muted cursor-pointer" onClick={() => setLightboxIndex(0)}>
              <img src={award.image} alt={`${award.title} — ${award.organization} award, ${award.year}`} className="w-full h-auto object-cover" />
            </motion.div>
          )}

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-4xl font-light leading-tight mb-4">{award.title}</motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="text-sm text-muted-foreground mb-2">{award.organization} · {award.year}</motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground leading-relaxed text-base mb-16 max-w-3xl">{award.description}</motion.p>

          <div className="grid grid-cols-2 gap-4">
            {award.gallery.map((img: GalleryItem, j: number) => (
              <motion.figure key={j} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: j * 0.06 }} className="cursor-pointer" onClick={() => setLightboxIndex(j)}>
                <div className="overflow-hidden bg-muted">
                  <img src={img.src} alt={`${award.title} — ${img.caption}`} className="w-full h-auto object-cover" loading="lazy" />
                </div>
                <figcaption className="mt-2 text-xs text-muted-foreground">{img.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
        <Footer />
      </div>

      {lightboxIndex !== null && (
        <Lightbox images={award.gallery.map((g: GalleryItem) => ({ src: g.src, caption: g.caption }))}
          currentIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      )}
    </div>
  );
};

export default AwardDetail;
