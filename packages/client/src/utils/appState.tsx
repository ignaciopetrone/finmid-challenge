import { createContext, useContext, useEffect, useState } from 'react';
import callApi from './callApi';

type User = {
  id: string;
  smeId: string;
  name: string;
  email: string;
  profileImage: string;
};

export type ContextValue = {
  user?: User;
  token?: User;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  resolvers: {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
  };
};

const StateContext = createContext<ContextValue>({} as ContextValue);

export const StateProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // Automatically login the user if there is a valid token in cookie -> TODO: Abstract into custom hook
    const checkAuth = async () => {
      setLoading(true);
      try {
        const response = await callApi<{ user?: any }>({
          method: 'GET',
          endpoint: '/auth-check',
        });

        if (response.user) {
          setUser(response.user);
        }
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await callApi({
        method: 'POST',
        endpoint: '/login',
        payload: { email, password },
      });
      localStorage.setItem('authToken', token);
      setUser(user);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      setUser(undefined);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        user: user,
        isLoading,
        setLoading,
        resolvers: { login, logout },
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
