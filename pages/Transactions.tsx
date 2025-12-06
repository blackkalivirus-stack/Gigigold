import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { TransactionType } from '../types';
import { TrendingUp, TrendingDown, Gift, Repeat, CreditCard, Loader2, CalendarClock } from '../components/ui/Icons';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.phone) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_phone', user.phone)
          .order('created_at', { ascending: false });
          
        if (data) {
          setTransactions(data.map(txn => ({
            id: txn.id,
            type: txn.type,
            amountInr: txn.amount_inr,
            grams: txn.grams,
            ratePerGram: txn.rate_per_gram,
            date: txn.created_at,
            status: txn.status
          })));
        }
      } catch (e) {
        console.error("Error fetching transactions", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user]);

  const filtered = filter === 'ALL' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  return (
    <div className="min-h-full bg-slate-50 flex flex-col pt-safe">
      <Header title="Transactions" className="sticky top-0 bg-white/95" />
      
      <div className="px-6 pt-2 pb-4 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-[60px] sm:top-[72px] z-20">
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['ALL', 'BUY', 'SELL', 'SIP', 'GIFT'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-300 ${
                  filter === f 
                  ? 'bg-gold-500 border-gold-500 text-white shadow-md shadow-gold-500/20' 
                  : 'bg-slate-100 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                {f === 'ALL' ? 'All' : f === 'SIP' ? 'SIP' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
         </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-24 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-gold-500" size={32} />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((txn) => (
            <div 
              key={txn.id} 
              className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(`/transaction/${txn.id}`, { state: { transaction: txn } })}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-slate-50 ${
                  txn.type === TransactionType.BUY ? 'bg-green-50 text-green-600' : 
                  txn.type === TransactionType.SELL ? 'bg-red-50 text-red-600' : 
                  txn.type === TransactionType.GIFT ? 'bg-purple-50 text-purple-600' :
                  txn.type === TransactionType.SIP ? 'bg-indigo-50 text-indigo-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {txn.type === TransactionType.BUY ? <TrendingUp size={20} /> : 
                   txn.type === TransactionType.SELL ? <TrendingDown size={20} /> : 
                   txn.type === TransactionType.GIFT ? <Gift size={20} /> : 
                   txn.type === TransactionType.SIP ? <CalendarClock size={20} /> :
                   <Repeat size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 capitalize tracking-tight">
                    {txn.type === 'BUY' ? 'Bought Gold' : 
                     txn.type === 'SELL' ? 'Sold Gold' : 
                     txn.type === 'SIP' ? 'Gold SIP' :
                     txn.type.toLowerCase()}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                     <p className="text-[10px] text-slate-500 font-medium">{new Date(txn.date).toLocaleDateString()}</p>
                     <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                     <p className="text-[10px] text-slate-400 font-mono tracking-wider">{txn.id.slice(0, 8)}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${
                   txn.type === 'BUY' ? 'text-green-600' : 
                   txn.type === 'SIP' ? 'text-green-600' :
                   txn.type === 'SELL' ? 'text-slate-900' : 
                   'text-slate-600'
                }`}>
                  {txn.type === TransactionType.BUY || txn.type === TransactionType.SIP ? '+' : '-'}{Number(txn.grams).toFixed(4)} g
                </p>
                <p className="text-xs text-slate-500 font-mono">₹{Number(txn.amountInr).toLocaleString()}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200">
               <CreditCard className="opacity-40" size={40} />
            </div>
            <p className="text-sm font-medium">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};