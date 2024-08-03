import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './main.scss';
import { StateProvider } from './utils/appState';
import { NotificationProvider } from './components/organisms/notifications';

// Removed strict mode to avoid doble rendering in development mode
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <NotificationProvider>
      <StateProvider>
        <App />
      </StateProvider>
    </NotificationProvider>
  </BrowserRouter>
);
