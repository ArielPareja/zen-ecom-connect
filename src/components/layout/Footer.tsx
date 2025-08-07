import { useSettings } from "@/context/SettingsContext";

const Footer = () => {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 grid gap-6 md:grid-cols-3">
        <div>
          <h2 className="text-lg font-semibold">{settings.siteName}</h2>
          {settings.footer.note && (
            <p className="text-sm text-muted-foreground mt-2">{settings.footer.note}</p>
          )}
        </div>
        <div>
          <h3 className="font-medium mb-2">Contacto</h3>
          {settings.footer.address && (
            <p className="text-sm text-muted-foreground">{settings.footer.address}</p>
          )}
          {settings.footer.email && (
            <p className="text-sm text-muted-foreground">{settings.footer.email}</p>
          )}
        </div>
        <div>
          <h3 className="font-medium mb-2">WhatsApp</h3>
          {settings.whatsapp.phone ? (
            <a
              className="text-sm text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
              href={`https://wa.me/${settings.whatsapp.phone}`}
            >
              Escríbenos por WhatsApp
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">No hay número configurado.</p>
          )}
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 text-xs text-muted-foreground">
          © {year} {settings.siteName}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
