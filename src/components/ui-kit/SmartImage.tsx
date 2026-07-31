import { useState, type ImgHTMLAttributes } from "react";
import { FALLBACK_IMAGE, resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  imageKey?: string;
  alt: string;
  ratio?: "square" | "portrait" | "wide";
};

const ratios = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
};

/** Image with consistent framing, lazy loading and a graceful fallback. */
export function SmartImage({ imageKey, alt, className, ratio = "square", ...rest }: Props) {
  const [src, setSrc] = useState(() => resolveImage(imageKey));

  return (
    <div className={cn("overflow-hidden rounded-lg bg-cream", ratios[ratio])}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setSrc(FALLBACK_IMAGE)}
        className={cn("h-full w-full object-cover", className)}
        {...rest}
      />
    </div>
  );
}
