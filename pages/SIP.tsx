import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { CalendarClock, Plus, CheckCircle, PauseCircle, PlayCircle, AlertTriangle, TrendingUp, RefreshCw, Calendar, Info } from '../components/ui/Icons';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { MOCK_RATES } from '../constants';
import { getErrorMessage } from '../utils/helpers';
import { TransactionType } from '../types';

type SipType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

interface SipRecord {
  id: string;
  user_phone: string;
  sip_type: SipType;
  plan_amount: number;
  start_date: string;
  next_due_date: string;
  total_cycles: number;
  cycles_completed: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
}

export const SIP: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'MY_SIPS' | 'CREATE'>('MY_SIPS');
  const [sips, setSips] = useState<SipRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // ID of SIP being processed
  const [success, setSuccess] = useState(false);

  // Create Form State
  const [amount, setAmount] = useState('');
  const [sipType, setSipType] = useState<SipType>('MONTHLY');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalCycles, setTotalCycles] = useState('12');

  const RATE = MOCK_RATES.buy;

  useEffect(() => {
    if (user) fetchSIPs();
  }, [user]);

  const fetchSIPs = async () => {
    setFetchError(null);
    if (!user?.phone) return;

    try {
      // Hybrid Fetch: Try DB first, fallback to LocalStorage if DB table is missing
      const { data, error } = await supabase
        .from('sips')
        .select('*')
        .eq('user_phone', user.phone)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }

      setSips((data as SipRecord[]) || []);
    } catch (err: any) {
      console.warn("Error fetching SIPs from Supabase:", err);
      
      // Fallback to local storage
      const localSips = localStorage.getItem(`sips_${user.phone}`);
      if (localSips) {
        setSips(JSON.parse(localSips));
        setFetchError(null); // It's working locally, so don't show error
      } else {
         const msg = getErrorMessage(err);
         // 42P01 is Postgres code for "table undefined"
         if (msg.includes("42P01") || msg.toLowerCase().includes("relation") || msg.toLowerCase().includes("does not exist")) {
           // Assume demo mode if table is missing
           setSips([]);
         } else {
           setFetchError(msg);
         }
      }
    }
  };

  const calculateNextDate = (currentDate: string, type: SipType): string => {
    const date = new Date(currentDate);
    if (type === 'DAILY') date.setDate(date.getDate() + 1);
    if (type === 'WEEKLY') date.setDate(date.getDate() + 7);
    if (type === 'MONTHLY') date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

  const saveToLocalStorage = (newSip: SipRecord) => {
    const key = `sips_${user?.phone}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify([newSip, ...existing]));
  };

  const handleCreateSIP = async () => {
    if (!user) return;
    setLoading(true);

    const firstPaymentDate = startDate; 
    const nextDue = calculateNextDate(firstPaymentDate, sipType);
    
    // Optimistic SIP Object
    const newSip: SipRecord = {
      id: `sip_${Date.now()}`,
      user_phone: user.phone,
      sip_type: sipType,
      plan_amount: parseFloat(amount),
      start_date: firstPaymentDate,
      next_due_date: nextDue,
      total_cycles: parseInt(totalCycles),
      cycles_completed: 1,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };

    try {
      // 1. Insert SIP Record
      const { error: sipError } = await supabase.from('sips').insert([
        {
          ...newSip,
          id: undefined // Let DB generate ID if possible
        }
      ]);

      if (sipError) throw sipError;

      // 2. Process First Installment
      const grams = parseFloat(amount) / RATE;
      
      const { error: txnError } = await supabase.from('transactions').insert([
        {
          user_phone: user.phone,
          type: TransactionType.SIP, 
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
      // Fallback: If DB fails (table missing), save locally for DEMO
      const msg = getErrorMessage(e);
      if (msg.includes("42P01") || msg.toLowerCase().includes("relation")) {
        console.log("Database table missing, falling back to LocalStorage for SIP");
        saveToLocalStorage(newSip);
        
        // Also mock the transaction update in UI via refresh (User balance won't persist across refresh if profile update failed too, but that's ok for demo)
        setSips(prev => [newSip, ...prev]);
        setSuccess(true);
      } else {
        alert("Failed to create SIP: " + msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayInstallment = async (sip: SipRecord) => {
    if (!user) return;
    setActionLoading(sip.id);

    try {
      const currentCompleted = sip.cycles_completed + 1;
      const isCompleted = currentCompleted >= sip.total_cycles;
      const newNextDueDate = calculateNextDate(sip.next_due_date, sip.sip_type);
      const newStatus = isCompleted ? 'COMPLETED' : 'ACTIVE';

      // 1. Update SIP
      const { error: updateError } = await supabase
        .from('sips')
        .update({
          cycles_completed: currentCompleted,
          next_due_date: newNextDueDate,
          status: newStatus
        })
        .eq('id', sip.id);

      if (updateError) throw updateError;

      // 2. Create Transaction (SIP Type)
      const grams = sip.plan_amount / RATE;
      const { error: txnError } = await supabase.from('transactions').insert([
        {
          user_phone: user.phone,
          type: TransactionType.SIP,
          amount_inr: sip.plan_amount,
          grams: grams,
          rate_per_gram: RATE,
          status: 'SUCCESS'
        }
      ]);

      if (txnError) throw txnError;

      // 3. Update Balance
      const newBalance = (Number(user.goldBalanceGrams) || 0) + grams;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ gold_balance: newBalance })
        .eq('phone', user.phone);

      if (profileError) throw profileError;

      await refreshUser();
      await fetchSIPs();

    } catch (e: any) {
       // Local Storage Fallback for Pay
       const msg = getErrorMessage(e);
       if (msg.includes("42P01") || msg.toLowerCase().includes("relation")) {
         // Update local SIP
         const key = `sips_${user.phone}`;
         const localSips = JSON.parse(localStorage.getItem(key) || '[]');
         const updatedSips = localSips.map((s: SipRecord) => {
            if (s.id === sip.id) {
               return {
                  ...s,
                  cycles_completed: sip.cycles_completed + 1,
                  next_due_date: calculateNextDate(sip.next_due_date, sip.sip_type),
                  status: (sip.cycles_completed + 1 >= sip.total_cycles) ? 'COMPLETED' : 'ACTIVE'
               }
            }
            return s;
         });
         localStorage.setItem(key, JSON.stringify(updatedSips));
         setSips(updatedSips);
       } else {
         alert("Payment failed: " + msg);
       }
    } finally {
      setActionLoading(null);
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
          Your <span className="font-bold text-slate-900 capitalize">{sipType.toLowerCase()}</span> SIP of <span className="text-slate-900 font-bold">₹{amount}</span> has been set up.<br/>
          <span className="text-xs text-green-600 font-bold mt-2 block">First installment processed successfully.</span>
        </p>
        <div className="space-y-3 w-full">
           <Button fullWidth size="lg" onClick={() => { setSuccess(false); setActiveTab('MY_SIPS'); setAmount(''); setStartDate(new Date().toISOString().split('T')[0]); }}>View My SIPs</Button>
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
              {fetchError && (
                 <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-start gap-3 animate-fade-in">
                    <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-red-800">Unable to load SIPs</h3>
                      <p className="text-xs text-red-600 mt-1">{fetchError}</p>
                      <button 
                        onClick={fetchSIPs}
                        className="mt-3 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors inline-flex items-center gap-2"
                      >
                        <RefreshCw size={12} /> Retry
                      </button>
                    </div>
                 </div>
              )}

              {!fetchError && sips.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarClock className="text-slate-400" size={32} />
                   </div>
                   <p className="text-sm text-slate-500 mb-4">No Active SIPs Found</p>
                   <Button size="sm" variant="outline" onClick={() => setActiveTab('CREATE')}>Start Your First SIP</Button>
                </div>
              )}

              {sips.length > 0 && sips.map(sip => {
                const progress = (sip.cycles_completed / sip.total_cycles) * 100;
                const isProcessing = actionLoading === sip.id;
                
                return (
                  <div key={sip.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                     <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <CalendarClock size={100} className="text-slate-900" />
                     </div>
                     
                     <div className="relative z-10">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex flex-col">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit mb-2 ${
                                sip.sip_type === 'DAILY' ? 'bg-blue-50 text-blue-600' : 
                                sip.sip_type === 'WEEKLY' ? 'bg-purple-50 text-purple-600' : 'bg-gold-50 text-gold-600'
                              }`}>
                                {sip.sip_type}
                              </span>
                              <h3 className="text-2xl font-bold text-slate-900">₹{sip.plan_amount}</h3>
                           </div>
                           <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                             sip.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 
                             sip.status === 'COMPLETED' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-red-50 text-red-600 border-red-100'
                           }`}>
                             {sip.status}
                           </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                           <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-slate-500">Progress</span>
                              <span className="font-bold text-slate-900">{sip.cycles_completed}/{sip.total_cycles} Cycles</span>
                           </div>
                           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-900 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                           </div>
                        </div>

                        {/* Footer Info */}
                        <div className="flex items-center justify-between text-sm bg-slate-50 rounded-xl p-3 border border-slate-100">
                           <div>
                             <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-0.5">Next Due</p>
                             <div className="flex items-center gap-1.5">
                               <Calendar size={12} className="text-slate-500"/>
                               <p className="font-bold text-slate-700">
                                 {sip.status === 'COMPLETED' ? '-' : new Date(sip.next_due_date).toLocaleDateString()}
                               </p>
                             </div>
                           </div>
                           
                           {sip.status === 'ACTIVE' && (
                             <Button 
                               size="sm" 
                               onClick={() => handlePayInstallment(sip)}
                               isLoading={isProcessing}
                               className="h-8 text-xs"
                             >
                               Pay Installment
                             </Button>
                           )}
                        </div>
                     </div>
                  </div>
                );
              })}
           </div>
         ) : (
           <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg shadow-purple-500/20">
                 <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                   <RefreshCw size={20} className="animate-spin-slow" /> Automate Savings
                 </h3>
                 <p className="text-xs text-purple-100 leading-relaxed max-w-xs opacity-90">
                   Systematic Investment Plans help you average out market volatility. Start with as low as ₹100.
                 </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                 <div>
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block ml-1">SIP Amount (₹)</label>
                    <input 
                       type="number"
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)}
                       placeholder="Min ₹100"
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-xl font-bold text-slate-900 focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-300"
                    />
                 </div>

                 <div>
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block ml-1">Frequency</label>
                    <div className="grid grid-cols-3 gap-2">
                       {(['DAILY', 'WEEKLY', 'MONTHLY'] as SipType[]).map(f => (
                         <button 
                           key={f}
                           onClick={() => { setSipType(f); setTotalCycles(f === 'DAILY' ? '30' : f === 'WEEKLY' ? '12' : '12'); }}
                           className={`py-3 rounded-xl text-[10px] sm:text-xs font-bold border transition-all ${sipType === f ? 'bg-purple-600 text-white border-purple-600 shadow-md transform scale-105' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                         >
                           {f}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block ml-1">Start Date</label>
                      <input 
                         type="date"
                         value={startDate}
                         min={new Date().toISOString().split('T')[0]}
                         onChange={(e) => setStartDate(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 block ml-1">Total Cycles</label>
                      <input 
                         type="number"
                         value={totalCycles}
                         onChange={(e) => setTotalCycles(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                 </div>
              </div>

              {/* Summary */}
              {amount && totalCycles && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-500">Total Investment</span>
                    <span className="text-sm font-bold text-slate-900">₹{(parseFloat(amount) * parseInt(totalCycles)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Ends On</span>
                    <span className="text-sm font-bold text-slate-900">
                      {(() => {
                        const end = new Date(startDate);
                        const cycles = parseInt(totalCycles);
                        if (sipType === 'DAILY') end.setDate(end.getDate() + cycles);
                        if (sipType === 'WEEKLY') end.setDate(end.getDate() + (cycles * 7));
                        if (sipType === 'MONTHLY') end.setDate(end.getDate() + (cycles * 30));
                        return end.toLocaleDateString();
                      })()}
                    </span>
                  </div>
                </div>
              )}

              <Button 
                fullWidth 
                size="lg" 
                onClick={handleCreateSIP}
                isLoading={loading}
                disabled={!amount || !startDate || !totalCycles || parseFloat(amount) < 100}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/20 border-none"
              >
                Start SIP & Pay First Installment
              </Button>
           </div>
         )}
      </div>
    </div>
  );
};