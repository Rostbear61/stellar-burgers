import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { TOrder } from '@utils-types';
import { RootState, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const data = useSelector((state: RootState) => state.feed.data);
  const orders: TOrder[] = data?.orders ?? [];
  const { number } = useParams<{ number: string }>();
  const order = orders.find((item) => String(item.number) === number);

  const orderData = {
    createdAt: order?.createdAt ?? 'string',
    ingredients: order?.ingredients ?? [],
    _id: order?._id ?? '',
    status: order?.status ?? '',
    name: order?.name ?? '',
    updatedAt: order?.updatedAt ?? '',
    number: order?.number ?? 0
  };

  const ingredients: TIngredient[] = useSelector(
    (state: RootState) => state.ingredients.products
  );

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
