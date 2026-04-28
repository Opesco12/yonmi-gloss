import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Leaf, Truck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import { categories, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Home() {
  const featured = products.filter((p) => p.bestseller);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="container relative grid lg:grid-cols-2 gap-12 items-center py-16 md:py-24 lg:py-28">
          <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-gold">
              <Sparkles className="w-3 h-3" /> New Season Drop
            </span>
            <h1 className="mt-5 font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
              Lips that <em className="gold-text not-italic">whisper</em>,
              <br /> shine that <em className="text-primary not-italic">speaks</em>.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Hydrating, high-pigment lip glosses crafted in small batches.
              Soft on lips, bold on impact — for the woman who knows her shine.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 bg-foreground text-background px-7 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-primary transition-colors shadow-soft"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 border border-foreground/20 hover:border-foreground px-7 py-4 rounded-full text-sm uppercase tracking-widest transition-colors"
              >
                Explore Gallery
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5 text-gold" /> Cruelty-free</div>
              <div className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-gold" /> Hydrating</div>
              <div className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-gold" /> Free over ₦50k</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[5/6] rounded-[2rem] overflow-hidden shadow-elegant">
              <img src={heroImg} alt="Yonmi's Gloss lip gloss collection" width={1600} height={1200} className="w-full h-full object-cover" />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 hidden md:block bg-background rounded-2xl shadow-elegant px-5 py-4 border border-border/60"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Bestseller</p>
              <p className="font-display text-lg mt-0.5">Rose Glow</p>
              <p className="text-xs text-gold">★ 4.9 · 248 reviews</p>
            </motion.div>
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full gradient-gold opacity-30 blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border/60 bg-secondary/40 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 text-sm tracking-[0.3em] uppercase text-muted-foreground">
              {["Hydrating Formula", "✦", "Cruelty-Free", "✦", "Long-Wear", "✦", "Vitamin E", "✦", "Made in Lagos", "✦", "Vegan", "✦"].map((t, j) => (
                <span key={j}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container py-20 md:py-28">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">Collections</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Find your finish</h2>
          <p className="mt-4 text-muted-foreground">From mirror-shine glossy to second-skin nudes, Yonmi's Gloss has a shade for every mood.</p>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c, i) => {
            const img = [gallery1, gallery2, gallery3, gallery5][i];
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to={`/shop/${c.id}`} className="group block relative overflow-hidden rounded-2xl aspect-[3/4]">
                  <img src={img} alt={c.name} loading="lazy" width={800} height={1000}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-background">
                    <h3 className="font-display text-2xl">{c.name}</h3>
                    <p className="text-xs opacity-80 mt-1">{c.tagline}</p>
                    <span className="inline-flex items-center gap-1 mt-3 text-[11px] uppercase tracking-widest opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container pb-20 md:pb-28">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Loved by you</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Bestsellers</h2>
          </div>
          <Link to="/shop" className="text-sm uppercase tracking-widest hover:text-primary transition-colors inline-flex items-center gap-2">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* INSTAGRAM-STYLE STRIP */}
      <section className="container pb-20 md:pb-28">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">@lushgloss</span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">As seen on you</h2>
          <p className="mt-4 text-muted-foreground">Tag us on Instagram for a chance to be featured.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[gallery1, gallery2, gallery3, gallery5].map((src, i) => (
            <motion.a
              key={i}
              href="https://instagram.com" target="_blank" rel="noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="relative block aspect-square overflow-hidden rounded-xl group"
            >
              <img src={src} alt="" loading="lazy" width={600} height={600}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors" />
            </motion.a>
          ))}
        </div>
      </section>
    </>
  );
}
