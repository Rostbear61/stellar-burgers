import { orderReducer, OrdersState } from '../src/services/slices/order';
import {
  fetchUserOrders,
  fetchFeed,
  createOrder,
  fetchOrderByNumber
} from '../src/services/slices/order';
import { TOrder } from '../src/utils/types';

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

describe('orders slice', () => {
  it('should handle fetchUserOrders.pending', () => {
    const state = orderReducer(initialState, {
      type: fetchUserOrders.pending.type
    });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchUserOrders.fulfilled', () => {
    const mockOrders = [{ number: 1, name: 'Order1' }];
    const state = orderReducer(initialState, {
      type: fetchUserOrders.fulfilled.type,
      payload: mockOrders
    });
    expect(state.isLoading).toBe(false);
    expect(state.userOrders).toEqual(mockOrders);
  });

  it('should handle fetchUserOrders.rejected', () => {
    const errorMsg = 'Error fetching orders';
    const state = orderReducer(initialState, {
      type: fetchUserOrders.rejected.type,
      error: { message: errorMsg }
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });

  // Аналогично для fetchFeed
  it('should handle fetchFeed.pending', () => {
    const state = orderReducer(initialState, { type: fetchFeed.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchFeed.fulfilled with success true', () => {
    const payload = {
      success: true,
      orders: [{ number: 2 }],
      total: 10,
      totalToday: 2
    };
    const state = orderReducer(initialState, {
      type: fetchFeed.fulfilled.type,
      payload
    });
    expect(state.isLoading).toBe(false);
    expect(state.feed.orders).toEqual(payload.orders);
    expect(state.feed.total).toBe(10);
  });

  it('should handle fetchFeed.fulfilled with success false', () => {
    const payload = { success: false };
    const state = orderReducer(initialState, {
      type: fetchFeed.fulfilled.type,
      payload
    });
    // В вашем коде при success=false ничего не меняется явно, можно проверить что состояние осталось без изменений или оставить как есть.
    expect(state.isLoading).toBe(false);
  });

  it('should handle fetchFeed.rejected', () => {
    const errorMsg = 'Error fetching feed';
    const state = orderReducer(initialState, {
      type: fetchFeed.rejected.type,
      error: { message: errorMsg }
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });

  // Тест для createOrder
  it('should handle createOrder.pending', () => {
    const state = orderReducer(initialState, {
      type: createOrder.pending.type
    });
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle createOrder.fulfilled with success true', () => {
    const newOrder = { number: 123 };
    const payload = {
      success: true,
      order: newOrder
    };

    const prevState = { ...initialState };

    const state = orderReducer(prevState, {
      type: createOrder.fulfilled.type,
      payload
    });

    expect(state.orderRequest).toBe(false);
    expect(state.currentOrder).toEqual(newOrder);

    // Проверка что заказ добавился в userOrders
    expect(state.userOrders[0]).toEqual(newOrder);
  });

  it('should handle createOrder.rejected', () => {
    const errorMsg = 'Create order failed';
    const state = orderReducer(initialState, {
      type: createOrder.rejected.type,
      error: { message: errorMsg }
    });
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(errorMsg);
  });

  // Для fetchOrderByNumber
  it('should handle fetchOrderByNumber.pending', () => {
    const state = orderReducer(initialState, {
      type: fetchOrderByNumber.pending.type
    });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchOrderByNumber.fulfilled with success true and orders array', () => {
    // Создаем полноценный заказ, соответствующий типу TOrder
    const fullOrder: TOrder = {
      _id: 'abc123',
      status: 'done',
      name: 'Test Order',
      createdAt: '2023-10-01T12:00:00Z',
      updatedAt: '2023-10-01T12:30:00Z',
      number: 5,
      ingredients: ['ingredient1', 'ingredient2']
    };

    const payload = {
      success: true,
      orders: [fullOrder]
    };

    // Предварительно добавляем заказ в userOrders для проверки обновления
    const prevState = {
      ...initialState,
      userOrders: [
        {
          _id: 'xyz789',
          status: 'pending',
          name: 'Old Order',
          createdAt: '2023-09-30T10:00:00Z',
          updatedAt: '2023-09-30T10:30:00Z',
          number: 5,
          ingredients: ['ingredientX']
        }
      ],
      currentOrder: null
    };

    const newState = orderReducer(prevState, {
      type: fetchOrderByNumber.fulfilled.type,
      payload
    });

    // Проверяем, что currentOrder обновился
    expect(newState.currentOrder).toEqual(fullOrder);

    // Проверка, что заказ в userOrders обновился
    expect(newState.userOrders[0]).toEqual(fullOrder);
  });

  it('should handle fetchOrderByNumber.rejected', () => {
    const errorMsg = 'Error fetching order by number';
    const state = orderReducer(initialState, {
      type: fetchOrderByNumber.rejected.type,
      error: { message: errorMsg }
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });
});
