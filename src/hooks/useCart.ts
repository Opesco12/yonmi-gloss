import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

const CART_KEY = "yonmi_gloss_cart_v1";
const CART_EVENT = "yonmi_gloss_cart_updated";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => readCart());

  useEffect(() => {
    const sync = () => setItems(readCart());
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const commit = useCallback((next: CartItem[]) => {
    setItems(next);
    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CART_EVENT));
  }, []);

  const addToCart = useCallback((product: Product, qty = 1) => {
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      commit(items.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i)));
      return;
    }
    commit([
      ...items,
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
        qty,
      },
    ]);
  }, [items, commit]);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      commit(items.filter((i) => i.id !== id));
      return;
    }
    commit(items.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, [items, commit]);

  const removeFromCart = useCallback((id: string) => {
    commit(items.filter((i) => i.id !== id));
  }, [items, commit]);

  const clearCart = useCallback(() => {
    commit([]);
  }, [commit]);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.price, 0), [items]);

  return { items, count, subtotal, addToCart, updateQty, removeFromCart, clearCart };
}
