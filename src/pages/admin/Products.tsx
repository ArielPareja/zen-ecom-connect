import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, deleteProduct, searchProducts, updateProduct, getStats } from "@/services/products";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

const Dropzone = ({ onFiles }: { onFiles: (urls: string[]) => void }) => {
  const [hover, setHover] = useState(false);
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const readers = Array.from(files).map((file) => new Promise<string>((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.readAsDataURL(file);
    }));
    Promise.all(readers).then(onFiles);
  };
  return (
    <div
      className={`border-2 border-dashed rounded-md p-6 text-sm ${hover ? 'bg-muted' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => { e.preventDefault(); setHover(false); handleFiles(e.dataTransfer.files); }}
    >
      Arrastra y suelta imágenes aquí o
      <input type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} className="block mt-2" />
    </div>
  );
};

const ProductsAdmin = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const { data } = useQuery({ queryKey: ['admin-products', q], queryFn: () => searchProducts({ limit: 50, page: 1, q }) });
  const stats = useQuery({ queryKey: ['stats'], queryFn: getStats });
  const [form, setForm] = useState({ name: '', description: '', price: 0, images: [] as string[], categories: '', featured: false });
  const [editingId, setEditingId] = useState<string | null>(null);

  const createMut = useMutation({
    mutationFn: () => createProduct({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      images: form.images,
      active: true,
      categories: form.categories ? form.categories.split(',').map((s) => s.trim()) : [],
      featured: form.featured,
      sizes: [],
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      setForm({ name: '', description: '', price: 0, images: [], categories: '', featured: false });
    },
  });

  const updateMut = useMutation({
    mutationFn: () => updateProduct(editingId!, {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      images: form.images,
      categories: form.categories ? form.categories.split(',').map((s) => s.trim()) : [],
      featured: form.featured,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      setEditingId(null);
      setForm({ name: '', description: '', price: 0, images: [], categories: '', featured: false });
    },
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  return (
    <div className="container py-10">
      <SEO title="Productos - Admin" description="Administra tus productos" canonical={window.location.origin + '/admin/productos'} />
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate('/admin')}>← Volver</Button>
      </div>
      <h1 className="text-2xl font-semibold mb-6">Productos</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="space-y-3">
          <h2 className="font-medium">Crear producto</h2>
          <Input placeholder="Nombre" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Input type="number" placeholder="Precio" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
          <Input placeholder="Categorías (separadas por coma)" value={form.categories} onChange={(e) => setForm((f) => ({ ...f, categories: e.target.value }))} />
          <div className="flex items-center gap-2">
            <Checkbox id="featured" checked={form.featured} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: Boolean(v) }))} />
            <label htmlFor="featured" className="text-sm">Marcar como favorito (featured)</label>
          </div>
          <Dropzone onFiles={(urls) => setForm((f) => ({ ...f, images: [...f.images, ...urls] }))} />
          <div className="flex gap-2 flex-wrap">
            {form.images.map((src, i) => (
              <img key={i} src={src} alt={`imagen ${i+1}`} className="h-16 w-16 object-cover rounded" />
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => (editingId ? updateMut.mutate() : createMut.mutate())} disabled={!form.name || !form.price}>
              {editingId ? 'Actualizar' : 'Guardar'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: 0, images: [], categories: '', featured: false }); }}>
                Cancelar
              </Button>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-medium mb-3">Listado</h2>

          <div className="mb-4 flex items-center gap-2">
            <Input
              placeholder="Buscar productos (solo admin)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3 mb-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Activos</div>
              <div className="text-xl font-semibold">{stats.data?.active ?? '-'}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="text-xl font-semibold">{stats.data?.total ?? '-'}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground">Inactivos</div>
              <div className="text-xl font-semibold">{stats.data?.inactive ?? '-'}</div>
            </div>
          </div>

          <ul className="divide-y">
            {data?.docs?.map((p) => (
              <li key={p._id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">${p.price.toFixed(2)}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(p._id);
                      setForm({
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        images: p.images || [],
                        categories: p.categories?.join(', ') || '',
                        featured: p.featured,
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Editar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => del.mutate(p._id)}>Eliminar</Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ProductsAdmin;
