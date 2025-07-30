import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { useAppDispatch } from '../../services/hooks/useAppDispatch';
import { TRegisterData } from '../../utils/burger-api';
import { updateProfile } from '../../services/slices/user';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [isInitialized, setIsInitialized] = useState(false);
  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });
  useEffect(() => {
    if (user && !isInitialized) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  const isFormChanged =
    isInitialized &&
    (formValue.name !== user?.name ||
      formValue.email !== user?.email ||
      formValue.password !== '');
  /*const userName = useSelector(
    (state: RootState) => state.user.user?.name || ''
  );
  const userEmail = useSelector(
    (state: RootState) => state.user.user?.email || ''
  );

  const user = {
    name: userName,
    email: userEmail
  };

  /*const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (userName && userEmail) {
      setFormValue({
        name: userName,
        email: userEmail,
        password: ''
      });
    }
  }, [userName, userEmail]);

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: userName,
      email: userEmail
    }));
  }, [userName, userEmail]);

  const isFormChanged =
    formValue.name !== userName ||
    formValue.email !== userEmail ||
    formValue.password !== '';*/

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!user) return;

    const updateData: Partial<TRegisterData> = {};
    if (formValue.name !== user.name) updateData.name = formValue.name;
    if (formValue.email !== user.email) updateData.email = formValue.email;
    if (formValue.password) updateData.password = formValue.password;
    dispatch(updateProfile(updateData))
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({ ...prev, password: '' }));
      })
      .catch(() => {
        console.log('error');
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!user) return;

    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
