import { categories } from "./categories";
import { discountPercent } from "@/lib/format";

/**
 * CENTRAL PRODUCT CATALOG
 * -----------------------
 * Every product below is a DEMO product (`isDemo: true`) using in-house
 * generated brand imagery from `src/lib/images.ts`.
 *
 * To add your own real product:
 *   1. Add the image to `src/assets/` and register it in `src/lib/images.ts`.
 *   2. Add a seed row below with `isDemo: false` and your image key.
 * Prices are in Bangladeshi Taka (৳).
 */

export type ProductOption = { label: string; values: string[] };

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  categoryName: string;
  subcategory: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount: number;
  image: string;
  gallery: string[];
  stock: number;
  inStock: boolean;
  sku: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  ageGroup: string;
  options: ProductOption[];
  features: string[];
  specifications: Record<string, string>;
  care: string;
  deliveryInfo: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isDemo: boolean;
};

type Seed = {
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  age: string;
  brand?: string;
  short: string;
  options?: ProductOption[];
  featured?: boolean;
  best?: boolean;
  isNew?: boolean;
  tags?: string[];
};

const SIZES_SHOE: ProductOption = { label: "Size", values: ["EU 17", "EU 19", "EU 21", "EU 23", "EU 25"] };
const SIZES_KIDS: ProductOption = { label: "Size", values: ["0–3M", "3–6M", "6–12M", "1–2Y", "2–3Y"] };
const COLORS_SAGE: ProductOption = { label: "Colour", values: ["Sage", "Cream", "Warm Beige"] };

