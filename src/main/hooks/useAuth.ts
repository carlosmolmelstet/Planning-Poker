import { useContext } from 'react';
import { AuthContext } from 'data/contexts';

export function useAuth() {
  const value = useContext(AuthContext);

  return value;
}