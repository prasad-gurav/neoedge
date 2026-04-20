import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((s) => s.session.user);
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
