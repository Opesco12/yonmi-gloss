export type Category = "lip-gloss" | "lip-liners" | "lip-care";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: Category;
  images: string[];
  description: string;
  bestseller?: boolean;
}

export const categories: { id: Category; name: string; tagline: string }[] = [
  {
    id: "lip-gloss",
    name: "Lip Gloss",
    tagline: "High-shine color and everyday gloss looks",
  },
  {
    id: "lip-liners",
    name: "Lip Liners",
    tagline: "Shape, define, and lock in your lip look",
  },
  {
    id: "lip-care",
    name: "Lip Care",
    tagline: "Hydration, repair, and everyday lip treatment",
  },
];

export const formatPrice = (n: number) => "₦" + n.toLocaleString("en-NG");

// WhatsApp configuration
export const WHATSAPP_NUMBER = "2349163639432";
export const buildWhatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const orderMessage = (product: Product, qty: number) =>
  `Hello Yonmi's Gloss! I'd like to order ${product.name} (x${qty}). Total: ${formatPrice(product.price * qty)}.`;
