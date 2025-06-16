import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import StarRating from './StarRating';

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
    <div className="border rounded-lg shadow-md p-4 bg-white dark:bg-gray-800">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t mb-4"
          onError={(e) => {
            console.error('Image load error:', product.image_url);
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      </Link>
      <div className="px-4 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{product.name}</h3>
        <div className="flex items-center mt-1">
          <StarRating rating={product.averageRating || 0} />
          <span className="text-gray-500 text-sm ml-2">({product.totalReviews || 0})</span>
        </div>
        <p className="text-primary font-bold mt-2">Ugshs{product.price?.toFixed(2)}</p>
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