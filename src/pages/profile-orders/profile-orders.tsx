import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectUserOrders, fetchUserOrders } from '../../services/slices/order';
import { useEffect } from 'react';
import { useAppDispatch } from '../../services/hooks/useAppDispatch';
import { ProfileMenu } from '@components';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(selectUserOrders);

  return <ProfileOrdersUI orders={orders} />;
};
