import { fetchIngredients } from '../src/services/slices/ingredients'; 
import { ingredientsReducer } from '../src/services/slices/ingredients';

describe('ingredients slice', () => {
  const initialState = {
    products: [],
    load: false,
    error: null
  };

  it('should set load to true and reset error on fetchIngredients.pending', () => {
    const state = ingredientsReducer(initialState, { type: fetchIngredients.pending.type });
    expect(state.load).toBe(false); 
    expect(state.error).toBeNull();
  });

  it('should update products and set load to true on fetchIngredients.fulfilled', () => {
    const mockData = [
      { _id: '1', name: 'Ingredient1', type: 'bun', price: 100 },
      { _id: '2', name: 'Ingredient2', type: 'main', price: 200 }
    ];
    const state = ingredientsReducer(initialState, { type: fetchIngredients.fulfilled.type, payload: mockData });
    expect(state.products).toEqual(mockData);
    expect(state.load).toBe(true);
  });

  it('should set load to false and set error message on fetchIngredients.rejected', () => {
    const state = ingredientsReducer(initialState, { type: fetchIngredients.rejected.type });
    expect(state.load).toBe(false);
    expect(state.error).toBe('Ошибка при загрузке ингредиентов');
  });
});