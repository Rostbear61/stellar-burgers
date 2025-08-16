import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearIngredients,
  TConstructorState
} from '../src/services/slices/constructor';
import { v4 as uuidv4 } from 'uuid';
import { TIngredient, TConstructorIngredient } from '../src/utils/types';

// Мокаем uuidv4 для предсказуемых тестов
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid')
}));

describe('constructor slice', () => {
  const ingredientBase: TIngredient = {
    _id: 'test-id',
    name: 'Test Ingredient',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: 'url-to-image',
    image_large: 'url-to-large-image',
    image_mobile: 'url-to-mobile-image'
  };
  const initialState = {
    ingredients: null
  };

  it('should handle addIngredient for non-bun ingredient', () => {
    const ingredient = { ...ingredientBase, type: 'main' };
    const action = addIngredient(ingredient);
    const newState = constructorReducer({ ingredients: null }, action);

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients![0]).toMatchObject({
      ...ingredient,
      id: 'mocked-uuid'
    });
  });

  it('should replace bun if adding a new bun', () => {
    // сначала добавим бун
    const bun1 = { ...ingredientBase, type: 'bun' };
    let state = constructorReducer(initialState, addIngredient(bun1));

    // добавим другой бун
    const bun2 = { ...ingredientBase, type: 'bun' };
    const action = addIngredient(bun2);
    state = constructorReducer(state, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients![0]).toMatchObject({
      ...bun2,
      id: 'mocked-uuid'
    });
  });

  it('should handle removeIngredient correctly', () => {
    const ingredient1 = { ...ingredientBase, id: 'id1', type: 'main' };
    const ingredient2 = { ...ingredientBase, id: 'id2', type: 'main' };

    const stateWithIngredients = {
      ingredients: [ingredient1, ingredient2]
    };

    // Удаляем один ингредиент
    const newState = constructorReducer(
      stateWithIngredients,
      removeIngredient('id1')
    );

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients![0].id).toBe('id2');

    // Удаляем последний ингредиент
    const finalState = constructorReducer(newState, removeIngredient('id2'));

    expect(finalState.ingredients).toBeNull();
  });

  it('should handle moveIngredient up and down correctly', () => {
    const ing1 = { ...ingredientBase, id: 'id1' };
    const ing2 = { ...ingredientBase, id: 'id2' };
    const ing3 = { ...ingredientBase, id: 'id3' };

    const initialIngredients: TConstructorIngredient[] = [ing1, ing2, ing3];

    let state: TConstructorState = {
      ingredients: [...initialIngredients]
    };

    // Исходный порядок: [id1, id2, id3]

    // Перемещение id3 вверх (должно стать: [id1, id3, id2])
    state = constructorReducer(
      state,
      moveIngredient({ id: 'id3', direction: 'up' })
    );

    expect(state.ingredients![0].id).toBe('id1');
    expect(state.ingredients![1].id).toBe('id3');
    expect(state.ingredients![2].id).toBe('id2');

    // Теперь порядок: [id1, id3, id2]
    // Перемещение id3 вниз (должно стать: [id1, id2, id3])
    state = constructorReducer(
      state,
      moveIngredient({ id: 'id3', direction: 'down' })
    );

    expect(state.ingredients![0].id).toBe('id1');
    expect(state.ingredients![1].id).toBe('id2');
    expect(state.ingredients![2].id).toBe('id3');

    // Попытка переместить первый элемент вверх - ничего не произойдет
    state = constructorReducer(
      state,
      moveIngredient({ id: 'id1', direction: 'up' })
    );

    expect(state.ingredients![0].id).toBe('id1');

    // Попытка переместить последний элемент вниз - ничего не произойдет
    state = constructorReducer(
      state,
      moveIngredient({ id: 'id3', direction: 'down' })
    );

    expect(state.ingredients![2].id).toBe('id3');
  });

  it('should handle clearIngredients correctly', () => {
    const ingredient = { ...ingredientBase, id: 'someId' };
    const stateWithIngredients = {
      ingredients: [ingredient]
    };

    const newState = constructorReducer(
      stateWithIngredients,
      clearIngredients()
    );
    expect(newState.ingredients).toBeNull();
  });
});
