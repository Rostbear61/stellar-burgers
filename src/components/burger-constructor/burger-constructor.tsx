import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { TIngredient } from '@utils-types';
import { useAppDispatch } from '../../services/hooks/useAppDispatch';
import { createOrder } from '../../services/slices/order';
import { useNavigate } from 'react-router-dom';
import {
  setOrderRequest,
  setOrderModalData,
  selectOrderRequest,
  selectOrderModalData
} from '../../services/slices/order';
import { useCallback } from 'react';
import { clearIngredients } from '../../services/slices/constructor';

export const BurgerConstructor: FC = () => {
  const items = useSelector(
    (state: RootState) => state.constructor.ingredients
  );
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const authUser = useSelector((state: RootState) => state.user.user);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  type TConstructorBun = {
    _id: string;
    name: string;
    image: string;
    price: number;
  };

  type TConstructorItems = {
    bun: TConstructorBun | null;
    ingredients: TIngredient[];
  };

  const constructorItems = useMemo(() => {
    const result: TConstructorItems = {
      bun: null,
      ingredients: items || []
    };

    if (items) {
      const bunItem = items.find((item) => item.type === 'bun');
      if (bunItem) {
        result.bun = {
          _id: bunItem._id,
          name: bunItem.name,
          image: bunItem.image,
          price: bunItem.price
        };
      }
      result.ingredients = items.filter((item) => item.type !== 'bun');
    }

    return result;
  }, [items]);

  const onOrderClick = useCallback(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || constructorItems.ingredients.length === 0) {
      return;
    }

    if (orderRequest) return;

    dispatch(setOrderRequest(true));
    const ids = [
      constructorItems.bun._id,
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];

    dispatch(createOrder(ids))
      .unwrap()
      .then((result) => {
        if (result.success) {
          dispatch(setOrderModalData(result.order));
          dispatch(clearIngredients());
        }
      })
      .catch((error) => {
        console.error('Ошибка при создании заказа:', error);
      })
      .finally(() => {
        dispatch(setOrderRequest(false));
      });
  }, [authUser, constructorItems, orderRequest, dispatch, navigate]);

  const closeOrderModal = useCallback(() => {
    dispatch(setOrderModalData(null));
  }, [dispatch]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
