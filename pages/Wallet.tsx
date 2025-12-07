import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { 
  Wallet, 
  TrendingUp, 
  CalendarClock, 
  Ticket, 
  Loader2, 
  CreditCard,
  Copy,
  ChevronRight,
  Plus
} from '../components/ui/Icons';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { MOCK_RATES } from '../constants';
import { TransactionType } from '../types';

type WalletTab = 'PURCHASES' | 'SIPS' | 'VOUCHERS';

export const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<WalletTab>('PURCHASES');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [sips, setSips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user, activeTab]);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'PURCHASES') {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_phone', user?.phone)
          .in('type', ['BUY'])
          .order('created_at', { ascending: false });
        if (data) setTransactions(data);
      } 
      else if (activeTab === 'SIPS') {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('sips')
          .select('*')
          .eq('user_phone', user?.phone)
          .order('created_at', { ascending: false });
        
        let fetchedSips = data || [];

        // Merge with LocalStorage (for fallback/demo)
        const localSips = JSON.parse(localStorage.getItem(`sips_${user?.phone}`) || '[]');
        
        // Simple de-dupe based on ID if needed, but for now mostly unique
        const mergedSips = [...fetchedSips, ...localSips.filter((l: any) => !fetchedSips.some((r: any) => r.id === l.id))];
        
        // Re-sort
        mergedSips.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setSips(mergedSips);
      }
      else if (activeTab === 'VOUCHERS') {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_phone', user?.phone)
          .eq('type', 'REDEEM')
          .order('created_at', { ascending: false });
        if (data) setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching wallet data", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPurchases = () => (
    <div className="space-y-4 animate-fade-in">
       {transactions.length > 0 ? (
         transactions.map(txn => (
           <div 
             key={txn.id} 
             onClick={() => navigate(`/transaction/${txn.id}`, { state: { transaction: txn } })}
             className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center group hover:border-gold-200 transition-all active:scale-[0.98] cursor-pointer"
           >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100 group-hover:bg-green-100 transition-colors">
                    <TrendingUp size={18} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-900">Gold Purchase</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                       <span>{new Date(txn.created_at).toLocaleDateString()}</span>
                       <span className="w-0.5 h-0.5 bg-slate-300 rounded-full"></span>
                       <span>@ ₹{Number(txn.rate_per_gram).toLocaleString()}/gm</span>
                    </div>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-sm font-bold text-slate-900">+{Number(txn.grams).toFixed(4)} gm</p>
                 <p className="text-xs text-slate-500 font-medium">₹{Number(txn.amount_inr).toLocaleString()}</p>
              </div>
           </div>
         ))
       ) : (
         <div className="text-center py-10">
           <p className="text-slate-400 text-sm mb-4">No purchase history found</p>
           <Button size="sm" onClick={() => navigate('/buy')}>Start Investing</Button>
         </div>
       )}
    </div>
  );

  const renderSIPs = () => (
    <div className="space-y-4 animate-fade-in">
       {sips.length > 0 ? (
         sips.map(sip => (
           <div 
             key={sip.id} 
             onClick={() => navigate('/sip')}
             className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                 <div>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase tracking-wider">{sip.sip_type}</span>
                    <h4 className="text-lg font-bold text-slate-900 mt-1">₹{sip.plan_amount}</h4>
                 </div>
                 <div className={`px-2 py-1 rounded text-[10px] font-bold border ${sip.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {sip.status}
                 </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-50">
                 <span>Next Due: {new Date(sip.next_due_date).toLocaleDateString()}</span>
                 <span className="font-bold text-purple-600 flex items-center gap-1">Manage <ChevronRight size={12} /></span>
              </div>
           </div>
         ))
       ) : (
         <div className="text-center py-10">
           <p className="text-slate-400 text-sm mb-4">No active SIPs</p>
           <Button size="sm" onClick={() => navigate('/sip')}>Start SIP</Button>
         </div>
       )}
    </div>
  );

  const renderVouchers = () => (
    <div className="space-y-4 animate-fade-in">
       {transactions.length > 0 ? (
         transactions.map(txn => {
           // Mock code generation for display to verify requirement "see all redeemed vouchers"
           const mockCode = `PMJ-${txn.id.substring(0,6).toUpperCase()}`;
           return (
             <div 
               key={txn.id} 
               onClick={() => navigate(`/transaction/${txn.id}`, { state: { transaction: txn } })}
               className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group border-l-4 border-l-gold-500 active:scale-[0.98] transition-transform cursor-pointer"
             >
                <div className="flex justify-between items-start mb-3">
                   <div>
                      <h4 className="text-sm font-bold text-slate-900">PMJ Jewels Voucher</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(txn.created_at).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-lg font-bold text-gold-600">₹{Number(txn.amount_inr).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">{Number(txn.grams).toFixed(4)} gm</p>
                   </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 border-dashed flex justify-between items-center" onClick={(e) => { e.stopPropagation(); }}>
                   <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Redemption Code</p>
                      <p className="text-sm font-mono font-bold text-slate-800 tracking-wide">{mockCode}</p>
                   </div>
                   <button onClick={() => {navigator.clipboard.writeText(mockCode); alert('Code Copied!')}} className="p-2 text-gold-600 hover:bg-gold-50 rounded-full transition-colors">
                      <Copy size={16} />
                   </button>
                </div>
                <div className="mt-3 text-[10px] text-slate-400 flex items-center gap-1">
                   <Ticket size={10} /> Show this code at store to redeem
                </div>
             </div>
           );
         })
       ) : (
         <div className="text-center py-10">
           <p className="text-slate-400 text-sm mb-4">No redeemed vouchers</p>
           <Button size="sm" onClick={() => navigate('/redeem')}>Redeem Gold</Button>
         </div>
       )}
    </div>
  );

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      <Header title="My Wallet" showBack={false} />
      
      <div className="px-6 pt-6 flex-1 overflow-y-auto pb-24">
         {/* Portfolio Summary */}
         <div className="bg-slate-900 rounded-[1.5rem] p-6 text-white shadow-xl shadow-slate-900/20 mb-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-500/20 rounded-full blur-3xl"></div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Gold Holdings</p>
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">{user?.goldBalanceGrams.toFixed(4)} <span className="text-xl text-gold-500">gm</span></h2>
            <div className="flex gap-4">
               <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Current Value</p>
                  <p className="text-lg font-bold">₹{((user?.goldBalanceGrams || 0) * MOCK_RATES.sell).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
               </div>
            </div>
            
            <div className="mt-6 flex gap-3">
               <button onClick={() => navigate('/buy')} className="flex-1 bg-white text-slate-900 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                 <Plus size={14} /> Invest
               </button>
               <button onClick={() => navigate('/redeem')} className="flex-1 bg-white/10 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors border border-white/10 flex items-center justify-center gap-2">
                 <Ticket size={14} /> Redeem
               </button>
            </div>
         </div>

         {/* Tabs */}
         <div className="flex p-1 bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
            <button 
              onClick={() => setActiveTab('PURCHASES')} 
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'PURCHASES' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Purchases
            </button>
            <button 
              onClick={() => setActiveTab('SIPS')} 
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'SIPS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              SIPs
            </button>
            <button 
              onClick={() => setActiveTab('VOUCHERS')} 
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'VOUCHERS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Vouchers
            </button>
         </div>

         {loading ? (
            <div className="flex justify-center py-10">
               <Loader2 className="animate-spin text-gold-500" size={32} />
            </div>
         ) : (
            <>
               {activeTab === 'PURCHASES' && renderPurchases()}
               {activeTab === 'SIPS' && renderSIPs()}
               {activeTab === 'VOUCHERS' && renderVouchers()}
            </>
         )}
      </div>
    </div>
  );
};