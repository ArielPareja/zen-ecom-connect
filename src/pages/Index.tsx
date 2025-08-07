import { useQuery } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import ProductGrid from "@/components/ProductGrid";
import { fetchFeatured, fetchRandom } from "@/services/products";

const Index = () => {
  const { data: featured } = useQuery({ queryKey: ['featured'], queryFn: () => fetchFeatured(8) });
  const { data: random } = useQuery({ queryKey: ['random-4'], queryFn: () => fetchRandom(4) });

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Tienda online - Inicio" description="Compra tus productos favoritos y descubre novedades" canonical={window.location.origin + '/'} />
      <section className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Favoritos</h1>
        {featured && featured.length > 0 ? (
          <ProductGrid products={featured} />
        ) : (
          <p className="text-muted-foreground">No hay productos destacados por ahora.</p>
        )}
      </section>

      <section className="container py-12">
        <h2 className="text-2xl font-semibold mb-6">Te puede interesar</h2>
        {random && random.length > 0 ? (
          <ProductGrid products={random} />
        ) : (
          <p className="text-muted-foreground">Sin sugerencias por el momento.</p>
        )}
      </section>
    </div>
  );
};

export default Index;
