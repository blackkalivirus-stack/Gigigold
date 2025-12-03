import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { BuyGold } from './pages/BuyGold';
import { SellGold } from './pages/SellGold';
import { KYC } from './pages/KYC';
import { Transactions } from './pages/Transactions';
import { Profile } from './pages/Profile';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/buy" element={<BuyGold />} />
          <Route path="/sell" element={<SellGold />} />
          <Route path="/gift" element={<BuyGold />} /> {/* Reusing Buy flow for demo, normally distinct */}
          <Route path="/redeem" element={<SellGold />} /> {/* Reusing Sell flow for demo */}
          <Route path="/kyc-flow" element={<KYC />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;