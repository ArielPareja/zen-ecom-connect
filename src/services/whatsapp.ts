import { CartItem } from "@/context/CartContext";
import { SiteSettings } from "@/context/SettingsContext";

export function buildWhatsAppUrl(items: CartItem[], settings: SiteSettings): string {
  const lines = items.map((i) => `• ${i.product.name} x${i.quantity} — $${(i.product.price * i.quantity).toFixed(2)}`);
  const total = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const message = [
    settings.whatsapp.greeting,
    '',
    ...lines,
    '',
    `Total: $${total.toFixed(2)}`,
    '',
    settings.whatsapp.endOfMessage,
  ].join('\n');
  const phone = settings.whatsapp.phone || '';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return url;
}
