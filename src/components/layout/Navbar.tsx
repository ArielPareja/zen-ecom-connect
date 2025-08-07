import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const { settings } = useSettings();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="font-semibold text-lg">
          {settings.siteName}
        </Link>
        <div className="hidden md:flex items-center gap-2 w-1/2">
          <Input placeholder="Buscar productos..." onKeyDown={(e) => {
            const el = e.currentTarget as HTMLInputElement;
            if (e.key === 'Enter') {
              const q = el.value.trim();
              window.location.href = q ? `/buscar?q=${encodeURIComponent(q)}` : "/buscar";
            }
          }} aria-label="Buscar productos" />
          <Button asChild variant="secondary">
            <Link to="/buscar" aria-label="Ir a búsqueda">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link to="/buscar">Buscar</Link>
          </Button>
          <Button asChild variant="default" className="relative">
            <Link to="/carrito" aria-label="Ir al carrito">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs h-5 min-w-5 px-1">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
