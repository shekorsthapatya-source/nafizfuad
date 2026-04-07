const projectBhuiyanNibash = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop";
const projectShahiEidgah = "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop";
const chakuliCollageRender = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop";
const chakuliComparison = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop";
const chakuliElevations = "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop";

const bn00 = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop";
const bn01 = "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop";
const bn02 = "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?w=800&h=600&fit=crop";
const bn03 = "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop";
const bn04 = "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop";
const bn05 = "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop";
const bn06 = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop";
const bn07 = "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop";
const bn08 = "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800&h=600&fit=crop";
const bn09 = "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&h=600&fit=crop";
const bn10 = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop";
const bn11 = "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop";
const bn12 = "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800&h=600&fit=crop";
const bn13 = "https://images.unsplash.com/photo-1600566752734-0a8227d1eea7?w=800&h=600&fit=crop";
const bn14 = "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop";
const bn15 = "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop";
const bn16 = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop";
const bn17 = "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop";
const bn18 = "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop";
const bn19 = "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop";
const mosqueFrontView = "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop";
const mosqueAerialView = "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&h=600&fit=crop";
const mosquePrayerCorridor = "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?w=800&h=600&fit=crop";

const eidgahCourtyard = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop";
const eidgahBrickCutting = "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop";
const eidgahBambooDetail = "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop";
const eidgahPattern = "https://images.unsplash.com/photo-1600566752734-0a8227d1eea7?w=800&h=600&fit=crop";
const interiorLiving1 = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop";
const interiorLiving2 = "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop";
const interiorBedroom = "https://images.pexels.com/photos/1648768/pexels-photo-1648768.jpeg?w=800&h=600&fit=crop";
const betarChamber = "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800&h=600&fit=crop";

export type GalleryItem = { src: string; caption: string };
export type Credit = { label: string; value: string };

export interface Project {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  location: string;
  year: string;
  status?: string;
  category: string;
  size?: string;
  credits?: Credit[];
  image: string;
  gallery?: GalleryItem[];
}

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const categories = ["All", "Residential", "Cultural", "Religious", "Interior"];

