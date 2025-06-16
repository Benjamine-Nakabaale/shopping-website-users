import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { supabase } from '../services/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { user, error } = await getCurrentUser();
      if (error) {
        console.error(error);
      }
      setUser(user);
      setLoading(false);
    };
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};