import { Link, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const { items, totalPrice, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container py-10">
      <SEO title="Carrito" description="Revisa y finaliza tu compra por WhatsApp" canonical={window.location.origin + '/carrito'} />
      <h1 className="text-2xl font-semibold mb-6">Carrito</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Tu carrito está vacío. <Link className="text-primary underline" to="/buscar">Explora productos</Link></p>
      ) : (
        <div className="grid gap-6">
          <ul className="divide-y">
            {items.map((i) => (
              <li key={i.product._id} className="flex items-center justify-between py-4">
                <div>
                  <div className="font-medium">{i.product.name}</div>
                  <div className="text-sm text-muted-foreground">x{i.quantity} — ${(i.product.price * i.quantity).toFixed(2)}</div>
                </div>
                <Button variant="ghost" onClick={() => removeFromCart(i.product._id)}>Quitar</Button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={clearCart}>Vaciar</Button>
              <Button onClick={() => navigate('/checkout')}>Finalizar por WhatsApp</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
