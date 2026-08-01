import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Phone, Search, ShoppingBag, Truck, User, X, ChevronDown, RefreshCw } from "lucide-react";
import { categories } from "@/data/categories";
import { site } from "@/config/site";
import { useShop } from "@/store/shop";
import { useI18n } from "@/lib/i18n";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { cn } from "@/lib/utils";

const navCategories = [
  "baby-shoes",
  "feeding-chairs",
  "baby-bottles",
  "silicone-sets",
  "school-bags",
  "toys-play",
  "nursery-essentials",
];

export function Header() {
  const { cartCount, wishlist, setCartOpen, user } = useShop();
  const { lang, setLang } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    void navigate({ to: "/search", search: { q } });
    setTerm("");
  };

  return (
    <>
      <div className="bg-heading text-primary-foreground">
        <div className="container-page flex h-10 items-center justify-between gap-4 text-[12px]">
          <div className="hide-scrollbar flex items-center gap-5 overflow-x-auto whitespace-nowrap">
            <span className="flex items-center gap-1.5">
              <Truck size={13} /> {site.delivery}
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">Cash on Delivery available</span>
            <span className="hidden items-center gap-1.5 md:flex">
              <RefreshCw size={13} /> Easy exchange support
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <a href={site.phoneHref} className="hidden items-center gap-1.5 hover:underline sm:flex">
              <Phone size={13} /> {site.phone}
            </a>
            <div className="flex items-center gap-1" role="group" aria-label="Language">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={cn("rounded px-1.5 py-0.5", lang === "en" ? "bg-primary-foreground/20 font-medium" : "opacity-70")}
              >
                English
              </button>
              <span aria-hidden="true">|</span>
              <button
                type="button"
                onClick={() => setLang("bn")}
                className={cn("rounded px-1.5 py-0.5", lang === "bn" ? "bg-primary-foreground/20 font-medium" : "opacity-70")}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container-page flex h-16 items-center gap-4 lg:h-20">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2">

  <Image
    src="/logo.png"
    alt="Little Feet Bangladesh"
    width={40}
    height={40}
    className="h-10 w-10 object-contain"
  />

  <span className="hidden leading-none sm:block">
    <span className="block font-display text-xl text-heading">
      Little Feet
    </span>
    <span className="block text-[10px] uppercase tracking-[0.28em] text-primary-dark">
      Bangladesh
    </span>
  </span>

</Link>

          <form onSubmit={submitSearch} className="mx-auto hidden w-full max-w-xl items-center gap-2 rounded-xl border border-border bg-card px-3 lg:flex">
            <Search size={17} className="text-muted-foreground" aria-hidden="true" />
            <label htmlFor="header-search" className="sr-only">
              Search products
            </label>
            <input
              id="header-search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search for baby shoes, bottles, strollers…"
              className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="text-sm font-medium text-primary-dark">
              Search
            </button>
          </form>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-secondary lg:hidden"
            >
              <Search size={19} />
            </button>
            <Link
              to={user ? "/account" : "/login"}
              aria-label={user ? "Your account" : "Log in"}
              className="hidden h-11 w-11 items-center justify-center rounded-lg hover:bg-secondary sm:inline-flex"
            >
              <User size={19} />
            </Link>
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlist.length} items`}
              className="relative hidden h-11 w-11 items-center justify-center rounded-lg hover:bg-secondary sm:inline-flex"
            >
              <Heart size={19} />
              {wishlist.length > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-semibold text-heading">
                  {wishlist.length}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${cartCount} items`}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-secondary"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 ? (
                <span className="absolute right-0.5 top-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <nav aria-label="Primary" className="hidden border-t border-border lg:block">
          <div className="container-page flex h-12 items-center gap-6 text-sm">
            <Link to="/" className="text-heading transition-colors hover:text-primary-dark" activeProps={{ className: "font-medium text-primary-dark" }} activeOptions={{ exact: true }}>
              Home
            </Link>
            <div className="relative" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
              <Link
                to="/shop"
                className="flex items-center gap-1 text-heading transition-colors hover:text-primary-dark"
                aria-expanded={megaOpen}
              >
                Shop <ChevronDown size={14} />
              </Link>
              {megaOpen ? (
                <div className="absolute left-0 top-full z-50 w-[720px] rounded-2xl border border-border bg-card p-6 shadow-lift">
                  <div className="grid grid-cols-3 gap-x-8 gap-y-5">
                    {categories.map((c) => (
                      <div key={c.slug}>
                        <Link
                          to="/category/$slug"
                          params={{ slug: c.slug }}
                          className="text-sm font-medium text-heading hover:text-primary-dark"
                        >
                          {c.name}
                        </Link>
                        <ul className="mt-1.5 space-y-1">
                          {c.subcategories.slice(0, 3).map((s) => (
                            <li key={s}>
                              <Link
                                to="/category/$slug"
                                params={{ slug: c.slug }}
                                className="text-xs text-muted-foreground hover:text-primary-dark"
                              >
                                {s}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            {navCategories.map((slug) => {
              const c = categories.find((x) => x.slug === slug);
              if (!c) return null;
              return (
                <Link
                  key={slug}
                  to="/category/$slug"
                  params={{ slug }}
                  className="whitespace-nowrap text-heading transition-colors hover:text-primary-dark"
                  activeProps={{ className: "font-medium text-primary-dark" }}
                >
                  {c.name}
                </Link>
              );
            })}
            <Link to="/new-arrivals" className="whitespace-nowrap text-heading hover:text-primary-dark">
              New Arrivals
            </Link>
            <Link to="/offers" className="whitespace-nowrap font-medium text-coral hover:opacity-80">
              Offers
            </Link>
          </div>
        </nav>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-[95] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-heading/40" />
          <div className="relative flex h-full w-[86%] max-w-sm flex-col bg-card shadow-lift">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-display text-xl">Menu</span>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="inline-flex h-11 w-11 items-center justify-center rounded-lg">
                <X size={18} />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-1 text-sm">
                {[
                  { to: "/", label: "Home" },
                  { to: "/shop", label: "Shop All" },
                  { to: "/new-arrivals", label: "New Arrivals" },
                  { to: "/offers", label: "Offers" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-heading hover:bg-cream">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mb-2 mt-5 px-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">Categories</p>
              <ul className="space-y-1 text-sm">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/category/$slug"
                      params={{ slug: c.slug }}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-3 text-heading hover:bg-cream"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mb-2 mt-5 px-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">Account</p>
              <ul className="space-y-1 text-sm">
                {[
                  { to: user ? "/account" : "/login", label: user ? "My Account" : "Login / Register" },
                  { to: "/track-order", label: "Track Order" },
                  { to: "/contact", label: "Contact Us" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-heading hover:bg-cream">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-border px-5 py-4 text-xs text-muted-foreground">
              <a href={site.phoneHref} className="flex items-center gap-2 text-heading">
                <Phone size={14} /> {site.phone}
              </a>
              <p className="mt-1">{site.hours}</p>
            </div>
          </div>
        </div>
      ) : null}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
