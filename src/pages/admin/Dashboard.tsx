import { useQuery } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { getStats } from "@/services/products";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { data } = useQuery({ queryKey: ['stats'], queryFn: getStats });
  const navigate = useNavigate();

  return (
    <div className="container py-10">
      <SEO title="Panel - Admin" description="Estadísticas de la tienda" canonical={window.location.origin + '/admin'} />
      <h1 className="text-2xl font-semibold mb-6">Panel</h1>
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Activos</div>
          <div className="text-2xl font-semibold">{data?.active ?? '-'}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-2xl font-semibold">{data?.total ?? '-'}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Inactivos</div>
          <div className="text-2xl font-semibold">{data?.inactive ?? '-'}</div>
        </div>
      </div>
      <div className="mt-8 flex gap-3">
        <Button onClick={() => navigate('/admin/productos')}>Gestionar productos</Button>
        <Button variant="outline" onClick={() => navigate('/admin/configuracion')}>Configuración del sitio</Button>
      </div>
    </div>
  );
};

export default Dashboard;
