import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ForgotPassword = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Si el email existe, recibirás un enlace para restablecer tu contraseña.');
  };

  return (
    <div className="container py-10 max-w-md">
      <SEO title="Recuperar contraseña" description="Ingresa tu email para recibir un enlace" canonical={window.location.origin + '/admin/forgot-password'} />
      <h1 className="text-2xl font-semibold mb-6">Recuperar contraseña</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input type="email" required placeholder="tu@correo.com" />
        </div>
        <Button type="submit" className="w-full">Enviar enlace</Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
