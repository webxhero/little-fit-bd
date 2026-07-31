import type { Product } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  view = "grid",
  columns = 4,
}: {
  products: Product[];
  view?: "grid" | "list";
  columns?: 3 | 4;
}) {
  if (view === "list") {
    return (
      <div className="flex flex-col gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} view="list" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 lg:gap-6",
        columns === 4 ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3",
      )}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function ProductRail({ products, title }: { products: Product[]; title: string }) {
  return (
    <div className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
      {products.map((p) => (
        <div key={p.id} className="w-[70vw] shrink-0 snap-start sm:w-[45vw] lg:w-auto">
          <ProductCard product={p} />
        </div>
      ))}
      <span className="sr-only">{title}</span>
    </div>
  );
}
