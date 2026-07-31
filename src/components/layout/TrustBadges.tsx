import { BadgeCheck, HeartHandshake, Lock, RefreshCw, ShieldCheck, Truck } from "lucide-react";

const badges = [
  { icon: BadgeCheck, title: "Premium quality", text: "Every batch checked before dispatch" },
  { icon: ShieldCheck, title: "Child-safe products", text: "BPA-free, food-grade, non-toxic" },
  { icon: Truck, title: "Nationwide delivery", text: "All 64 districts, 1–4 business days" },
  { icon: RefreshCw, title: "Easy exchange", text: "3-day size and defect exchange" },
  { icon: HeartHandshake, title: "Responsive support", text: "Sat–Thu, 10:00 AM – 8:00 PM" },
  { icon: Lock, title: "Secure checkout", text: "Cash on Delivery, bKash and Nagad" },
];

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  const list = compact ? badges.slice(0, 3) : badges;
  return (
    <div className={compact ? "grid gap-3 sm:grid-cols-3" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
      {list.map(({ icon: Icon, title, text }) => (
        <div key={title} className="card-surface flex items-start gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream text-primary-dark">
            <Icon size={18} />
          </span>
          <span>
            <span className="block text-sm font-medium text-heading">{title}</span>
            <span className="block text-xs text-muted-foreground">{text}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
