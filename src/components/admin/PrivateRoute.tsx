import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppRedux';
import { RootState } from '../../store/store';

interface PrivateRouteProps {
  children?: React.ReactNode;
  requiredRole?: "ADMIN";
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, currentUser } = useAppSelector((state: RootState) => state.user);

  // 1. Chưa đăng nhập -> Đá về Login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 2. Check Role (CHỈ CHECK NẾU CÓ TRUYỀN requiredRole)
  // Nếu bên App.tsx không truyền requiredRole thì đoạn này sẽ được bỏ qua -> Cho phép tất cả
  if (requiredRole && currentUser?.role !== requiredRole) {
    // alert("Bạn không có quyền truy cập!");
    return <Navigate to="/" replace />;
  }

  // 3. Hợp lệ -> Cho vào
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;