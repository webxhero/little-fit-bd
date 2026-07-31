import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useShop } from "@/store/shop";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { Button } from "@/components/ui-kit/Button";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create an Account — Little Feet BD" },
      { name: "description", content: "Register for a Little Feet BD account to save addresses, track orders and keep a wishlist." },
      { property: "og:title", content: "Create an Account — Little Feet BD" },
      { property: "og:description", content: "Faster checkout and order history in one place." },
      { property: "og:url", content: "/register" },
    ],
    links: [{ rel: "canonical", href: "/register" }],
  }),
  component: RegisterPage,
});

const field = "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none";

function RegisterPage() {
  const { register, pushToast } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (form.name.trim().length < 3) err["name"] = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) err["email"] = "Enter a valid email address.";
    if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, ""))) err["phone"] = "Enter a valid mobile number (01XXXXXXXXX).";
    if (form.password.length < 6) err["password"] = "Password must be at least 6 characters.";
    setErrors(err);
    if (Object.keys(err).length) return;

    const result = register(form);
    if (!result.ok) {
      setErrors({ email: result.message });
      return;
    }
    pushToast({ title: "Account created", tone: "success" });
    void navigate({ to: "/account" });
  };

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: "Register" }]} />
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Save your address once and check out faster next time.</p>
        <form onSubmit={submit} noValidate className="card-surface mt-6 space-y-4 p-6">
          {([
            ["name", "Full name", "text"],
            ["email", "Email", "email"],
            ["phone", "Mobile number", "tel"],
            ["password", "Password", "password"],
          ] as const).map(([key, label, type]) => (
            <div key={key}>
              <label htmlFor={key} className="text-xs font-medium text-heading">{label}</label>
              <input id={key} type={type} className={field} value={form[key]} onChange={(e) => set(key, e.target.value)} aria-invalid={Boolean(errors[key])} />
              {errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null}
            </div>
          ))}
          <Button type="submit" size="lg" className="w-full">Create account</Button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary-dark underline">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
