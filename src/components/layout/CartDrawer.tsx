import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useShop } from "@/store/shop";
import { SmartImage } from "@/components/ui-kit/SmartImage";
import { Button } from "@/components/ui-kit/Button";
import { formatBDT } from "@/lib/format";
import { shipping } from "@/config/site";
import { useEffect } from "react";

export function CartDrawer() {
  const { cartOpen, setCartOpen, cartDetailed, subtotal, updateQuantity, removeFromCart } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartOpen) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  const remaining = Math.max(0, shipping.freeThreshold - subtotal);
  const progress = Math.min(100, (subtotal / shipping.freeThreshold) * 100);

  return (
    <div className="fixed inset-0 z-[85] flex" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button type="button" aria-label="Close cart" onClick={() => setCartOpen(false)} className="absolute inset-0 bg-heading/30" />
      <aside className="relative z-10 ml-auto flex h-full w-full max-w-md flex-col bg-card shadow-lift">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-xl">Your Cart</h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-secondary"
          >
            <X size={18} />
          </button>
        </header>

        {cartDetailed.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={40} className="text-primary-light" />
            <p className="font-display text-xl">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add a few essentials and they will wait here for you.</p>
            <Button onClick={() => { setCartOpen(false); void navigate({ to: "/shop" }); }}>Start shopping</Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border bg-cream px-5 py-3">
              {remaining > 0 ? (
                <p className="text-xs text-heading">
                  Add <strong>{formatBDT(remaining)}</strong> more for free delivery
                </p>
              ) : (
                <p className="text-xs font-medium text-success">You have unlocked free delivery</p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {cartDetailed.map(({ item, product }) => (
                <li key={item.key} className="flex gap-3 py-4">
                  <Link to="/product/$slug" params={{ slug: product.slug }} onClick={() => setCartOpen(false)} className="w-20 shrink-0">
                    <SmartImage imageKey={product.image} alt={product.name} ratio="square" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-heading">{product.name}</p>
                    {item.variant ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm font-semibold text-heading">{formatBDT(product.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="inline-flex items-center rounded-lg border border-border">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${product.name}`}
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="inline-flex h-9 w-9 items-center justify-center"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${product.name}`}
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="inline-flex h-9 w-9 items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        aria-label={`Remove ${product.name} from cart`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-border px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold text-heading">{formatBDT(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Delivery is calculated at checkout.</p>
              <div className="mt-4 grid gap-2">
                <Button onClick={() => { setCartOpen(false); void navigate({ to: "/checkout" }); }}>Proceed to Checkout</Button>
                <Button variant="outline" onClick={() => { setCartOpen(false); void navigate({ to: "/cart" }); }}>
                  View cart
                </Button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