export const projects: Project[] = [
  {
    title: "Bhuiyan Nibash",
    slug: toSlug("Bhuiyan Nibash"),
    description: "A cooler space design featuring 10\" walls, blending traditional materiality with modern thermal comfort.",
    longDescription: "Bhuiyan Nibash is a residential haven located in Rangpur, Mahigonj, thoughtfully designed for a joint family dynamic. Although primarily inhabited by the parents, the space caters to their children who frequently visit. Nestled amidst the serene landscape, this dwelling offers respite from the demands of daily life, enabling the family to reconnect and rejuvenate.\n\nThe site's proximity to a dusty and heat-emitting rice field, situated on its southern side, posed a unique challenge. To mitigate this issue, we strategically positioned the building to shield the living spaces from dust and excessive heat. Simultaneously, we harnessed the prevailing southeastern air flow by introducing a central courtyard. This innovative design choice not only improves air circulation but also creates a visually captivating focal point for the entire property.\n\nIn response to the sun's intense heat from the west, we devised an ingenious solution — a perforated brick wall. This feature acts as a shield against the harsh western sun while facilitating continuous airflow. As a result, the bedrooms on the western side enjoy refreshing verandas, offering an ideal balance between natural light, ventilation, and thermal comfort.",
    location: "Rangpur",
    year: "2022",
    status: "Completed",
    category: "Residential",
    size: "6300 SFT",
    credits: [
      { label: "Consultant Firm", value: "Chinta Sthapatya" },
      { label: "Principal Architect", value: "Mahmudul Gani Kanak" },
      { label: "Lead Architect", value: "Ahsan Habib" },
      { label: "Design Team", value: "Shihab Ahmed, Arif Mahtab Kabir Onjon" },
      { label: "Engineer", value: "Nesar Ahmed, MD. Nasir Patowary" },
      { label: "Engineer", value: "MD. Nafiz Fuad" },
    ],
    image: bn00,
    gallery: [
      { src: bn01, caption: "" },
      { src: bn02, caption: "" },
      { src: bn03, caption: "" },
      { src: bn04, caption: "" },
      { src: bn05, caption: "" },
      { src: bn06, caption: "" },
      { src: bn07, caption: "" },
      { src: bn08, caption: "" },
      { src: bn09, caption: "" },
      { src: bn10, caption: "" },
      { src: bn11, caption: "" },
      { src: bn12, caption: "" },
      { src: bn13, caption: "" },
      { src: bn14, caption: "" },
      { src: bn15, caption: "" },
      { src: bn16, caption: "" },
      { src: bn17, caption: "" },
      { src: bn18, caption: "" },
      { src: bn19, caption: "" },
    ],
  },
  {
    title: "Muslim Mosque",
    slug: toSlug("Muslim Mosque"),
    description: "A place for finding peace and communicating with the creator through thoughtful minimalist visualisation.",
    longDescription: "A mosque is a place for finding peace and communicating with the creator. I tried to create that feeling in these visualisations. The design explores the interplay of brick, light, and open space to evoke a sense of spiritual tranquility.",
    location: "Cumilla",
    year: "2025",
    category: "Religious",
    credits: [
      { label: "Consultant Firm", value: "Chinta Sthapatya" },
      { label: "Designer", value: "Mohammad Obaidullah" },
    ],
    image: mosqueFrontView,
    gallery: [
      { src: mosqueAerialView, caption: "Aerial View" },
      { src: mosquePrayerCorridor, caption: "Prayer Corridor" },
    ],
  },
  {
    title: "Shahi Eid-gah",
    slug: toSlug("Shahi Eid-gah"),
    description: "Jay-namaz design with brick and concrete, featuring modular holes for temporary shading solutions.",
    longDescription: "I designed this floor as 'Jay-namaz' with brick and concrete and gave some holes for bamboos to make temporary shadings on occasions. And made sure wastage as less as possible.",
    location: "Flooring Design",
    year: "2023",
    category: "Religious",
    credits: [
      { label: "Designer", value: "MD. Nafiz Fuad" },
    ],
    image: eidgahCourtyard,
    gallery: [
      { src: eidgahPattern, caption: "Brick Pattern Detail" },
      { src: eidgahBrickCutting, caption: "Brick Cutting & Layout Method" },
      { src: eidgahBambooDetail, caption: "Bamboo Hole & Cover Detail" },
    ],
  },
  {
    title: "Chakuli Renovation",
    slug: toSlug("Chakuli Renovation"),
    description: "Renovation project surrounded by heavy trees, blending functionality with memory-making architectural spaces.",
    longDescription: "It was a renovation project located at Chakuli, Naogaon, Rajshahi. It was also a west-faced building, surrounded by heavy layers of trees. Because it was a vacation house, I tried to blend functionality and memory-making spaces.",
    location: "Naogaon, Rajshahi",
    year: "2023",
    category: "Cultural",
    credits: [
      { label: "Designer", value: "MD. Nafiz Fuad" },
    ],
    image: chakuliCollageRender,
    gallery: [
      { src: chakuliComparison, caption: "Renovation vs Existing" },
      { src: chakuliElevations, caption: "Elevation Drawings" },
    ],
  },
  {
    title: "Sage & Saffron",
    slug: toSlug("Sage & Saffron"),
    description: "Vibrant interior design featuring bold color palettes, curated art walls, and warm material textures.",
    longDescription: "This residential interior project explores the intersection of vibrant color theory and minimalist structure. By pairing deep sage green surfaces with high-saturation orange accents, the space achieves a balanced energy that is both calming and stimulating. The design features a curated gallery wall and custom wooden millwork, emphasizing a \"refined-maximalist\" aesthetic for modern urban living.",
    location: "Dhaka, Bangladesh",
    year: "2025",
    category: "Interior",
    credits: [
      { label: "Consultant Firm", value: "Nandan Interior" },
      { label: "Designer", value: "MD. Nafiz Fuad" },
    ],
    image: interiorLiving1,
    gallery: [
      { src: interiorLiving2, caption: "Living Area — Full View" },
      { src: interiorBedroom, caption: "Bedroom" },
    ],
  },
  {
    title: "Bangladesh Betar Directors Chamber",
    slug: toSlug("Bangladesh Betar Directors Chamber"),
    description: "Interior design exploring verticality and light to maximize a narrow executive space with reflective glass and continuous wall features.",
    longDescription: "This interior project explores the use of verticality and light to maximize a narrow executive space. By integrating reflective glass elements and a continuous wall feature, the design creates a sense of depth and transparency. The furniture selection focuses on ergonomics and classic executive styling, ensuring the space serves as both a private workstation and a professional reception area. The vertical wall battens on the right draw the eye upward, making the ceiling feel higher. Since it's designed for a radio station, the materials—wood, fabric sofa, and textured flooring—were chosen to suggest a soft acoustic environment appropriate for a broadcaster. The contrast between the dark wooden doors and desk against bright white walls creates a clean-cut, professional look.",
    location: "Bangladesh Betar, Sayed Mahbub Morshed Rd, Dhaka 1207",
    year: "2025",
    category: "Interior",
    credits: [
      { label: "Designer", value: "MD. Nafiz Fuad" },
    ],
    image: betarChamber,
    gallery: [],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
