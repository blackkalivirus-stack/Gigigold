import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Gift, 
  CalendarClock, 
  CreditCard, 
  Ticket,
  Share2,
  Download,
  HelpCircle,
  Copy,
  Loader2
} from '../components/ui/Icons';
import { supabase } from '../utils/supabaseClient';
import { TransactionType, TransactionStatus } from '../types';
import { getErrorMessage } from '../utils/helpers';

export const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [txn, setTxn] = useState<any | null>(location.state?.transaction || null);
  const [loading, setLoading] = useState(!location.state?.transaction);
  const [error, setError] = useState('');

  useEffect(() => {
    // If we don't have transaction data from state, fetch it
    if (!txn && id) {
      const fetchTxn = async () => {
        try {
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;

          // Map snake_case to camelCase matches our internal type structure if needed
          // But for this view we can just use the DB shape or map it
          setTxn({
            id: data.id,
            type: data.type,
            amountInr: data.amount_inr,
            grams: data.grams,
            ratePerGram: data.rate_per_gram,
            date: data.created_at,
            status: data.status,
            user_phone: data.user_phone
          });
        } catch (err) {
          setError(getErrorMessage(err));
        } finally {
          setLoading(false);
        }
      };
      fetchTxn();
    }
  }, [id, txn]);

  if (loading) {
    return (
      <div className="min-h-full bg-slate-50 flex flex-col">
        <Header title="Details" showBack />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-gold-500" size={32} />
        </div>
      </div>
    );
  }

  if (error || !txn) {
    return (
      <div className="min-h-full bg-slate-50 flex flex-col">
        <Header title="Details" showBack />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-slate-400" size={32} />
          </div>
          <h3 className="text-slate-900 font-bold mb-2">Transaction Not Found</h3>
          <p className="text-slate-500 text-sm mb-6">{error || "The transaction you are looking for does not exist."}</p>
          <Button onClick={() => navigate('/transactions')}>Go to History</Button>
        </div>
      </div>
    );
  }

  // Helper to determine styles based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'text-green-600 bg-green-50 border-green-100';
      case 'FAILED': return 'text-red-600 bg-red-50 border-red-100';
      case 'PENDING': return 'text-gold-600 bg-gold-50 border-gold-100';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle size={32} />;
      case 'FAILED': return <AlertTriangle size={32} />;
      case 'PENDING': return <Clock size={32} />;
      default: return <HelpCircle size={32} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BUY': return <TrendingUp size={20} />;
      case 'SELL': return <TrendingDown size={20} />;
      case 'GIFT': return <Gift size={20} />;
      case 'SIP': return <CalendarClock size={20} />;
      case 'REDEEM': return <Ticket size={20} />;
      default: return <CreditCard size={20} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'BUY': return 'Buy Gold';
      case 'SELL': return 'Sell Gold';
      case 'GIFT': return 'Gift Gold';
      case 'SIP': return 'Gold SIP';
      case 'REDEEM': return 'Redemption';
      default: return type;
    }
  };

  // Calculations
  const isBuyOrSip = txn.type === 'BUY' || txn.type === 'SIP';
  const gst = isBuyOrSip ? txn.amountInr - (txn.amountInr / 1.03) : 0;
  const baseAmount = txn.amountInr - gst;

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      <Header title="Transaction Details" showBack />

      <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto animate-slide-up">
        
        {/* Status Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6 relative overflow-hidden text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border ${getStatusColor(txn.status)}`}>
             {getStatusIcon(txn.status)}
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            ₹{Number(txn.amountInr).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
             <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusColor(txn.status)}`}>
               {txn.status}
             </span>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
             <CalendarClock size={14} />
             <span>{new Date(txn.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
        </div>

        {/* Details List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
           <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction Info</h3>
              <div className="flex items-center gap-2 px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                 <span className="text-slate-400">{getTypeIcon(txn.type)}</span>
                 <span className="text-xs font-bold text-slate-700">{getTypeLabel(txn.type)}</span>
              </div>
           </div>
           
           <div className="divide-y divide-slate-50">
             {/* Weight */}
             <div className="flex justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <span className="text-sm text-slate-500 font-medium">Gold Weight</span>
                <span className="text-sm font-bold text-slate-900">{Number(txn.grams).toFixed(4)} gm</span>
             </div>

             {/* Rate */}
             <div className="flex justify-between p-4 hover:bg-slate-50/50 transition-colors">
                <span className="text-sm text-slate-500 font-medium">Rate / gm</span>
                <span className="text-sm font-semibold text-slate-900">₹{Number(txn.ratePerGram).toLocaleString()}</span>
             </div>

             {/* Base Amount */}
             {isBuyOrSip && (
               <div className="flex justify-between p-4 hover:bg-slate-50/50 transition-colors">
                  <span className="text-sm text-slate-500 font-medium">Gold Value</span>
                  <span className="text-sm font-semibold text-slate-900">₹{baseAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
               </div>
             )}

             {/* GST */}
             {isBuyOrSip && (
               <div className="flex justify-between p-4 hover:bg-slate-50/50 transition-colors">
                  <span className="text-sm text-slate-500 font-medium">GST (3%)</span>
                  <span className="text-sm font-semibold text-slate-900">₹{gst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
               </div>
             )}

             {/* Transaction ID */}
             <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex justify-between mb-1">
                   <span className="text-sm text-slate-500 font-medium">Transaction ID</span>
                   <button 
                     onClick={() => {
                        navigator.clipboard.writeText(txn.id);
                        alert("Copied!");
                     }}
                     className="text-gold-600 hover:text-gold-700"
                   >
                      <Copy size={14} />
                   </button>
                </div>
                <p className="text-xs text-slate-400 font-mono break-all">{txn.id}</p>
             </div>
           </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
           <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
              <Share2 size={16} /> Share
           </button>
           <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
              <Download size={16} /> Invoice
           </button>
        </div>

        <div className="mt-6 text-center">
           <button className="text-xs font-semibold text-slate-400 flex items-center justify-center gap-1 mx-auto hover:text-gold-600 transition-colors">
             <HelpCircle size={14} /> Need help with this transaction?
           </button>
        </div>

      </div>
    </div>
  );
};