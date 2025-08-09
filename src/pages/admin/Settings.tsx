import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/context/SettingsContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Palette, MessageSquare, MapPin, ArrowLeft, Package } from "lucide-react";

const SettingsAdmin = () => {
  const { settings, saveSettings, saveFooter } = useSettings();
  const navigate = useNavigate();
  const [name, setName] = useState(settings.siteName);
  const [primary, setPrimary] = useState(settings.colors.primary);
  const [secondary, setSecondary] = useState(settings.colors?.secondary || '#f1f5f9');
  const [background, setBackground] = useState(settings.colors?.background || '#ffffff');
  const [phone, setPhone] = useState(settings.whatsapp.phone);
  const [greeting, setGreeting] = useState(settings.whatsapp.greeting);
  const [endOfMessage, setEndOfMessage] = useState(settings.whatsapp.endOfMessage);
  const [address, setAddress] = useState(settings.footer.address || '');
  const [email, setEmail] = useState(settings.footer.email || '');
  const [note, setNote] = useState(settings.footer.note || '');

  return (
    <div className="container py-10 max-w-6xl">
      <SEO title="Configuración - Admin" description="Personaliza tu tienda" canonical={window.location.origin + '/admin/configuracion'} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración del Sitio</h1>
          <p className="text-muted-foreground">Personaliza la apariencia y configuración de tu tienda</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin/productos')} variant="outline" className="gap-2">
            <Package className="h-4 w-4" />
            Productos
          </Button>
          <Button onClick={() => navigate('/admin')} variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Brand Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Marca y Diseño
              </CardTitle>
              <CardDescription>
                Configura el nombre de tu sitio y los colores de tu marca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre del sitio</label>
                <Input 
                  placeholder="Nombre de tu tienda" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Color primario</label>
                  <div className="flex items-center gap-3 mt-1">
                    <input 
                      type="color" 
                      value={primary} 
                      onChange={(e) => setPrimary(e.target.value)} 
                      className="h-10 w-16 p-1 border rounded-md"
                    />
                    <Input 
                      value={primary} 
                      onChange={(e) => setPrimary(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Color secundario</label>
                  <div className="flex items-center gap-3 mt-1">
                    <input 
                      type="color" 
                      value={secondary} 
                      onChange={(e) => setSecondary(e.target.value)} 
                      className="h-10 w-16 p-1 border rounded-md"
                    />
                    <Input 
                      value={secondary} 
                      onChange={(e) => setSecondary(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Color de fondo</label>
                  <div className="flex items-center gap-3 mt-1">
                    <input 
                      type="color" 
                      value={background} 
                      onChange={(e) => setBackground(e.target.value)} 
                      className="h-10 w-16 p-1 border rounded-md"
                    />
                    <Input 
                      value={background} 
                      onChange={(e) => setBackground(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => saveSettings({ siteName: name, colors: { primary, secondary, background } })} 
                className="w-full"
              >
                Guardar cambios de marca
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                WhatsApp
              </CardTitle>
              <CardDescription>
                Configura la integración con WhatsApp para recibir pedidos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <Input 
                  placeholder="Código país + número (ej: +1234567890)" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Mensaje de saludo</label>
                <Textarea 
                  placeholder="Hola! Me interesa este producto:" 
                  value={greeting} 
                  onChange={(e) => setGreeting(e.target.value)} 
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cierre del mensaje</label>
                <Textarea 
                  placeholder="¡Gracias!" 
                  value={endOfMessage} 
                  onChange={(e) => setEndOfMessage(e.target.value)} 
                  className="mt-1"
                  rows={2}
                />
              </div>
              <Button 
                onClick={() => saveSettings({ whatsapp: { phone, greeting, endOfMessage } as any })} 
                className="w-full"
              >
                Guardar configuración de WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Footer Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Información de Contacto
              </CardTitle>
              <CardDescription>
                Información que aparecerá en el pie de página de tu sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Dirección</label>
                <Input 
                  placeholder="Calle Principal 123, Ciudad, País" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email de contacto</label>
                <Input 
                  type="email"
                  placeholder="contacto@tutienda.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nota adicional</label>
                <Textarea 
                  placeholder="Información adicional, horarios de atención, etc." 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)} 
                  className="mt-1"
                  rows={4}
                />
              </div>
              <Button 
                onClick={() => saveFooter({ address, email, note })} 
                className="w-full"
              >
                Guardar información de contacto
              </Button>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa de Colores</CardTitle>
              <CardDescription>
                Así se verán los colores en tu sitio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="p-4 rounded-lg text-white"
                  style={{ backgroundColor: primary }}
                >
                  <div className="font-medium">Color Primario</div>
                  <div className="text-sm opacity-90">Botones principales y elementos destacados</div>
                </div>
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: secondary, color: primary }}
                >
                  <div className="font-medium">Color Secundario</div>
                  <div className="text-sm opacity-75">Elementos de apoyo y fondos suaves</div>
                </div>
                <div 
                  className="p-4 rounded-lg border"
                  style={{ backgroundColor: background }}
                >
                  <div className="font-medium" style={{ color: primary }}>Color de Fondo</div>
                  <div className="text-sm text-gray-600">Fondo principal del sitio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
