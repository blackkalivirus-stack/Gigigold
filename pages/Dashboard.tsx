import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Bell, TrendingUp, TrendingDown, ChevronRight, ShieldCheck, Gift, Wallet, Repeat, CreditCard, Lock, User as UserIcon } from '../components/ui/Icons';
import { Button } from '../components/ui/Button';
import { MOCK_RATES, CHART_DATA } from '../constants';
import { TransactionType } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isProfit = MOCK_RATES.trend === 'UP';
  const [profileImg, setProfileImg] = useState('https://picsum.photos/200');
  const [isMounted, setIsMounted] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const savedImg = localStorage.getItem('profileImage');
    if (savedImg) {
      setProfileImg(savedImg);
    }
  }, []);

  // Fetch recent transactions if user is logged in
  useEffect(() => {
    const fetchRecentTxns = async () => {
      if (user?.phone) {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_phone', user.phone)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (data) {
          setRecentTransactions(data.map(txn => ({
            id: txn.id,
            type: txn.type,
            amountInr: txn.amount_inr,
            grams: txn.grams,
            ratePerGram: txn.rate_per_gram,
            date: txn.created_at,
            status: txn.status
          })));
        }
      } else {
        setRecentTransactions([]);
      }
    };
    fetchRecentTxns();
  }, [user]);

  const handleActionClick = (path: string) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pt-safe bg-slate-100/50 min-h-full">
      {/* Header */}
      <header className="px-6 pt-6 pb-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer group" onClick={() => handleActionClick('/profile')}>
            {user ? (
              <div className="w-10 h-10 rounded-full p-0.5 bg-white shadow-sm border border-slate-200 overflow-hidden">
                 <img 
                  src={profileImg} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300">
                <UserIcon size={20} className="text-slate-500" />
              </div>
            )}
            
            {user && user.kycStatus !== 'VERIFIED' && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-50 ring-1 ring-red-500/20"></span>
            )}
          </div>
          <div onClick={() => handleActionClick('/profile')} className="cursor-pointer">
            <p className="text-xs text-slate-500 font-medium">Welcome,</p>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {user ? user.firstName : 'Guest User'}
            </h2>
          </div>
        </div>
        <button 
          onClick={() => handleActionClick('/notifications')}
          className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-gold-600 hover:border-gold-200 transition-colors active:scale-95 shadow-sm"
        >
          <Bell size={20} />
        </button>
      </header>

      {/* Main Portfolio Card */}
      <div className="px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-800 p-6 shadow-2xl shadow-slate-900/20 group">
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-gold-500/30 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

          {user ? (
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/5">Gold Balance</p>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg backdrop-blur-md border border-white/5 ${isProfit ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {isProfit ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span className="text-xs font-bold">0.8%</span>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">{user.goldBalanceGrams?.toFixed(4) || '0.0000'} <span className="text-xl text-gold-400 font-semibold">gm</span></h1>
              </div>

              <div className="flex items-center justify-between mb-8 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/5">
                <div>
                  <p className="text-xs text-slate-300 mb-0.5">Current Value</p>
                  <p className="text-lg font-bold text-white">₹ {((user.goldBalanceGrams || 0) * MOCK_RATES.sell).toLocaleString('en-IN')}</p>
                </div>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="text-right">
                   <p className="text-xs text-slate-300 mb-0.5">24h Gain</p>
                   <p className={`text-lg font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                      {isProfit ? '+' : '-'}₹540
                   </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => navigate('/buy')} size="md" className="shadow-gold-500/20 text-white border-none">Buy Gold</Button>
                <Button onClick={() => navigate('/sell')} variant="secondary" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">Sell Gold</Button>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center py-6 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                <Lock className="text-gold-400" size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Login to View Balance</h3>
              <p className="text-slate-400 text-xs mb-6 max-w-[200px]">Secure your future with digital gold. Sign up to start investing.</p>
              <Button onClick={() => navigate('/login')} fullWidth className="max-w-[200px] bg-gold-500 hover:bg-gold-400 text-white border-none">
                 Login / Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6">
        <div className="grid grid-cols-4 gap-4">
           <button onClick={() => handleActionClick('/gift')} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-slate-100 group-active:scale-90 transition-all duration-200 shadow-sm shadow-slate-200 group-hover:border-gold-500/50 group-hover:shadow-gold-500/20">
                <Gift className="text-gold-500 w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-gold-600 transition-colors">Gift</span>
           </button>
           <button onClick={() => handleActionClick('/redeem')} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-slate-100 group-active:scale-90 transition-all duration-200 shadow-sm shadow-slate-200 group-hover:border-blue-500/50 group-hover:shadow-blue-500/20">
                <Wallet className="text-blue-500 w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-blue-600 transition-colors">Redeem</span>
           </button>
           <button onClick={() => handleActionClick('/kyc-flow')} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-slate-100 group-active:scale-90 transition-all duration-200 shadow-sm shadow-slate-200 group-hover:border-green-500/50 group-hover:shadow-green-500/20">
                 <ShieldCheck className="text-green-500 w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-green-600 transition-colors">KYC</span>
           </button>
           <button onClick={() => handleActionClick('/sip')} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-slate-100 group-active:scale-90 transition-all duration-200 shadow-sm shadow-slate-200 group-hover:border-purple-500/50 group-hover:shadow-purple-500/20">
                 <Repeat className="text-purple-500 w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-purple-600 transition-colors">SIP</span>
           </button>
        </div>
      </div>

      {/* Live Rates Ticker */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-sm font-semibold text-slate-900 tracking-wide">Live Market Rates</h3>
           <div className="px-2 py-1 rounded-md bg-green-50 border border-green-200 flex items-center gap-1.5">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </span>
             <span className="text-[10px] font-medium text-green-600 uppercase tracking-wide">Live</span>
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute right-0 top-0 p-3 opacity-[0.05]">
                <TrendingUp size={40} className="text-slate-900"/>
             </div>
             <p className="text-xs text-slate-500 mb-1 font-medium">Buy Price</p>
             <p className="text-lg font-bold text-slate-900 tracking-tight">₹{MOCK_RATES.buy.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400 ml-1">/gm</span></p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute right-0 top-0 p-3 opacity-[0.05]">
                <TrendingDown size={40} className="text-slate-900"/>
             </div>
             <p className="text-xs text-slate-500 mb-1 font-medium">Sell Price</p>
             <p className="text-lg font-bold text-slate-900 tracking-tight">₹{MOCK_RATES.sell.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400 ml-1">/gm</span></p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-48 w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative isolate">
           <div className="absolute top-4 left-4 z-20">
              <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md border border-slate-200">Gold Trend (24h)</span>
           </div>
           <div className="absolute inset-0 w-full h-full pt-8">
             {isMounted ? (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={CHART_DATA}>
                   <defs>
                     <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#0f172a' }}
                     itemStyle={{ color: '#d97706' }}
                     cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                   />
                   <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorGold)" />
                 </AreaChart>
               </ResponsiveContainer>
             ) : (
               <div className="w-full h-full flex items-center justify-center">
                 <div className="w-full h-full bg-slate-100 animate-pulse"></div>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 pt-4 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-900 tracking-wide">Recent Transactions</h3>
          <button onClick={() => handleActionClick('/transactions')} className="text-xs text-gold-600 font-bold flex items-center gap-1 hover:text-gold-700 transition-colors">
            View All <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {user ? (
            recentTransactions.length > 0 ? (
              recentTransactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer active:scale-[0.99]" onClick={() => navigate('/transactions')}>
                  <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-slate-100 ${
                        txn.type === TransactionType.BUY ? 'bg-green-50 text-green-600' : 
                        txn.type === TransactionType.SELL ? 'bg-red-50 text-red-600' : 
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {txn.type === TransactionType.BUY ? <TrendingUp size={18} /> : 
                        txn.type === TransactionType.SELL ? <TrendingDown size={18} /> : 
                        <CreditCard size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 capitalize">
                          {txn.type === TransactionType.BUY ? 'Bought Gold' : txn.type === TransactionType.SELL ? 'Sold Gold' : txn.type === 'GIFT' ? 'Gifted Gold' : 'Redeemed'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">{new Date(txn.date).toLocaleDateString()}</p>
                      </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {txn.type === TransactionType.BUY ? '+' : '-'}{Number(txn.grams).toFixed(4)} gm
                    </p>
                    <p className="text-xs text-slate-500 font-mono">₹{Number(txn.amountInr).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 bg-white rounded-2xl border border-slate-100">
                 <p className="text-sm text-slate-400 mb-2">No transactions yet</p>
              </div>
            )
          ) : (
            <div className="text-center py-6 bg-white rounded-2xl border border-slate-100">
               <p className="text-sm text-slate-400 mb-2">Login to see your history</p>
               <Button onClick={() => navigate('/login')} variant="outline" size="sm">Login Now</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};