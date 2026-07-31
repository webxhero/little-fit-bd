import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { STORAGE_KEYS, readStore, writeStore } from "@/lib/storage";

export type Lang = "en" | "bn";

/** Essential interface labels. Extend this object to complete the Bengali UI. */
const dict = {
  en: {
    home: "Home",
    shop: "Shop",
    search: "Search",
    wishlist: "Wishlist",
    cart: "Cart",
    account: "Account",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    checkout: "Checkout",
    newArrivals: "New Arrivals",
    offers: "Offers",
    bestSellers: "Best Sellers",
    total: "Total",
    subtotal: "Subtotal",
    delivery: "Delivery",
    inStock: "In stock",
    outOfStock: "Out of stock",
  },
  bn: {
    home: "হোম",
    shop: "শপ",
    search: "সার্চ",
    wishlist: "উইশলিস্ট",
    cart: "কার্ট",
    account: "অ্যাকাউন্ট",
    addToCart: "কার্টে যোগ করুন",
    buyNow: "এখনই কিনুন",
    checkout: "চেকআউট",
    newArrivals: "নতুন পণ্য",
    offers: "অফার",
    bestSellers: "বেস্ট সেলার",
    total: "মোট",
    subtotal: "সাবটোটাল",
    delivery: "ডেলিভারি",
    inStock: "স্টকে আছে",
    outOfStock: "স্টক নেই",
  },
} as const;

export type TranslationKey = keyof typeof dict.en;

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(readStore<Lang>(STORAGE_KEYS.lang, "en"));
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    writeStore(STORAGE_KEYS.lang, l);
  }, []);

  const t = useCallback((key: TranslationKey) => dict[lang][key] ?? dict.en[key], [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
