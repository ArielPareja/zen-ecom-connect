import { useEffect } from "react";
import SEO from "@/components/SEO";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { buildWhatsAppUrl } from "@/services/whatsapp";
import { Button } from "@/components/ui/button";

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { settings } = useSettings();

  const url = buildWhatsAppUrl(items, settings);

  useEffect(() => {
    if (items.length > 0) {
      window.open(url, '_blank', 'noopener');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container py-10">
      <SEO title="Checkout por WhatsApp" description="Completa tu compra por WhatsApp" canonical={window.location.origin + '/checkout'} />
      <h1 className="text-2xl font-semibold mb-4">Finalizar compra</h1>
      <p className="text-muted-foreground mb-6">Se abrirá una conversación de WhatsApp con el detalle de tu pedido.</p>
      <div className="flex gap-3">
        <Button asChild>
          <a href={url} target="_blank" rel="noreferrer">Abrir WhatsApp</a>
        </Button>
        <Button variant="outline" onClick={clearCart}>Vaciar carrito</Button>
      </div>
    </div>
  );
};

export default Checkout;
