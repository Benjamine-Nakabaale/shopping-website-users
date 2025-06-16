import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function OrderConfirmation() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!user) {
    navigate('/login', { state: { from: '/order-confirmation' } });
    return null;
  }

  if (!order) {
    return <div className="text-center py-8">No order details available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <div className="bg-secondary p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Thank You for Your Order!</h2>
        <p className="text-gray-600 mb-4">
          Your order has been successfully placed. You'll receive a confirmation email soon.
        </p>
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold">Order Details</h3>
          <p className="text-gray-600">Order #{order.id.slice(0, 8)}</p>
          <p className="text-gray-600">Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
          <p className="text-gray-600">Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          <p className="text-gray-600">Total: Ugsh{order.total_amount.toFixed(2)}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Items</h3>
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
          <h3 className="text-lg font-semibold">Shipping Details</h3>
          <p className="text-gray-600">{order.user_details.name}</p>
          <p className="text-gray-600">{order.user_details.email}</p>
          <p className="text-gray-600">{order.user_details.phone}</p>
          <p className="text-gray-600">{order.user_details.address}</p>
        </div>
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => navigate('/OrderHistory')}
            className="btn"
          >
            View Order History
          </button>
          <button
            onClick={() => navigate('/Home')}
            className="btn btn-secondary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}