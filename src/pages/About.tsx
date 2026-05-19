import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Leaf, Heart } from "lucide-react";
import hero from "@/assets/hero.jpg";

export default function About() {
  return (
    <>
      <section className="container grid lg:grid-cols-2 gap-12 items-center py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-gold">
            Our Story
          </span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl leading-[1.05]">
            Made for the women who{" "}
            <em className="gold-text not-italic">glow</em>.
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Yonmi Gloss is a beauty brand created to make every lip look soft,
            shiny, and confident. From hydrating lip glosses like Berry Shine,
            Choco Kiss, Crystal Clear, and Natural Kiss to lip liners, lip
            creams, scrubs, and lip masks, every product is made to help you
            care for your lips while adding a beautiful finishing touch.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Our goal is simple: to give you affordable, cute, and easy-to-use
            lip products that keep your lips looking fresh, glossy, and ready
            for any occasion.
          </p>
          <Link
            to="/shop"
            className="inline-flex mt-8 items-center gap-2 bg-foreground text-background px-7 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-primary transition-colors shadow-soft"
          >
            Shop the collection
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-elegant">
            <img
              src={hero}
              alt="Yonmi's Gloss studio"
              width={1600}
              height={1200}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="container grid md:grid-cols-3 gap-8">
          {[
            {
              Icon: Leaf,
              title: "Clean & cruelty-free",
              text: "Vegan, paraben-free formulas tested on us, never on animals.",
            },
            {
              Icon: Sparkles,
              title: "Small batch luxury",
              text: "Hand-poured in Lagos for impeccable quality and freshness.",
            },
            {
              Icon: Heart,
              title: "Made to be loved",
              text: "Skin-loving oils that hydrate while they shine. No stickiness, ever.",
            },
          ].map(({ Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-background rounded-2xl p-8 shadow-soft"
            >
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-background">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display text-2xl mt-5">{title}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
