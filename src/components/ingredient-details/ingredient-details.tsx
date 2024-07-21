import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from 'react-redux';
import {
  selectIngredients,
  selectLoading
} from '../../slices/ingredientsSlice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const loading = useSelector(selectLoading);
  const ingredients = useSelector(selectIngredients);
  const id = useParams().id;
  const ingredientData = ingredients.find((i) => i._id === id);

  if (loading) {
    return <Preloader />;
  }

  if (!ingredientData) return;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
