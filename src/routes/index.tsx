import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { brandImages } from "@/lib/images";
import { categories, ageGroups } from "@/data/categories";
import { products, countByCategory } from "@/data/products";
import { testimonials } from "@/data/content";
import { SectionHeading } from "@/components/ui-kit/SectionHeading";
import { SmartImage } from "@/components/ui-kit/SmartImage";
import { ProductGrid } from "@/components/product/ProductGrid";
import { TrustBadges } from "@/components/layout/TrustBadges";
import { StarRating } from "@/components/ui-kit/StarRating";
import { Button } from "@/components/ui-kit/Button";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Little Feet BD — Baby & Kids Essentials, Delivered Nationwide" },
      {
        name: "description",
        content:
          "Shop baby shoes, feeding sets, bottles, strollers, nursery items, school bags and toys at Little Feet BD. Cash on Delivery across Bangladesh.",
      },
      { property: "og:title", content: "Little Feet BD — Baby & Kids Essentials" },
      { property: "og:description", content: "Everyday essentials thoughtfully selected for growing kids." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const featured = products.find((p) => p.isFeatured) ?? products[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-primary-dark">
              <Sparkles size={13} /> Baby & kids essentials
            </p>
            <h1 className="font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">Little Steps, Big Adventures</h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Everyday essentials thoughtfully selected for growing kids — soft shoes, safe feeding sets and calm
              nursery pieces, delivered anywhere in Bangladesh.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/shop">
                <Button size="lg">
                  Shop Now <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/shop" hash="categories">
                <Button size="lg" variant="outline">
                  Explore Categories
                </Button>
              </Link>
            </div>
            <dl className="mt-9 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
              {[
                ["4.8/5", "Parent rating"],
                ["64", "Districts covered"],
                ["3-day", "Easy exchange"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl text-heading">{value}</dt>
                  <dd className="text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-primary-light/30 blur-2xl" aria-hidden="true" />
            <div className="overflow-hidden rounded-3xl border border-border shadow-lift">
              <img
                src={brandImages.hero}
                alt="Baby shoes, silicone feeding set and a muslin blanket arranged on a cream background"
                width={1536}
                height={1152}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="container-page section-y scroll-mt-24">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by category"
          description="From first walkers to school bags — everything organised the way parents actually shop."
          action={
            <Link to="/shop" className="text-sm font-medium text-primary-dark underline underline-offset-4">
              View all products
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-6">
          {categories.slice(0, 10).map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group card-surface overflow-hidden p-3 transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <SmartImage imageKey={c.image} alt={c.name} ratio="square" className="transition-transform duration-500 group-hover:scale-105" />
              <p className="mt-3 text-sm font-medium text-heading">{c.name}</p>
              <p className="text-xs text-muted-foreground">{countByCategory(c.slug)} products</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary-dark">
                Explore <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-cream">
        <div className="container-page section-y">
          <SectionHeading eyebrow="Loved by parents" title="Best sellers" description="The pieces our customers reorder and recommend." />
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      {/* Promo banner */}
      <section className="container-page section-y">
        <div className="grid overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center gap-4 p-8 lg:order-1 lg:p-14">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-dark">Seasonal bundle</p>
            <h2 className="font-display text-3xl leading-tight lg:text-4xl">The Mealtime Set — save up to 24%</h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Suction plate, bowl, bib and spoons in food-grade silicone. Built for the messy, joyful months of
              self-feeding, and easy to rinse clean afterwards.
            </p>
            <div>
              <Link to="/category/$slug" params={{ slug: "silicone-sets" }}>
                <Button size="lg">Shop the bundle</Button>
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <SmartImage imageKey="silicone-sets" alt="Sage green silicone feeding set" ratio="wide" className="h-full" />
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="container-page section-y pt-0">
        <SectionHeading
          eyebrow="Just in"
          title="New arrivals"
          action={
            <Link to="/new-arrivals" className="text-sm font-medium text-primary-dark underline underline-offset-4">
              See all new arrivals
            </Link>
          }
        />
        <ProductGrid products={newArrivals} />
      </section>

      {/* Shop by age */}
      <section className="bg-cream">
        <div className="container-page section-y">
          <SectionHeading eyebrow="The right fit" title="Shop by age" align="center" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {ageGroups.map((age) => (
              <Link
                key={age}
                to="/shop"
                search={{ age }}
                className="card-surface flex h-24 flex-col items-center justify-center gap-1 text-center transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="font-display text-lg text-heading">{age}</span>
                <span className="text-xs text-muted-foreground">Shop now</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="container-page section-y">
        <SectionHeading eyebrow="Why Little Feet BD" title="Care in every detail" align="center" />
        <TrustBadges />
      </section>

      {/* Featured editorial */}
      {featured ? (
        <section className="bg-cream">
          <div className="container-page section-y grid items-center gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-border">
              <img src={brandImages.editorial} alt="A calm nursery corner with woven baskets and folded blankets" loading="lazy" width={1600} height={900} className="w-full object-cover" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-dark">Featured collection</p>
              <h2 className="mt-3 font-display text-3xl leading-tight lg:text-4xl">A nursery that feels calm</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Muted tones, breathable fabrics and storage that hides the clutter. Our nursery range is chosen so a
                small Dhaka bedroom can still feel restful — for the baby and for you.
              </p>
              <div className="mt-6">
                <Link to="/category/$slug" params={{ slug: "nursery-essentials" }}>
                  <Button variant="dark" size="lg">
                    Explore nursery
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Reviews */}
      <section className="container-page section-y">
        <SectionHeading eyebrow="Customer stories" title="What parents say" align="center" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <figure key={t.name} className="card-surface flex h-full flex-col p-5">
              <StarRating rating={t.rating} />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">“{t.text}”</blockquote>
              <figcaption className="mt-4 text-sm font-medium text-heading">
                {t.name}
                <span className="block text-xs font-normal text-muted-foreground">{t.location}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="container-page section-y pt-0">
        <SectionHeading eyebrow="@littlefeetbd" title="From our little community" align="center" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((c) => (
            <SmartImage key={c.slug} imageKey={c.image} alt={`Lifestyle photo — ${c.name}`} ratio="square" />
          ))}
        </div>
      </section>

      <RecentlyViewed />
    </>
  );
}
