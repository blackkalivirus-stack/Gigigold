import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Bell, TrendingUp, TrendingDown, ChevronRight, ShieldCheck, Gift, Wallet, Repeat, CreditCard } from '../components/ui/Icons';
import { Button } from '../components/ui/Button';
import { MOCK_USER, MOCK_RATES, CHART_DATA, MOCK_HISTORY } from '../constants';
import { TransactionType } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const isProfit = MOCK_RATES.trend === 'UP';
  const [profileImg, setProfileImg] = useState('https://picsum.photos/200');

  useEffect(() => {
    const savedImg = localStorage.getItem('profileImage');
    if (savedImg) {
      setProfileImg(savedImg);
    }
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pt-safe">
      {/* Header */}
      <header className="px-6 pt-6 pb-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer" onClick={() => navigate('/profile')}>
            <img 
              src={profileImg} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border border-slate-700 shadow-sm object-cover"
            />
            {MOCK_USER.kycStatus !== 'VERIFIED' && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-navy-950 ring-1 ring-red-500/20"></span>
            )}
          </div>
          <div onClick={() => navigate('/profile')} className="cursor-pointer">
            <p className="text-xs text-slate-400 font-medium">Welcome back,</p>
            <h2 className="text-base font-bold text-white leading-tight">{MOCK_USER.firstName}</h2>
          </div>
        </div>
        <button className="p-2.5 rounded-full bg-slate-900/50 border border-white/5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors active:scale-95">
          <Bell size={20} />
        </button>
      </header>

      {/* Main Portfolio Card */}
      <div className="px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-800 to-navy-900 border border-white/10 p-6 shadow-2xl shadow-black/20 group">
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-gold-500/30 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider bg-slate-900/40 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/5">Gold Balance</p>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg backdrop-blur-md border border-white/5 ${isProfit ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {isProfit ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span className="text-xs font-bold">0.8%</span>
              </div>
            </div>
            
            <div className="flex items-baseline gap-2 mb-6">
              <h1 className="text-4xl font-extrabold text-white tracking-tight">{MOCK_USER.goldBalanceGrams.toFixed(4)} <span className="text-xl text-gold-500 font-semibold">gm</span></h1>
            </div>

            <div className="flex items-center justify-between mb-8 p-3 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-white/5">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Current Value</p>
                <p className="text-lg font-bold text-white">₹ {(MOCK_USER.goldBalanceGrams * MOCK_RATES.sell).toLocaleString('en-IN')}</p>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="text-right">
                 <p className="text-xs text-slate-400 mb-0.5">24h Gain</p>
                 <p className={`text-lg font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                    {isProfit ? '+' : '-'}₹540
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => navigate('/buy')} size="md" className="shadow-gold-500/20">Buy Gold</Button>
              <Button onClick={() => navigate('/sell')} variant="secondary" size="md" className="bg-slate-800/80 backdrop-blur-md">Sell Gold</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6">
        <div className="grid grid-cols-4 gap-4">
           <button onClick={() => navigate('/gift')} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-slate-900/80 flex items-center justify-center border border-white/5 group-active:scale-90 transition-all duration-200 shadow-lg shadow-black/20 group-hover:border-gold-500/30 group-hover:bg-slate-800">
                <Gift className="text-gold-400 w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-gold-400 transition-colors">Gift</span>
           </button>
           <button onClick={() => navigate('/redeem')} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-slate-900/80 flex items-center justify-center border border-white/5 group-active:scale-90 transition-all duration-200 shadow-lg shadow-black/20 group-hover:border-blue-500/30 group-hover:bg-slate-800">
                <Wallet className="text-blue-400 w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-blue-400 transition-colors">Redeem</span>
           </button>
           <button onClick={() => navigate('/kyc-flow')} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-slate-900/80 flex items-center justify-center border border-white/5 group-active:scale-90 transition-all duration-200 shadow-lg shadow-black/20 group-hover:border-green-500/30 group-hover:bg-slate-800">
                 <ShieldCheck className="text-green-400 w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-green-400 transition-colors">KYC</span>
           </button>
           <button className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-slate-900/80 flex items-center justify-center border border-white/5 group-active:scale-90 transition-all duration-200 shadow-lg shadow-black/20 group-hover:border-purple-500/30 group-hover:bg-slate-800">
                 <Repeat className="text-purple-400 w-6 h-6" />
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-purple-400 transition-colors">SIP</span>
           </button>
        </div>
      </div>

      {/* Live Rates Ticker */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-sm font-semibold text-slate-200 tracking-wide">Live Market Rates</h3>
           <div className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 flex items-center gap-1.5">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </span>
             <span className="text-[10px] font-medium text-green-400 uppercase tracking-wide">Live</span>
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-white/5 relative overflow-hidden">
             <div className="absolute right-0 top-0 p-3 opacity-10">
                <TrendingUp size={40} className="text-slate-400"/>
             </div>
             <p className="text-xs text-slate-500 mb-1 font-medium">Buy Price</p>
             <p className="text-lg font-bold text-white tracking-tight">₹{MOCK_RATES.buy.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500 ml-1">/gm</span></p>
          </div>
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-white/5 relative overflow-hidden">
             <div className="absolute right-0 top-0 p-3 opacity-10">
                <TrendingDown size={40} className="text-slate-400"/>
             </div>
             <p className="text-xs text-slate-500 mb-1 font-medium">Sell Price</p>
             <p className="text-lg font-bold text-white tracking-tight">₹{MOCK_RATES.sell.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500 ml-1">/gm</span></p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-48 w-full bg-slate-900/40 rounded-2xl border border-white/5 pt-4 overflow-hidden relative">
           <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] text-slate-500 font-medium bg-slate-800/80 px-2 py-1 rounded-md border border-white/5">Gold Trend (24h)</span>
           </div>
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={CHART_DATA}>
               <defs>
                 <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                   <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Tooltip 
                 contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                 itemStyle={{ color: '#f59e0b' }}
                 cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
               />
               <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorGold)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 pt-4 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-200 tracking-wide">Recent Transactions</h3>
          <button onClick={() => navigate('/transactions')} className="text-xs text-gold-500 font-bold flex items-center gap-1 hover:text-gold-400 transition-colors">
            View All <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {MOCK_HISTORY.slice(0, 3).map((txn) => (
             <div key={txn.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 hover:bg-slate-900/60 transition-colors cursor-pointer active:scale-[0.99]" onClick={() => navigate('/transactions')}>
               <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-black/20 border border-white/5 ${
                    txn.type === TransactionType.BUY ? 'bg-gradient-to-br from-green-500/20 to-green-900/20 text-green-500' : 
                    txn.type === TransactionType.SELL ? 'bg-gradient-to-br from-red-500/20 to-red-900/20 text-red-500' : 
                    'bg-gradient-to-br from-blue-500/20 to-blue-900/20 text-blue-500'
                  }`}>
                    {txn.type === TransactionType.BUY ? <TrendingUp size={18} /> : 
                     txn.type === TransactionType.SELL ? <TrendingDown size={18} /> : 
                     <CreditCard size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white capitalize">
                      {txn.type === TransactionType.BUY ? 'Bought Gold' : txn.type === TransactionType.SELL ? 'Sold Gold' : txn.type === 'GIFT' ? 'Gifted Gold' : 'Redeemed'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">{new Date(txn.date).toLocaleDateString()}</p>
                  </div>
               </div>
               <div className="text-right">
                 <p className="text-sm font-bold text-white">
                   {txn.type === TransactionType.BUY ? '+' : '-'}{txn.grams} gm
                 </p>
                 <p className="text-xs text-slate-500 font-mono">₹{txn.amountInr.toLocaleString('en-IN')}</p>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};