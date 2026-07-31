import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Home, Search, ShoppingBag, Store } from "lucide-react";
import { useShop } from "@/store/shop";
import { SearchOverlay } from "@/components/layout/SearchOverlay";

export function BottomNav() {
  const { cartCount, setCartOpen, wishlist } = useShop();
  const [searchOpen, setSearchOpen] = useState(false);

  const itemClass =
    "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 text-[10px] text-heading";

  return (
    <>
      <nav
        aria-label="Mobile quick navigation"
        className="fixed bottom-0 left-0 right-0 z-[60] flex border-t border-border bg-card/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <Link to="/" className={itemClass} activeProps={{ className: `${itemClass} text-primary-dark` }} activeOptions={{ exact: true }}>
          <Home size={19} /> Home
        </Link>
        <Link to="/shop" className={itemClass} activeProps={{ className: `${itemClass} text-primary-dark` }}>
          <Store size={19} /> Shop
        </Link>
        <button type="button" onClick={() => setSearchOpen(true)} className={itemClass} aria-label="Search">
          <Search size={19} /> Search
        </button>
        <Link to="/wishlist" className={`${itemClass} relative`} aria-label={`Wishlist, ${wishlist.length} items`}>
          <Heart size={19} /> Wishlist
          {wishlist.length > 0 ? (
            <span className="absolute right-4 top-1.5 h-2 w-2 rounded-full bg-coral" />
          ) : null}
        </Link>
        <button type="button" onClick={() => setCartOpen(true)} className={`${itemClass} relative`} aria-label={`Cart, ${cartCount} items`}>
          <ShoppingBag size={19} /> Cart
          {cartCount > 0 ? (
            <span className="absolute right-3 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
              {cartCount}
            </span>
          ) : null}
        </button>
      </nav>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
