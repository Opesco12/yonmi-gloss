import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useCatalog } from "@/hooks/useCatalog";
import { Skeleton } from "@/components/ui/skeleton";
import { buildWhatsAppLink } from "@/data/products";

export default function Footer() {
  const { categories, loading } = useCatalog();
  const whatsappHref = buildWhatsAppLink(
    "Hi Yonmi's Gloss! I have a question.",
  );
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="container py-16 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="font-display text-3xl">Yonmi's Gloss</h3>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            Premium lip gloss for the woman who knows her shine. Crafted in
            small batches with skin-loving ingredients.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Shop
          </h4>
          <ul className="space-y-2 text-sm">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <li key={`footer-category-skeleton-${i}`}>
                  <Skeleton className="h-4 w-24" />
                </li>
              ))}
            {!loading &&
              categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/shop/${c.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            About
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/about"
                className="hover:text-primary transition-colors"
              >
                Our Story
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className="hover:text-primary transition-colors"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className="hover:text-primary transition-colors"
              >
                All Products
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Stay in touch
          </h4>
          <div className="flex gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href="https://www.tiktok.com/medeyonmi20"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.24V2h-3.13v12.26a2.8 2.8 0 1 1-2.8-2.8c.22 0 .43.03.63.08V8.36a5.93 5.93 0 1 0 5.3 5.9V8.09a7.93 7.93 0 0 0 4.77 1.6V6.69Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Yonmi's Gloss. All rights reserved.
          </p>
          <p>Crafted with love · Made in Lagos</p>
        </div>
      </div>
    </footer>
  );
}
