import React, { useState } from 'react';
import { Header } from '../components/Header';
import { MOCK_HISTORY } from '../constants';
import { TransactionType } from '../types';
import { TrendingUp, TrendingDown, Gift, Repeat, CreditCard } from '../components/ui/Icons';

export const Transactions: React.FC = () => {
  const [filter, setFilter] = useState<TransactionType | 'ALL'>('ALL');

  const filtered = filter === 'ALL' 
    ? MOCK_HISTORY 
    : MOCK_HISTORY.filter(t => t.type === filter);

  return (
    <div className="min-h-full bg-navy-950 flex flex-col pt-safe">
      <Header title="Transactions" className="sticky top-0 bg-navy-950/95" />
      
      <div className="px-6 pt-2 pb-4 border-b border-white/5 bg-navy-950/50 backdrop-blur-xl sticky top-[60px] sm:top-[72px] z-20">
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {['ALL', 'BUY', 'SELL', 'GIFT'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-300 ${
                  filter === f 
                  ? 'bg-gold-500 border-gold-500 text-white shadow-lg shadow-gold-900/20' 
                  : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
         </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-24 space-y-4">
        {filtered.map((txn) => (
          <div key={txn.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:bg-slate-900/60 transition-colors animate-fade-in">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-white/5 shadow-md ${
                txn.type === TransactionType.BUY ? 'bg-gradient-to-br from-green-500/20 to-green-900/20 text-green-500' : 
                txn.type === TransactionType.SELL ? 'bg-gradient-to-br from-red-500/20 to-red-900/20 text-red-500' : 
                txn.type === TransactionType.GIFT ? 'bg-gradient-to-br from-purple-500/20 to-purple-900/20 text-purple-500' :
                'bg-gradient-to-br from-blue-500/20 to-blue-900/20 text-blue-500'
              }`}>
                {txn.type === TransactionType.BUY ? <TrendingUp size={20} /> : 
                 txn.type === TransactionType.SELL ? <TrendingDown size={20} /> : 
                 txn.type === TransactionType.GIFT ? <Gift size={20} /> : <Repeat size={20} />}
              </div>
              <div>
                <p className="text-sm font-bold text-white capitalize tracking-tight">
                  {txn.type === 'BUY' ? 'Bought Gold' : txn.type === 'SELL' ? 'Sold Gold' : txn.type.toLowerCase()}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                   <p className="text-[10px] text-slate-500 font-medium">{new Date(txn.date).toLocaleDateString()}</p>
                   <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                   <p className="text-[10px] text-slate-600 font-mono tracking-wider">{txn.id.slice(-6)}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${
                 txn.type === 'BUY' ? 'text-green-500' : txn.type === 'SELL' ? 'text-white' : 'text-slate-300'
              }`}>
                {txn.type === TransactionType.BUY ? '+' : '-'}{txn.grams.toFixed(4)} g
              </p>
              <p className="text-xs text-slate-500 font-mono">₹{txn.amountInr.toLocaleString()}</p>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
               <CreditCard className="opacity-20" size={40} />
            </div>
            <p className="text-sm font-medium">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};