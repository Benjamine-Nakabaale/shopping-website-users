import {useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';


export default function ProductCard({ product }) {
  console.log('ProductCard.jsx: Rendering product:', product.id, product.name);
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }
    addToCart(product, 1);
  };

  return (
    <div className="border  rounded-lg shadow-md p-1 dark:text-gray-900 ">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t mb-4"
          onError={(e) => {
            console.error('Image load error:', product.image_url);
            e.target.src = '/placeholder-image.jpg';
          }}
        />

      <div className="px-4 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-black truncate">{product.name}</h3>
        <p className="text-primary font-bold mt-2">Ugshs{product.price?.toFixed(0)}</p>
        <button
          onClick={handleAddToCart}
          className="mt-4 btn w-full"
          disabled={!product.available}
        >
          {product.available ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}