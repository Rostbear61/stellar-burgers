import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useAppDispatch } from '../../services/hooks/useAppDispatch';
import { RootState } from '../../services/store';
import { useSelector } from 'react-redux';
import { login } from '../../services/slices/user';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { error } = useSelector((state: RootState) => state.user);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
