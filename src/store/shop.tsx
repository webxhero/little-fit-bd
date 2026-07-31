import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS, readStore, writeStore } from "@/lib/storage";
import { coupons, shipping } from "@/config/site";
import { getProductById, type Product } from "@/data/products";

export type CartItem = {
  productId: string;
  quantity: number;
  variant?: Record<string, string>;
  key: string;
};

export type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  address: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // demo only — replace with real auth
  addresses: Address[];
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: Record<string, string>;
};

export type Order = {
  id: string;
  createdAt: string;
  status: "Processing" | "Packed" | "Shipped" | "Delivered";
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  coupon?: string;
  paymentMethod: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    division: string;
    district: string;
    area: string;
    address: string;
    notes?: string;
  };
};

export type Toast = { id: number; title: string; description?: string; tone: "success" | "error" | "info" };

function variantKey(productId: string, variant?: Record<string, string>) {
  const suffix = variant
    ? Object.keys(variant)
        .sort()
        .map((k) => `${k}:${variant[k]}`)
        .join("|")
    : "";
  return suffix ? `${productId}__${suffix}` : productId;
}

type ShopValue = {
  ready: boolean;
  cart: CartItem[];
  cartCount: number;
  cartDetailed: { item: CartItem; product: Product }[];
  subtotal: number;
  addToCart: (product: Product, quantity?: number, variant?: Record<string, string>, silent?: boolean) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;

  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;

  coupon: { code: string; amount: number; freeShipping: boolean } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  deliveryCharge: (division: string) => number;

  user: User | null;
  login: (email: string, password: string) => { ok: boolean; message: string };
  register: (data: { name: string; email: string; phone: string; password: string }) => { ok: boolean; message: string };
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "name" | "phone" | "email">>) => void;
  saveAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;

  orders: Order[];
  placeOrder: (order: Order) => void;
  getOrder: (id: string) => Order | undefined;

  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
};

