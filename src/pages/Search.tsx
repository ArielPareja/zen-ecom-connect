import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import ProductGrid from "@/components/ProductGrid";
import { searchProducts } from "@/services/products";
import { getCategories } from "@/services/categories";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const [min, setMin] = useState<number>(Number(params.get('minPrice') || 0));
  const [max, setMax] = useState<number>(Number(params.get('maxPrice') || 1000));

  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const order = (params.get('order') as 'ASC' | 'DESC') || 'ASC';
  const page = Number(params.get('page') || 1);
  const limit = 8;

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { data } = useQuery({
    queryKey: ['search', q, category, min, max, order, page],
    queryFn: () => searchProducts({ q, category: category || undefined, minPrice: min, maxPrice: max, order, page, limit }),
  });

  useEffect(() => {
    if (!params.get('minPrice')) params.set('minPrice', String(min));
    if (!params.get('maxPrice')) params.set('maxPrice', String(max));
    setParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => {
    const next = new URLSearchParams(params);
    next.set('q', q);
    next.set('page', '1');
    next.set('minPrice', String(min));
    next.set('maxPrice', String(max));
    setParams(next);
  };

  return (
    <div className="container py-10">
      <SEO title="Buscar productos" description="Encuentra por nombre, categoría y precio" canonical={window.location.origin + '/buscar'} />
      <h1 className="text-2xl font-semibold mb-6">Búsqueda</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <Input
              defaultValue={q}
              placeholder="Buscar..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const next = new URLSearchParams(params);
                  next.set('q', (e.currentTarget as HTMLInputElement).value);
                  next.set('page', '1');
                  setParams(next);
                }
              }}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Categoría</label>
            <Select value={category} onValueChange={(val) => { const next = new URLSearchParams(params); next.set('category', val); next.set('page','1'); setParams(next); }}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {categories?.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Precio</label>
            <div className="mt-2">
              <Slider min={0} max={1000} step={1} value={[min]} onValueChange={([v]) => setMin(v)} />
              <div className="text-xs text-muted-foreground mt-1">Mín: ${min}</div>
              <Slider min={0} max={5000} step={1} value={[max]} onValueChange={([v]) => setMax(v)} />
              <div className="text-xs text-muted-foreground mt-1">Máx: ${max}</div>
            </div>
            <Button className="mt-3 w-full" onClick={applyFilters}>Aplicar</Button>
          </div>
          <div>
            <label className="text-sm font-medium">Orden</label>
            <Select value={order} onValueChange={(val: 'ASC'|'DESC') => { const next = new URLSearchParams(params); next.set('order', val); next.set('page','1'); setParams(next); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">Precio: menor a mayor</SelectItem>
                <SelectItem value="DESC">Precio: mayor a menor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </aside>
        <main className="md:col-span-3 space-y-6">
          {data?.docs && data.docs.length > 0 ? (
            <ProductGrid products={data.docs} />
          ) : (
            <p className="text-muted-foreground">No se encontraron resultados.</p>
          )}

          {data && data.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                {Array.from({ length: data.totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const next = new URLSearchParams(params);
                  next.set('page', String(pageNum));
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink isActive={pageNum === data.page} to={`?${next.toString()}`}>
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
