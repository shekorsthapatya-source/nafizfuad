import awardWinner1 from "@/assets/award-winner-1.jpg";
import awardWinner2 from "@/assets/award-winner-2.jpg";
import awardTrophy from "@/assets/award-trophy.jpg";
import awardCompetition from "@/assets/award-competition.jpg";
import designAiAward1 from "@/assets/design-ai-award-1.jpg";
import designAiAward2 from "@/assets/design-ai-award-2.jpg";
import designAiAward3 from "@/assets/design-ai-award-3.jpg";

export type AwardGalleryItem = { src: string; caption: string };

export interface Award {
  title: string;
  slug: string;
  organization: string;
  year: string;
  description: string;
  image: string;
  gallery: AwardGalleryItem[];
}

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const awards: Award[] = [
  {
    title: "Toilets on the Go — Winner",
    slug: toSlug("Toilets on the Go Winner"),
    organization: "WaterAid × Blue",
    year: "2026",
    description: "Winner of the 'Toilets on the Go' mobile toilet design competition organized by WaterAid and Blue. Awarded BDT 100,000 prize money.",
    image: awardWinner1,
    gallery: [
      { src: awardWinner1, caption: "Award Ceremony" },
      { src: awardWinner2, caption: "Winner Announcement" },
      { src: awardTrophy, caption: "Trophy" },
      { src: awardCompetition, caption: "Competition" },
    ],
  },
  {
    title: "Design & AI Revolution — Winner",
    slug: toSlug("Design AI Revolution Winner"),
    organization: "Wood & Metal Industries Expo",
    year: "2025",
    description: "Winner of the 'Design & AI Revolution 2025' competition at the Wood & Metal Industries Expo, Bangladesh.",
    image: designAiAward2,
    gallery: [
      { src: designAiAward1, caption: "Award Event" },
      { src: designAiAward2, caption: "Certificate" },
      { src: designAiAward3, caption: "At the Event" },
    ],
  },
];

export function getAwardBySlug(slug: string): Award | undefined {
  return awards.find((a) => a.slug === slug);
}
