import glossy from "@/assets/product-glossy.jpg";
import matte from "@/assets/product-matte.jpg";
import shimmer from "@/assets/product-shimmer.jpg";
import nude from "@/assets/product-nude.jpg";

export type Category = "lip-gloss" | "lip-liners" | "lip-care";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  bestseller?: boolean;
}

export const categories: { id: Category; name: string; tagline: string }[] = [
  { id: "lip-gloss", name: "Lip Gloss", tagline: "High-shine color and everyday gloss looks" },
  { id: "lip-liners", name: "Lip Liners", tagline: "Shape, define, and lock in your lip look" },
  { id: "lip-care", name: "Lip Care", tagline: "Hydration, repair, and everyday lip treatment" },
];

export const defaultProducts: Product[] = [
  {
    id: "1", slug: "rose-glow", name: "Rose Glow",
    price: 8500, category: "lip-gloss", image: glossy, bestseller: true,
    description: "Our signature high-shine gloss in a fresh rosé pink. Hydrating, non-sticky and infused with vitamin E for a plumped, glassy finish that lasts.",
  },
  {
    id: "2", slug: "velvet-kiss", name: "Velvet Kiss",
    price: 9000, category: "lip-liners",  image: matte,
    description: "A weightless matte formula that hugs the lips with a velvety, blurred finish. Long-wear and pigment-rich without ever drying you out.",
  },
  {
    id: "3", slug: "rose-shimmer", name: "Rose Shimmer",
    price: 9500, category: "lip-gloss", image: shimmer, bestseller: true,
    description: "Liquid sunlight in a tube. Fine rose-gold pearls catch every angle for a multi-dimensional glow that screams main character.",
  },
  {
    id: "4", slug: "honey-nude", name: "Honey Nude",
    price: 8000, category: "lip-gloss", image: nude,
    description: "Your lips but better. A creamy nude in warm caramel — flattering, neutral, and impossibly easy to wear day to night.",
  },
  {
    id: "5", slug: "cherry-bloom", name: "Cherry Bloom",
    price: 8500, category: "lip-gloss", image: glossy,
    description: "Bold, juicy and unapologetic. A bright pink gloss with mirror shine that doubles as your luckiest charm.",
  },
  {
    id: "6", slug: "midnight-nude", name: "Midnight Nude",
    price: 9000, category: "lip-liners", image: matte,
    description: "A cool mauve matte with editorial attitude. Perfect for the evening, the after-party, and every story in between.",
  },
  {
    id: "7", slug: "sunset-shimmer", name: "Sunset Shimmer",
    price: 9500, category: "lip-care", image: shimmer,
    description: "A coral shimmer that bottles golden hour. Wear it solo or layer over any shade for instant dimension.",
  },
  {
    id: "8", slug: "sand-nude", name: "Sand Nude",
    price: 8000, category: "lip-care", image: nude, bestseller: true,
    description: "An iconic soft-beige nude with the gentlest pink undertone. The everyday gloss you'll never put down.",
  },
];

export const products = defaultProducts;

export const getProduct = (slug: string, list: Product[] = products) =>
  list.find((p) => p.slug === slug);
export const getByCategory = (cat: Category, list: Product[] = products) =>
  list.filter((p) => p.category === cat);

export const formatPrice = (n: number) =>
  "₦" + n.toLocaleString("en-NG");

// WhatsApp configuration
export const WHATSAPP_NUMBER = "2348012345678"; // brand WhatsApp number
export const buildWhatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const orderMessage = (product: Product, qty: number) =>
  `Hello Yonmi's Gloss! I'd like to order ${product.name} (x${qty}). Total: ${formatPrice(product.price * qty)}.`;
