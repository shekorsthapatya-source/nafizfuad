import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import awardWinner1 from "@/assets/award-winner-1.jpg";
import awardWinner2 from "@/assets/award-winner-2.jpg";
import awardTrophy from "@/assets/award-trophy.jpg";
import awardCompetition from "@/assets/award-competition.jpg";
import designAiAward1 from "@/assets/design-ai-award-1.jpg";
import designAiAward2 from "@/assets/design-ai-award-2.jpg";

const awards = [
  {
    title: "Toilets on the Go — Winner",
    organization: "WaterAid × Blue",
    year: "2026",
    description: "Winner of the 'Toilets on the Go' mobile toilet design competition organized by WaterAid and Blue. Awarded BDT 100,000 prize money.",
    image: awardWinner2,
    gallery: [
      { src: awardWinner1, caption: "Award Ceremony" },
      { src: awardWinner2, caption: "Winner Announcement" },
      { src: awardTrophy, caption: "Trophy" },
      { src: awardCompetition, caption: "Competition" },
    ],
  },
  {
    title: "Design & AI Revolution — Winner",
    organization: "Wood & Metal Industries Expo",
    year: "2025",
    description: "Winner of the 'Design & AI Revolution 2025' competition at the Wood & Metal Industries Expo, Bangladesh.",
    image: designAiAward1,
    gallery: [
      { src: designAiAward1, caption: "Award Event" },
      { src: designAiAward2, caption: "Certificate" },
    ],
  },
];

const AwardsSection = () => {
  const [selectedAward, setSelectedAward] = useState<typeof awards[0] | null>(null);

  return (
    <>
      <section id="awards" className="py-24 lg:py-32 bg-secondary/40">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Recognition</p>
            <h2 className="text-3xl md:text-5xl font-display font-light">Awards & Achievements</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {awards.map((award, i) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group cursor-pointer"
                onClick={() => setSelectedAward(award)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={award.image}
                    alt={award.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
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

      {/* Award Detail Modal */}
      <AnimatePresence>
        {selectedAward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedAward(null)}
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
                  <h3 className="font-display text-xl md:text-2xl font-medium">{selectedAward.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedAward.organization} · {selectedAward.year}</p>
                </div>
                <button
                  onClick={() => setSelectedAward(null)}
                  className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-8">{selectedAward.description}</p>

              <div className="grid grid-cols-2 gap-3">
                {selectedAward.gallery.map((img, j) => (
                  <div key={j} className="overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.caption}
                      className="w-full h-auto object-cover"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{img.caption}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AwardsSection;
