import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import hero from "@/assets/hero.jpg";

const images = [g1, g3, g2, g4, g6, g5, hero, g1, g3];

export default function Gallery() {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <section className="gradient-hero">
        <div className="container py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-xs tracking-[0.3em] uppercase text-gold">Gallery</span>
            <h1 className="mt-3 font-display text-5xl md:text-6xl">The Yonmi's Gloss life</h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Moments, shines, and stories from our community.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container py-14">
        <div className="columns-2 md:columns-3 gap-4 md:gap-6 [column-fill:_balance]">
          {images.map((src, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setIndex(i)}
              className="block w-full mb-4 md:mb-6 break-inside-avoid overflow-hidden rounded-2xl group relative"
            >
              <img
                src={src}
                alt={`Gallery image ${i + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={images.map((src) => ({ src }))}
        styles={{ container: { backgroundColor: "rgba(20, 10, 15, 0.95)" } }}
      />
    </>
  );
}
