import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feed';
import { useAppDispatch } from '../../services/hooks/useAppDispatch';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const data = useSelector((state: RootState) => state.feed.data);
  const orders: TOrder[] = data?.orders ?? [];

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchFeeds());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleRefresh} />;
};
