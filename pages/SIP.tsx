import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { CalendarClock, Plus, CheckCircle, PauseCircle, PlayCircle, AlertTriangle, TrendingUp } from '../components/ui/Icons';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { MOCK_RATES } from '../constants';
import { getErrorMessage } from '../utils/helpers';

export const SIP: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'MY_SIPS' | 'CREATE'>('MY_SIPS');
  const [sips, setSips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('MONTHLY');
  const [date, setDate] = useState('');

  const RATE = MOCK_RATES.buy;

  useEffect(() => {
    if (user) fetchSIPs();
  }, [user]);

  const fetchSIPs = async () => {
    const { data } = await supabase
      .from('sips')
      .select('*')
      .eq('user_phone', user?.phone)
      .order('created_at', { ascending: false });
    
    if (data) setSips(data);
  };

  const handleCreateSIP = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Create SIP Record
      const { error: sipError } = await supabase.from('sips').insert([
        {
          user_phone: user.phone,
          amount: parseFloat(amount),
          frequency,
          next_due_date: date,
          status: 'ACTIVE'
        }
      ]);

      if (sipError) throw sipError;

      // 2. Process First Installment (Immediate Buy)
      const grams = parseFloat(amount) / RATE;
      
      const { error: txnError } = await supabase.from('transactions').insert([
        {
          user_phone: user.phone,
          type: 'BUY', // SIP is technically a recurring BUY
          amount_inr: parseFloat(amount),
          grams: grams,
          rate_per_gram: RATE,
          status: 'SUCCESS'
        }
      ]);

      if (txnError) throw txnError;

      // 3. Update User Balance
      const newBalance = (Number(user.goldBalanceGrams) || 0) + grams;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ gold_balance: newBalance })
        .eq('phone', user.phone);

      if (profileError) throw profileError;

      await refreshUser();
      await fetchSIPs();
      setSuccess(true);
    } catch (e: any) {
      console.error(e);
      const msg = getErrorMessage(e);
      alert("Failed to create SIP: " + msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-full bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-8 border border-purple-100 shadow-xl shadow-purple-100/50">
          <CalendarClock className="text-purple-500 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">SIP Started!</h2>
        <p className="text-slate-500 text-center mb-10 leading-relaxed max-w-xs mx-auto">
          Your Gold SIP of <span className="text-slate-900 font-bold">₹{amount}</span> has been set up successfully.<br/>
          <span className="text-xs text-green-600 font-bold mt-2 block">First installment processed successfully.</span>
        </p>
        <div className="space-y-3 w-full">
           <Button fullWidth size="lg" onClick={() => { setSuccess(false); setActiveTab('MY_SIPS'); setAmount(''); setDate(''); }}>View My SIPs</Button>
           <Button fullWidth variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      <Header title="Gold SIP" showBack />

      <div className="px-6 pt-4 sticky top-[60px] bg-slate-50 z-10 pb-4">
         <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
            <button 
               onClick={() => setActiveTab('MY_SIPS')}
               className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'MY_SIPS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
               My SIPs
            </button>
            <button 
               onClick={() => setActiveTab('CREATE')}
               className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'CREATE' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
               Start New SIP
            </button>
         </div>
      </div>

      <div className="flex-1 px-6 pb-24 overflow-y-auto">
         {activeTab === 'MY_SIPS' ? (
           <div className="space-y-4">
              {sips.length > 0 ? sips.map(sip => (
                <div key={sip.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                      <CalendarClock size={80} className="text-slate-900" />
                   </div>
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">SIP Amount</p>
                            <h3 className="text-2xl font-bold text-slate-900">₹{sip.amount}</h3>
                         </div>
                         <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${sip.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                           {sip.status}
                         </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                         <div>
                           <p className="text-xs text-slate-400 mb-0.5">Frequency</p>
                           <p className="font-semibold text-slate-700">{sip.frequency}</p>
                         </div>
                         <div>
                           <p className="text-xs text-slate-400 mb-0.5">Next Date</p>
                           <p className="font-semibold text-slate-700">{new Date(sip.next_due_date).toLocaleDateString()}</p>
                         </div>
                      </div>
                   </div>
                </div>
              )) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 border-dashed">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarClock className="text-slate-400" size={32} />
                   </div>
                   <p className="text-sm text-slate-500 mb-4">No Active SIPs</p>
                   <Button size="sm" variant="outline" onClick={() => setActiveTab('CREATE')}>Start Your First SIP</Button>
                </div>
              )}
           </div>
         ) : (
           <div className="space-y-6 animate-fade-in">
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center">
                 <h3 className="text-purple-900 font-bold text-lg mb-2">Automate your Savings</h3>
                 <p className="text-xs text-purple-700 leading-relaxed max-w-xs mx-auto">
                   Invest small amounts regularly to build wealth over time. 
                   Money will be auto-debited from your wallet.
                 </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
                 <div>
                    <label className="text-xs text-slate-500 font-medium mb-1.5 block">SIP Amount (₹)</label>
                    <input 
                       type="number"
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)}
                       placeholder="Min ₹100"
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                 </div>

                 <div>
                    <label className="text-xs text-slate-500 font-medium mb-1.5 block">Frequency</label>
                    <div className="grid grid-cols-2 gap-3">
                       {['WEEKLY', 'MONTHLY'].map(f => (
                         <button 
                           key={f}
                           onClick={() => setFrequency(f)}
                           className={`py-3 rounded-xl text-xs font-bold border transition-all ${frequency === f ? 'bg-purple-500 text-white border-purple-500 shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                         >
                           {f}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="text-xs text-slate-500 font-medium mb-1.5 block">Start Date</label>
                    <input 
                       type="date"
                       value={date}
                       onChange={(e) => setDate(e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-purple-500"
                    />
                 </div>
              </div>

              <Button 
                fullWidth 
                size="lg" 
                onClick={handleCreateSIP}
                isLoading={loading}
                disabled={!amount || !date || parseFloat(amount) < 100}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 shadow-purple-500/20 border-none"
              >
                Create SIP & Pay First Installment
              </Button>
           </div>
         )}
      </div>
    </div>
  );
};