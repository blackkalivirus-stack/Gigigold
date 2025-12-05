import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { MOCK_RATES } from '../constants';
import { Banknote, AlertTriangle, CheckCircle } from '../components/ui/Icons';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { getErrorMessage } from '../utils/helpers';

export const SellGold: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [amountGrams, setAmountGrams] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const RATE = MOCK_RATES.sell;
  const totalValue = parseFloat(amountGrams || '0') * RATE;
  const isBalanceSufficient = user ? parseFloat(amountGrams || '0') <= user.goldBalanceGrams : false;

  const handleSell = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Insert Transaction
      const { error: txnError } = await supabase.from('transactions').insert([
        {
          user_phone: user.phone,
          type: 'SELL',
          amount_inr: totalValue,
          grams: parseFloat(amountGrams),
          rate_per_gram: RATE,
          status: 'SUCCESS'
        }
      ]);
      
      if (txnError) throw txnError;

      // 2. Update Profile Balance (Decrement)
      const newBalance = Math.max(0, (Number(user.goldBalanceGrams) || 0) - parseFloat(amountGrams));
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ gold_balance: newBalance })
        .eq('phone', user.phone);
        
      if (profileError) throw profileError;

      // 3. Refresh Context
      await refreshUser();
      setSuccess(true);
    } catch (error) {
       console.error("Sell error:", error);
       const msg = getErrorMessage(error);
       alert("Failed to sell gold: " + msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-full bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-100 shadow-xl shadow-green-100/50">
          <CheckCircle className="text-green-500 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Sell Request Placed</h2>
        <p className="text-slate-500 text-center mb-10 leading-relaxed max-w-xs mx-auto">
          Amount of <span className="text-slate-900 font-bold text-lg">₹{totalValue.toFixed(2)}</span> will be credited to your account within 48 hours.
        </p>
        <Button fullWidth size="lg" onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      <Header title="Sell Gold" showBack />

      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 mb-8 flex justify-between items-center shadow-lg shadow-slate-900/10">
          <span className="text-sm text-slate-400 font-medium">Available to Sell</span>
          <span className="text-xl font-bold text-white tracking-tight">{user?.goldBalanceGrams.toFixed(4) || '0.0000'} <span className="text-sm text-gold-400">gm</span></span>
        </div>

        <div className="mb-10">
          <label className="text-xs text-slate-500 mb-3 block uppercase tracking-wider font-semibold ml-1">Weight to Sell (gm)</label>
          <div className="relative group">
             <input
               type="number"
               value={amountGrams}
               onChange={(e) => setAmountGrams(e.target.value)}
               placeholder="0.0000"
               className={`w-full bg-white rounded-2xl p-6 text-3xl sm:text-4xl font-bold text-slate-900 border transition-all focus:outline-none focus:ring-4 shadow-sm ${!isBalanceSufficient ? 'border-red-500/50 focus:ring-red-500/10' : 'border-slate-200 focus:border-gold-500 focus:ring-gold-500/10'}`}
             />
             <button 
               onClick={() => setAmountGrams(user?.goldBalanceGrams.toString() || '')}
               className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gold-600 bg-gold-50 hover:bg-gold-100 border border-gold-200 px-3 py-1.5 rounded-full transition-colors uppercase tracking-wide"
             >
               Max
             </button>
          </div>
          {!isBalanceSufficient && (
            <div className="flex items-center gap-2 mt-3 animate-slide-up">
              <AlertTriangle size={14} className="text-red-500" />
              <p className="text-xs text-red-500 font-medium">Insufficient gold balance</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-8 shadow-sm">
           <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
              <span className="text-slate-500 text-sm font-medium">Sell Rate</span>
              <span className="text-slate-900 font-semibold">₹{RATE.toLocaleString()}/gm</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold text-lg">Total Amount</span>
              <span className="text-2xl font-bold text-gold-600">₹{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
           </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-800 mb-3 ml-1">Credit To</h3>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group shadow-sm">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-slate-200">
             <Banknote size={24} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
          <div className="flex-1">
             <p className="text-sm font-bold text-slate-900">HDFC Bank **** 9012</p>
             <div className="flex items-center gap-1 mt-0.5">
               <CheckCircle size={10} className="text-green-500"/> 
               <p className="text-[10px] text-green-600 font-medium uppercase tracking-wide">Verified</p>
             </div>
          </div>
          <button className="text-xs text-gold-600 font-bold hover:text-gold-700 uppercase tracking-wide px-2 py-1">Change</button>
        </div>
      </div>

      <div className="p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 sticky bottom-0">
         <Button 
           fullWidth 
           variant="primary"
           size="lg"
           disabled={!amountGrams || parseFloat(amountGrams) <= 0 || !isBalanceSufficient}
           onClick={handleSell}
           isLoading={loading}
           className="shadow-lg shadow-gold-500/20"
         >
           Confirm Sell
         </Button>
      </div>
    </div>
  );
};