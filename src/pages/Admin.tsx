import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useCatalog } from "@/hooks/useCatalog";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { Product } from "@/data/products";
import { auth } from "@/lib/firebase";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  price: 0,
  category: "lip-gloss",
  images: [],
  description: "",
  bestseller: false,
};

export default function Admin() {
  const { user, loading: authLoading } = useAdminAuth();
  const { products, categories, addProduct, updateProduct, removeProduct, loading, error, refreshProducts } = useCatalog();
  const [draft, setDraft] = useState<DraftProduct>(initialDraft);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [productEdits, setProductEdits] = useState<Record<string, Product>>({});

  const getEditableProduct = (product: Product) => productEdits[product.id] ?? product;

  const setProductEdit = (id: string, updater: (current: Product) => Product) => {
    const base = productEdits[id] ?? products.find((p) => p.id === id);
    if (!base) return;
    setProductEdits((prev) => ({ ...prev, [id]: updater(base) }));
  };

  const isDirty = (product: Product) => {
    const edit = productEdits[product.id];
    if (!edit) return false;
    return JSON.stringify(edit) !== JSON.stringify(product);
  };

  const onDraftImage = async (files?: FileList | null) => {
    if (!files?.length) return;
    if (draft.images.length >= 3) return;

    setBusy(true);
    setActionError(null);
    try {
      const roomLeft = 3 - draft.images.length;
      const selected = Array.from(files).slice(0, roomLeft);
      const uploaded = await Promise.all(selected.map((file) => uploadImageToCloudinary(file)));
      setDraft((prev) => ({ ...prev, images: [...prev.images, ...uploaded].slice(0, 3) }));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const onExistingImageReplace = async (id: string, imageIndex: number, file?: File | null) => {
    if (!file) return;
    setBusy(true);
    setActionError(null);

    try {
      const url = await uploadImageToCloudinary(file);
      const product = products.find((p) => p.id === id);
      if (!product) return;
      const source = productEdits[id] ?? product;
      const next = [...source.images];
      next[imageIndex] = url;
      setProductEdit(id, (current) => ({ ...current, images: next.slice(0, 3) }));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Image update failed.");
    } finally {
      setBusy(false);
    }
  };

  const onExistingImageAdd = async (id: string, file?: File | null) => {
    if (!file) return;
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const source = productEdits[id] ?? product;
    if (source.images.length >= 3) return;

    setBusy(true);
    setActionError(null);
    try {
      const url = await uploadImageToCloudinary(file);
      setProductEdit(id, (current) => ({ ...current, images: [...current.images, url].slice(0, 3) }));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Image update failed.");
    } finally {
      setBusy(false);
    }
  };

  const moveDraftImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.images.length) return;
    const next = [...draft.images];
    [next[index], next[target]] = [next[target], next[index]];
    setDraft((prev) => ({ ...prev, images: next }));
  };

  const removeDraftImage = (index: number) => {
    setDraft((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const moveProductImage = async (product: Product, index: number, direction: -1 | 1) => {
    const source = productEdits[product.id] ?? product;
    const target = index + direction;
    if (target < 0 || target >= source.images.length) return;
    const next = [...source.images];
    [next[index], next[target]] = [next[target], next[index]];
    setProductEdit(product.id, (current) => ({ ...current, images: next }));
  };

  const removeProductImage = async (product: Product, index: number) => {
    const source = productEdits[product.id] ?? product;
    if (source.images.length <= 1) {
      setActionError("A product must have at least one image.");
      return;
    }
    const next = source.images.filter((_, i) => i !== index);
    setProductEdit(product.id, (current) => ({ ...current, images: next }));
  };

  const saveProductChanges = async (product: Product) => {
    const edited = productEdits[product.id];
    if (!edited) return;
    setBusy(true);
    setActionError(null);
    try {
      await updateProduct(product.id, {
        name: edited.name,
        price: edited.price,
        category: edited.category,
        slug: edited.slug,
        description: edited.description,
        images: edited.images.slice(0, 3),
        bestseller: edited.bestseller,
      });
      setProductEdits((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  };

  const discardProductChanges = (id: string) => {
    setProductEdits((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const createProduct = async () => {
    if (!draft.name || !draft.category || draft.images.length === 0 || draft.price <= 0) return;
    const slug = draft.slug ? slugify(draft.slug) : slugify(draft.name);
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`;
    setBusy(true);
    setActionError(null);
    try {
      await addProduct({
        ...draft,
        id,
        slug: slug || id,
        images: draft.images.slice(0, 3),
      });
      setDraft(initialDraft);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not add product.");
    } finally {
      setBusy(false);
    }
  };

  const signIn = async () => {
    setBusy(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (authLoading) {
    return <main className="container py-24">Checking admin access...</main>;
  }

  if (!user) {
    return (
      <main className="container py-24 md:py-28 max-w-lg">
        <h1 className="font-display text-4xl md:text-5xl">Admin Login</h1>
        <p className="mt-3 text-muted-foreground">Sign in to manage products.</p>
        <div className="mt-8 grid gap-4">
          <input
            className="h-11 rounded-lg border border-border bg-background px-3"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="h-11 rounded-lg border border-border bg-background px-3"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {authError && <p className="text-sm text-red-500">{authError}</p>}
          <button
            onClick={signIn}
            disabled={busy}
            className="rounded-full bg-foreground px-5 py-3 text-sm uppercase tracking-widest text-background disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-24 md:py-28">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-display text-4xl md:text-5xl">Admin</h1>
        <button onClick={handleSignOut} className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest">
          Sign out
        </button>
      </div>
      <p className="mt-3 text-muted-foreground">
        Manage products, prices, categories, and images without editing code.
      </p>
      {error && <p className="mt-3 text-sm text-red-500">Catalog error: {error}</p>}
      {actionError && <p className="mt-3 text-sm text-red-500">{actionError}</p>}

      <section className="mt-10 rounded-2xl border border-border p-5 md:p-6 bg-secondary/30">
        <h2 className="font-display text-2xl">Add Product</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input className="h-11 rounded-lg border border-border bg-background px-3" placeholder="Product name"
            value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
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
            <span className="mb-1 block text-muted-foreground">Upload Images (up to 3)</span>
            <input type="file" accept="image/*" multiple onChange={(e) => onDraftImage(e.target.files)} />
          </label>
          {draft.images.length > 0 && (
            <div className="md:col-span-2 grid grid-cols-3 gap-3">
              {draft.images.map((src, i) => (
                <div key={`${src}-${i}`} className="rounded-lg border border-border p-2">
                  <img src={src} alt="Draft preview" className="h-24 w-full rounded object-cover" />
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    {i === 0 ? "Thumbnail" : `Image ${i + 1}`}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button type="button" className="text-xs border rounded px-2 py-1" onClick={() => moveDraftImage(i, -1)}>←</button>
                    <button type="button" className="text-xs border rounded px-2 py-1" onClick={() => moveDraftImage(i, 1)}>→</button>
                    <button type="button" className="text-xs border rounded px-2 py-1 text-red-500" onClick={() => removeDraftImage(i)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" checked={Boolean(draft.bestseller)}
              onChange={(e) => setDraft((p) => ({ ...p, bestseller: e.target.checked }))} />
            Mark as bestseller
          </label>
        </div>
        <div className="mt-5">
          <button onClick={createProduct} disabled={busy} className="rounded-full bg-foreground px-5 py-3 text-sm uppercase tracking-widest text-background disabled:opacity-60">
            {busy ? "Saving..." : "Add Product"}
          </button>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl">Products ({products.length})</h2>
          <button
            onClick={refreshProducts}
            className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest"
          >
            Refresh
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {loading && <p className="text-sm text-muted-foreground">Loading products...</p>}
          {products.map((product) => (
            (() => {
              const editable = getEditableProduct(product);
              return (
            <article key={product.id} className="rounded-2xl border border-border p-4 md:p-5 bg-background">
              <div className="grid gap-4 md:grid-cols-4">
                <img src={editable.images[0]} alt={editable.name} className="h-28 w-28 rounded-lg object-cover border border-border" />
                <div className="md:col-span-3 grid gap-3 md:grid-cols-2">
                  <input className="h-10 rounded-lg border border-border bg-background px-3" value={editable.name}
                    onChange={(e) => setProductEdit(product.id, (current) => ({ ...current, name: e.target.value }))} />
                  <input className="h-10 rounded-lg border border-border bg-background px-3" type="number" value={editable.price}
                    onChange={(e) => setProductEdit(product.id, (current) => ({ ...current, price: Number(e.target.value) }))} />
                  <select className="h-10 rounded-lg border border-border bg-background px-3" value={editable.category}
                    onChange={(e) => setProductEdit(product.id, (current) => ({ ...current, category: e.target.value as Product["category"] }))}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input className="h-10 rounded-lg border border-border bg-background px-3 md:col-span-2" value={editable.slug}
                    onChange={(e) => setProductEdit(product.id, (current) => ({ ...current, slug: slugify(e.target.value) }))} />
                  <textarea className="min-h-24 rounded-lg border border-border bg-background px-3 py-2 md:col-span-2" value={editable.description}
                    onChange={(e) => setProductEdit(product.id, (current) => ({ ...current, description: e.target.value }))} />

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {editable.images.map((src, i) => (
                      <div key={`${product.id}-${i}`} className="rounded-lg border border-border p-2">
                        <img src={src} alt="Product" className="h-24 w-full rounded object-cover" />
                        <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                          {i === 0 ? "Thumbnail" : `Image ${i + 1}`}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button type="button" className="text-xs border rounded px-2 py-1" onClick={() => moveProductImage(product, i, -1)}>←</button>
                          <button type="button" className="text-xs border rounded px-2 py-1" onClick={() => moveProductImage(product, i, 1)}>→</button>
                          <label className="text-xs border rounded px-2 py-1 cursor-pointer">
                            Replace
                            <input className="hidden" type="file" accept="image/*" onChange={(e) => onExistingImageReplace(product.id, i, e.target.files?.[0])} />
                          </label>
                          <button type="button" className="text-xs border rounded px-2 py-1 text-red-500" onClick={() => removeProductImage(product, i)}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {editable.images.length < 3 && (
                    <label className="text-sm md:col-span-2">
                      <span className="mb-1 block text-muted-foreground">Add another image</span>
                      <input type="file" accept="image/*" onChange={(e) => onExistingImageAdd(product.id, e.target.files?.[0])} />
                    </label>
                  )}

                  <label className="flex items-center gap-2 text-sm md:col-span-2">
                    <input type="checkbox" checked={Boolean(editable.bestseller)}
                      onChange={(e) => setProductEdit(product.id, (current) => ({ ...current, bestseller: e.target.checked }))} />
                    Bestseller
                  </label>
                </div>
              </div>
              <div className="mt-4">
                {isDirty(product) && (
                  <div className="mb-3 flex gap-2">
                    <button
                      onClick={() => saveProductChanges(product)}
                      disabled={busy}
                      className="rounded-full bg-foreground px-4 py-2 text-xs uppercase tracking-widest text-background disabled:opacity-60"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => discardProductChanges(product.id)}
                      className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest"
                    >
                      Discard
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setPendingDelete(product)}
                  className="rounded-full border border-red-400 px-4 py-2 text-xs uppercase tracking-widest text-red-500"
                >
                  Delete
                </button>
              </div>
            </article>
              );
            })()
          ))}
        </div>
      </section>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {pendingDelete?.name ?? "this product"} from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (pendingDelete) {
                  try {
                    await removeProduct(pendingDelete.id);
                  } catch (err) {
                    setActionError(err instanceof Error ? err.message : "Delete failed.");
                  }
                }
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
