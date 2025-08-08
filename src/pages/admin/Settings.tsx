import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/context/SettingsContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SettingsAdmin = () => {
  const { settings, saveSettings, saveFooter } = useSettings();
  const navigate = useNavigate();
  const [name, setName] = useState(settings.siteName);
  const [primary, setPrimary] = useState(settings.colors.primary);
  const [phone, setPhone] = useState(settings.whatsapp.phone);
  const [greeting, setGreeting] = useState(settings.whatsapp.greeting);
  const [endOfMessage, setEndOfMessage] = useState(settings.whatsapp.endOfMessage);
  const [address, setAddress] = useState(settings.footer.address || '');
  const [email, setEmail] = useState(settings.footer.email || '');
  const [note, setNote] = useState(settings.footer.note || '');

  return (
    <div className="container py-10 max-w-2xl">
      <SEO title="Configuración - Admin" description="Personaliza tu tienda" canonical={window.location.origin + '/admin/configuracion'} />
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate('/admin')}>← Volver</Button>
      </div>
      <h1 className="text-2xl font-semibold mb-6">Configuración del sitio</h1>

      <section className="space-y-4 mb-8">
        <h2 className="font-medium">Marca</h2>
        <Input placeholder="Nombre del sitio" value={name} onChange={(e) => setName(e.target.value)} />
        <div>
          <label className="text-sm font-medium">Color primario</label>
          <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="ml-3 h-8 w-12 p-0 border rounded" />
        </div>
        <Button onClick={() => saveSettings({ siteName: name, colors: { primary } })}>Guardar cambios</Button>
      </section>

      <section className="space-y-4 mb-8">
        <h2 className="font-medium">WhatsApp</h2>
        <Input placeholder="Teléfono (código país + número)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Textarea placeholder="Saludo" value={greeting} onChange={(e) => setGreeting(e.target.value)} />
        <Textarea placeholder="Cierre del mensaje" value={endOfMessage} onChange={(e) => setEndOfMessage(e.target.value)} />
        <Button onClick={() => saveSettings({ whatsapp: { phone, greeting, endOfMessage } as any })}>Guardar WhatsApp</Button>
      </section>

      <section className="space-y-4">
        <h2 className="font-medium">Footer</h2>
        <Input placeholder="Dirección" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Textarea placeholder="Nota" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button onClick={() => saveFooter({ address, email, note })}>Guardar Footer</Button>
      </section>
    </div>
  );
};

export default SettingsAdmin;
