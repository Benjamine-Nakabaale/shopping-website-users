import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchUserOrders } from '../services/orderService';

export default function OrderHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await fetchUserOrders();
      if (error) {
        setError(error.message || 'Failed to load orders');
        console.error(error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };
    loadOrders();
  }, [user, navigate]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h2>
                <span className={`text-sm ${order.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
              <p className="text-gray-600">Total: Ugsh{order.total_amount.toFixed(2)}</p>
              <div className="mt-4">
                <h3 className="text-md font-semibold">Items</h3>
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center mt-2">
                    <img
                      src={item.image_url}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded mr-4"
                      onError={(e) => {
                        console.error('Image load error:', item.image_url);
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div>
                      <p className="text-gray-800">{item.product_name}</p>
                      <p className="text-gray-600 text-sm">
                        Ugsh{item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h3 className="text-md font-semibold">Shipping Details</h3>
                <p className="text-gray-600">{order.user_details.name}</p>
                <p className="text-gray-600">{order.user_details.email}</p>
                <p className="text-gray-600">{order.user_details.phone}</p>
                <p className="text-gray-600">{order.user_details.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}