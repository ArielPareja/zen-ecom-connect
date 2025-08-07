import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

type Props = { products: Product[] };

const ProductGrid = ({ products }: Props) => {
  return (
    <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
