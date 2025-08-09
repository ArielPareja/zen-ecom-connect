import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createProduct, deleteProduct, searchProducts, updateProduct, getStats, exportProducts } from "@/services/products";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Settings, Plus, Search, BarChart3, Download } from "lucide-react";

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

  const exportMut = useMutation({
    mutationFn: () => exportProducts('csv'),
    onSuccess: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `productos_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });

  return (
    <div className="container py-10 max-w-7xl">
      <SEO title="Panel de Control - Admin" description="Administra tu tienda online" canonical={window.location.origin + '/admin/productos'} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
          <p className="text-muted-foreground">Gestiona tus productos y configuración del sitio</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportMut.mutate()} variant="outline" className="gap-2" disabled={exportMut.isPending}>
            <Download className="h-4 w-4" />
            {exportMut.isPending ? 'Exportando...' : 'Exportar CSV'}
          </Button>
          <Button onClick={() => navigate('/admin/configuracion')} variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configuración del Sitio
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.data?.active ?? '-'}</div>
            <p className="text-xs text-muted-foreground">Productos disponibles para venta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Productos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.data?.total ?? '-'}</div>
            <p className="text-xs text-muted-foreground">Total en inventario</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Inactivos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.data?.inactive ?? '-'}</div>
            <p className="text-xs text-muted-foreground">Productos no disponibles</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editingId ? 'Editar Producto' : 'Crear Producto'}
            </CardTitle>
            <CardDescription>
              {editingId ? 'Modifica los detalles del producto' : 'Añade un nuevo producto a tu catálogo'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Inventario de Productos
            </CardTitle>
            <CardDescription>
              Busca y gestiona tus productos existentes
            </CardDescription>
          </CardHeader>
          <CardContent>

            <div className="mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data?.docs?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay productos aún</p>
                  <p className="text-sm">Crea tu primer producto usando el formulario</p>
                </div>
              ) : (
                data?.docs?.map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.name} className="h-12 w-12 object-cover rounded" />
                      )}
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${p.price.toFixed(2)}
                          {p.featured && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">Featured</span>}
                        </div>
                      </div>
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
                      <Button variant="destructive" size="sm" onClick={() => del.mutate(p._id)}>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductsAdmin;