const seeds: Seed[] = [
  // Baby Shoes
  { name: "Soft Sole First Walker Shoes", category: "baby-shoes", subcategory: "First Walkers", price: 890, originalPrice: 1190, stock: 24, rating: 4.8, reviewCount: 126, age: "0–1 Year", short: "Flexible cotton-lined shoes that let first steps feel natural.", options: [SIZES_SHOE, COLORS_SAGE], featured: true, best: true },
  { name: "Everyday Canvas Sneakers", category: "baby-shoes", subcategory: "Sneakers", price: 1150, originalPrice: 1450, stock: 18, rating: 4.6, reviewCount: 84, age: "1–3 Years", short: "Breathable canvas uppers with a grippy, non-slip sole.", options: [SIZES_SHOE, COLORS_SAGE], best: true },
  { name: "Summer Comfort Sandals", category: "baby-shoes", subcategory: "Sandals", price: 780, stock: 31, rating: 4.5, reviewCount: 57, age: "1–3 Years", short: "Open sandals with adjustable straps for humid days.", options: [SIZES_SHOE] },
  { name: "Knitted Newborn Booties", category: "baby-shoes", subcategory: "Booties", price: 490, originalPrice: 650, stock: 45, rating: 4.9, reviewCount: 203, age: "Newborn", short: "Hand-finished knit booties that stay on tiny feet.", options: [COLORS_SAGE], isNew: true },
  { name: "School Ready Velcro Shoes", category: "baby-shoes", subcategory: "Sneakers", price: 1390, originalPrice: 1690, stock: 12, rating: 4.4, reviewCount: 41, age: "3–5 Years", short: "Easy velcro closure so kids can wear them on their own.", options: [SIZES_SHOE] },
  // Kids Fashion
  { name: "Organic Cotton Romper", category: "kids-fashion", subcategory: "Rompers", price: 950, originalPrice: 1250, stock: 40, rating: 4.7, reviewCount: 112, age: "0–1 Year", short: "Breathable organic cotton with easy bottom snaps.", options: [SIZES_KIDS, COLORS_SAGE], featured: true },
  { name: "Two-Piece Everyday Set", category: "kids-fashion", subcategory: "Sets", price: 1290, stock: 22, rating: 4.5, reviewCount: 66, age: "1–3 Years", short: "Soft tee and jogger set that survives daily washing.", options: [SIZES_KIDS], best: true },
  { name: "Muslin Sleep Suit", category: "kids-fashion", subcategory: "Sleepwear", price: 1090, originalPrice: 1390, stock: 27, rating: 4.8, reviewCount: 91, age: "0–1 Year", short: "Airy double-gauze muslin for warm nights.", options: [SIZES_KIDS], isNew: true },
  { name: "Light Knit Cardigan", category: "kids-fashion", subcategory: "Outerwear", price: 1490, stock: 15, rating: 4.6, reviewCount: 38, age: "1–3 Years", short: "A soft layer for early mornings and air-conditioned rooms.", options: [SIZES_KIDS, COLORS_SAGE] },
  // Strollers
  { name: "Lightweight Travel Stroller", category: "baby-strollers", subcategory: "Lightweight", price: 8900, originalPrice: 11500, stock: 6, rating: 4.7, reviewCount: 74, age: "0–1 Year", short: "Folds one-handed and fits in a car boot or rickshaw.", featured: true, best: true },
  { name: "All-Terrain City Stroller", category: "baby-strollers", subcategory: "Travel System", price: 14500, originalPrice: 17900, stock: 4, rating: 4.8, reviewCount: 52, age: "0–1 Year", short: "Suspension wheels tuned for uneven city footpaths." },
  { name: "Classic Reversible Pram", category: "baby-strollers", subcategory: "Prams", price: 12900, stock: 5, rating: 4.5, reviewCount: 29, age: "Newborn", short: "Parent-facing seat with a fully reclining bassinet mode." },
  // Feeding chairs
  { name: "Wooden Grow-With-Me High Chair", category: "feeding-chairs", subcategory: "Wooden Chairs", price: 6900, originalPrice: 8400, stock: 8, rating: 4.9, reviewCount: 61, age: "0–1 Year", short: "Beech wood chair with an adjustable seat and footrest.", featured: true },
  { name: "Foldable Feeding High Chair", category: "feeding-chairs", subcategory: "High Chairs", price: 4500, stock: 14, rating: 4.4, reviewCount: 48, age: "0–1 Year", short: "Slim folding frame for small apartments.", best: true },
  { name: "Portable Booster Seat", category: "feeding-chairs", subcategory: "Booster Seats", price: 2200, originalPrice: 2800, stock: 20, rating: 4.3, reviewCount: 33, age: "1–3 Years", short: "Straps to any dining chair for travel and guests." },
  // Bottles
  { name: "Anti-Colic Feeding Bottle 240ml", category: "baby-bottles", subcategory: "Anti-Colic", price: 690, originalPrice: 890, stock: 60, rating: 4.7, reviewCount: 184, age: "Newborn", short: "Vented nipple system that reduces air intake.", best: true, featured: true },
  { name: "Wide Neck Glass Bottle 150ml", category: "baby-bottles", subcategory: "Glass Bottles", price: 850, stock: 34, rating: 4.6, reviewCount: 97, age: "Newborn", short: "Borosilicate glass with a protective silicone sleeve." },
  { name: "Training Sipper Cup", category: "baby-bottles", subcategory: "Sippers", price: 520, originalPrice: 690, stock: 52, rating: 4.5, reviewCount: 76, age: "1–3 Years", short: "Weighted straw and leak-proof lid for the transition stage.", isNew: true },
  { name: "Silicone Nipple Replacement Pack", category: "baby-bottles", subcategory: "Accessories", price: 320, stock: 80, rating: 4.4, reviewCount: 58, age: "Newborn", short: "Slow-flow spare nipples, pack of three." },
  { name: "Insulated Bottle Warmer Bag", category: "baby-bottles", subcategory: "Accessories", price: 1150, originalPrice: 1450, stock: 17, rating: 4.2, reviewCount: 24, age: "0–1 Year", short: "Keeps a prepared bottle warm for up to four hours." },
  // Silicone
  { name: "Silicone Suction Plate", category: "silicone-sets", subcategory: "Suction Plates", price: 780, originalPrice: 990, stock: 38, rating: 4.8, reviewCount: 143, age: "0–1 Year", short: "Stays locked to the table through determined self-feeding.", options: [COLORS_SAGE], best: true },
  { name: "Complete Silicone Feeding Set", category: "silicone-sets", subcategory: "Full Sets", price: 1890, originalPrice: 2490, stock: 21, rating: 4.9, reviewCount: 167, age: "0–1 Year", short: "Plate, bowl, cup, bib and two spoons in one gift-ready box.", options: [COLORS_SAGE], featured: true, best: true },
  { name: "Roll-Up Silicone Bib", category: "silicone-sets", subcategory: "Bibs", price: 450, stock: 64, rating: 4.6, reviewCount: 88, age: "0–1 Year", short: "Deep crumb catcher, wipes clean in seconds.", options: [COLORS_SAGE] },
  { name: "Silicone Snack Bowl Pair", category: "silicone-sets", subcategory: "Bowls", price: 690, originalPrice: 850, stock: 29, rating: 4.5, reviewCount: 52, age: "1–3 Years", short: "Two nesting bowls, oven and dishwasher safe.", isNew: true },
  // Nursery
  { name: "Muslin Swaddle Blanket Set", category: "nursery-essentials", subcategory: "Blankets", price: 1290, originalPrice: 1590, stock: 33, rating: 4.9, reviewCount: 210, age: "Newborn", short: "Three breathable swaddles that soften with every wash.", featured: true, best: true },
  { name: "Woven Storage Basket", category: "nursery-essentials", subcategory: "Storage", price: 1690, stock: 12, rating: 4.6, reviewCount: 44, age: "Newborn", short: "Handwoven basket for toys, laundry or nursery linen." },
  { name: "Warm Glow Night Lamp", category: "nursery-essentials", subcategory: "Lighting", price: 1350, originalPrice: 1690, stock: 19, rating: 4.7, reviewCount: 63, age: "Newborn", short: "Dimmable, rechargeable light with a soft amber tone.", isNew: true },
  { name: "Fitted Cot Sheet Pair", category: "nursery-essentials", subcategory: "Bedding", price: 1150, stock: 26, rating: 4.5, reviewCount: 39, age: "Newborn", short: "Snug jersey cotton sheets in calm neutral shades.", options: [COLORS_SAGE] },
  // School bags
  { name: "Ergonomic Primary Backpack", category: "school-bags", subcategory: "Backpacks", price: 2290, originalPrice: 2890, stock: 23, rating: 4.7, reviewCount: 95, age: "5+ Years", short: "Padded back panel and chest strap for balanced weight.", featured: true, best: true },
  { name: "Playgroup Mini Backpack", category: "school-bags", subcategory: "Backpacks", price: 1290, stock: 30, rating: 4.6, reviewCount: 57, age: "3–5 Years", short: "Sized small so shoulders stay comfortable all day.", options: [COLORS_SAGE] },
  { name: "Insulated Lunch Bag", category: "school-bags", subcategory: "Lunch Bags", price: 890, originalPrice: 1150, stock: 41, rating: 4.4, reviewCount: 48, age: "3–5 Years", short: "Keeps tiffin warm until lunch break." },
  { name: "Stainless Steel Water Bottle 500ml", category: "school-bags", subcategory: "Water Bottles", price: 950, stock: 47, rating: 4.5, reviewCount: 71, age: "5+ Years", short: "Double-walled bottle that survives school-bag life.", isNew: true },
  // Toys
  { name: "Wooden Stacking Rings", category: "toys-play", subcategory: "Wooden Toys", price: 890, originalPrice: 1150, stock: 36, rating: 4.8, reviewCount: 132, age: "0–1 Year", short: "Non-toxic water-based paint on smooth beech wood.", best: true, featured: true },
  { name: "Natural Wood Rattle", category: "toys-play", subcategory: "Teethers", price: 490, stock: 55, rating: 4.6, reviewCount: 79, age: "Newborn", short: "Lightweight rattle sized for the smallest grip." },
  { name: "Silicone Teether Duo", category: "toys-play", subcategory: "Teethers", price: 550, originalPrice: 720, stock: 48, rating: 4.7, reviewCount: 104, age: "0–1 Year", short: "Textured surfaces that soothe sore gums.", isNew: true },
  { name: "Chunky Wooden Puzzle", category: "toys-play", subcategory: "Puzzles", price: 790, stock: 25, rating: 4.5, reviewCount: 46, age: "1–3 Years", short: "Easy-grip pieces that build early problem solving." },
  { name: "Soft Cuddle Bear", category: "toys-play", subcategory: "Soft Toys", price: 1190, originalPrice: 1490, stock: 20, rating: 4.9, reviewCount: 158, age: "Newborn", short: "Hypoallergenic plush with securely stitched features." },
  // Bath & potty
  { name: "Hooded Bath Towel", category: "bath-potty", subcategory: "Towels", price: 1090, originalPrice: 1350, stock: 32, rating: 4.8, reviewCount: 118, age: "Newborn", short: "Thick cotton terry that dries quickly in humid weather.", best: true },
  { name: "Toddler Potty Training Seat", category: "bath-potty", subcategory: "Potty Seats", price: 1450, stock: 16, rating: 4.5, reviewCount: 62, age: "1–3 Years", short: "Stable base and splash guard for confident training.", options: [COLORS_SAGE] },
  { name: "Foldable Baby Bath Tub", category: "bath-potty", subcategory: "Bath Tubs", price: 2490, originalPrice: 2990, stock: 9, rating: 4.6, reviewCount: 37, age: "Newborn", short: "Collapses flat — ideal for small bathrooms.", featured: true },
  { name: "Floating Bath Toy Set", category: "bath-potty", subcategory: "Bath Toys", price: 640, stock: 44, rating: 4.3, reviewCount: 51, age: "1–3 Years", short: "Mould-free sealed toys that keep bath time playful.", isNew: true },
];

