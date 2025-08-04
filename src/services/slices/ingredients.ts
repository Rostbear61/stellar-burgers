import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '../../utils/burger-api';

interface TIngredientsState {
  products: TIngredient[];
  load: boolean;
  error: string | null;
}

const initialState: TIngredientsState = {
  products: [],
  load: false,
  error: null
};
export const fetchIngredients = createAsyncThunk(
  'product/fetchIngredients',
  async (_, thunkAPI) => {
    const data = await getIngredientsApi();
    return data;
  }
);

const IngredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<TIngredient[]>) {
      state.products = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.load = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.load = false;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.products = action.payload;
        state.load = true;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.load = false;
        state.error = 'Ошибка при загрузке ингредиентов';
      });
  }
});

export const ingredientsReducer = IngredientsSlice.reducer;
