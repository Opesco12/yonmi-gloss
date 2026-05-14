import { useState } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import type { Product } from "@/data/products";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type DraftProduct = Omit<Product, "id">;

const initialDraft: DraftProduct = {
  slug: "",
  name: "",
  shade: "",
  price: 0,
  category: "lip-gloss",
  image: "",
  description: "",
  bestseller: false,
};

export default function Admin() {
  const { products, categories, addProduct, updateProduct, removeProduct, resetProducts } = useCatalog();
  const [draft, setDraft] = useState<DraftProduct>(initialDraft);

  const onDraftImage = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((prev) => ({ ...prev, image: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const onExistingImage = (id: string, file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateProduct(id, { image: String(reader.result || "") });
    };
    reader.readAsDataURL(file);
  };

  const createProduct = () => {
    if (!draft.name || !draft.category || !draft.image || draft.price <= 0) return;
    const slug = draft.slug ? slugify(draft.slug) : slugify(draft.name);
    const id = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`);
    addProduct({
      ...draft,
      id,
      slug: slug || id,
    });
    setDraft(initialDraft);
  };

  return (
    <main className="container py-24 md:py-28">
      <h1 className="font-display text-4xl md:text-5xl">Admin</h1>
      <p className="mt-3 text-muted-foreground">
        Manage products, prices, categories, and images without editing code.
      </p>

      <section className="mt-10 rounded-2xl border border-border p-5 md:p-6 bg-secondary/30">
        <h2 className="font-display text-2xl">Add Product</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input className="h-11 rounded-lg border border-border bg-background px-3" placeholder="Product name"
            value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
          <input className="h-11 rounded-lg border border-border bg-background px-3" placeholder="Shade"
            value={draft.shade} onChange={(e) => setDraft((p) => ({ ...p, shade: e.target.value }))} />
          <input className="h-11 rounded-lg border border-border bg-background px-3" placeholder="Price (NGN)" type="number"
            value={draft.price || ""} onChange={(e) => setDraft((p) => ({ ...p, price: Number(e.target.value) }))} />
          <select className="h-11 rounded-lg border border-border bg-background px-3"
            value={draft.category} onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value as Product["category"] }))}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input className="h-11 rounded-lg border border-border bg-background px-3 md:col-span-2" placeholder="Slug (optional)"
            value={draft.slug} onChange={(e) => setDraft((p) => ({ ...p, slug: e.target.value }))} />
          <textarea className="min-h-28 rounded-lg border border-border bg-background px-3 py-2 md:col-span-2" placeholder="Description"
            value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} />
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-muted-foreground">Upload Image</span>
            <input type="file" accept="image/*" onChange={(e) => onDraftImage(e.target.files?.[0])} />
          </label>
          {draft.image && <img src={draft.image} alt="Draft preview" className="h-28 w-28 rounded-lg object-cover border border-border" />}
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" checked={Boolean(draft.bestseller)}
              onChange={(e) => setDraft((p) => ({ ...p, bestseller: e.target.checked }))} />
            Mark as bestseller
          </label>
        </div>
        <div className="mt-5">
          <button onClick={createProduct} className="rounded-full bg-foreground px-5 py-3 text-sm uppercase tracking-widest text-background">
            Add Product
          </button>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl">Products ({products.length})</h2>
          <button
            onClick={resetProducts}
            className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest"
          >
            Reset to defaults
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {products.map((product) => (
            <article key={product.id} className="rounded-2xl border border-border p-4 md:p-5 bg-background">
              <div className="grid gap-4 md:grid-cols-4">
                <img src={product.image} alt={product.name} className="h-28 w-28 rounded-lg object-cover border border-border" />
                <div className="md:col-span-3 grid gap-3 md:grid-cols-2">
                  <input className="h-10 rounded-lg border border-border bg-background px-3" value={product.name}
                    onChange={(e) => updateProduct(product.id, { name: e.target.value })} />
                  <input className="h-10 rounded-lg border border-border bg-background px-3" value={product.shade}
                    onChange={(e) => updateProduct(product.id, { shade: e.target.value })} />
                  <input className="h-10 rounded-lg border border-border bg-background px-3" type="number" value={product.price}
                    onChange={(e) => updateProduct(product.id, { price: Number(e.target.value) })} />
                  <select className="h-10 rounded-lg border border-border bg-background px-3" value={product.category}
                    onChange={(e) => updateProduct(product.id, { category: e.target.value as Product["category"] })}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input className="h-10 rounded-lg border border-border bg-background px-3 md:col-span-2" value={product.slug}
                    onChange={(e) => updateProduct(product.id, { slug: slugify(e.target.value) })} />
                  <textarea className="min-h-24 rounded-lg border border-border bg-background px-3 py-2 md:col-span-2" value={product.description}
                    onChange={(e) => updateProduct(product.id, { description: e.target.value })} />
                  <label className="text-sm md:col-span-2">
                    <span className="mb-1 block text-muted-foreground">Replace Image</span>
                    <input type="file" accept="image/*" onChange={(e) => onExistingImage(product.id, e.target.files?.[0])} />
                  </label>
                  <label className="flex items-center gap-2 text-sm md:col-span-2">
                    <input type="checkbox" checked={Boolean(product.bestseller)}
                      onChange={(e) => updateProduct(product.id, { bestseller: e.target.checked })} />
                    Bestseller
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => removeProduct(product.id)}
                  className="rounded-full border border-red-400 px-4 py-2 text-xs uppercase tracking-widest text-red-500"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
