import { useCallback, useEffect, useMemo, useState } from "react";
import { categories, defaultProducts, type Product } from "@/data/products";

const CATALOG_STORAGE_KEY = "yonmi_gloss_products_v1";

function readStoredProducts(): Product[] {
  if (typeof window === "undefined") return defaultProducts;

  try {
    const raw = window.localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) return defaultProducts;
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultProducts;
    return parsed;
  } catch {
    return defaultProducts;
  }
}

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>(() => readStoredProducts());

  useEffect(() => {
    window.localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const getProduct = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products],
  );

  const getByCategory = useCallback(
    (categoryId: Product["category"]) => products.filter((p) => p.category === categoryId),
    [products],
  );

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [product, ...prev]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetProducts = useCallback(() => {
    setProducts(defaultProducts);
  }, []);

  return useMemo(
    () => ({
      categories,
      products,
      getProduct,
      getByCategory,
      addProduct,
      updateProduct,
      removeProduct,
      resetProducts,
    }),
    [products, getProduct, getByCategory, addProduct, updateProduct, removeProduct, resetProducts],
  );
}
