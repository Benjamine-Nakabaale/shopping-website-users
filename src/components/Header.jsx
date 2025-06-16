import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { CartContext } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/authService';
export default function Header() {
  const { cart } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      console.error(error);
    }
    navigate('/');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-primary  max-w-screen-2xl flex text-center justify-between 
    items-center py-4 px-5 text-white mx-auto max-sm:px-5 max-[400px]:px-3 ">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Shop With PRAISE
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/OrderHistory" className="text-xl hover:underline">
                Order History
              </Link>
              <button onClick={handleLogout} className="flex items-center">
                <LogOut size={24} />
              </button>
            </>
          ) : (
            <Link to="/login">
              <User size={24} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}