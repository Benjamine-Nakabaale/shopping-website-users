import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import Landing from './pages/Landing';
import OrderConfirmation from './pages/order-confimation';
import Auth from './pages/Auth';
import OrderHistory from './pages/OrderHistory';


export default function App() {
  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="/Home" element ={<Home/>}/>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/OrderHistory" element={<OrderHistory />} />
          </Routes>
        </Layout>
      </CartProvider>
    </Router>
  );
}