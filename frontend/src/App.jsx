import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import SessionManager from './components/SessionManager';

export default function App() {
  return (
    <BrowserRouter>
      <SessionManager>
        <AppRoutes />
      </SessionManager> 
    </BrowserRouter>
  );
}
