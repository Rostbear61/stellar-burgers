import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TFeedsResponse, getFeedsApi } from '../../utils/burger-api';

interface FeedsState {
  data: TFeedsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeedsState = {
  data: null,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: string }
>('feeds/fetchFeeds', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error) {
    return rejectWithValue('Ошибка при загрузке данных');
  }
});

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const feedReducer = feedsSlice.reducer;
