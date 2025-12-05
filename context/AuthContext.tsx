import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { User } from '../types';
import { getErrorMessage } from '../utils/helpers';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string) => Promise<{ success: boolean; isNewUser: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedPhone = localStorage.getItem('user_phone');
      if (storedPhone) {
        await fetchUserProfile(storedPhone);
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const fetchUserProfile = async (phone: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // If not found in DB but local storage exists, clear local storage
        // But do NOT clear biometric_user as they might want to re-login later
        localStorage.removeItem('user_phone');
        setUser(null);
      } else {
        // Map DB fields to User type
        setUser({
          id: data.id || 'u_' + Date.now(),
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          kycStatus: data.kyc_status,
          goldBalanceGrams: data.gold_balance || 0,
          walletBalanceInr: data.wallet_balance || 0,
          email: data.email
        });
      }
    } catch (err) {
      console.error("Auth Error:", err);
      // Don't clear user immediately on network error, just stop loading
      if (user) {
        // keep current user if already loaded
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone: string): Promise<{ success: boolean; isNewUser: boolean; error?: string }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        // User exists
        localStorage.setItem('user_phone', phone);
        await fetchUserProfile(phone);
        return { success: true, isNewUser: false };
      } else {
        // User does not exist, needs signup
        setLoading(false);
        return { success: true, isNewUser: true };
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Login logic error:", error);
      
      const errMsg = getErrorMessage(error);
      return { success: false, isNewUser: false, error: errMsg };
    }
  };

  const logout = () => {
    // Clear active session data
    localStorage.removeItem('user_phone');
    localStorage.removeItem('authToken');
    // NOTE: We do NOT clear 'biometric_user' or 'profileImage' here. 
    // This allows the user to easily log back in using face ID.
    setUser(null);
  };

  const refreshUser = async () => {
    if (user?.phone) {
      await fetchUserProfile(user.phone);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};