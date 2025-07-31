import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  orderBurgerApi,
  getOrderByNumberApi,
  getFeedsApi,
  TFeedsResponse
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { RootState } from '../store';
import { PayloadAction } from '@reduxjs/toolkit';

interface OrdersState {
  userOrders: TOrder[];
  currentOrder: TOrder | null;
  feed: {
    orders: TOrder[];
    total: number;
    totalToday: number;
  };
  isLoading: boolean;
  error: string | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: OrdersState = {
  userOrders: [],
  currentOrder: null,
  feed: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: null,
  orderRequest: false,
  orderModalData: null
};

export const fetchUserOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const fetchFeed = createAsyncThunk<TFeedsResponse>(
  'orders/fetchFeed',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[], { dispatch }) => {
    const response = await orderBurgerApi(ingredients);
    if (response.success) {
      const fullOrder = await getOrderByNumberApi(response.order.number);
      if (fullOrder.success) {
        return {
          ...response,
          order: fullOrder.orders[0]
        };
      }
    }
    return response;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
    clearUserOrders(state) {
      state.userOrders = [];
    },
    setOrderRequest(state, action: PayloadAction<boolean>) {
      state.orderRequest = action.payload;
    },
    setOrderModalData(state, action: PayloadAction<TOrder | null>) {
      state.orderModalData = action.payload;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось загрузить историю заказов';
      })
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.feed = {
            orders: action.payload.orders,
            total: action.payload.total,
            totalToday: action.payload.totalToday
          };
        }
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось загрузить ленту заказов';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        if (action.payload.success) {
          state.currentOrder = action.payload.order;
          state.userOrders.unshift(action.payload.order);
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось создать заказ';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.orders.length > 0) {
          const fullOrder = action.payload.orders[0];
          state.currentOrder = fullOrder;
          state.userOrders = state.userOrders.map((order) =>
            order.number === fullOrder.number ? fullOrder : order
          );
        }
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось найти заказ';
      });
  }
});

export const {
  clearCurrentOrder,
  clearUserOrders,
  setOrderRequest,
  setOrderModalData,
  clearError
} = ordersSlice.actions;

export const selectUserOrders = (state: RootState) => state.order.userOrders;
export const selectFeed = (state: RootState) => state.order.feed;
export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectOrdersLoading = (state: RootState) => state.order.isLoading;
export const selectOrdersError = (state: RootState) => state.order.error;
export const orderReducer = ordersSlice.reducer;
