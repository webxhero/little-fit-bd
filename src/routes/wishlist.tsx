import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useShop } from "@/store/shop";
import { products } from "@/data/products";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { Button } from "@/components/ui-kit/Button";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Little Feet BD" },
      { name: "description", content: "Products you have saved at Little Feet BD, kept on this device." },
      { property: "og:title", content: "Wishlist — Little Feet BD" },
      { property: "og:description", content: "Your saved baby and kids essentials." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/wishlist" }],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useShop();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <h1 className="font-display text-3xl lg:text-4xl">Your wishlist</h1>
      <p className="mt-2 text-sm text-muted-foreground">{items.length} saved {items.length === 1 ? "item" : "items"}</p>

      <div className="mt-8">
        {items.length === 0 ? (
          <EmptyState
            icon={<Heart size={22} />}
            title="No saved items yet"
            description="Tap the heart on any product to keep it here while you decide."
            action={<Link to="/shop"><Button>Browse products</Button></Link>}
          />
        ) : (
          <ProductGrid products={items} />
        )}
      </div>
    </div>
  );
}
