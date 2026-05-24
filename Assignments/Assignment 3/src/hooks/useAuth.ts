import { useAppContext } from '../store/AppContext';
import { removeFromStorage, STORAGE_KEYS } from '../utils/storage';
import { User } from '../store/types';

const useAuth = () => {
  const { state, dispatch } = useAppContext();

  // Dummy login — in a real app this would call an auth API
  const login = (name: string): void => {
    const user: User = {
      token: `token_${Date.now()}`, // generate a dummy token
      name,
    };
    dispatch({ type: 'SET_USER', payload: user });
  };

  const logout = async (): Promise<void> => {
    dispatch({ type: 'SET_USER', payload: null });
    await removeFromStorage(STORAGE_KEYS.USER);
  };

  return {
    user: state.user,
    isLoggedIn: !!state.user,
    login,
    logout,
  };
};

export default useAuth;