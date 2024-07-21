import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppDispatch, useDispatch } from '../../services/store';
import {
  fetchOrders,
  selectOrders,
  selectLoading
} from '../../slices/ordersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectLoading);

  useEffect(() => {
    // если orders нет в сторе, загружаем их
    if (!orders.length) {
      dispatch(fetchOrders());
    }
  }, [dispatch]);

  if (loading) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
