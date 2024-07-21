import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectLoading } from '../../slices/burgerSlice';
import { selectUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { sendOrder } from '../../slices/burgerSlice';
import { AppDispatch } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const loading: boolean = useSelector(selectLoading);
  const cartItems = useSelector(selectCartItems);
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const constructorItems = useMemo(() => {
    const bun = cartItems.find((item) => item.type === 'bun');
    const otherIngredients = cartItems.filter((item) => item.type !== 'bun');
    return {
      bun: bun ? { ...bun, id: bun._id } : null,
      ingredients: otherIngredients.map((ingredient) => ({
        ...ingredient
      }))
    };
  }, [cartItems]);

  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const onOrderClick = () => {
    if (!constructorItems.bun || !constructorItems.ingredients.length) return;
    if (!user) return navigate('/login');

    const ingredients = [
      constructorItems.bun.id,
      ...constructorItems.ingredients.map((item) => item._id)
    ];
    dispatch(sendOrder(ingredients))
      .unwrap() // unwrap получает результат санки как обычный промис
      .then((response) => {
        const newOrder = response.order;
        setOrderModalData(newOrder);
      })
      .catch((err) => {
        console.log('Ошибка при оформлении заказа:', err);
      });
  };

  const closeOrderModal = () => {
    setOrderModalData(null);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={loading}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
