import { createContext, useContext, useEffect, useState } from 'react';
import calculatePagination from './calculatePagination';
import callApi, { ApiError } from './callApi';
import { wait } from './wait';
import { Navigate, useNavigate } from 'react-router-dom';

export type SearchParameters = {
  status?: 'ALL' | 'REJECTED' | 'PENDING' | 'COMPLETED' | 'REVERSED';
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
  searchParameters: SearchParameters;
  setLoading: (isLoading: string) => void;
  resolvers: {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getUserName: (id: string) => Promise<string>;
    searchTransactions: (params: SearchParameters) => Promise<string>;
  };
};

const StateContext = createContext<ContextValue>({} as ContextValue);

export const LOADING_TYPES = {
  off: '',
  authCheck: 'auth:check',
  authLogin: 'auth:login',
  authLogout: 'auth:logout',
  transactionsFetch: 'transactions:fetch',
  transactionFetch: 'transaction:fetch',
};

export const StateProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>();
  const [sme, setSME] = useState<Sme>();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [pagination, setPagination] = useState<Pagination>();
  const [searchParameters, setSearchParameters] = useState<SearchParameters>(
    {}
  );

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
    try {
      const { user } = await callApi({
        method: 'POST',
        endpoint: '/login',
        payload: { email, password },
      });
      setUser(user);
    } catch ({ statusCode, message }: any) {
      console.error('Error during login:', statusCode, message);
    }
  };

  const logout = async () => {
    await wait(1000);
    try {
      await callApi({ method: 'POST', endpoint: '/logout' });
      setUser(undefined);
      setSME(undefined);
      setTransactions([]);
      navigate('/login');
    } catch ({ statusCode, message }: any) {
      console.error('Error during logout:', statusCode, message);
    }
  };

  const getSme = async () => {
    const sme = await callApi({
      method: 'GET',
      endpoint: '/sme-data',
    });
    try {
      setSME(sme);
    } catch ({ statusCode, message }: any) {
      console.error('Error fetching sme:', statusCode, message);
      if (
        statusCode === 401 &&
        message === 'Your session expired, please log in again.'
      ) {
        logout();
      }
    }
  };

  const getUserName = async (id: string) => {
    const queryParams = new URLSearchParams();
    queryParams.append('userId', id);
    const endpoint = `/user?${queryParams.toString()}`;

    try {
      const userName = await callApi({
        method: 'GET',
        endpoint,
      });
      return userName;
    } catch ({ statusCode, message }: any) {
      console.error('Error fetching userName:', statusCode, message);
      if (
        statusCode === 401 &&
        message === 'Your session expired, please log in again.'
      ) {
        logout();
      }
    }
  };

  const getTransactions = async ({
    status,
    limit = 10,
    offset = 0,
  }: SearchParameters) => {
    const queryParams = new URLSearchParams();
    if (status) {
      if (status === 'ALL') {
        queryParams.delete('status');
      } else {
        queryParams.append('status', status);
      }
    }
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
    } catch ({ statusCode, message }: any) {
      console.error('Error fetching transactions:', statusCode, message);
      if (
        statusCode === 401 &&
        message === 'Your session expired, please log in again.'
      ) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getTransactions(searchParameters);
  }, [searchParameters]);

  return (
    <StateContext.Provider
      value={{
        user,
        sme,
        pagination,
        transactions,
        isLoading,
        searchParameters,
        setLoading,
        resolvers: {
          login,
          logout,
          getUserName,
          searchTransactions: async (params: SearchParameters) =>
            setSearchParameters({ ...searchParameters, ...params }),
        },
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
