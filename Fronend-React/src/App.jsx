import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import { useTheme } from '@/hooks/useTheme';
import { CartProvider } from '@/context/CartContext';
import { CompareProvider } from '@/context/CompareContext';

function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Router>
      <CartProvider>
        <CompareProvider>
          <AppRoutes isDark={isDark} toggleTheme={toggleTheme} />
        </CompareProvider>
      </CartProvider>
    </Router>
  );
}

export default App;

