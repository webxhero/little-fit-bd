export type Category = {
  slug: string;
  name: string;
  nameBn: string;
  image: string;
  description: string;
  subcategories: string[];
};

export const categories: Category[] = [
  {
    slug: "baby-shoes",
    name: "Baby Shoes",
    nameBn: "বেবি জুতা",
    image: "baby-shoes",
    description:
      "Soft-soled first walkers, breathable sandals and everyday sneakers sized for little growing feet.",
    subcategories: ["First Walkers", "Sandals", "Sneakers", "Booties"],
  },
  {
    slug: "kids-fashion",
    name: "Kids Fashion",
    nameBn: "কিডস ফ্যাশন",
    image: "kids-fashion",
    description: "Breathable cotton sets, rompers and layering pieces made for Bangladesh weather.",
    subcategories: ["Rompers", "Sets", "Outerwear", "Sleepwear"],
  },
  {
    slug: "baby-strollers",
    name: "Baby Strollers",
    nameBn: "বেবি স্ট্রলার",
    image: "baby-strollers",
    description: "Lightweight, easy-fold strollers and prams built for city roads and long walks.",
    subcategories: ["Lightweight", "Travel System", "Prams"],
  },
  {
    slug: "feeding-chairs",
    name: "Feeding Chairs",
    nameBn: "ফিডিং চেয়ার",
    image: "feeding-chairs",
    description: "Stable high chairs and booster seats that make mealtime calmer for everyone.",
    subcategories: ["High Chairs", "Booster Seats", "Wooden Chairs"],
  },
  {
    slug: "baby-bottles",
    name: "Baby Bottles",
    nameBn: "বেবি বোতল",
    image: "baby-bottles",
    description: "Anti-colic, BPA-free bottles, sippers and spare nipples for every feeding stage.",
    subcategories: ["Anti-Colic", "Glass Bottles", "Sippers", "Accessories"],
  },
  {
    slug: "silicone-sets",
    name: "Silicone Sets",
    nameBn: "সিলিকন সেট",
    image: "silicone-sets",
    description: "Food-grade silicone plates, bowls, bibs and spoons that stay put during self-feeding.",
    subcategories: ["Suction Plates", "Bowls", "Bibs", "Full Sets"],
  },
  {
    slug: "nursery-essentials",
    name: "Nursery Essentials",
    nameBn: "নার্সারি",
    image: "nursery-essentials",
    description: "Muslin blankets, storage baskets and soft lighting for a restful nursery corner.",
    subcategories: ["Bedding", "Storage", "Lighting", "Blankets"],
  },
  {
    slug: "school-bags",
    name: "School Bags",
    nameBn: "স্কুল ব্যাগ",
    image: "school-bags",
    description: "Ergonomic, lightweight backpacks and lunch bags for playgroup through primary.",
    subcategories: ["Backpacks", "Lunch Bags", "Water Bottles"],
  },
  {
    slug: "toys-play",
    name: "Toys & Play",
    nameBn: "খেলনা",
    image: "toys-play",
    description: "Wooden and montessori-inspired play things chosen for safe, screen-free time.",
    subcategories: ["Wooden Toys", "Teethers", "Puzzles", "Soft Toys"],
  },
  {
    slug: "bath-potty",
    name: "Bath & Potty",
    nameBn: "বাথ ও পটি",
    image: "bath-potty",
    description: "Gentle bath-time and potty-training essentials with soft, skin-friendly materials.",
    subcategories: ["Bath Tubs", "Towels", "Potty Seats", "Bath Toys"],
  },
];

export const ageGroups = ["Newborn", "0–1 Year", "1–3 Years", "3–5 Years", "5+ Years"] as const;
export type AgeGroup = (typeof ageGroups)[number];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
