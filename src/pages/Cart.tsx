import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { buildWhatsAppLink, formatPrice } from "@/data/products";
import { useCart } from "@/hooks/useCart";

export default function Cart() {
  const { items, count, subtotal, updateQty, removeFromCart, clearCart } = useCart();
  const sendCartToWhatsApp = () => {
    if (!items.length) return;

    const lines = items.map(
      (item, index) =>
        `${index + 1}. ${item.name} x${item.qty} - ${formatPrice(item.price * item.qty)}`,
    );
    const message = [
      "Hello Yonmi's Gloss! I'd like to place this order:",
      "",
      ...lines,
      "",
      `Total items: ${count}`,
      `Subtotal: ${formatPrice(subtotal)}`,
    ].join("\n");

    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    clearCart();
  };

  return (
    <main className="container py-24 md:py-28">
      <h1 className="font-display text-4xl md:text-5xl">Cart</h1>
      <p className="mt-3 text-muted-foreground">
        {count} item{count === 1 ? "" : "s"} in your cart.
      </p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/shop" className="inline-block mt-5 underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 space-y-4">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-border p-4 md:p-5 flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover border border-border" />
                <div className="flex-1">
                  <Link to={`/product/${item.slug}`} className="font-display text-2xl hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{formatPrice(item.price)}</p>

                  <div className="mt-4 flex items-center gap-3">
                    <button className="w-8 h-8 rounded-full border border-border inline-flex items-center justify-center" onClick={() => updateQty(item.id, item.qty - 1)}>
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <button className="w-8 h-8 rounded-full border border-border inline-flex items-center justify-center" onClick={() => updateQty(item.id, item.qty + 1)}>
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button className="ml-2 inline-flex items-center gap-1 text-xs text-red-500" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium whitespace-nowrap">{formatPrice(item.price * item.qty)}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-lg">
              Subtotal: <span className="font-display text-2xl">{formatPrice(subtotal)}</span>
            </p>
            <div className="flex gap-2">
              <button onClick={clearCart} className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest">
                Clear cart
              </button>
              <button
                onClick={sendCartToWhatsApp}
                className="rounded-full bg-[#25D366] px-5 py-2 text-xs uppercase tracking-widest text-white"
              >
                Order on WhatsApp
              </button>
              <Link to="/shop" className="rounded-full bg-foreground text-background px-5 py-2 text-xs uppercase tracking-widest">
                Keep shopping
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
