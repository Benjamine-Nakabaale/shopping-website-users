import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, getCategories } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Footer from '../components/footer';
import Searching from '../components/searching';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'created_at';

  useEffect(() => {
    console.log('Home.jsx: Fetching products with', { search, category, sortBy });
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [productsRes, categoriesRes] = await Promise.all([
          fetchProducts(search, category, sortBy),
          getCategories()
        ]);

        console.log('Home.jsx: Products response:', productsRes);
        console.log('Home.jsx: Categories response:', categoriesRes);

        if (productsRes.error) {
          setError(productsRes.error.message || 'Failed to load products');
          console.error('Products error:', productsRes.error);
        } else {
          setProducts(productsRes.data || []);
        }

        if (categoriesRes.error) {
          console.error('Categories error:', categoriesRes.error);
        } else {
          setCategories(categoriesRes.data || []);
        }
      } catch (err) {
        setError('Unexpected error loading data');
        console.error('Home.jsx: Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [search, category, sortBy]);

  console.log('Home.jsx: Rendering with products:', products);

  return (
    <div className="container mx-auto px-4 py-8">
      <Searching/>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {loading && <div className="text-center py-8">Loading products...</div>}
      {error && <div className="text-center py-8 text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          {categories.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Categories</h2>
              <div className="flex flex-wrap gap-2">
                <a href="/Home?category=" className={`px-3 py-1 rounded ${!category ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  All
                </a>
                {categories.map(cat => (
                  <a
                    key={cat}
                    href={`/Home?category=${encodeURIComponent(cat)}`}
                    className={`px-3 py-1 rounded ${category === cat ? 'bg-primary text-white' : 'bg-gray-200'}`}
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <p className="text-gray-600 col-span-full text-center">No products found. Check back later!</p>
            ) : (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </>
      )}
     <Footer/>
    </div>
  );
}