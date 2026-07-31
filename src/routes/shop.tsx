import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { products, priceBounds, type Product } from "@/data/products";
import { categories, ageGroups } from "@/data/categories";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui-kit/Button";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { formatBDT } from "@/lib/format";

type ShopSearch = { age?: string; category?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    ...(typeof search["age"] === "string" ? { age: search["age"] } : {}),
    ...(typeof search["category"] === "string" ? { category: search["category"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Shop All Baby & Kids Products — Little Feet BD" },
      { name: "description", content: "Browse the full Little Feet BD catalogue — shoes, feeding, nursery, bags and toys with filters for age, price and rating." },
      { property: "og:title", content: "Shop All — Little Feet BD" },
      { property: "og:description", content: "Filter baby and kids essentials by category, age, price and rating." },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: ShopPage,
});

const sortOptions = [
  "Featured",
  "Best Selling",
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
  "Highest Rated",
  "Biggest Discount",
] as const;

export function ShopCatalogue({
  baseProducts,
  title,
  description,
  initialAge,
}: {
  baseProducts: Product[];
  title: string;
  description: string;
  initialAge?: string;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Featured");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [ages, setAges] = useState<string[]>(initialAge ? [initialAge] : []);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [visible, setVisible] = useState(12);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggle = (list: string[], value: string, set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const filtered = useMemo(() => {
    let list = baseProducts.filter((p) => {
      if (selectedCats.length && !selectedCats.includes(p.category)) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && !p.inStock) return false;
      if (minRating && p.rating < minRating) return false;
      if (ages.length && !ages.includes(p.ageGroup)) return false;
      if (onlyDiscounted && p.discount <= 0) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "Best Selling":
          return Number(b.isBestSeller) - Number(a.isBestSeller) || b.reviewCount - a.reviewCount;
        case "Newest":
          return Number(b.isNew) - Number(a.isNew);
        case "Price: Low to High":
          return a.price - b.price;
        case "Price: High to Low":
          return b.price - a.price;
        case "Highest Rated":
          return b.rating - a.rating;
        case "Biggest Discount":
          return b.discount - a.discount;
        default:
          return Number(b.isFeatured) - Number(a.isFeatured);
      }
    });
    return list;
  }, [baseProducts, selectedCats, maxPrice, inStockOnly, minRating, ages, onlyDiscounted, sort]);

  const activeChips = [
    ...selectedCats.map((c) => ({ label: categories.find((x) => x.slug === c)?.name ?? c, clear: () => toggle(selectedCats, c, setSelectedCats) })),
    ...ages.map((a) => ({ label: a, clear: () => toggle(ages, a, setAges) })),
    ...(inStockOnly ? [{ label: "In stock", clear: () => setInStockOnly(false) }] : []),
    ...(onlyDiscounted ? [{ label: "On sale", clear: () => setOnlyDiscounted(false) }] : []),
    ...(minRating ? [{ label: `${minRating}★ & up`, clear: () => setMinRating(0) }] : []),
    ...(maxPrice < priceBounds.max ? [{ label: `Under ${formatBDT(maxPrice)}`, clear: () => setMaxPrice(priceBounds.max) }] : []),
  ];

  const clearAll = () => {
    setSelectedCats([]);
    setAges([]);
    setInStockOnly(false);
    setOnlyDiscounted(false);
    setMinRating(0);
    setMaxPrice(priceBounds.max);
  };

  const filterPanel = (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-heading">Category</legend>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c.slug} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={selectedCats.includes(c.slug)} onChange={() => toggle(selectedCats, c.slug, setSelectedCats)} className="h-4 w-4 accent-[var(--primary)]" />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-heading">Max price</legend>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="w-full accent-[var(--primary)]"
        />
        <p className="mt-1 text-xs text-muted-foreground">Up to {formatBDT(maxPrice)}</p>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-heading">Age group</legend>
        <div className="space-y-2">
          {ageGroups.map((a) => (
            <label key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={ages.includes(a)} onChange={() => toggle(ages, a, setAges)} className="h-4 w-4 accent-[var(--primary)]" />
              {a}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-heading">Rating</legend>
        <div className="space-y-2">
          {[4, 3, 0].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} className="h-4 w-4 accent-[var(--primary)]" />
              {r === 0 ? "All ratings" : `${r}★ & up`}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-heading">Availability & offers</legend>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
          In stock only
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={onlyDiscounted} onChange={(e) => setOnlyDiscounted(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
          Discounted items
        </label>
      </fieldset>

      <Button variant="outline" className="w-full" onClick={clearAll}>
        Clear all filters
      </Button>
    </div>
  );

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: title }]} />
      <header className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="card-surface sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto p-5">{filterPanel}</div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{filtered.length} products</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setDrawerOpen(true)}>
                <SlidersHorizontal size={15} /> Filters
              </Button>
              <label className="sr-only" htmlFor="sort">Sort products</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as (typeof sortOptions)[number])}
                className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-heading"
              >
                {sortOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <div className="hidden items-center rounded-lg border border-border sm:flex">
                <button type="button" aria-label="Grid view" onClick={() => setView("grid")} className={`inline-flex h-10 w-10 items-center justify-center ${view === "grid" ? "text-primary-dark" : "text-muted-foreground"}`}>
                  <LayoutGrid size={16} />
                </button>
                <button type="button" aria-label="List view" onClick={() => setView("list")} className={`inline-flex h-10 w-10 items-center justify-center ${view === "list" ? "text-primary-dark" : "text-muted-foreground"}`}>
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {activeChips.length > 0 ? (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button key={chip.label} type="button" onClick={chip.clear} className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs text-heading">
                  {chip.label} <X size={12} />
                </button>
              ))}
              <button type="button" onClick={clearAll} className="text-xs text-primary-dark underline underline-offset-4">
                Clear all
              </button>
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <EmptyState
              title="No products match these filters"
              description="Try widening the price range or clearing a filter to see more of the catalogue."
              action={<Button onClick={clearAll}>Clear filters</Button>}
            />
          ) : (
            <>
              <ProductGrid products={filtered.slice(0, visible)} view={view} columns={3} />
              {visible < filtered.length ? (
                <div className="mt-10 flex justify-center">
                  <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + 12)}>
                    Load more products
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-[85] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" aria-label="Close filters" onClick={() => setDrawerOpen(false)} className="absolute inset-0 bg-heading/40" />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl">Filters</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close filters" className="inline-flex h-11 w-11 items-center justify-center rounded-lg">
                <X size={18} />
              </button>
            </div>
            {filterPanel}
            <Button className="mt-4 w-full" onClick={() => setDrawerOpen(false)}>
              Show {filtered.length} products
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ShopPage() {
  const { age } = Route.useSearch();
  return (
    <ShopCatalogue
      baseProducts={products}
      title="Shop all essentials"
      description="Every product in one place — filter by category, age, price and rating to find exactly what your child needs."
      {...(age ? { initialAge: age } : {})}
    />
  );
}