const ShopContext = createContext<ShopValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<{ code: string; amount: number; freeShipping: boolean } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setCart(readStore<CartItem[]>(STORAGE_KEYS.cart, []));
    setWishlist(readStore<string[]>(STORAGE_KEYS.wishlist, []));
    setRecentlyViewed(readStore<string[]>(STORAGE_KEYS.recent, []));
    setRecentSearches(readStore<string[]>(STORAGE_KEYS.searches, []));
    setOrders(readStore<Order[]>(STORAGE_KEYS.orders, []));
    setUser(readStore<User | null>(STORAGE_KEYS.user, null));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) writeStore(STORAGE_KEYS.cart, cart);
  }, [cart, ready]);
  useEffect(() => {
    if (ready) writeStore(STORAGE_KEYS.wishlist, wishlist);
  }, [wishlist, ready]);
  useEffect(() => {
    if (ready) writeStore(STORAGE_KEYS.recent, recentlyViewed);
  }, [recentlyViewed, ready]);
  useEffect(() => {
    if (ready) writeStore(STORAGE_KEYS.searches, recentSearches);
  }, [recentSearches, ready]);
  useEffect(() => {
    if (ready) writeStore(STORAGE_KEYS.orders, orders);
  }, [orders, ready]);
  useEffect(() => {
    if (ready) writeStore(STORAGE_KEYS.user, user);
  }, [user, ready]);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3600);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToCart = useCallback<ShopValue["addToCart"]>(
    (product, quantity = 1, variant, silent) => {
      const key = variantKey(product.id, variant);
      setCart((prev) => {
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock || 99) } : i,
          );
        }
        const item: CartItem = { productId: product.id, quantity, key, ...(variant ? { variant } : {}) };
        return [...prev, item];
      });
      if (!silent) {
        pushToast({ title: "Added to cart", description: product.name, tone: "success" });
      }
    },
    [pushToast],
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, quantity } : i)),
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartDetailed = useMemo(() => {
    return cart
      .map((item) => {
        const product = getProductById(item.productId);
        return product ? { item, product } : null;
      })
      .filter((v): v is { item: CartItem; product: Product } => v !== null);
  }, [cart]);

  const subtotal = useMemo(
    () => cartDetailed.reduce((sum, { item, product }) => sum + product.price * item.quantity, 0),
    [cartDetailed],
  );

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.quantity, 0), [cart]);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        pushToast({
          title: exists ? "Removed from wishlist" : "Saved to wishlist",
          tone: exists ? "info" : "success",
        });
        return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      });
    },
    [pushToast],
  );

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 8));
  }, []);

  const addRecentSearch = useCallback((term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 6));
  }, []);

  const clearRecentSearches = useCallback(() => setRecentSearches([]), []);

  const applyCoupon = useCallback(
    (code: string) => {
      const found = coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
      if (!found) {
        pushToast({ title: "Invalid coupon code", tone: "error" });
        return false;
      }
      if (subtotal < found.minSubtotal) {
        pushToast({
          title: "Coupon not applicable",
          description: found.label,
          tone: "error",
        });
        return false;
      }
      const amount = found.type === "percent" ? Math.round((subtotal * found.value) / 100) : found.type === "flat" ? found.value : 0;
      setCoupon({ code: found.code, amount, freeShipping: found.type === "shipping" });
      pushToast({ title: `Coupon ${found.code} applied`, description: found.label, tone: "success" });
      return true;
    },
    [subtotal, pushToast],
  );

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const deliveryCharge = useCallback(
    (division: string) => {
      if (subtotal === 0) return 0;
      if (coupon?.freeShipping) return 0;
      if (subtotal >= shipping.freeThreshold) return 0;
      return division === "Dhaka" ? shipping.insideDhaka : shipping.outsideDhaka;
    },
    [subtotal, coupon],
  );

  const login = useCallback<ShopValue["login"]>((email, password) => {
    const users = readStore<User[]>(STORAGE_KEYS.users, []);
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return { ok: false, message: "No account found with this email." };
    if (found.password !== password) return { ok: false, message: "Incorrect password. Please try again." };
    setUser(found);
    return { ok: true, message: "Welcome back!" };
  }, []);

  const register = useCallback<ShopValue["register"]>((data) => {
    const users = readStore<User[]>(STORAGE_KEYS.users, []);
    if (users.some((u) => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
      return { ok: false, message: "An account with this email already exists." };
    }
    const newUser: User = {
      id: `U-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      password: data.password,
      addresses: [],
    };
    writeStore(STORAGE_KEYS.users, [...users, newUser]);
    setUser(newUser);
    return { ok: true, message: "Account created." };
  }, []);

  const persistUser = useCallback((next: User) => {
    setUser(next);
    const users = readStore<User[]>(STORAGE_KEYS.users, []);
    writeStore(
      STORAGE_KEYS.users,
      users.map((u) => (u.id === next.id ? next : u)),
    );
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback<ShopValue["updateProfile"]>(
    (data) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...data };
        const users = readStore<User[]>(STORAGE_KEYS.users, []);
        writeStore(
          STORAGE_KEYS.users,
          users.map((u) => (u.id === next.id ? next : u)),
        );
        return next;
      });
      pushToast({ title: "Profile updated", tone: "success" });
    },
    [pushToast],
  );

  const saveAddress = useCallback<ShopValue["saveAddress"]>(
    (address) => {
      if (!user) return;
      const next: User = {
        ...user,
        addresses: [...user.addresses, { ...address, id: `A-${Date.now()}` }],
      };
      persistUser(next);
      pushToast({ title: "Address saved", tone: "success" });
    },
    [user, persistUser, pushToast],
  );

  const removeAddress = useCallback(
    (id: string) => {
      if (!user) return;
      persistUser({ ...user, addresses: user.addresses.filter((a) => a.id !== id) });
      pushToast({ title: "Address removed", tone: "info" });
    },
    [user, persistUser, pushToast],
  );

  const placeOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id.toLowerCase() === id.toLowerCase()),
    [orders],
  );

  const value: ShopValue = {
    ready,
    cart,
    cartCount,
    cartDetailed,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartOpen,
    setCartOpen,
    wishlist,
    toggleWishlist,
    isWishlisted,
    recentlyViewed,
    addRecentlyViewed,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    coupon,
    applyCoupon,
    removeCoupon,
    deliveryCharge,
    user,
    login,
    register,
    logout,
    updateProfile,
    saveAddress,
    removeAddress,
    orders,
    placeOrder,
    getOrder,
    toasts,
    pushToast,
    dismissToast,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
