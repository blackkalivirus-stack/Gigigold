import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { Ticket, Store, Sparkles, MapPin, Gift, CheckCircle, Copy, RefreshCw } from '../components/ui/Icons';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { MOCK_RATES } from '../constants';
import { getErrorMessage } from '../utils/helpers';

type RedeemMode = 'STORE' | 'VOUCHER' | null;

export const Redeem: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [mode, setMode] = useState<RedeemMode>(null);
  
  // Input State
  const [inputMode, setInputMode] = useState<'INR' | 'GRAMS'>('INR');
  const [inputValue, setInputValue] = useState('');
  
  // Derived Values
  const [displayGrams, setDisplayGrams] = useState(0);
  const [displayAmount, setDisplayAmount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{code: string, type: string, amount: number, grams: number} | null>(null);

  const RATE = MOCK_RATES.sell;

  useEffect(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val <= 0) {
      setDisplayGrams(0);
      setDisplayAmount(0);
      return;
    }

    if (inputMode === 'INR') {
      setDisplayAmount(val);
      setDisplayGrams(val / RATE);
    } else {
      setDisplayGrams(val);
      setDisplayAmount(val * RATE);
    }
  }, [inputValue, inputMode, RATE]);

  const handleRedeem = async () => {
    if (!user || !mode) return;
    setLoading(true);

    try {
      // 1. Create Transaction (REDEEM type)
      const { error: txnError } = await supabase.from('transactions').insert([
        {
          user_phone: user.phone,
          type: 'REDEEM',
          amount_inr: displayAmount,
          grams: displayGrams,
          rate_per_gram: RATE,
          status: 'SUCCESS' 
        }
      ]);
      
      if (txnError) throw txnError;

      // 2. Update Profile Balance (Deduct Gold)
      const newBalance = Math.max(0, (Number(user.goldBalanceGrams) || 0) - displayGrams);
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ gold_balance: newBalance })
        .eq('phone', user.phone);

      if (profileError) throw profileError;

      await refreshUser();
      
      // Generate Mock Code based on mode
      const prefix = mode === 'STORE' ? 'PMJ-STORE' : 'PMJ-VCHR';
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `${prefix}-${randomPart}`;

      setSuccessData({
        code: code,
        type: mode === 'STORE' ? 'Store Code' : 'Gift Voucher',
        amount: displayAmount,
        grams: displayGrams
      });

    } catch (error) {
       console.error("Redeem error:", error);
       const msg = getErrorMessage(error);
       alert("Redemption failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-full bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-gold-50 rounded-full flex items-center justify-center mb-6 border border-gold-100 shadow-xl shadow-gold-100/50">
          <Ticket className="text-gold-600 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Redemption Successful!</h2>
        <p className="text-slate-500 text-sm mb-8">
          Your gold has been successfully converted into a {successData.type}. Show this code at any PMJ Jewels store to buy jewellery.
        </p>

        <div className="w-full bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6 relative overflow-hidden mb-8 group cursor-pointer" onClick={() => {navigator.clipboard.writeText(successData.code); alert('Copied!')}}>
           <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-r border-slate-200"></div>
           <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-l border-slate-200"></div>
           
           <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Redemption Code</p>
           <div className="flex items-center justify-center gap-2">
             <p className="text-2xl font-mono font-bold text-slate-900 tracking-wider select-all">{successData.code}</p>
             <Copy size={16} className="text-slate-300" />
           </div>
           <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
             <span className="text-xs text-slate-500 font-bold">Value</span>
             <div className="text-right">
                <span className="block text-lg font-bold text-gold-600">₹{successData.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span className="block text-xs text-slate-400 font-medium">{successData.grams.toFixed(4)} gm</span>
             </div>
           </div>
        </div>

        <div className="space-y-3 w-full">
          <Button fullWidth onClick={() => navigate('/wallet')}>View My Vouchers</Button>
          <Button fullWidth variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      <Header 
        title={mode === 'STORE' ? "Redeem at Store" : mode === 'VOUCHER' ? "Gift Voucher" : "Redeem Gold"} 
        showBack 
        onBack={() => {
            if (mode) {
                setMode(null);
                setInputValue('');
                setInputMode('INR');
            } else {
                navigate(-1);
            }
        }}
        rightAction={
           !mode && (
             <button onClick={() => navigate('/wallet')} className="text-xs font-bold text-gold-600 px-3 py-1 bg-gold-50 rounded-full border border-gold-100">
               My Vouchers
             </button>
           )
        }
      />

      <div className="px-6 pt-6 pb-24 overflow-y-auto flex-1">
         
         {!mode ? (
           <div className="animate-fade-in space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg shadow-slate-900/20 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={100} />
                 </div>
                 <h3 className="text-lg font-bold mb-1 relative z-10">Gold Redemption</h3>
                 <p className="text-slate-300 text-xs leading-relaxed max-w-[85%] relative z-10">
                   Convert your digital gold balance into physical jewellery or gift vouchers instantly.
                 </p>
              </div>

              <div className="space-y-4">
                 <button 
                   onClick={() => setMode('STORE')}
                   className="w-full bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-gold-300 hover:shadow-md transition-all group"
                 >
                    <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                       <Store size={28} />
                    </div>
                    <div className="text-left flex-1">
                       <h4 className="text-slate-900 font-bold text-base">Redeem at Store</h4>
                       <p className="text-slate-500 text-xs mt-1">Generate a code to use at any PMJ Jewels outlet.</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-gold-500 group-hover:text-white transition-all">
                       <MapPin size={16} />
                    </div>
                 </button>

                 <button 
                   onClick={() => setMode('VOUCHER')}
                   className="w-full bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-gold-300 hover:shadow-md transition-all group"
                 >
                    <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 group-hover:bg-pink-100 transition-colors">
                       <Gift size={28} />
                    </div>
                    <div className="text-left flex-1">
                       <h4 className="text-slate-900 font-bold text-base">Redeem as Gift Voucher</h4>
                       <p className="text-slate-500 text-xs mt-1">Create a digital voucher to gift loved ones.</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-gold-500 group-hover:text-white transition-all">
                       <Ticket size={16} />
                    </div>
                 </button>
              </div>
           </div>
         ) : (
           <div className="animate-slide-up space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Available Balance</span>
                       <span className="text-xl font-bold text-slate-900">{user?.goldBalanceGrams.toFixed(4)} <span className="text-sm text-slate-500">gm</span></span>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Value</span>
                       <span className="text-xl font-bold text-gold-600">₹{((user?.goldBalanceGrams || 0) * RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                 </div>

                 {/* Input Toggle */}
                 <div className="flex justify-center mb-6">
                    <div className="bg-slate-50 p-1 rounded-full border border-slate-200 flex">
                        <button 
                            onClick={() => { setInputMode('INR'); setInputValue(''); }}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${inputMode === 'INR' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                        >
                            Amount (₹)
                        </button>
                        <button 
                            onClick={() => { setInputMode('GRAMS'); setInputValue(''); }}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${inputMode === 'GRAMS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                        >
                            Grams (g)
                        </button>
                    </div>
                 </div>

                 <div className="relative mb-6">
                    <label className="text-xs font-bold text-slate-500 mb-2 block">Enter {inputMode === 'INR' ? 'Amount' : 'Weight'} to Redeem</label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                           {inputMode === 'INR' ? '₹' : 'g'}
                       </span>
                       <input 
                         type="number"
                         value={inputValue}
                         onChange={(e) => setInputValue(e.target.value)}
                         placeholder="0"
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-10 pr-4 text-xl font-bold text-slate-900 focus:outline-none focus:border-gold-500 focus:bg-white transition-all"
                         autoFocus
                       />
                    </div>
                 </div>

                 <div className="bg-gold-50 rounded-xl p-4 border border-gold-100 flex justify-between items-center">
                    <span className="text-xs text-gold-800 font-bold">
                        {inputMode === 'INR' ? 'Gold Weight' : 'Approx Value'}
                    </span>
                    <span className="text-sm font-bold text-gold-700">
                        {inputMode === 'INR' ? `${displayGrams.toFixed(4)} gm` : `₹${displayAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    </span>
                 </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed">
                 <p className="font-bold text-slate-700 mb-1">Note:</p>
                 {mode === 'STORE' 
                   ? "This will generate a secure code. Show this code at any PMJ Jewels store counter to redeem your digital gold against physical jewellery."
                   : "You will receive a digital gift voucher code. You can use this yourself or share it with a loved one to redeem at PMJ Jewels stores."
                 }
              </div>
           </div>
         )}
      </div>

      {mode && (
        <div className="p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 sticky bottom-0">
           <Button 
             fullWidth 
             size="lg" 
             onClick={handleRedeem}
             isLoading={loading}
             disabled={!inputValue || parseFloat(inputValue) <= 0 || (user ? displayGrams > user.goldBalanceGrams : true)}
             className="shadow-xl shadow-gold-500/20"
           >
             {mode === 'STORE' ? 'Generate Store Code' : 'Redeem as Voucher'}
           </Button>
        </div>
      )}
    </div>
  );
};