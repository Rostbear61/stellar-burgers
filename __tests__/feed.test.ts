import { feedReducer, fetchFeeds } from '../src/services/slices/feed';
import { getFeedsApi, TFeedsResponse } from '../src/utils/burger-api';

// Мокаем API вызов
jest.mock('../src/utils/burger-api');

describe('feedSlice', () => {
  const mockFeedsData: TFeedsResponse = {
    orders: [
      {
        _id: '123',
        number: 123,
        status: 'done',
        name: 'name',
        ingredients: [],
        createdAt: '',
        updatedAt: ''
      }
    ],
    success: true,
    total: 100,
    totalToday: 10
  };

  const initialState = {
    data: null,
    loading: false,
    error: null
  };

  it('should return the initial state', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchFeeds thunk', () => {
    it('should handle pending state', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        data: null,
        loading: true,
        error: null
      });
    });

    it('should handle fulfilled state', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeedsData
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        data: mockFeedsData,
        loading: false,
        error: null
      });
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Network Error';
      const action = {
        type: fetchFeeds.rejected.type,
        payload: errorMessage
      };
      const state = feedReducer(initialState, action);

      expect(state).toEqual({
        data: null,
        loading: false,
        error: errorMessage
      });
    });
  });

  describe('async thunks', () => {
    it('fetchFeeds should call getFeedsApi and return data', async () => {
      (getFeedsApi as jest.Mock).mockResolvedValue(mockFeedsData);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const extra = {};

      const result = await fetchFeeds()(dispatch, getState, extra);

      expect(getFeedsApi).toHaveBeenCalledTimes(1);
      expect(result.payload).toEqual(mockFeedsData);
    });

    it('fetchFeeds should handle error', async () => {
      const errorMessage = 'Ошибка при загрузке данных';
      (getFeedsApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      const getState = jest.fn();
      const extra = {};

      const result = await fetchFeeds()(dispatch, getState, extra);

      expect(result.payload).toBe(errorMessage);
    });
  });
});
