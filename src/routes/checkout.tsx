import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useShop, type Order } from "@/store/shop";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { Button } from "@/components/ui-kit/Button";
import { SmartImage } from "@/components/ui-kit/SmartImage";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { formatBDT, generateOrderId } from "@/lib/format";
import { divisions, shipping } from "@/config/site";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Little Feet BD" },
      { name: "description", content: "Complete your Little Feet BD order with Cash on Delivery, bKash or Nagad." },
      { property: "og:title", content: "Checkout — Little Feet BD" },
      { property: "og:description", content: "Secure, simple checkout with nationwide delivery." },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: CheckoutPage,
});

const payments = [
  { id: "Cash on Delivery", note: "Pay the rider when your parcel arrives." },
  { id: "bKash", note: "Manual payment — we will share the merchant number after you order." },
  { id: "Nagad", note: "Manual payment — we will share the merchant number after you order." },
  { id: "Card (coming soon)", note: "Card payments are not active yet.", disabled: true },
];

function CheckoutPage() {
  const { cartDetailed, subtotal, coupon, applyCoupon, clearCart, placeOrder, user } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    division: "Dhaka",
    district: "Dhaka",
    area: "",
    address: "",
    notes: "",
  });
  const [payment, setPayment] = useState("Cash on Delivery");
  const [agree, setAgree] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const districts = divisions[form.division] ?? [];
  const discount = coupon?.amount ?? 0;
  const delivery = subtotal === 0 || subtotal >= shipping.freeThreshold || coupon?.freeShipping ? 0 : form.division === "Dhaka" ? shipping.insideDhaka : shipping.outsideDhaka;
  const total = Math.max(0, subtotal - discount) + delivery;

  const set = (key: keyof typeof form, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 3) e["fullName"] = "Please enter your full name.";
    if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, ""))) e["phone"] = "Enter a valid Bangladeshi mobile number (01XXXXXXXXX).";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e["email"] = "Enter a valid email address.";
    if (!form.area.trim()) e["area"] = "Please enter your upazila or area.";
    if (form.address.trim().length < 10) e["address"] = "Please enter a complete delivery address.";
    if (!agree) e["agree"] = "Please accept the terms to place your order.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const order: Order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      status: "Processing",
      items: cartDetailed.map(({ item, product }) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
        ...(item.variant ? { variant: item.variant } : {}),
      })),
      subtotal,
      discount,
      deliveryCharge: delivery,
      total,
      ...(coupon ? { coupon: coupon.code } : {}),
      paymentMethod: payment,
      customer: { ...form },
    };
    window.setTimeout(() => {
      placeOrder(order);
      clearCart();
      setLoading(false);
      void navigate({ to: "/order/$orderId", params: { orderId: order.id }, search: { success: true } });
    }, 700);
  };

  if (cartDetailed.length === 0) {
    return (
      <div className="container-page pb-16">
        <Breadcrumbs items={[{ label: "Checkout" }]} />
        <EmptyState
          title="Nothing to check out"
          description="Your cart is empty. Add a product first and it will appear here."
          action={<Link to="/shop"><Button>Browse products</Button></Link>}
        />
      </div>
    );
  }

  const field = "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none";

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: "Checkout" }]} />
      <h1 className="font-display text-3xl lg:text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">Delivery across Bangladesh. Cash on Delivery available everywhere.</p>

      <form onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="card-surface space-y-5 p-5 lg:p-7">
          <h2 className="font-display text-xl">Delivery details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="text-xs font-medium text-heading">Full name *</label>
              <input id="fullName" className={field} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} aria-invalid={Boolean(errors["fullName"])} />
              {errors["fullName"] ? <p className="mt-1 text-xs text-destructive">{errors["fullName"]}</p> : null}
            </div>
            <div>
              <label htmlFor="phone" className="text-xs font-medium text-heading">Mobile number *</label>
              <input id="phone" className={field} placeholder="01XXXXXXXXX" value={form.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={Boolean(errors["phone"])} />
              {errors["phone"] ? <p className="mt-1 text-xs text-destructive">{errors["phone"]}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="text-xs font-medium text-heading">Email (optional)</label>
              <input id="email" type="email" className={field} value={form.email} onChange={(e) => set("email", e.target.value)} />
              {errors["email"] ? <p className="mt-1 text-xs text-destructive">{errors["email"]}</p> : null}
            </div>
            <div>
              <label htmlFor="division" className="text-xs font-medium text-heading">Division *</label>
              <select id="division" className={field} value={form.division} onChange={(e) => { set("division", e.target.value); set("district", divisions[e.target.value]?.[0] ?? ""); }}>
                {Object.keys(divisions).map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="district" className="text-xs font-medium text-heading">District *</label>
              <select id="district" className={field} value={form.district} onChange={(e) => set("district", e.target.value)}>
                {districts.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="area" className="text-xs font-medium text-heading">Upazila / area *</label>
              <input id="area" className={field} value={form.area} onChange={(e) => set("area", e.target.value)} aria-invalid={Boolean(errors["area"])} />
              {errors["area"] ? <p className="mt-1 text-xs text-destructive">{errors["area"]}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="address" className="text-xs font-medium text-heading">Full delivery address *</label>
              <textarea id="address" rows={3} className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none" value={form.address} onChange={(e) => set("address", e.target.value)} aria-invalid={Boolean(errors["address"])} />
              {errors["address"] ? <p className="mt-1 text-xs text-destructive">{errors["address"]}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="text-xs font-medium text-heading">Order notes (optional)</label>
              <textarea id="notes" rows={2} className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>
          </div>

          <h2 className="pt-2 font-display text-xl">Payment method</h2>
          <div className="grid gap-2">
            {payments.map((p) => (
              <label key={p.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${payment === p.id ? "border-primary bg-cream" : "border-border"} ${p.disabled ? "opacity-50" : ""}`}>
                <input type="radio" name="payment" disabled={p.disabled} checked={payment === p.id} onChange={() => setPayment(p.id)} className="mt-1 accent-[var(--primary)]" />
                <span>
                  <span className="block font-medium text-heading">{p.id}</span>
                  <span className="block text-xs text-muted-foreground">{p.note}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <aside className="card-surface h-fit p-5">
          <h2 className="font-display text-xl">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {cartDetailed.map(({ item, product }) => (
              <li key={item.key} className="flex items-center gap-3">
                <div className="w-14 shrink-0"><SmartImage imageKey={product.image} alt={product.name} ratio="square" /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-heading">{product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-heading">{formatBDT(product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" className={field} />
            <Button type="button" variant="outline" onClick={() => applyCoupon(code)}>Apply</Button>
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatBDT(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>−{formatBDT(discount)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{delivery === 0 ? "Free" : formatBDT(delivery)}</span></div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-heading"><span>Total payable</span><span>{formatBDT(total)}</span></div>
          </div>

          <label className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-[var(--primary)]" />
            I agree to the terms, return policy and privacy policy.
          </label>
          {errors["agree"] ? <p className="mt-1 text-xs text-destructive">{errors["agree"]}</p> : null}

          <Button type="submit" size="lg" className="mt-4 w-full" disabled={loading}>
            {loading ? "Placing order…" : `Place order · ${formatBDT(total)}`}
          </Button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">This is a demo checkout — no real payment is processed.</p>
        </aside>
      </form>
    </div>
  );
}
