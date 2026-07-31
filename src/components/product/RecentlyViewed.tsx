import { products } from "@/data/products";
import { useShop } from "@/store/shop";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const { recentlyViewed } = useShop();
  const list = recentlyViewed
    .filter((id) => id !== excludeId)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p))
    .slice(0, 4);

  if (list.length === 0) return null;

  return (
    <section className="container-page section-y pt-0">
      <SectionHeading eyebrow="Pick up where you left off" title="Recently viewed" />
      <ProductGrid products={list} />
    </section>
  );
}
