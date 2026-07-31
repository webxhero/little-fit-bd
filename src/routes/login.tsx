import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useShop } from "@/store/shop";
import { Breadcrumbs } from "@/components/ui-kit/Breadcrumbs";
import { Button } from "@/components/ui-kit/Button";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Customer Login — Little Feet BD" },
      { name: "description", content: "Log in to your Little Feet BD account to view orders, addresses and your wishlist." },
      { property: "og:title", content: "Login — Little Feet BD" },
      { property: "og:description", content: "Access your account, orders and saved items." },
      { property: "og:url", content: "/login" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

const field = "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none";

function LoginPage() {
  const { login, pushToast } = useShop();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    pushToast({ title: result.message, tone: "success" });
    void navigate({ to: "/account" });
  };

  return (
    <div className="container-page pb-16">
      <Breadcrumbs items={[{ label: "Login" }]} />
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Log in to track orders and keep your wishlist in one place.</p>

        {forgot ? (
          <div className="card-surface mt-6 p-6">
            <h2 className="font-display text-xl">Reset your password</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and we will send reset instructions once email service is connected.
            </p>
            <input className={`${field} mt-4`} placeholder="your@email.com" aria-label="Email for password reset" />
            <Button
              className="mt-3 w-full"
              onClick={() => {
                pushToast({ title: "Reset link requested", description: "Demo only — no email is sent yet.", tone: "info" });
                setForgot(false);
              }}
            >
              Send reset link
            </Button>
            <button type="button" onClick={() => setForgot(false)} className="mt-3 w-full text-xs text-primary-dark underline">
              Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="card-surface mt-6 space-y-4 p-6">
            <div>
              <label htmlFor="email" className="text-xs font-medium text-heading">Email</label>
              <input id="email" type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-medium text-heading">Password</label>
              <input id="password" type="password" className={field} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
            <Button type="submit" size="lg" className="w-full">Log in</Button>
            <div className="flex items-center justify-between text-xs">
              <button type="button" onClick={() => setForgot(true)} className="text-primary-dark underline">Forgot password?</button>
              <Link to="/register" className="text-primary-dark underline">Create an account</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
