import { ReactNode, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAppState } from './utils/appState';
import Login from './components/organisms/login';
import Dashboard from './components/organisms/dashboard';

type ProtectRoutePorps = { route: ReactNode; user?: boolean };

const ProtectRoute = ({ route: RouteToProtect, user }: ProtectRoutePorps) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  } else {
    return <>{RouteToProtect}</>;
  }
};

const App = () => {
  const { user, resolvers } = useAppState();

  return (
    <div className="app">
      <div className="app__header">
        {user && <p>Welcome {user?.name}</p>}
        {user && (
          <button onClick={resolvers.logout} style={{ height: '30px' }}>
            LOGOUT
          </button>
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
