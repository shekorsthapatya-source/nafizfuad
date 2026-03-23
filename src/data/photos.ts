import armenianChurch from "@/assets/armenian-church.jpeg";
import cuAuditorium from "@/assets/chittagong-university-auditorium.jpeg";

export interface Photo {
  title: string;
  slug: string;
  location: string;
  year: string;
  camera: string;
  image: string;
  description: string;
}

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const photos: Photo[] = [
  {
    title: "Armenian Church",
    slug: toSlug("Armenian Church"),
    location: "Dhaka",
    year: "2025",
    camera: "Nikon D3500",
    image: armenianChurch,
    description: "The historic Armenian Church in Old Dhaka, showcasing colonial-era architecture with its distinctive white and gold façade, arched corridors, and towering spire.",
  },
  {
    title: "Chittagong University Auditorium",
    slug: toSlug("Chittagong University Auditorium"),
    location: "Chittagong",
    year: "2024",
    camera: "Nikon D3500",
    image: cuAuditorium,
    description: "The brutalist red-brick auditorium of Chittagong University — bold geometric forms rising against the sky, a testament to modernist architecture in Bangladesh.",
  },
];

export function getPhotoBySlug(slug: string): Photo | undefined {
  return photos.find((p) => p.slug === slug);
}
