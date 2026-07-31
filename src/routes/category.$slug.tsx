import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCategory, type Category } from "@/data/categories";
import { products } from "@/data/products";
import { ShopCatalogue } from "@/routes/shop";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Category — Little Feet BD" }, { name: "robots", content: "noindex" }] };
    const { category } = loaderData;
    return {
      meta: [
        { title: `${category.name} — Little Feet BD` },
        { name: "description", content: category.description },
        { property: "og:title", content: `${category.name} — Little Feet BD` },
        { property: "og:description", content: category.description },
        { property: "og:url", content: `/category/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData() as { category: Category };
  return (
    <ShopCatalogue
      baseProducts={products.filter((p) => p.category === category.slug)}
      title={category.name}
      description={category.description}
    />
  );
}
