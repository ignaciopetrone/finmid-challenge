import { createContext, useContext, useEffect, useState } from 'react';
import callApi from './callApi';
import { wait } from './wait';

type Transaction = {
  id: string;
  userId: string;
  smeId: string;
  transactionTime: string;
  merchantIconUrl: string;
  merchantName: string;
  amount: string;
  currency: string;
  status: string;
  rejectionReason: any;
};
type Sme = {
  id: string;
  legalName: string;
  businessType: string;
};

type User = {
  id: string;
  smeId: string;
  name: string;
  email: string;
  profileImage: string;
};

export type ContextValue = {
  user?: User;
  sme?: Sme;
  token?: User;
  isLoading: string;
  setLoading: (isLoading: string) => void;
  resolvers: {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
  };
};

const StateContext = createContext<ContextValue>({} as ContextValue);

export const LOADING_TYPES = {
  off: '',
  authCheck: 'auth:check',
  authLogin: 'auth:login',
  authLogout: 'auth:logout',
};

export const StateProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>();
  const [sme, setSME] = useState<Sme>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setLoading] = useState(LOADING_TYPES.authCheck);

  useEffect(() => {
    // Automatically login the user if there is a valid token in cookie -> TODO: Abstract into custom hook
    const checkAuth = async () => {
      try {
        await wait(2000);
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
        setLoading(LOADING_TYPES.off);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      (async () => {
        await getSme();
      })();
    }
  }, [user]);

  useEffect(() => {
    if (sme) {
      (async () => {
        await getTransactions();
      })();
    }
  }, [sme]);

  const login = async (email: string, password: string) => {
    await wait(2000);
    const { user } = await callApi({
      method: 'POST',
      endpoint: '/login',
      payload: { email, password },
    });
    setUser(user);
  };

  const logout = async () => {
    await wait(2000);
    await callApi({ method: 'POST', endpoint: '/logout' });
    setUser(undefined);
  };

  const getSme = async () => {
    await wait(3000);
    const sme = await callApi({
      method: 'GET',
      endpoint: '/sme-data',
    });
    try {
      setSME(sme);
    } catch (erro) {}
  };

  const getTransactions = async () => {
    await wait(3000);
    const transactions = await callApi({
      method: 'GET',
      endpoint: '/transactions',
    });
    try {
      setTransactions(transactions);
    } catch (erro) {}
  };

  console.log('sme', sme);
  console.log('transactions', transactions);

  return (
    <StateContext.Provider
      value={{
        user,
        sme,
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
