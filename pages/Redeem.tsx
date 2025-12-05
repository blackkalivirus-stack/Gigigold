
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { Wallet, Ticket, ChevronRight, CheckCircle, Sparkles, MapPin } from '../components/ui/Icons';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { MOCK_RATES } from '../constants';
import { getErrorMessage } from '../utils/helpers';

export const Redeem: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'CASH' | 'VOUCHER'>('CASH');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{code: string, brand: string, amount: string} | null>(null);

  const RATE = MOCK_RATES.sell;
  const grams = parseFloat(amount) ? (parseFloat(amount) / RATE) : 0;
  
  const BRANDS = [
    { id: 'TANISHQ', name: 'Tanishq', logo: 'https://ui-avatars.com/api/?name=Tanishq&background=8d1b3d&color=fff' },
    { id: 'KALYAN', name: 'Kalyan Jewellers', logo: 'https://ui-avatars.com/api/?name=Kalyan&background=cfa015&color=fff' },
    { id: 'MALABAR', name: 'Malabar Gold', logo: 'https://ui-avatars.com/api/?name=Malabar&background=0f172a&color=fff' },
    { id: 'BLUESTONE', name: 'BlueStone', logo: 'https://ui-avatars.com/api/?name=BlueStone&background=2563eb&color=fff' },
  ];

  const handleRedeemVoucher = async () => {
    if (!user || !selectedBrand) return;
    setLoading(true);

    try {
      // 1. Create Transaction (REDEEM type)
      const { error: txnError } = await supabase.from('transactions').insert([
        {
          user_phone: user.phone,
          type: 'REDEEM',
          amount_inr: parseFloat(amount),
          grams: grams,
          rate_per_gram: RATE,
          status: 'SUCCESS'
        }
      ]);
      
      if (txnError) throw txnError;

      // 2. Update Profile Balance (Deduct Gold)
      const newBalance = Math.max(0, (Number(user.goldBalanceGrams) || 0) - grams);
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ gold_balance: newBalance })
        .eq('phone', user.phone);

      if (profileError) throw profileError;

      await refreshUser();
      
      // Simulate Voucher Code Generation
      const voucherCode = `${selectedBrand.substring(0,3)}-${Math.random().toString(36).substring(2,8).toUpperCase()}`;
      setSuccessData({
        code: voucherCode,
        brand: BRANDS.find(b => b.id === selectedBrand)?.name || 'Gold Store',
        amount: amount
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
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Voucher Ready!</h2>
        <p className="text-slate-500 text-sm mb-8">
          Your gold has been successfully converted into a {successData.brand} voucher.
        </p>

        <div className="w-full bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6 relative overflow-hidden mb-8">
           <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-r border-slate-200"></div>
           <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-l border-slate-200"></div>
           
           <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">Voucher Code</p>
           <p className="text-2xl font-mono font-bold text-slate-900 tracking-wider select-all">{successData.code}</p>
           <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
             <span className="text-xs text-slate-500 font-bold">Value</span>
             <span className="text-lg font-bold text-gold-600">₹{successData.amount}</span>
           </div>
        </div>

        <Button fullWidth onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      <Header title="Redeem Gold" showBack />

      <div className="px-6 pt-6 pb-24 overflow-y-auto flex-1">
         {/* Toggle */}
         <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm mb-8">
            <button 
               onClick={() => { setActiveTab('CASH'); navigate('/sell'); }}
               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${activeTab === 'CASH' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
               <Wallet size={14} /> Cash Out
            </button>
            <button 
               onClick={() => setActiveTab('VOUCHER')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${activeTab === 'VOUCHER' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
            >
               <Ticket size={14} /> Voucher
            </button>
         </div>

         <div className="animate-fade-in space-y-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={100} />
               </div>
               <h3 className="text-lg font-bold mb-1 relative z-10">Convert to Jewellery</h3>
               <p className="text-indigo-100 text-xs leading-relaxed max-w-[80%] relative z-10">
                 Exchange your digital gold balance for a voucher code redeemable at partner stores near you.
               </p>
            </div>

            {/* Select Brand */}
            <div>
               <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3 block ml-1">Select Partner Brand</label>
               <div className="grid grid-cols-2 gap-3">
                  {BRANDS.map(brand => (
                    <button 
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.id)}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${selectedBrand === brand.id ? 'bg-white border-gold-500 ring-1 ring-gold-500/50 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                    >
                       <img src={brand.logo} className="w-8 h-8 rounded-full" alt={brand.name} />
                       <span className={`text-xs font-bold ${selectedBrand === brand.id ? 'text-slate-900' : 'text-slate-600'}`}>{brand.name}</span>
                    </button>
                  ))}
               </div>
            </div>

            {/* Amount */}
            {selectedBrand && (
              <div className="animate-slide-up bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-900">Redemption Value</span>
                    <span className="text-xs text-slate-500">Max: ₹{((user?.goldBalanceGrams || 0) * RATE).toFixed(2)}</span>
                 </div>
                 <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-4 text-lg font-bold text-slate-900 focus:outline-none focus:border-gold-500"
                    />
                 </div>
                 {grams > 0 && (
                   <p className="text-xs text-right text-slate-500">
                     Burns <span className="font-bold text-gold-600">{grams.toFixed(4)} gm</span> of gold
                   </p>
                 )}
              </div>
            )}
         </div>
      </div>

      <div className="p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 sticky bottom-0">
         <Button 
           fullWidth 
           size="lg" 
           onClick={handleRedeemVoucher}
           isLoading={loading}
           disabled={!selectedBrand || !amount || parseFloat(amount) <= 0 || (user ? parseFloat(amount) > (user.goldBalanceGrams * RATE) : true)}
           className="shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-purple-600 border-none"
         >
           Generate Voucher
         </Button>
      </div>
    </div>
  );
};