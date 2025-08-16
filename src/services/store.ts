import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers
} from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userReducer } from './slices/user';
import { ingredientsReducer } from './slices/ingredients';
import { feedReducer } from './slices/feed';
import { constructorReducer } from './slices/constructor';
import { orderReducer } from './slices/order';
export const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  feed: feedReducer,
  constructor: constructorReducer,
  order: orderReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export default store;
