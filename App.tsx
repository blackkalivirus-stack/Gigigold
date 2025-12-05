import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { BuyGold } from './pages/BuyGold';
import { SellGold } from './pages/SellGold';
import { KYC } from './pages/KYC';
import { Transactions } from './pages/Transactions';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Terms } from './pages/Terms';
import { GiftGold } from './pages/GiftGold';
import { SIP } from './pages/SIP';
import { Redeem } from './pages/Redeem';
import { Notifications } from './pages/Notifications';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from './components/ui/Icons';

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
    // Redirect to login but save where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
     <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms" element={<Terms />} />

          {/* Semi-Protected Routes (Guest Mode Allowed on Dashboard) */}
          <Route path="/" element={<Dashboard />} />

          {/* Strictly Protected Routes */}
          <Route path="/buy" element={<ProtectedRoute><BuyGold /></ProtectedRoute>} />
          <Route path="/sell" element={<ProtectedRoute><SellGold /></ProtectedRoute>} />
          <Route path="/gift" element={<ProtectedRoute><GiftGold /></ProtectedRoute>} />
          <Route path="/sip" element={<ProtectedRoute><SIP /></ProtectedRoute>} />
          
          <Route path="/redeem" element={<ProtectedRoute><Redeem /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          <Route path="/kyc-flow" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
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