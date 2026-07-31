import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { products } from "@/data/products";
import { useShop } from "@/store/shop";
import { SmartImage } from "@/components/ui-kit/SmartImage";
import { formatBDT } from "@/lib/format";

const popular = ["Baby shoes", "Silicone set", "Stroller", "School bag", "Muslin swaddle"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { recentSearches, addRecentSearch, clearRecentSearches } = useShop();

  useEffect(() => {
    if (open) {
      setTerm("");
      const id = window.setTimeout(() => inputRef.current?.focus(), 40);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const suggestions = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  }, [term]);

  const submit = (value: string) => {
    const q = value.trim();
    if (!q) return;
    addRecentSearch(q);
    onClose();
    void navigate({ to: "/search", search: { q } });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Search products">
      <button type="button" aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-heading/30" />
      <div className="relative mx-auto w-full max-w-3xl bg-card p-4 shadow-lift sm:mt-24 sm:rounded-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(term);
          }}
          className="flex items-center gap-2 rounded-xl border border-border bg-background px-3"
        >
          <Search size={18} className="text-muted-foreground" aria-hidden="true" />
          <label htmlFor="search-overlay-input" className="sr-only">
            Search products
          </label>
          <input
            id="search-overlay-input"
            ref={inputRef}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search for shoes, bottles, strollers…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="p-2 text-muted-foreground">
            <X size={18} />
          </button>
        </form>

        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {suggestions.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {suggestions.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/product/$slug"
                    params={{ slug: p.slug }}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-cream"
                  >
                    <div className="w-14 shrink-0">
                      <SmartImage imageKey={p.image} alt={p.name} ratio="square" />
                    </div>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-heading">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">{p.categoryName}</span>
                    </span>
                    <span className="text-sm font-semibold text-heading">{formatBDT(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : term.trim() ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No matches for “{term}”. Try a category name like “bottles”.
            </p>
          ) : (
            <div className="grid gap-5 px-2 py-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  <TrendingUp size={13} /> Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popular.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => submit(p)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-heading transition-colors hover:border-primary"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              {recentSearches.length > 0 ? (
                <div>
                  <p className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Clock size={13} /> Recent
                    </span>
                    <button type="button" onClick={clearRecentSearches} className="normal-case tracking-normal underline">
                      Clear
                    </button>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => submit(p)}
                        className="rounded-lg bg-cream px-3 py-1.5 text-xs text-heading"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
