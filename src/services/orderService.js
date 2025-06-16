import { supabase } from './supabaseClient';

export const placeOrder = async (cartItems, userDetails) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = {
      user_id: userData.user.id,
      user_details: {
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        address: userDetails.address
      },
      items: cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image_url
      })),
      total_amount: totalAmount,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select();

    if (error) {
      console.error('Place order error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in placeOrder:', err);
    return { data: null, error: { message: err.message || 'Unexpected error' } };
  }
};

export const fetchUserOrders = async () => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        user_details,
        items,
        total_amount,
        status,
        created_at
      `)
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch orders error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in fetchUserOrders:', err);
    return { data: null, error: { message: err.message || 'Unexpected error' } };
  }
};