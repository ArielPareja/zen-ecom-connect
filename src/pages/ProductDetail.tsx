import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import { getProductById } from "@/services/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product } = useQuery({ queryKey: ['product', id], queryFn: () => getProductById(id || '') });
  const { addToCart } = useCart();

  if (!product) return null;

  const image = product.images?.[0];

  return (
    <div className="container py-10">
      <SEO title={`${product.name} - Detalle`} description={product.description?.slice(0, 150)} canonical={window.location.origin + `/producto/${product._id}`} jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: image,
        description: product.description,
        offers: { '@type': 'Offer', price: product.price, priceCurrency: 'USD' },
      }} />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden bg-muted group">
          {image && (
            <img
              src={image}
              alt={`Imagen de ${product.name}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
            />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-muted-foreground mb-4">{product.description}</p>
          <div className="text-2xl font-semibold mb-6">${product.price.toFixed(2)}</div>
          <Button onClick={() => addToCart(product)}>Agregar al carrito</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
