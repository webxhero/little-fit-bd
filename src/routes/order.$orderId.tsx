import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package } from "lucide-react";
import { useShop } from "@/store/shop";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { Button } from "@/components/ui-kit/Button";
import { EmptyState } from "@/components/ui-kit/EmptyState";
import { SmartImage } from "@/components/ui-kit/SmartImage";
import { formatBDT, formatDate } from "@/lib/format";

export const Route = createFileRoute("/order/$orderId")({
  validateSearch: (search: Record<string, unknown>): { success?: boolean } =>
    search["success"] ? { success: true } : {},
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.orderId} — Little Feet BD` },
      { name: "description", content: "View the details and status of your Little Feet BD order." },
      { property: "og:title", content: "Order details — Little Feet BD" },
      { property: "og:description", content: "Order summary, items and delivery information." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { orderId } = Route.useParams();
  const { success } = Route.useSearch();
  const { getOrder, ready } = useShop();
  const order = getOrder(orderId);

  if (!ready) {
    return <div className="container-page py-20 text-center text-sm text-muted-foreground">Loading order…</div>;
  }

  if (!order) {
    return (
      <div className="container-page pb-16">
        <Breadcrumbs items={[{ label: "Order" }]} />
        <EmptyState
          icon={<Package size={22} />}
          title="Order not found"
          description={`We couldn't find order ${orderId} on this device. Orders are stored locally in this demo.`}
          action={<Link to="/shop"><Button>Continue shopping</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: "Account", to: "/account" }, { label: order.id }]} />

      {success ? (
        <div className="card-surface mb-8 flex flex-col items-center gap-3 p-8 text-center">
          <CheckCircle2 size={40} className="text-success" />
          <h1 className="font-display text-3xl">Thank you — your order is confirmed</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Order <strong className="text-heading">{order.id}</strong> was placed successfully. Our team will call you on{" "}
            {order.customer.phone} to confirm before dispatch.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/shop"><Button>Continue shopping</Button></Link>
            <Link to="/track-order"><Button variant="outline">Track this order</Button></Link>
          </div>
        </div>
      ) : (
        <h1 className="mb-6 font-display text-3xl">Order {order.id}</h1>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
            <p className="text-sm text-muted-foreground">Placed {formatDate(order.createdAt)}</p>
            <span className="rounded-md bg-cream px-2.5 py-1 text-xs font-medium text-heading">{order.status}</span>
          </div>
          <ul className="divide-y divide-border">
            {order.items.map((item, i) => (
              <li key={`${item.productId}-${i}`} className="flex items-center gap-3 py-4">
                <div className="w-16 shrink-0"><SmartImage imageKey={item.image} alt={item.name} ratio="square" /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-heading">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {item.quantity} · {formatBDT(item.price)}</p>
                </div>
                <span className="text-sm font-semibold text-heading">{formatBDT(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="card-surface h-fit space-y-4 p-5 text-sm">
          <div>
            <h2 className="font-display text-lg">Summary</h2>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatBDT(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>−{formatBDT(order.discount)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{order.deliveryCharge === 0 ? "Free" : formatBDT(order.deliveryCharge)}</span></div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold text-heading"><span>Total</span><span>{formatBDT(order.total)}</span></div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-lg">Delivery to</h2>
            <p className="mt-1 text-muted-foreground">
              {order.customer.fullName}<br />
              {order.customer.address}, {order.customer.area}<br />
              {order.customer.district}, {order.customer.division}<br />
              {order.customer.phone}
            </p>
          </div>
          <div>
            <h2 className="font-display text-lg">Payment</h2>
            <p className="mt-1 text-muted-foreground">{order.paymentMethod}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
