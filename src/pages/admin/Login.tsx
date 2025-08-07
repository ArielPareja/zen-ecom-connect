import { useSearchParams, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder reCAPTCHA y auth. Integrar con Supabase para producción.
    localStorage.setItem('admin_auth', 'true');
    const next = params.get('next') || '/admin';
    navigate(next);
  };

  return (
    <div className="container py-10 max-w-md">
      <SEO title="Ingresar - Admin" description="Acceso administrativo" canonical={window.location.origin + '/admin/login'} />
      <h1 className="text-2xl font-semibold mb-6">Ingresar</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input type="email" required placeholder="admin@correo.com" />
        </div>
        <div>
          <label className="text-sm font-medium">Contraseña</label>
          <Input type="password" required placeholder="••••••••" />
        </div>
        <div className="rounded-md border p-3 text-xs text-muted-foreground">reCAPTCHA aquí</div>
        <Button type="submit" className="w-full">Ingresar</Button>
        <Button variant="link" type="button" onClick={() => navigate('/admin/forgot-password')}>¿Olvidaste tu contraseña?</Button>
      </form>
    </div>
  );
};

export default Login;
