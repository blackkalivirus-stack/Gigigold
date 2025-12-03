import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { MOCK_RATES, MOCK_USER } from '../constants';
import { Banknote, AlertTriangle, CheckCircle } from '../components/ui/Icons';

export const SellGold: React.FC = () => {
  const navigate = useNavigate();
  const [amountGrams, setAmountGrams] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const RATE = MOCK_RATES.sell;
  const totalValue = parseFloat(amountGrams || '0') * RATE;
  const isBalanceSufficient = parseFloat(amountGrams || '0') <= MOCK_USER.goldBalanceGrams;

  const handleSell = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-full bg-navy-950 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20 shadow-xl shadow-green-500/10">
          <CheckCircle className="text-green-500 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Sell Request Placed</h2>
        <p className="text-slate-400 text-center mb-10 leading-relaxed max-w-xs mx-auto">
          Amount of <span className="text-white font-bold text-lg">₹{totalValue.toFixed(2)}</span> will be credited to your account within 48 hours.
        </p>
        <Button fullWidth size="lg" onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-navy-950 flex flex-col">
      <Header title="Sell Gold" showBack />

      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <div className="bg-gradient-to-r from-slate-900 to-navy-900 rounded-2xl p-5 border border-white/5 mb-8 flex justify-between items-center shadow-lg">
          <span className="text-sm text-slate-400 font-medium">Available to Sell</span>
          <span className="text-xl font-bold text-white tracking-tight">{MOCK_USER.goldBalanceGrams.toFixed(4)} <span className="text-sm text-gold-500">gm</span></span>
        </div>

        <div className="mb-10">
          <label className="text-xs text-slate-500 mb-3 block uppercase tracking-wider font-semibold ml-1">Weight to Sell (gm)</label>
          <div className="relative group">
             <input
               type="number"
               value={amountGrams}
               onChange={(e) => setAmountGrams(e.target.value)}
               placeholder="0.0000"
               className={`w-full bg-slate-900/50 rounded-2xl p-6 text-3xl sm:text-4xl font-bold text-white border transition-all focus:outline-none focus:ring-2 ${!isBalanceSufficient ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:border-gold-500 focus:ring-gold-500/20'}`}
             />
             <button 
               onClick={() => setAmountGrams(MOCK_USER.goldBalanceGrams.toString())}
               className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gold-500 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 px-3 py-1.5 rounded-full transition-colors uppercase tracking-wide"
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

        <div className="bg-slate-900/40 rounded-2xl p-6 border border-white/5 mb-8 backdrop-blur-sm">
           <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
              <span className="text-slate-400 text-sm font-medium">Sell Rate</span>
              <span className="text-white font-semibold">₹{RATE.toLocaleString()}/gm</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-slate-200 font-bold text-lg">Total Amount</span>
              <span className="text-2xl font-bold text-gold-500">₹{totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
           </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-300 mb-3 ml-1">Credit To</h3>
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-white/10">
             <Banknote size={24} className="text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1">
             <p className="text-sm font-bold text-white">HDFC Bank **** 9012</p>
             <div className="flex items-center gap-1 mt-0.5">
               <CheckCircle size={10} className="text-green-500"/> 
               <p className="text-[10px] text-green-500 font-medium uppercase tracking-wide">Verified</p>
             </div>
          </div>
          <button className="text-xs text-gold-500 font-bold hover:text-gold-400 uppercase tracking-wide px-2 py-1">Change</button>
        </div>
      </div>

      <div className="p-6 bg-navy-950/90 backdrop-blur-md border-t border-white/5 sticky bottom-0">
         <Button 
           fullWidth 
           variant="primary"
           size="lg"
           disabled={!amountGrams || parseFloat(amountGrams) <= 0 || !isBalanceSufficient}
           onClick={handleSell}
           isLoading={loading}
           className="shadow-lg shadow-gold-500/10"
         >
           Confirm Sell
         </Button>
      </div>
    </div>
  );
};