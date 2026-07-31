import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui-kit/Button";
import { useShop } from "@/store/shop";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { pushToast } = useShop();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setEmail("");
    pushToast({ title: "You're on the list", description: "We'll send new arrivals and offers occasionally.", tone: "success" });
  };

  return (
    <section className="card-surface grid gap-6 rounded-2xl px-6 py-8 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-10">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary-dark">Stay in touch</p>
        <h2 className="font-display text-2xl leading-tight lg:text-3xl">New arrivals, quietly delivered</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          One short email a month — new pieces, restocks and parenting-friendly offers. No spam, unsubscribe anytime.
        </p>
      </div>
      <form onSubmit={submit} noValidate className="w-full">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3">
            <Mail size={16} className="text-muted-foreground" aria-hidden="true" />
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-invalid={Boolean(error)}
              {...(error ? { "aria-describedby": "newsletter-error" } : {})}
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" size="lg">
            Subscribe
          </Button>
        </div>
        {error ? (
          <p id="newsletter-error" className="mt-2 text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
