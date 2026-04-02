import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { awards as hardcodedAwards } from "@/data/awards";

type DbAward = {
  id: string; title: string; slug: string; organization: string; year: string;
  description: string; image_url: string | null;
};

const AwardsSection = () => {
  const navigate = useNavigate();
  const [dbAwards, setDbAwards] = useState<DbAward[]>([]);

  useEffect(() => {
    supabase.from("awards").select("id,title,slug,organization,year,description,image_url")
      .order("created_at", { ascending: false })
      .then(({ data }) => setDbAwards((data as DbAward[]) || []));
  }, []);

  const dbSlugs = new Set(dbAwards.map((a) => a.slug));
  const allAwards = [
    ...dbAwards.map((a) => ({ title: a.title, slug: a.slug, organization: a.organization, year: a.year, image: a.image_url || "" })),
    ...hardcodedAwards.filter((a) => !dbSlugs.has(a.slug)).map((a) => ({ title: a.title, slug: a.slug, organization: a.organization, year: a.year, image: a.image })),
  ];

  return (
    <section id="awards" className="py-24 lg:py-32 bg-secondary/40">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
          <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Recognition</p>
          <h2 className="text-3xl md:text-5xl font-sans font-bold">Awards & Achievements</h2>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allAwards.map((award, i) => (
            <motion.div key={award.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }} className="group cursor-pointer" onClick={() => navigate(`/awards/${award.slug}`)}>
              <div className="aspect-square overflow-hidden">
                {award.image ? <img src={award.image} alt={`${award.title} — ${award.organization}, ${award.year}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  : <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">No image</div>}
              </div>
              <div className="pt-2 pb-1">
                <h3 className="font-display text-sm font-medium text-foreground group-hover:text-accent transition-colors">{award.title}</h3>
                <p className="text-xs text-muted-foreground">{award.organization} · {award.year}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AwardsSection;
