import { useCallback, useEffect, useMemo, useState } from "react";
import { categories, type Product } from "@/data/products";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: Product["category"];
  images: string[];
  image?: string;
  description: string;
  bestseller: boolean | null;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: row.price,
    category: row.category,
    images: (row.images?.slice(0, 3) ?? (row.image ? [row.image] : [])),
    description: row.description,
    bestseller: Boolean(row.bestseller),
  };
}

export function useCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    setLoading(true);
    try {
      const ref = collection(db, "products");
      const snapshot = await getDocs(query(ref, orderBy("createdAt", "desc")));
      const rows = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ProductRow, "id">) }));
      setProducts(rows.map((row) => toProduct(row as ProductRow)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not fetch products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const getProduct = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products],
  );

  const getByCategory = useCallback(
    (categoryId: Product["category"]) => products.filter((p) => p.category === categoryId),
    [products],
  );

  const addProduct = useCallback(async (product: Product) => {
    await setDoc(doc(db, "products", product.id), {
      slug: product.slug,
      name: product.name,
      price: product.price,
      category: product.category,
      images: product.images.slice(0, 3),
      description: product.description,
      bestseller: Boolean(product.bestseller),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await refreshProducts();
  }, [refreshProducts]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const payload: Partial<Product> & { updatedAt: unknown } = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    if (payload.images) payload.images = payload.images.slice(0, 3);
    await updateDoc(doc(db, "products", id), payload);
    await refreshProducts();
  }, [refreshProducts]);

  const removeProduct = useCallback(async (id: string) => {
    await deleteDoc(doc(db, "products", id));
    await refreshProducts();
  }, [refreshProducts]);

  return useMemo(
    () => ({
      categories,
      products,
      loading,
      error,
      getProduct,
      getByCategory,
      addProduct,
      updateProduct,
      removeProduct,
      refreshProducts,
    }),
    [products, loading, error, getProduct, getByCategory, addProduct, updateProduct, removeProduct, refreshProducts],
  );
}
