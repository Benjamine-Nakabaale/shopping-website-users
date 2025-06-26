import { supabase } from './supabaseClient';

export const fetchProducts = async (search = '', category = '', sortBy = 'created_at') => {
  try {
    let query = supabase
      .from('products')
      .select(`
        id, name, description, price, category, image_url, available, created_at,
        product_ratings (
          rating,
          review,
          user_id
        )
      `)
      .eq('available', true);

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (category) {
      query = query.eq('category', category);
    }

    query = query.order(sortBy, { ascending: sortBy === 'price' });

    const { data, error } = await query;
    
    if (error) {
      console.error('Fetch products error:', error);
      return { data: null, error };
    }

    const productsWithRatings = data.map(product => {
      const ratings = product.product_ratings || [];
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;
      return {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: ratings.length
      };
    });
    return { data: productsWithRatings, error: null };
  } catch (err) {
    console.error('Unexpected error in fetchProducts:', err);
    return { data: null, error: { message: err.message || 'Unexpected error' } };
  }
};

export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('available', true);
    
    if (error) {
      console.error('Fetch categories error:', error);
      return { data: null, error };
    }

    const categories = [...new Set(data.map(p => p.category))];
    return { data: categories, error: null };
  } catch (err) {
    console.error('Unexpected error in getCategories:', err);
    return { data: null, error: { message: err.message || 'Unexpected error' } };
  }
};

export const rateProduct = async (productId, rating, review) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('product_ratings')
      .upsert(
        {
          product_id: productId,
          user_id: userData.user.id,
          rating,
          review,
          created_at: new Date().toISOString()
        },
        {
          onConflict: ['product_id', 'user_id']
        }
      )
      .select();

    if (error) {
      console.error('Rate product error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in rateProduct:', err);
    return { data: null, error: { message: err.message || 'Unexpected error' } };
  }
}