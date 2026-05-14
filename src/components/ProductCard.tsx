import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product, formatPrice } from "@/data/products";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-secondary/60 aspect-[4/5]">
          {product.bestseller && (
            <span className="absolute top-3 left-3 z-10 text-[10px] tracking-[0.2em] uppercase bg-background/80 backdrop-blur px-3 py-1 rounded-full border border-gold/40 text-gold">
              Bestseller
            </span>
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            width={800}
            height={1000}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <div className="bg-background/95 backdrop-blur rounded-full px-5 py-3 text-center text-xs uppercase tracking-widest font-medium">
              View Details
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl leading-tight">{product.name}</h3>
          </div>
          <p className="text-sm font-medium whitespace-nowrap">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
