import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';
import { fetchProductById, rateProduct } from '../services/productService';
import StarRating from '../components/StarRating';
import { ArrowLeft, ShoppingCart, Heart, Share2 } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    const { data, error } = await fetchProductById(id);
    if (data) {
      setProduct(data);
      // Check if user has already rated this product
      if (user && data.product_ratings) {
        const existingRating = data.product_ratings.find(r => r.user_id === user.id);
        if (existingRating) {
          setUserRating(existingRating.rating);
          setUserReview(existingRating.review || '');
        }
      }
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Show success message or redirect to cart
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }

    const { error } = await rateProduct(product.id, user.id, userRating, userReview);
    if (!error) {
      setShowReviewForm(false);
      loadProduct(); // Reload to show updated rating
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Product not found.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <img
            src={product.image_url || 'https://via.placeholder.com/600'}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.averageRating > 0 && (
            <div className="flex items-center">
                <StarRating rating={product.averageRating} readonly />
                <span className="ml-2 text-gray-600">
                 ({product.totalReviews} review{product.totalReviews !== 1 ? 's' : ''})
                </span>
            </div>
                )}
                    

          {/* Quantity and Actions */}
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-16 border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={handleAddToCart}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              <ShoppingCart className="mr-2" size={18} />
              Add to Cart
            </button>
            <button className="p-2 text-gray-500 hover:text-red-500">
              <Heart size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-500">
              <Share2 size={20} />
            </button>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Reviews */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews</h2>
            {product.product_ratings && product.product_ratings.length > 0 ? (
              <div className="space-y-4">
                {product.product_ratings.map((rating) => (
                  <div key={rating.user_id} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <StarRating rating={rating.rating} readonly />
                      <span className="text-sm text-gray-500">
                        {rating.user_name || 'Anonymous'}
                      </span>
                    </div>
                    {rating.review && <p className="text-gray-700">{rating.review}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}

            {/* Review Form */}
            {!showReviewForm ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                {userRating > 0 ? 'Edit Your Review' : 'Write a Review'}
              </button>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">
                    Your Rating:
                  </label>
                  <StarRating rating={userRating} onChange={setUserRating} />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">
                    Your Review:
                  </label>
                  <textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    rows="4"
                    placeholder="Share your thoughts about the product..."
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
