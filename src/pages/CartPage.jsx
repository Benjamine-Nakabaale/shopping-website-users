import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import { placeOrder } from '../services/orderService';
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      setLoading(false);
      return;
    }

    if (cart.length === 0) {
      setError('Cart is empty');
      setLoading(false);
      return;
    }

    if (!orderDetails.name || !orderDetails.email || !orderDetails.phone || !orderDetails.address) {
      setError('Please fill in all order details');
      setLoading(false);
      return;
    }

    const { data, error: orderError } = await placeOrder(cart, orderDetails);
    if (orderError) {
      setError(orderError.message || 'Failed to place order');
      setLoading(false);
      return;
    }

    clearCart();
    navigate('/order-confirmation', { state: { order: data[0] } });
    setLoading(false);
  };

  if (cart.length === 0) {
    
    return(
    <div className="banner w-full bg-primary-light flex flex-col justify-end items-center max-sm:h-[550px] max-sm:gap-2"> 
        <h2 className="text-center py-8">Your cart is empty </h2>
    <div className="flex justify-center items-center gap-3 pb-10 max-[400px]:flex-col max-[400px]:gap-1 w-[420px] max-sm:w-[350px] max-[400px]:w-[300px]">
      <Link to="/Home" className="bg-white text-amber-500 text-center text-xl border border-[rgba(0, 0, 0, 0.4)] font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center">
          Shop Now
        </Link>
        <Link to="/Home" className="text-amber-500 border-white border-2 text-center text-xl font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center">See Collection</Link>
      </div>
    </div>);
    
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cart.map(item => (
            <div key={item.id} className="flex items-center border-b py-4">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-20 h-20 object-cover rounded mr-4"
                onError={(e) => {
                  console.error('Image load error:', item.image_url);
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">Ugsh{item.price.toFixed(2)} x {item.quantity}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-bold">Ugsh{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div>
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <p className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>Ugsh{totalAmount.toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-bold">
              <span>Total</span>
              <span>Ugsh{totalAmount.toFixed(2)}</span>
            </p>
            <form onSubmit={handlePlaceOrder} className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Shipping Details</h3>
              <input
                type="text"
                name="name"
                value={orderDetails.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full"
                required
              />
              <input
                type="email"
                name="email"
                value={orderDetails.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full"
                required
              />
              <input
                type="tel"
                name="phone"
                value={orderDetails.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full"
                required
              />
              <textarea
                name="address"
                value={orderDetails.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full"
                rows={4}
                required
              />
              <button
                type="submit"
                className="w-full btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}