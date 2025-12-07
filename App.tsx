import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { BuyGold } from './pages/BuyGold';
import { SellGold } from './pages/SellGold';
import { KYC } from './pages/KYC';
import { Transactions } from './pages/Transactions';
import { TransactionDetail } from './pages/TransactionDetail';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Terms } from './pages/Terms';
import { GiftGold } from './pages/GiftGold';
import { SIP } from './pages/SIP';
import { Redeem } from './pages/Redeem';
import { WalletPage } from './pages/Wallet';
import { Notifications } from './pages/Notifications';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from './components/ui/Icons';

// Native Interaction Handler
const MobileExperience: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Configure Status Bar for Immersive Feel
    const configStatusBar = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          await StatusBar.setStyle({ style: Style.Light }); // Dark text icons
          if (Capacitor.getPlatform() === 'android') {
            await StatusBar.setOverlaysWebView({ overlay: true }); // Transparent status bar
          }
        }
      } catch (e) {
        console.warn('Status Bar config failed', e);
      }
    };
    configStatusBar();

    // 2. Handle Android Hardware Back Button
    const backListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      // If we are on the root pages, exit app on back press
      const rootPaths = ['/', '/login'];
      if (rootPaths.includes(location.pathname)) {
        CapacitorApp.exitApp();
      } else {
        // Otherwise go back in history
        navigate(-1);
      }
    });

    return () => {
      backListener.then(handler => handler.remove());
    };
  }, [location, navigate]);

  return null;
};

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-gold-500" size={32} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
     <Layout>
        <MobileExperience />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms" element={<Terms />} />

          {/* Semi-Protected Routes */}
          <Route path="/" element={<Dashboard />} />

          {/* Protected Routes */}
          <Route path="/buy" element={<ProtectedRoute><BuyGold /></ProtectedRoute>} />
          <Route path="/sell" element={<ProtectedRoute><SellGold /></ProtectedRoute>} />
          <Route path="/gift" element={<ProtectedRoute><GiftGold /></ProtectedRoute>} />
          <Route path="/sip" element={<ProtectedRoute><SIP /></ProtectedRoute>} />
          
          <Route path="/redeem" element={<ProtectedRoute><Redeem /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          <Route path="/kyc-flow" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/transaction/:id" element={<ProtectedRoute><TransactionDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
  );
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;