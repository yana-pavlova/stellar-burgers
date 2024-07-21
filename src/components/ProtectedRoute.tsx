import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import { fetchUser, selectLoading, selectUser } from '../slices/userSlice';
import { Preloader } from '@ui';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { TUser } from '@utils-types';
import { NotFound404 } from '@pages';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const location = useLocation();

  if (loading) return <Preloader />;

  if (!user && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (user && onlyUnAuth) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
