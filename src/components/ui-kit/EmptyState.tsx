import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="card-surface mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center">
      {icon ? (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cream text-primary-dark">
          {icon}
        </div>
      ) : null}
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function LoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-surface overflow-hidden p-3">
          <div className="aspect-square animate-pulse rounded-lg bg-secondary" />
          <div className="mt-4 h-3 w-1/3 animate-pulse rounded bg-secondary" />
          <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-secondary" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-secondary" />
        </div>
      ))}
    </div>
  );
}
