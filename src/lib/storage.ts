/** Tiny SSR-safe LocalStorage wrapper. Swap for an API layer later. */

export const STORAGE_KEYS = {
  cart: "lfbd.cart",
  wishlist: "lfbd.wishlist",
  recent: "lfbd.recentlyViewed",
  orders: "lfbd.orders",
  user: "lfbd.user",
  users: "lfbd.users",
  searches: "lfbd.recentSearches",
  lang: "lfbd.lang",
} as const;

export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode — ignore */
  }
}
