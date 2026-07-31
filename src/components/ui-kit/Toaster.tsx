import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useShop } from "@/store/shop";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

export function Toaster() {
  const { toasts, dismissToast } = useShop();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-20 right-4 z-[70] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 sm:bottom-6"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.tone];
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex animate-fade-up items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-lift"
          >
            <Icon
              size={18}
              className={
                toast.tone === "success" ? "mt-0.5 text-success" : toast.tone === "error" ? "mt-0.5 text-destructive" : "mt-0.5 text-primary-dark"
              }
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-heading">{toast.title}</p>
              {toast.description ? (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-muted-foreground transition-colors hover:text-heading"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
