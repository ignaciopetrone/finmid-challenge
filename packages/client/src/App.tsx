import { ReactNode, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LOADING_TYPES, useAppState } from './utils/appState';
import Login from './components/organisms/login';
import Dashboard from './components/organisms/dashboard';
import { wait } from './utils/wait';
import Button from './components/atoms/button';

type ProtectRoutePorps = { route: ReactNode; user?: boolean };

const ProtectRoute = ({ route: RouteToProtect, user }: ProtectRoutePorps) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  } else {
    return <>{RouteToProtect}</>;
  }
};

const App = () => {
  const { user, resolvers, isLoading, setLoading } = useAppState();

  const onLogout = async () => {
    setLoading(LOADING_TYPES.authLogout);
    try {
      await wait(2000);
      await resolvers.logout();
    } catch (error: any) {
      console.error('Error during logout - ', error.message);
    } finally {
      setLoading(LOADING_TYPES.off);
    }
  };

  return (
    <div className="app">
      <div className="app__header">
        {user && <p>Welcome {user?.name}</p>}
        {user && (
          <Button
            isLoading={isLoading === LOADING_TYPES.authLogout}
            onClick={onLogout}
          >
            Sign out
          </Button>
        )}
      </div>
      <div className="app__body">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={<ProtectRoute route={<Dashboard />} user={!!user} />}
            />
          </Routes>
        </BrowserRouter>
      </div>
      <div className="app__footer">FOOTER</div>
    </div>
  );
};

export default App;