function slugFor(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const categoryNames = new Map(categories.map((c) => [c.slug, c.name]));

export const products: Product[] = seeds.map((seed, index) => {
  const id = `LF-${String(index + 1).padStart(3, "0")}`;
  const catName = categoryNames.get(seed.category) ?? seed.category;
  const discount = discountPercent(seed.price, seed.originalPrice);
  return {
    id,
    slug: slugFor(seed.name),
    name: seed.name,
    shortDescription: seed.short,
    description: `${seed.short} Part of our ${catName.toLowerCase()} range, this piece was selected for everyday use in Bangladeshi homes — easy to clean, comfortable in warm weather and durable enough to pass on. We check each batch before it reaches you, so what arrives matches what you saw online. If the fit or size is not right, our exchange support makes it simple to swap.`,
    category: seed.category,
    categoryName: catName,
    subcategory: seed.subcategory,
    brand: seed.brand ?? "Little Feet",
    price: seed.price,
    ...(seed.originalPrice ? { originalPrice: seed.originalPrice } : {}),
    discount,
    image: seed.category,
    gallery: [seed.category, "editorial", "hero"],
    stock: seed.stock,
    inStock: seed.stock > 0,
    sku: `LFBD-${seed.category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    tags: seed.tags ?? [catName, seed.subcategory, seed.age, "Baby", "Kids"],
    ageGroup: seed.age,
    options: seed.options ?? [],
    features: [
      "Child-safe, non-toxic materials",
      "Tested for everyday durability",
      "Easy to clean and maintain",
      "Sourced from verified suppliers",
    ],
    specifications: {
      Brand: seed.brand ?? "Little Feet",
      Category: catName,
      Subcategory: seed.subcategory,
      "Age Group": seed.age,
      "Country of Origin": "Imported",
      Warranty: "7-day replacement for manufacturing defects",
    },
    care: "Wipe clean with a damp cloth or wash gently with mild soap. Air dry away from direct sunlight. Avoid harsh detergents and bleach.",
    deliveryInfo:
      "Delivered nationwide. Inside Dhaka in 1–2 business days, outside Dhaka in 2–4 business days. Cash on Delivery available.",
    isFeatured: Boolean(seed.featured),
    isBestSeller: Boolean(seed.best),
    isNew: Boolean(seed.isNew),
    isDemo: true, // Demo catalog entry — set to false for your real inventory.
  };
});

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function countByCategory(slug: string): number {
  return products.filter((p) => p.category === slug).length;
}

export const priceBounds = {
  min: Math.min(...products.map((p) => p.price)),
  max: Math.max(...products.map((p) => p.price)),
};
