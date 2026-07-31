import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { Button } from "@/components/ui-kit/Button";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { q: string } => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Search Results — Little Feet BD" },
      { name: "description", content: "Search baby and kids essentials across the Little Feet BD catalogue." },
      { property: "og:title", content: "Search — Little Feet BD" },
      { property: "og:description", content: "Find products by name, category or keyword." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/search" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const term = q.trim().toLowerCase();
  const results = term
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.categoryName.toLowerCase().includes(term) ||
          p.subcategory.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term)),
      )
    : [];

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <h1 className="font-display text-3xl lg:text-4xl">Search results</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {term ? `${results.length} results for “${q}”` : "Type a product name, category or keyword to begin."}
      </p>

      <div className="mt-8">
        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <>
            <EmptyState
              icon={<SearchIcon size={22} />}
              title="No products found"
              description="We couldn't match that search. Try a broader term like “bottle”, “shoes” or “toys”."
              action={
                <Link to="/shop">
                  <Button>Browse all products</Button>
                </Link>
              }
            />
            <div className="mt-12">
              <h2 className="mb-4 font-display text-2xl">You might like these</h2>
              <ProductGrid products={products.filter((p) => p.isBestSeller).slice(0, 4)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
