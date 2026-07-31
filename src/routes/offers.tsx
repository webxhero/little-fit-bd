import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/data/products";
import { ShopCatalogue } from "@/routes/shop";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Special Offers & Discounts — Little Feet BD" },
      { name: "description", content: "Discounted baby and kids essentials at Little Feet BD, with Cash on Delivery nationwide." },
      { property: "og:title", content: "Special Offers — Little Feet BD" },
      { property: "og:description", content: "Current discounts across shoes, feeding, nursery and play." },
      { property: "og:url", content: "/offers" },
    ],
    links: [{ rel: "canonical", href: "/offers" }],
  }),
  component: () => (
    <ShopCatalogue
      baseProducts={products.filter((p) => p.discount > 0)}
      title="Special offers"
      description="Current price drops across the catalogue. Use code LITTLE10 at checkout for an extra 10% on orders over ৳1,500."
    />
  ),
});
