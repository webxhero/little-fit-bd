import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, MapPin, Package, User as UserIcon, Heart } from "lucide-react";
import { useShop } from "@/store/shop";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { Button } from "@/components/ui-kit/Button";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { formatBDT, formatDate } from "@/lib/format";
import { divisions } from "@/config/site";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — Little Feet BD" },
      { name: "description", content: "Manage your Little Feet BD profile, saved addresses and order history." },
      { property: "og:title", content: "My Account — Little Feet BD" },
      { property: "og:description", content: "Profile, addresses and orders in one dashboard." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

const field = "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none";
const tabs = ["Dashboard", "Orders", "Addresses", "Profile"] as const;

function AccountPage() {
  const { user, logout, orders, saveAddress, removeAddress, updateProfile, wishlist, ready } = useShop();
  const navigate = useNavigate();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Dashboard");
  const [profile, setProfile] = useState({ name: user?.name ?? "", phone: user?.phone ?? "", email: user?.email ?? "" });
  const [addr, setAddr] = useState({ label: "Home", fullName: "", phone: "", division: "Dhaka", district: "Dhaka", area: "", address: "" });

  if (!ready) return <div className="container-page py-20 text-center text-sm text-muted-foreground">Loading…</div>;

  if (!user) {
    return (
      <div className="container-page pb-16">
        <Breadcrumbs items={[{ label: "Account" }]} />
        <EmptyState
          icon={<UserIcon size={22} />}
          title="Please log in"
          description="Log in or create an account to see your orders, addresses and profile details."
          action={
            <div className="flex gap-2">
              <Link to="/login"><Button>Log in</Button></Link>
              <Link to="/register"><Button variant="outline">Register</Button></Link>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: "Account" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Hello, {user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => { logout(); void navigate({ to: "/" }); }}>
          <LogOut size={15} /> Log out
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Account sections" className="card-surface h-fit p-2">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`block w-full rounded-lg px-4 py-3 text-left text-sm ${tab === t ? "bg-cream font-medium text-heading" : "text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </nav>

        <div>
          {tab === "Dashboard" ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Package, label: "Orders", value: orders.length },
                { icon: Heart, label: "Wishlist items", value: wishlist.length },
                { icon: MapPin, label: "Saved addresses", value: user.addresses.length },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="card-surface p-5">
                  <Icon size={18} className="text-primary-dark" />
                  <p className="mt-3 font-display text-3xl text-heading">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          ) : null}

          {tab === "Orders" ? (
            orders.length === 0 ? (
              <EmptyState title="No orders yet" description="Your order history will appear here after your first purchase." action={<Link to="/shop"><Button>Start shopping</Button></Link>} />
            ) : (
              <ul className="space-y-3">
                {orders.map((o) => (
                  <li key={o.id} className="card-surface flex flex-wrap items-center justify-between gap-3 p-5">
                    <div>
                      <p className="text-sm font-medium text-heading">{o.id}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)} · {o.items.length} items · {o.status}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-heading">{formatBDT(o.total)}</span>
                      <Link to="/order/$orderId" params={{ orderId: o.id }}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : null}

          {tab === "Addresses" ? (
            <div className="space-y-4">
              {user.addresses.map((a) => (
                <div key={a.id} className="card-surface flex items-start justify-between gap-4 p-5 text-sm">
                  <div>
                    <p className="font-medium text-heading">{a.label} · {a.fullName}</p>
                    <p className="text-muted-foreground">{a.address}, {a.area}, {a.district}, {a.division}</p>
                    <p className="text-muted-foreground">{a.phone}</p>
                  </div>
                  <button type="button" onClick={() => removeAddress(a.id)} className="text-xs text-destructive underline">Remove</button>
                </div>
              ))}
              <form
                className="card-surface grid gap-3 p-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveAddress(addr);
                  setAddr({ ...addr, fullName: "", phone: "", area: "", address: "" });
                }}
              >
                <h2 className="font-display text-xl sm:col-span-2">Add a new address</h2>
                <input className={field} placeholder="Label (Home, Office)" value={addr.label} onChange={(e) => setAddr({ ...addr, label: e.target.value })} aria-label="Address label" required />
                <input className={field} placeholder="Full name" value={addr.fullName} onChange={(e) => setAddr({ ...addr, fullName: e.target.value })} aria-label="Full name" required />
                <input className={field} placeholder="Mobile number" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} aria-label="Mobile number" required />
                <select className={field} value={addr.division} onChange={(e) => setAddr({ ...addr, division: e.target.value, district: divisions[e.target.value]?.[0] ?? "" })} aria-label="Division">
                  {Object.keys(divisions).map((d) => <option key={d}>{d}</option>)}
                </select>
                <select className={field} value={addr.district} onChange={(e) => setAddr({ ...addr, district: e.target.value })} aria-label="District">
                  {(divisions[addr.division] ?? []).map((d) => <option key={d}>{d}</option>)}
                </select>
                <input className={field} placeholder="Upazila / area" value={addr.area} onChange={(e) => setAddr({ ...addr, area: e.target.value })} aria-label="Area" required />
                <input className={`${field} sm:col-span-2`} placeholder="Full address" value={addr.address} onChange={(e) => setAddr({ ...addr, address: e.target.value })} aria-label="Full address" required />
                <Button type="submit" className="sm:col-span-2">Save address</Button>
              </form>
            </div>
          ) : null}

          {tab === "Profile" ? (
            <form
              className="card-surface grid gap-3 p-5 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                updateProfile(profile);
              }}
            >
              <div>
                <label htmlFor="pname" className="text-xs font-medium text-heading">Full name</label>
                <input id="pname" className={field} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <label htmlFor="pphone" className="text-xs font-medium text-heading">Mobile number</label>
                <input id="pphone" className={field} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="pemail" className="text-xs font-medium text-heading">Email</label>
                <input id="pemail" type="email" className={field} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <Button type="submit" className="sm:col-span-2">Save changes</Button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
