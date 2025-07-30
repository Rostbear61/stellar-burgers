import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  /** TODO: взять переменную из стора */
  const items: TIngredient[] | null = useSelector(
    (state: RootState) => state.constructor.ingredients
  );

  type TburgerConstructorBun = {
    _id: string;
  };

  type TburgerConstructor = {
    bun: TburgerConstructorBun | null;
    ingredients: TIngredient[];
  };

  const burgerConstructor: TburgerConstructor = {
    bun: {
      _id: ''
    },
    ingredients: []
  };

  if (items) {
    const bunItem = items.find((item) => item.type === 'bun');

    if (bunItem) {
      burgerConstructor.bun = {
        _id: bunItem._id
      };
    }
    burgerConstructor.ingredients = items.filter((item) => item.type !== 'bun');
  }

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
