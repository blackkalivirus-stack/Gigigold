import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { Phone, User, CheckCircle, Heart, AlertTriangle } from '../components/ui/Icons';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { MOCK_RATES } from '../constants';
import { getErrorMessage } from '../utils/helpers';

export const GiftGold: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('Here is a gift of gold for you!');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const RATE = MOCK_RATES.buy;
  
  const totalPayable = parseFloat(amount) || 0;
  const calculatedGrams = totalPayable / RATE;

  const handleGift = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Create Transaction (GIFT type)
      const { error: txnError } = await supabase.from('transactions').insert([
        {
          user_phone: user.phone,
          type: 'GIFT',
          amount_inr: totalPayable,
          grams: calculatedGrams,
          rate_per_gram: RATE,
          status: 'SUCCESS'
        }
      ]);
      
      if (txnError) throw txnError;

      // 2. Add to recipient profile if they exist
      const { data: recipientData } = await supabase
        .from('profiles')
        .select('phone, gold_balance')
        .eq('phone', recipientPhone)
        .maybeSingle();

      if (recipientData) {
        await supabase
          .from('profiles')
          .update({ gold_balance: (recipientData.gold_balance || 0) + calculatedGrams })
          .eq('phone', recipientPhone);
      }

      await refreshUser();
      setSuccess(true);
    } catch (error) {
       console.error("Gift error:", error);
       const msg = getErrorMessage(error);
       alert("Failed to send gift: " + msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-full bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-8 border border-pink-100 shadow-xl shadow-pink-100/50">
          <Heart className="text-pink-500 w-12 h-12 fill-pink-500" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Gift Sent Successfully!</h2>
        <p className="text-slate-500 text-center mb-10 leading-relaxed max-w-xs mx-auto">
          You sent <span className="text-slate-900 font-bold">{calculatedGrams.toFixed(4)} gm</span> of gold to <br/>
          <span className="font-semibold text-slate-900">{recipientName || recipientPhone}</span>.
        </p>
        <Button fullWidth size="lg" onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      <Header title="Gift Gold" showBack />

      <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Recipient Details</h3>
            <div>
               <label className="text-xs text-slate-500 font-medium mb-1.5 block">Mobile Number</label>
               <div className="relative">
                  <div className="absolute left-3.5 top-3.5 flex items-center gap-1 border-r border-slate-200 pr-2">
                     <span className="text-xs font-bold text-slate-600">+91</span>
                  </div>
                  <input 
                     type="tel"
                     value={recipientPhone}
                     onChange={(e) => setRecipientPhone(e.target.value.replace(/\D/g, ''))}
                     placeholder="98765 43210"
                     maxLength={10}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-16 pr-3 py-3 text-slate-900 text-sm font-bold focus:outline-none focus:border-gold-500 transition-all"
                  />
               </div>
            </div>
            <div>
               <label className="text-xs text-slate-500 font-medium mb-1.5 block">Recipient Name (Optional)</label>
               <div className="relative">
                  <User className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                  <input 
                     type="text"
                     value={recipientName}
                     onChange={(e) => setRecipientName(e.target.value)}
                     placeholder="Enter Name"
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-gold-500 transition-all"
                  />
               </div>
            </div>
         </div>

         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Gift Value</h3>
            <div>
               <label className="text-xs text-slate-500 font-medium mb-1.5 block">Amount (₹)</label>
               <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-2xl font-bold text-slate-900 focus:outline-none focus:border-gold-500 transition-all"
               />
               <p className="text-xs text-slate-400 mt-2 text-right">
                 Approx: <span className="text-gold-600 font-bold">{calculatedGrams.toFixed(4)} gm</span>
               </p>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
               {[101, 501, 1001, 2001].map(amt => (
                  <button 
                     key={amt} 
                     onClick={() => setAmount(amt.toString())}
                     className="py-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-600 border border-slate-100 hover:border-gold-400 hover:text-gold-700 hover:bg-gold-50 transition-all"
                  >
                     ₹{amt}
                  </button>
               ))}
            </div>
         </div>

         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Add a Message</h3>
            <textarea 
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-gold-500 resize-none h-24"
            />
         </div>
      </div>

      <div className="p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 sticky bottom-0">
         <Button 
           fullWidth 
           size="lg" 
           onClick={handleGift} 
           isLoading={loading}
           disabled={!recipientPhone || !amount || parseFloat(amount) <= 0}
           className="shadow-xl shadow-pink-500/20 bg-gradient-to-r from-pink-500 to-rose-500 border-none"
         >
           Pay & Send Gift
         </Button>
      </div>
    </div>
  );
};