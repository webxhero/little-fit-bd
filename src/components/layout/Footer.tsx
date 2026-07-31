import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import { Newsletter } from "@/components/layout/Newsletter";

const customerLinks = [
  { to: "/track-order", label: "Track Order" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact Us" },
  { to: "/account", label: "My Account" },
  { to: "/wishlist", label: "Wishlist" },
];

const policyLinks = [
  { to: "/shipping", label: "Shipping & Delivery" },
  { to: "/returns", label: "Return & Refund" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/about", label: "About Us" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-cream pb-24 lg:pb-0">
      <div className="container-page py-14">
        <Newsletter />

        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-2xl text-heading">Little Feet BD</span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.tagline}. Everyday baby and kids essentials, selected with care and delivered across Bangladesh.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              <li>
                <a href={site.phoneHref} className="flex items-center gap-2 text-heading hover:text-primary-dark">
                  <Phone size={15} /> {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-heading hover:text-primary-dark">
                  <Mail size={15} /> {site.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin size={15} className="mt-0.5 shrink-0" /> {site.address}
              </li>
            </ul>
            <div className="mt-5 flex gap-2">
              {[
                { href: site.social.facebook, icon: Facebook, label: "Facebook" },
                { href: site.social.instagram, icon: Instagram, label: "Instagram" },
                { href: site.social.messenger, icon: MessageCircle, label: "Messenger" },
                { href: site.social.whatsapp, icon: Send, label: "WhatsApp" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-heading transition-colors hover:border-primary hover:text-primary-dark"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-heading">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {categories.slice(0, 7).map((c) => (
                <li key={c.slug}>
                  <Link to="/category/$slug" params={{ slug: c.slug }} className="text-muted-foreground hover:text-primary-dark">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-heading">Customer Care</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {customerLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground hover:text-primary-dark">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-heading">Information</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {policyLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground hover:text-primary-dark">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs uppercase tracking-[0.14em] text-muted-foreground">We accept</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Cash on Delivery", "bKash", "Nagad", "Card (soon)"].map((p) => (
                <span key={p} className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] text-heading">
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">Delivery partners</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Steadfast", "Pathao", "RedX"].map((p) => (
                <span key={p} className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] text-heading">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Little Feet BD. All rights reserved.</p>
          <p>{site.developerCredit}</p>
        </div>
      </div>
    </footer>
  );
}
