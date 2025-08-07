import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, deleteProduct, searchProducts, updateProduct } from "@/services/products";
import { useState } from "react";

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
  const { data } = useQuery({ queryKey: ['admin-products'], queryFn: () => searchProducts({ limit: 50, page: 1 }) });
  const [form, setForm] = useState({ name: '', description: '', price: 0, images: [] as string[], categories: '' });

  const createMut = useMutation({
    mutationFn: () => createProduct({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      images: form.images,
      active: true,
      categories: form.categories ? form.categories.split(',').map((s) => s.trim()) : [],
      featured: false,
      sizes: [],
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  return (
    <div className="container py-10">
      <SEO title="Productos - Admin" description="Administra tus productos" canonical={window.location.origin + '/admin/productos'} />
      <h1 className="text-2xl font-semibold mb-6">Productos</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="space-y-3">
          <h2 className="font-medium">Crear producto</h2>
          <Input placeholder="Nombre" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <Textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Input type="number" placeholder="Precio" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
          <Input placeholder="Categorías (separadas por coma)" value={form.categories} onChange={(e) => setForm((f) => ({ ...f, categories: e.target.value }))} />
          <Dropzone onFiles={(urls) => setForm((f) => ({ ...f, images: [...f.images, ...urls] }))} />
          <div className="flex gap-2 flex-wrap">
            {form.images.map((src, i) => (
              <img key={i} src={src} alt={`imagen ${i+1}`} className="h-16 w-16 object-cover rounded" />
            ))}
          </div>
          <Button onClick={() => createMut.mutate()} disabled={!form.name || !form.price}>Guardar</Button>
        </section>

        <section>
          <h2 className="font-medium mb-3">Listado</h2>
          <ul className="divide-y">
            {data?.docs?.map((p) => (
              <li key={p._id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">${p.price.toFixed(2)}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => alert('Edición básica: modificar en el formulario y crear nuevo (demo).')}>Editar</Button>
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
