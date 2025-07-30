import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { RootState } from '../../services/store';
import { useSelector } from 'react-redux';
import { register } from '../../services/slices/user';
import { useAppDispatch } from '../../services/hooks/useAppDispatch';

export const Register: FC = () => {
  const [name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const { error } = useSelector((state: RootState) => state.user);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(register({ email, password, name }));
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={name}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
