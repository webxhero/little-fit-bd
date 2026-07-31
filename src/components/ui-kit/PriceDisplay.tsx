import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PriceDisplay({
  price,
  originalPrice,
  size = "md",
  className,
}: {
  price: number;
  originalPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  } as const;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-heading", sizes[size])}>{formatBDT(price)}</span>
      {originalPrice && originalPrice > price ? (
        <span className="text-sm text-muted-foreground line-through">{formatBDT(originalPrice)}</span>
      ) : null}
    </div>
  );
}
