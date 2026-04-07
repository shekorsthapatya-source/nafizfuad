const awardWinner1 = "https://images.unsplash.com/photo-1541336032412-2048a678540d?w=800&h=600&fit=crop";
const awardWinner2 = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop";
const awardTrophy = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop";
const awardCompetition = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop";
const designAiAward1 = "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop";
const designAiAward2 = "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&h=600&fit=crop";
const designAiAward3 = "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&h=600&fit=crop";

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
