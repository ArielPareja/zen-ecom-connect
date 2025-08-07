import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ResetPassword = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Contraseña restablecida correctamente.');
  };

  return (
    <div className="container py-10 max-w-md">
      <SEO title="Restablecer contraseña" description="Ingresa tu nueva contraseña" canonical={window.location.origin + '/admin/reset-password'} />
      <h1 className="text-2xl font-semibold mb-6">Restablecer contraseña</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Nueva contraseña</label>
          <Input type="password" required placeholder="••••••••" />
        </div>
        <div>
          <label className="text-sm font-medium">Confirmar contraseña</label>
          <Input type="password" required placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full">Guardar</Button>
      </form>
    </div>
  );
};

export default ResetPassword;
