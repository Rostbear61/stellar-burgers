// hooks/useUserOrders.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../store';
import {
  fetchUserOrders,
  selectUserOrders,
  selectOrdersLoading,
  selectOrdersError,
  fetchOrderByNumber
} from '../slices/order';
import { RootState } from '../store';
import type { AppDispatch } from '../store';

export const useUserOrders = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const refreshOrders = () => dispatch(fetchUserOrders());

  return {
    orders,
    isLoading,
    error,
    refreshOrders
  };
};
