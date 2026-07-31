import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, Heart, ShoppingBag, Zap } from "lucide-react";
import type { Product } from "@/data/products";
import { useShop } from "@/store/shop";
import { SmartImage } from "@/components/ui-kit/SmartImage";
import { StarRating } from "@/components/ui-kit/StarRating";
import { PriceDisplay } from "@/components/ui-kit/PriceDisplay";
import { Button } from "@/components/ui-kit/Button";
import { QuickView } from "@/components/product/QuickView";
import { cn } from "@/lib/utils";

export function ProductCard({ product, view = "grid" }: { product: Product; view?: "grid" | "list" }) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const navigate = useNavigate();
  const [quickView, setQuickView] = useState(false);
  const [hover, setHover] = useState(false);
  const wished = isWishlisted(product.id);
  const secondary = product.gallery[1] ?? product.image;

  const buyNow = () => {
    addToCart(product, 1, undefined, true);
    void navigate({ to: "/checkout" });
  };

  return (
    <>
      <article
        className={cn(
          "group card-surface relative flex overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
          view === "list" ? "flex-col sm:flex-row" : "flex-col",
        )}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={cn("relative", view === "list" ? "sm:w-56 sm:shrink-0" : "")}>
          <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name} className="block">
            <SmartImage
              imageKey={hover ? secondary : product.image}
              alt={`${product.name} — ${product.categoryName}`}
              ratio="square"
              className="transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </Link>

          <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
            {product.discount > 0 ? (
              <span className="rounded-md bg-coral px-2 py-1 text-[11px] font-semibold text-heading">
                -{product.discount}%
              </span>
            ) : null}
            {product.isNew ? (
              <span className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground">
                New
              </span>
            ) : null}
            {!product.inStock ? (
              <span className="rounded-md bg-heading px-2 py-1 text-[11px] font-semibold text-primary-foreground">
                Sold out
              </span>
            ) : null}
          </div>

          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
              aria-pressed={wished}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/90 text-heading transition-colors hover:text-primary-dark"
            >
              <Heart size={16} className={wished ? "fill-coral text-coral" : ""} />
            </button>
            <button
              type="button"
              onClick={() => setQuickView(true)}
              aria-label={`Quick view ${product.name}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/90 text-heading transition-colors hover:text-primary-dark"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{product.categoryName}</p>
          <h3 className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-heading">
            <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:text-primary-dark">
              {product.name}
            </Link>
          </h3>

          {view === "list" ? (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
          ) : null}

          <div className="mt-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <PriceDisplay price={product.price} {...(product.originalPrice ? { originalPrice: product.originalPrice } : {})} />
            <span className={cn("text-[11px] font-medium", product.inStock ? "text-success" : "text-destructive")}>
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!product.inStock}
              onClick={() => addToCart(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag size={15} />
              <span className="truncate">Add</span>
            </Button>
            <Button size="sm" disabled={!product.inStock} onClick={buyNow} aria-label={`Buy ${product.name} now`}>
              <Zap size={15} />
              <span className="truncate">Buy Now</span>
            </Button>
          </div>
        </div>
      </article>

      <QuickView product={product} open={quickView} onClose={() => setQuickView(false)} />
    </>
  );
}
