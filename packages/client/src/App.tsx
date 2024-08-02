import { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoadingSpinner from './components/atoms/loadingSpinner';
import Navbar from './components/molecules/navbar';
import Dashboard from './components/organisms/dashboard';
import Login from './components/organisms/login';
import TransactionDetails from './components/organisms/transactionDetails';
import { LOADING_TYPES, useAppState } from './utils/appState';

type ProtectRoutePorps = {
  route: ReactNode;
  user?: boolean;
};

const App = () => {
  const { user, isLoading } = useAppState();

  const ProtectRoute = ({ route: RouteToProtect, user }: ProtectRoutePorps) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    } else {
      return <>{RouteToProtect}</>;
    }
  };

  if (isLoading === LOADING_TYPES.authCheck) {
    // Duplicated JSX here i know, just to handle initial load of the app
    return (
      <div className="app">
        <div className="app__header">
          <Navbar />
        </div>
        <div className="app__body">
          <div className="app__loading-spinner">
            <LoadingSpinner />
          </div>
        </div>
        <div className="app__footer">FOOTER</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app__header">
        <Navbar />
      </div>
      <div className="app__body">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={<ProtectRoute route={<Dashboard />} user={!!user} />}
          />
          <Route
            path="/transactions/:id"
            element={
              <ProtectRoute route={<TransactionDetails />} user={!!user} />
            }
          />
        </Routes>
      </div>
      <div className="app__footer">FOOTER</div>
    </div>
  );
};

export default App;
