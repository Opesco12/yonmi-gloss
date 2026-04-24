import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { products, categories, getByCategory, Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Shop() {
  const { category } = useParams<{ category?: string }>();
  const cat = categories.find((c) => c.id === category);
  const list = cat ? getByCategory(cat.id as Category) : products;

  return (
    <>
      <section className="gradient-hero">
        <div className="container py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-xs tracking-[0.3em] uppercase text-gold">{cat ? "Collection" : "All Products"}</span>
            <h1 className="mt-3 font-display text-5xl md:text-6xl">{cat ? cat.name : "The Shop"}</h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              {cat ? cat.tagline : "Every shade, every finish. Crafted to make you glow."}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container py-10">
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          <Link
            to="/shop"
            className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest border transition-all ${
              !cat ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/shop/${c.id}`}
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest border transition-all ${
                cat?.id === c.id ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
          {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>

        {list.length === 0 && (
          <p className="text-center py-20 text-muted-foreground">No products in this collection yet.</p>
        )}
      </div>
    </>
  );
}
