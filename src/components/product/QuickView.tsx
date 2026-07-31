import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Zap } from "lucide-react";
import type { Product } from "@/data/products";
import { Modal } from "@/components/ui-kit/Modal";
import { SmartImage } from "@/components/ui-kit/SmartImage";
import { StarRating } from "@/components/ui-kit/StarRating";
import { PriceDisplay } from "@/components/ui-kit/PriceDisplay";
import { QuantitySelector } from "@/components/ui-kit/QuantitySelector";
import { Button } from "@/components/ui-kit/Button";
import { useShop } from "@/store/shop";

export function QuickView({ product, open, onClose }: { product: Product; open: boolean; onClose: () => void }) {
  const { addToCart } = useShop();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  return (
    <Modal open={open} onClose={onClose} title="Quick view">
      <div className="grid gap-6 p-5 sm:grid-cols-2">
        <SmartImage imageKey={product.image} alt={product.name} ratio="square" />
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{product.categoryName}</p>
          <h3 className="mt-1 font-display text-2xl leading-tight">{product.name}</h3>
          <div className="mt-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
          <PriceDisplay
            className="mt-3"
            size="lg"
            price={product.price}
            {...(product.originalPrice ? { originalPrice: product.originalPrice } : {})}
          />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>

          <div className="mt-5 flex items-center gap-3">
            <QuantitySelector value={qty} onChange={setQty} max={Math.max(1, product.stock)} compact />
            <span className="text-xs text-muted-foreground">{product.stock} available</span>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              disabled={!product.inStock}
              onClick={() => {
                addToCart(product, qty);
                onClose();
              }}
            >
              <ShoppingBag size={16} /> Add to Cart
            </Button>
            <Button
              disabled={!product.inStock}
              onClick={() => {
                addToCart(product, qty, undefined, true);
                onClose();
                void navigate({ to: "/checkout" });
              }}
            >
              <Zap size={16} /> Buy Now
            </Button>
          </div>

          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            onClick={onClose}
            className="mt-4 inline-block text-sm font-medium text-primary-dark underline underline-offset-4"
          >
            View full details
          </Link>
        </div>
      </div>
    </Modal>
  );
}
