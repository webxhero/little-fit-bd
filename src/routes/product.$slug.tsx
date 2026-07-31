import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Heart, RefreshCw, ShieldCheck, ShoppingBag, Truck, Zap } from "lucide-react";
import { getProductBySlug, getRelatedProducts, type Product } from "@/data/products";
import { useShop } from "@/store/shop";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { SmartImage } from "@/components/ui-kit/SmartImage";
import { StarRating } from "@/components/ui-kit/StarRating";
import { PriceDisplay } from "@/components/ui-kit/PriceDisplay";
import { QuantitySelector } from "@/components/ui-kit/QuantitySelector";
import { Button } from "@/components/ui-kit/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { Modal } from "@/components/ui-kit/Modal";
import { testimonials } from "@/data/content";
import { formatBDT } from "@/lib/format";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Product — Little Feet BD" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — Little Feet BD` },
        { name: "description", content: p.shortDescription },
        { property: "og:title", content: p.name },
        { property: "og:description", content: p.shortDescription },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/product/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            sku: p.sku,
            description: p.shortDescription,
            brand: { "@type": "Brand", name: p.brand },
            offers: {
              "@type": "Offer",
              priceCurrency: "BDT",
              price: p.price,
              availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

const tabs = ["Description", "Specifications", "Care", "Shipping & Returns", "Reviews"] as const;

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const { addToCart, toggleWishlist, isWishlisted, addRecentlyViewed } = useShop();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Description");
  const [zoom, setZoom] = useState(false);
  const [variant, setVariant] = useState<Record<string, string>>({});

  useEffect(() => {
    addRecentlyViewed(product.id);
    setQty(1);
    setActive(0);
    setVariant(
      Object.fromEntries(product.options.map((o) => [o.label, o.values[0] ?? ""])) as Record<string, string>,
    );
  }, [product, addRecentlyViewed]);

  const wished = isWishlisted(product.id);
  const gallery = product.gallery.length ? product.gallery : [product.image];
  const related = getRelatedProducts(product);

  const buyNow = () => {
    addToCart(product, qty, Object.keys(variant).length ? variant : undefined, true);
    void navigate({ to: "/checkout" });
  };

  return (
    <div className="container-page pb-28 lg:pb-16">
      <Breadcrumbs
        items={[
          { label: "Shop", to: "/shop" },
          { label: product.categoryName, to: "/category/$slug", params: { slug: product.category } },
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <button type="button" onClick={() => setZoom(true)} className="block w-full" aria-label="Open larger image">
            <SmartImage imageKey={gallery[active] ?? product.image} alt={product.name} ratio="square" />
          </button>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {gallery.map((g, i) => (
              <button key={`${g}-${i}`} type="button" onClick={() => setActive(i)} aria-label={`View image ${i + 1}`} className={i === active ? "rounded-lg ring-2 ring-primary" : "rounded-lg"}>
                <SmartImage imageKey={g} alt={`${product.name} view ${i + 1}`} ratio="square" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.isNew ? <span className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground">New</span> : null}
            {product.discount > 0 ? <span className="rounded-md bg-coral px-2 py-1 text-[11px] font-semibold text-heading">-{product.discount}%</span> : null}
          </div>
          <h1 className="mt-3 font-display text-3xl leading-tight lg:text-4xl">{product.name}</h1>
          <div className="mt-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size={16} />
          </div>
          <PriceDisplay className="mt-4" size="lg" price={product.price} {...(product.originalPrice ? { originalPrice: product.originalPrice } : {})} />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>

          <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
            <li>SKU: <span className="text-heading">{product.sku}</span></li>
            <li>Category: <span className="text-heading">{product.categoryName}</span></li>
            <li>
              Availability:{" "}
              <span className={product.inStock ? "text-success" : "text-destructive"}>
                {product.inStock ? `In stock (${product.stock})` : "Out of stock"}
              </span>
            </li>
          </ul>

          {product.options.map((opt) => (
            <div key={opt.label} className="mt-5">
              <p className="mb-2 text-sm font-medium text-heading">{opt.label}</p>
              <div className="flex flex-wrap gap-2">
                {opt.values.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVariant((prev) => ({ ...prev, [opt.label]: v }))}
                    className={`rounded-lg border px-3 py-2 text-sm ${variant[opt.label] === v ? "border-primary bg-cream text-heading" : "border-border text-muted-foreground"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QuantitySelector value={qty} onChange={setQty} max={Math.max(1, product.stock)} />
            <Button variant="outline" disabled={!product.inStock} onClick={() => addToCart(product, qty, Object.keys(variant).length ? variant : undefined)}>
              <ShoppingBag size={16} /> Add to Cart
            </Button>
            <Button disabled={!product.inStock} onClick={buyNow}>
              <Zap size={16} /> Buy Now
            </Button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={wished}
              aria-label="Save to wishlist"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border"
            >
              <Heart size={17} className={wished ? "fill-coral text-coral" : ""} />
            </button>
          </div>

          <div className="mt-6 space-y-2 rounded-xl border border-border bg-cream p-4 text-sm">
            <p className="flex items-center gap-2 text-heading"><Truck size={15} /> {product.deliveryInfo}</p>
            <p className="flex items-center gap-2 text-heading"><ShieldCheck size={15} /> Cash on Delivery, bKash and Nagad accepted</p>
            <p className="flex items-center gap-2 text-heading"><RefreshCw size={15} /> 3-day easy exchange for size or defects</p>
          </div>
        </div>
      </div>

      <section className="mt-14">
        <div className="hide-scrollbar flex gap-2 overflow-x-auto border-b border-border">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`whitespace-nowrap px-4 py-3 text-sm ${tab === t ? "border-b-2 border-primary font-medium text-heading" : "text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="py-6 text-sm leading-relaxed text-muted-foreground">
          {tab === "Description" ? (
            <div className="max-w-3xl space-y-4">
              <p>{product.description}</p>
              <ul className="list-inside list-disc space-y-1">
                {product.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {tab === "Specifications" ? (
            <dl className="max-w-2xl divide-y divide-border">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-2.5">
                  <dt>{k}</dt>
                  <dd className="text-right text-heading">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {tab === "Care" ? <p className="max-w-2xl">{product.care}</p> : null}
          {tab === "Shipping & Returns" ? (
            <div className="max-w-2xl space-y-3">
              <p>{product.deliveryInfo}</p>
              <p>Delivery charge is ৳70 inside Dhaka and ৳130 outside Dhaka. Orders over {formatBDT(3000)} ship free.</p>
              <p>Exchanges accepted within 3 days of delivery for unused items in original packaging.</p>
            </div>
          ) : null}
          {tab === "Reviews" ? (
            <div className="grid max-w-4xl gap-4 sm:grid-cols-2">
              {testimonials.slice(0, 3).map((t) => (
                <figure key={t.name} className="card-surface p-4">
                  <StarRating rating={t.rating} />
                  <blockquote className="mt-2">“{t.text}”</blockquote>
                  <figcaption className="mt-2 text-xs text-heading">{t.name} — {t.location}</figcaption>
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-8">
          <SectionHeading eyebrow="You may also like" title="Related products" />
          <ProductGrid products={related} />
        </section>
      ) : null}

      <RecentlyViewed excludeId={product.id} />

      {/* Mobile sticky purchase bar */}
      <div className="fixed bottom-14 left-0 right-0 z-[62] flex items-center gap-2 border-t border-border bg-card px-4 py-3 lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">{product.name}</p>
          <p className="text-sm font-semibold text-heading">{formatBDT(product.price)}</p>
        </div>
        <Button size="sm" variant="outline" disabled={!product.inStock} onClick={() => addToCart(product, qty, Object.keys(variant).length ? variant : undefined)}>
          Add
        </Button>
        <Button size="sm" disabled={!product.inStock} onClick={buyNow}>
          Buy Now
        </Button>
      </div>

      <Modal open={zoom} onClose={() => setZoom(false)} title={product.name}>
        <div className="p-5">
          <SmartImage imageKey={gallery[active] ?? product.image} alt={product.name} ratio="square" />
        </div>
      </Modal>

      <p className="sr-only">
        <Link to="/shop">Continue shopping</Link>
      </p>
    </div>
  );
}
