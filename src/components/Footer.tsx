import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import { categories } from "@/data/products";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="container py-16 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-display text-3xl">Yonmi's Gloss</h3>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Premium lip gloss for the woman who knows her shine. Crafted in small batches with skin-loving ingredients.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/shop/${c.id}`} className="hover:text-primary transition-colors">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">About</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
            <li><Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
            <li><Link to="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Stay in touch</h4>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer"
               className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="mailto:hello@yonmisgloss.com"
               className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Yonmi's Gloss. All rights reserved.</p>
          <p>Crafted with love · Made in Lagos</p>
        </div>
      </div>
    </footer>
  );
}
