import { motion } from "framer-motion";
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
    images: [awardWinner1, awardWinner2, awardTrophy, awardCompetition],
  },
  {
    title: "Design & AI Revolution — Winner",
    organization: "Wood & Metal Industries Expo",
    year: "2025",
    description: "Winner of the 'Design & AI Revolution 2025' competition at the Wood & Metal Industries Expo, Bangladesh.",
    images: [designAiAward1, designAiAward2],
  },
];

const AwardsSection = () => {
  return (
    <section id="awards" className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-accent mb-4">Recognition</p>
          <h2 className="text-3xl md:text-5xl font-display font-light">Awards</h2>
        </motion.div>

        <div className="space-y-20">
          {awards.map((award, i) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="mb-6">
                <h3 className="font-display text-xl md:text-2xl font-medium mb-1">{award.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {award.organization} · {award.year}
                </p>
                <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">
                  {award.description}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {award.images.map((img, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: j * 0.08 }}
                    className="aspect-square overflow-hidden border border-border"
                  >
                    <img
                      src={img}
                      alt={`${award.title} — Photo ${j + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
