import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, rateProduct } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import StarRating from '../components/StarRating';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [ratingError, setRatingError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await fetchProductById(id);
      if (error) {
        setError('Failed to load product');
        console.error(error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    addToCart(product, quantity);
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setRatingError('');
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    if (rating < 1 || rating > 5) {
      setRatingError('Please select a rating between 1 and 5');
      return;
    }

    const { error } = await rateProduct(id, rating, review);
    if (error) {
      setRatingError(error.message || 'Failed to submit rating');
      return;
    }

    setRating(0);
    setReview('');
    // Reload product to update reviews
    const { data } = await fetchProductById(id);
    if (data) setProduct(data);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-96 object-cover rounded-lg"
        onError={(e) => {
          console.error('Image load error:', product.image_url);
          e.target.src = '/placeholder-image.jpg';
        }}
      />
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex items-center mt-2">
          <StarRating rating={product.averageRating || 0} />
          <span className="text-gray-500 text-sm ml-2">({product.totalReviews || 0} reviews)</span>
        </div>
        <p className="text-primary font-bold text-xl mt-2">${product.price.toFixed(2)}</p>
        <p className="text-gray-600 mt-4">{product.description}</p>
        <div className="flex items-center mt-4">
          <label className="mr-2">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
            className="w-16 px-2 py-1 border rounded"
          />
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-6 btn"
          disabled={!product.available}
        >
          {product.available ? 'Add to Cart' : 'Out of Stock'}
        </button>
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Reviews</h3>
          {(product.product_ratings || []).length === 0 ? (
            <p className="text-gray-500">No reviews yet</p>
          ) : (
            product.product_ratings.map((review, index) => (
              <div key={index} className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center">
                  <StarRating rating={review.rating} />
                  <span className="ml-2 text-gray-600">{review.profiles?.full_name || 'Anonymous'}</span>
                </div>
                <p className="text-gray-600 mt-1">{review.review || 'No comment'}</p>
                <p className="text-gray-500 text-sm">{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
          {user && (
            <form onSubmit={handleRatingSubmit} className="mt-6 space-y-4">
              <h4 className="text-md font-semibold">Submit Your Review</h4>
              {ratingError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {ratingError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full"
                >
                  <option value={0}>Select rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num} stars</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Review</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full"
                  rows={4}
                />
              </div>
              <button type="submit" className="btn">Submit Review</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}