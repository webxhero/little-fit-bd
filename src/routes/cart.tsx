import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "@/store/shop";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { SmartImage } from "@/components/ui-kit/SmartImage";
import { QuantitySelector } from "@/components/ui-kit/QuantitySelector";
import { Button } from "@/components/ui-kit/Button";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { ProductGrid } from "@/components/product/ProductGrid";
import { formatBDT } from "@/lib/format";
import { shipping } from "@/config/site";
import { products } from "@/data/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Little Feet BD" },
      { name: "description", content: "Review the baby and kids essentials in your Little Feet BD cart before checkout." },
      { property: "og:title", content: "Your Cart — Little Feet BD" },
      { property: "og:description", content: "Review your items, apply a coupon and proceed to checkout." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { cartDetailed, subtotal, updateQuantity, removeFromCart, coupon, applyCoupon, removeCoupon, toggleWishlist } = useShop();
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const delivery = subtotal === 0 || subtotal >= shipping.freeThreshold || coupon?.freeShipping ? 0 : shipping.insideDhaka;
  const discount = coupon?.amount ?? 0;
  const total = Math.max(0, subtotal - discount) + delivery;
  const remaining = Math.max(0, shipping.freeThreshold - subtotal);

  if (cartDetailed.length === 0) {
    return (
      <div className="container-page pb-16">
        <Breadcrumbs items={[{ label: "Cart" }]} />
        <EmptyState
          icon={<ShoppingBag size={22} />}
          title="Your cart is empty"
          description="Nothing here yet. Browse the shop and add the essentials you need — your cart is saved on this device."
          action={
            <Link to="/shop">
              <Button>Start shopping</Button>
            </Link>
          }
        />
        <div className="mt-14">
          <h2 className="mb-4 font-display text-2xl">Recommended for you</h2>
          <ProductGrid products={products.filter((p) => p.isBestSeller).slice(0, 4)} />
        </div>
      </div>
    );
  }

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="font-display text-3xl lg:text-4xl">Your cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card-surface divide-y divide-border px-5">
          {cartDetailed.map(({ item, product }) => (
            <div key={item.key} className="flex gap-4 py-5">
              <Link to="/product/$slug" params={{ slug: product.slug }} className="w-24 shrink-0">
                <SmartImage imageKey={product.image} alt={product.name} ratio="square" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to="/product/$slug" params={{ slug: product.slug }} className="line-clamp-2 text-sm font-medium text-heading">
                  {product.name}
                </Link>
                {item.variant ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-muted-foreground">Unit price {formatBDT(product.price)}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <QuantitySelector value={item.quantity} onChange={(v) => updateQuantity(item.key, v)} max={Math.max(1, product.stock)} compact />
                  <button type="button" onClick={() => toggleWishlist(product.id)} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary-dark">
                    <Heart size={14} /> Save for later
                  </button>
                  <button type="button" onClick={() => removeFromCart(item.key)} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold text-heading">{formatBDT(product.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <aside className="card-surface h-fit p-5">
          <h2 className="font-display text-xl">Order summary</h2>
          {remaining > 0 ? (
            <p className="mt-3 rounded-lg bg-cream p-3 text-xs text-heading">
              Add {formatBDT(remaining)} more to get free delivery.
            </p>
          ) : (
            <p className="mt-3 rounded-lg bg-cream p-3 text-xs font-medium text-success">Free delivery unlocked.</p>
          )}

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-heading">{formatBDT(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-heading">−{formatBDT(discount)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery (est.)</span><span className="text-heading">{delivery === 0 ? "Free" : formatBDT(delivery)}</span></div>
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold text-heading">
              <span>Total</span><span>{formatBDT(total)}</span>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="coupon" className="text-xs font-medium text-heading">Coupon code</label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="coupon"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="LITTLE10"
                className="h-11 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none"
              />
              <Button variant="outline" onClick={() => applyCoupon(code)}>Apply</Button>
            </div>
            {coupon ? (
              <button type="button" onClick={removeCoupon} className="mt-2 text-xs text-primary-dark underline">
                Remove coupon {coupon.code}
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-2">
            <Button size="lg" onClick={() => void navigate({ to: "/checkout" })}>Proceed to Checkout</Button>
            <Link to="/shop">
              <Button variant="outline" size="lg" className="w-full">Continue shopping</Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
