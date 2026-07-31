import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/data/products";
import { ShopCatalogue } from "@/routes/shop";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — Little Feet BD" },
      { name: "description", content: "The newest baby and kids essentials added to the Little Feet BD catalogue." },
      { property: "og:title", content: "New Arrivals — Little Feet BD" },
      { property: "og:description", content: "Freshly added shoes, feeding sets, nursery pieces and toys." },
      { property: "og:url", content: "/new-arrivals" },
    ],
    links: [{ rel: "canonical", href: "/new-arrivals" }],
  }),
  component: () => (
    <ShopCatalogue
      baseProducts={products.filter((p) => p.isNew)}
      title="New arrivals"
      description="Recently added to the shelves — small batches of pieces we tested before listing."
    />
  ),
});
