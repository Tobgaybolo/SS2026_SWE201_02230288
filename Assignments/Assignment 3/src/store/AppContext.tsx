import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { AppState, AppAction, User, FilterState } from './types';
import { reducer, initialState } from './reducer';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // On app start — rehydrate persisted state from AsyncStorage
  useEffect(() => {
    const rehydrate = async () => {
      const savedUser = await loadFromStorage<User>(STORAGE_KEYS.USER);
      const savedFilters = await loadFromStorage<FilterState>(STORAGE_KEYS.FILTERS);

      if (savedUser) dispatch({ type: 'SET_USER', payload: savedUser });
      if (savedFilters) dispatch({ type: 'SET_FILTER', payload: savedFilters });
    };
    rehydrate();
  }, []);

  // Persist user to AsyncStorage whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER, state.user);
  }, [state.user]);

  // Persist filters to AsyncStorage whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FILTERS, state.filters);
  }, [state.filters]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to consume context — throws if used outside provider
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};