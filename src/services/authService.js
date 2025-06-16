import { supabase } from './supabaseClient';

export const signUp = async (email, password, fullName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) {
      console.error('Sign-up error:', error);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in signUp:', err);
    return { data: null, error: { message: err.message || 'Unexpected error' } };
  }
};

export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      console.error('Login error:', error);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in login:', err);
    return { data: null, error: { message: err.message || 'Unexpected error' } };
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      return { error };
    }
    return { error: null };
  } catch (err) {
    console.error('Unexpected error in logout:', err);
    return { error: { message: err.message || 'Unexpected error' } };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Get user error:', error);
      return { user: null, error };
    }
    return { user, error: null };
  } catch (err) {
    console.error('Unexpected error in getCurrentUser:', err);
    return { user: null, error: { message: err.message || 'Unexpected error' } };
  }
};