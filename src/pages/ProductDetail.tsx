import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import { formatPrice, buildWhatsAppLink, orderMessage } from "@/data/products";
import { useCatalog } from "@/hooks/useCatalog";
import { useCart } from "@/hooks/useCart";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductReviews } from "@/hooks/useProductReviews";

export default function ProductDetail() {
  const { products, getProduct, categories, loading } = useCatalog();
  const { addToCart } = useCart();
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProduct(slug) : undefined;
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { reviews, loading: reviewsLoading, submitting: reviewsSubmitting, error: reviewsError, addReview } = useProductReviews(product?.id);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewActionError, setReviewActionError] = useState<string | null>(null);

  if (loading) {
    return (
      <section className="container py-10 md:py-14 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={`thumb-skeleton-${i}`} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <div className="container py-32 text-center">
        <h1 className="font-display text-4xl">Product not found</h1>
        <Link
          to="/shop"
          className="inline-block mt-6 underline"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const gallery = product.images.slice(0, 3);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);
  const total = product.price * qty;

  const waLink = buildWhatsAppLink(orderMessage(product, qty));
  const averageRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  const submitReview = async () => {
    setReviewActionError(null);
    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewActionError("Please add your name and comment.");
      return;
    }
    if (reviewRating < 1 || reviewRating > 5) {
      setReviewActionError("Please select a rating between 1 and 5.");
      return;
    }
    try {
      await addReview({ name: reviewName, rating: reviewRating, comment: reviewComment });
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
    } catch (err) {
      setReviewActionError(err instanceof Error ? err.message : "Could not submit review.");
    }
  };

  return (
    <>
      <div className="container pt-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> Back to shop
        </Link>
      </div>

      <section className="container py-10 md:py-14 grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-secondary/60 shadow-soft">
            <motion.img
              key={activeImg}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={gallery[activeImg]}
              alt={product.name}
              width={800}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImg === i
                    ? "border-gold"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={g}
                  alt=""
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-gold">
            {categories.find((c) => c.id === product.category)?.name ??
              product.category}
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
            {product.name}
          </h1>

          <div className="mt-6 flex items-baseline gap-3">
            <p className="font-display text-3xl">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-muted-foreground">incl. VAT</p>
          </div>

          <p className="mt-8 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="mt-10 flex items-center gap-6">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Quantity
            </span>
            <div className="flex items-center border border-border rounded-full">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:text-primary"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:text-primary"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => addToCart(product, qty)}
              className="group flex-1 inline-flex items-center justify-center gap-2 border border-foreground px-7 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors shadow-soft"
            >
              Add to cart
            </button>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="group flex-1 inline-flex items-center justify-center gap-2 bg-foreground text-background px-7 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-primary transition-colors shadow-soft"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              Order on WhatsApp · {formatPrice(total)}
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            We'll confirm availability and delivery details over WhatsApp.
          </p>
        </motion.div>
      </section>

      {related.length > 0 && (
        <section className="container py-20">
          <h2 className="font-display text-3xl md:text-4xl text-center mb-10">
            You may also love
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {related.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
              />
            ))}
          </div>
        </section>
      )}

      <section className="container pb-20">
        <div className="rounded-2xl border border-border p-5 md:p-6 bg-secondary/20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-3xl md:text-4xl">Reviews</h2>
            <p className="text-sm text-muted-foreground">
              {reviews.length > 0 ? `${averageRating.toFixed(1)}/5 from ${reviews.length} review${reviews.length === 1 ? "" : "s"}` : "No reviews yet"}
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <input
                className="h-11 w-full rounded-lg border border-border bg-background px-3"
                placeholder="Your name"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
              />
              <select
                className="h-11 w-full rounded-lg border border-border bg-background px-3"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} star{value === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
              <textarea
                className="min-h-28 w-full rounded-lg border border-border bg-background px-3 py-2"
                placeholder="Share your thoughts about this product"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
              {(reviewActionError || reviewsError) && (
                <p className="text-sm text-red-500">{reviewActionError ?? reviewsError}</p>
              )}
              <button
                type="button"
                onClick={submitReview}
                disabled={reviewsSubmitting}
                className="rounded-full bg-foreground px-5 py-3 text-xs uppercase tracking-widest text-background disabled:opacity-60"
              >
                {reviewsSubmitting ? "Submitting..." : "Submit review"}
              </button>
            </div>

            <div className="space-y-3">
              {reviewsLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`review-skeleton-${i}`} className="rounded-xl border border-border bg-background p-4 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              {!reviewsLoading && reviews.length === 0 && (
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Be the first to review this product.</p>
                </div>
              )}
              {!reviewsLoading &&
                reviews.map((review) => (
                  <article key={review.id} className="rounded-xl border border-border bg-background p-4">
                    <p className="text-sm font-medium">{review.name}</p>
                    <p className="text-xs text-gold mt-1">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                    <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                  </article>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
