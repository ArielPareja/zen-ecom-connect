import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

type Props = { product: Product };

const ProductCard = ({ product }: Props) => {
  const { addToCart } = useCart();
  const image = product.images?.[0];
  return (
    <Card className="overflow-hidden group">
      <Link to={`/producto/${product._id}`} aria-label={`Ver ${product.name}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          {image && (
            <img
              src={image}
              alt={`Imagen de ${product.name}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          )}
        </div>
      </Link>
      <CardContent className="pt-4">
        <h3 className="font-medium line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="font-semibold">${product.price.toFixed(2)}</span>
        <Button size="sm" onClick={() => addToCart(product)}>
          Agregar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
