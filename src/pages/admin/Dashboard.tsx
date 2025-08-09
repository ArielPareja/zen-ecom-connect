import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // Redirect to products (now the main admin page)
  useEffect(() => {
    navigate('/admin/productos', { replace: true });
  }, [navigate]);

  return null;
};

export default Dashboard;
