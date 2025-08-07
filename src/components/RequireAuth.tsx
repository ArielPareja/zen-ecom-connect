import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const loc = useLocation();
  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth') === 'true';
    if (!isAuth) {
      navigate('/admin/login?next=' + encodeURIComponent(loc.pathname + loc.search), { replace: true });
    }
  }, [navigate, loc]);
  return <>{children}</>;
};

export default RequireAuth;
