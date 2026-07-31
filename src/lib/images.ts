/**
 * Centralized image configuration.
 *
 * Every product image in the catalog resolves through this file, so you can
 * swap demo imagery for your own photography without touching any component.
 *
 * HOW TO REPLACE AN IMAGE
 * 1. Drop your file in `src/assets/` (e.g. `src/assets/my-shoe.jpg`).
 * 2. Import it below and point the matching key at it.
 * 3. Or set an absolute https URL string — both work.
 */

import hero from "@/assets/hero.jpg";
import editorial from "@/assets/editorial.jpg";
import babyShoes from "@/assets/cat-baby-shoes.jpg";
import kidsFashion from "@/assets/cat-kids-fashion.jpg";
import strollers from "@/assets/cat-strollers.jpg";
import feedingChairs from "@/assets/cat-feeding-chairs.jpg";
import bottles from "@/assets/cat-bottles.jpg";
import silicone from "@/assets/cat-silicone.jpg";
import nursery from "@/assets/cat-nursery.jpg";
import schoolBags from "@/assets/cat-school-bags.jpg";
import toys from "@/assets/cat-toys.jpg";
import bath from "@/assets/cat-bath.jpg";

export const brandImages = {
  hero,
  editorial,
} as const;

/** Key -> image source used by the product catalog. */
export const imageLibrary: Record<string, string> = {
  "baby-shoes": babyShoes,
  "kids-fashion": kidsFashion,
  "baby-strollers": strollers,
  "feeding-chairs": feedingChairs,
  "baby-bottles": bottles,
  "silicone-sets": silicone,
  "nursery-essentials": nursery,
  "school-bags": schoolBags,
  "toys-play": toys,
  "bath-potty": bath,
  editorial,
  hero,
};

/** Shown when an image key is missing or a remote URL fails to load. */
export const FALLBACK_IMAGE: string = nursery;

export function resolveImage(key?: string): string {
  if (!key) return FALLBACK_IMAGE;
  if (key.startsWith("http") || key.startsWith("/")) return key;

  return imageLibrary[key] ?? FALLBACK_IMAGE;
}
