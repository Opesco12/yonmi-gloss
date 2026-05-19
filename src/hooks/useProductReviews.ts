import { useCallback, useEffect, useMemo, useState } from "react";
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ProductReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt?: unknown;
}

interface AddReviewInput {
  name: string;
  rating: number;
  comment: string;
}

export function useProductReviews(productId?: string) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshReviews = useCallback(async () => {
    if (!productId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const reviewsRef = collection(db, "products", productId, "reviews");
      const snapshot = await getDocs(query(reviewsRef, orderBy("createdAt", "desc"), limit(20)));
      const rows = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<ProductReview, "id">) }));
      setReviews(rows);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not fetch reviews.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

  const addReview = useCallback(async ({ name, rating, comment }: AddReviewInput) => {
    if (!productId) return;
    setSubmitting(true);
    try {
      const reviewsRef = collection(db, "products", productId, "reviews");
      await addDoc(reviewsRef, {
        name: name.trim(),
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
      });
      await refreshReviews();
    } finally {
      setSubmitting(false);
    }
  }, [productId, refreshReviews]);

  return useMemo(
    () => ({ reviews, loading, submitting, error, refreshReviews, addReview }),
    [reviews, loading, submitting, error, refreshReviews, addReview],
  );
}
