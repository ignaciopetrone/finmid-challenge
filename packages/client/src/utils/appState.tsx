import { createContext, useContext, useEffect, useState } from 'react';
import callApi from './callApi';
import { wait } from './wait';
import calculatePagination from './calculatePagination';

export type SearchParameters = {
  status?: 'REJECTED' | 'PENDING' | 'COMPLETED' | 'REVERSED';
  userId?: string;
  limit?: number;
  offset?: number;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  nextOffset: number;
  prevOffset: number;
};

export type Transaction = {
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
  pagination?: Pagination;
  transactions: Transaction[];
  token?: User;
  isLoading: string;
  setLoading: (isLoading: string) => void;
  resolvers: {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getTransactions: (params: SearchParameters) => Promise<void>;
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
  const [pagination, setPagination] = useState<Pagination>();
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
        await getTransactions({});
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
    // await wait(3000);
    const sme = await callApi({
      method: 'GET',
      endpoint: '/sme-data',
    });
    try {
      setSME(sme);
    } catch (erro) {}
  };

  const getTransactions = async ({
    status,
    limit = 10,
    offset = 0,
  }: SearchParameters) => {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    if (user?.id) queryParams.append('userId', user?.id);
    if (limit) queryParams.append('limit', limit.toString());
    if (offset) queryParams.append('offset', offset.toString());

    const endpoint = `/transactions?${queryParams.toString()}`;

    try {
      const response = await callApi({
        method: 'GET',
        endpoint,
      });

      setTransactions(response.data);
      const { limit, offset, total } = response.meta;
      const getPaginationState = calculatePagination(limit, offset, total);
      setPagination(getPaginationState);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        user,
        sme,
        pagination,
        transactions,
        isLoading,
        setLoading,
        resolvers: { login, logout, getTransactions },
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
