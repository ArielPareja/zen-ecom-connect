import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const err = localStorage.getItem('auth_error');
    if (err) {
      setError(err === 'expired' ? 'Tu sesión expiró. Por favor ingresa nuevamente.' : 'Autenticación inválida. Ingresa nuevamente.');
      localStorage.removeItem('auth_error');
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error de autenticación');
      }

      if (!data.access_token) {
        throw new Error('Token de acceso no recibido');
      }

      // Guardar el JWT token
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_auth', 'true');
      
      toast({
        title: "Login exitoso",
        description: "Bienvenido al panel de administración",
      });

      const next = params.get('next') || '/admin';
      navigate(next);

    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container py-10 max-w-md">
      <SEO title="Ingresar - Admin" description="Acceso administrativo" canonical={window.location.origin + '/admin/login'} />
      <h1 className="text-2xl font-semibold mb-6">Ingresar</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error de autenticación</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div>
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input 
            id="email"
            type="email" 
            required 
            placeholder="admin@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
          <Input 
            id="password"
            type="password" 
            required 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="rounded-md border p-3 text-xs text-muted-foreground">reCAPTCHA aquí</div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Ingresar'}
        </Button>
        <Button variant="link" type="button" onClick={() => navigate('/admin/forgot-password')}>¿Olvidaste tu contraseña?</Button>
      </form>
    </div>
  );
};

export default Login;
