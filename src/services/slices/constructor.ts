import { TIngredient } from '../../utils/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export interface TConstructorState {
  ingredients: TConstructorIngredient[] | null;
}

const initialState: TConstructorState = {
  ingredients: null
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        const newIngredient = action.payload;
        const currentIngredients = state.ingredients ?? [];

        if (newIngredient.type === 'bun') {
          const otherIngredients = currentIngredients.filter(
            (ing) => ing.type !== 'bun'
          );
          return {
            ...state,
            ingredients: [...otherIngredients, newIngredient]
          };
        }

        return {
          ...state,
          ingredients: [...currentIngredients, newIngredient]
        };
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            id: uuidv4() // Генерируем id здесь
          }
        };
      }
    },

    removeIngredient(state, action: PayloadAction<string>) {
      if (!state.ingredients) return;

      const newIngredients = state.ingredients.filter(
        (ing) => ing.id !== action.payload // Используем id для фильтрации
      );
      return {
        ...state,
        ingredients: newIngredients.length > 0 ? newIngredients : null
      };
    },

    moveIngredient(
      state,
      action: PayloadAction<{ id: string; direction: 'up' | 'down' }>
    ) {
      if (!state.ingredients) return;

      const { id, direction } = action.payload;
      const index = state.ingredients.findIndex((ing) => ing.id === id); // Используем id для поиска

      if (index === -1) return;
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === state.ingredients.length - 1)
        return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      const newIngredients = [...state.ingredients];

      [newIngredients[index], newIngredients[newIndex]] = [
        newIngredients[newIndex],
        newIngredients[index]
      ];

      return {
        ...state,
        ingredients: newIngredients
      };
    },

    clearIngredients(state) {
      state.ingredients = null;
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  clearIngredients,
  moveIngredient
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
