import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Bell, TrendingUp, TrendingDown, ChevronRight, ShieldCheck, Gift, Wallet, CalendarClock, Lock, User as UserIcon } from '../components/ui/Icons';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/Logo'; // Import new Logo component
import { MOCK_RATES, HISTORICAL_DATA } from '../constants';
import { TransactionType } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isProfit = MOCK_RATES.trend === 'UP';
  const [profileImg, setProfileImg] = useState('https://picsum.photos/200');
  const [isMounted, setIsMounted] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    setIsMounted(true);
    const savedImg = localStorage.getItem('profileImage');
    if (savedImg) setProfileImg(savedImg);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

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
    if (navigator.vibrate) navigator.vibrate(10);
    if (!user) navigate('/login');
    else navigate(path);
  };

  const chartData = HISTORICAL_DATA[timeRange];

  return (
    <div className="space-y-8 animate-fade-in pt-safe min-h-full">
      {/* Header - Fixed Layout */}
      <header className="px-6 py-4 flex justify-between items-center sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md shadow-sm transition-all">
        {/* Left: Profile & Greeting (Flexible Width) */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative cursor-pointer group shrink-0" onClick={() => handleActionClick('/profile')}>
            {user ? (
              <div className="w-10 h-10 rounded-full p-0.5 bg-white shadow-sm border border-slate-200 overflow-hidden">
                 <img 
                   src={profileImg} 
                   alt="Profile" 
                   className="w-full h-full rounded-full object-cover"
                   onError={(e) => {
                     e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=f1f5f9&color=64748b';
                   }}
                 />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300">
                <UserIcon size={20} className="text-slate-500" />
              </div>
            )}
            {user && user.kycStatus !== 'VERIFIED' && (
              <span className="absolute 0 top-0 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div onClick={() => handleActionClick('/profile')} className="cursor-pointer hidden sm:block truncate">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider truncate">{greeting},</p>
            <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
              {user ? user.firstName : 'Guest'}
            </h2>
          </div>
        </div>

        {/* Center: Logo (Fixed Position) */}
        <div className="flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2">
          <div className="transform hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => navigate('/')}>
             <Logo className="h-10 w-auto" />
          </div>
        </div>

        {/* Right: Notifications */}
        <div className="flex justify-end flex-1">
           <button 
            onClick={() => navigate('/notifications')}
            className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-gold-600 transition-all active:scale-95 shadow-sm"
          >
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* Main Portfolio Card */}
      <div className="px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1c1917] border border-slate-800 p-7 shadow-2xl shadow-black/20 group">
          {/* Decorative Gold Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-500/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
             <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">Gold Balance</span>
                <div className={`flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                   {isProfit ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                   <span className="text-xs font-bold">0.8%</span>
                </div>
             </div>

             <div className="mb-8">
                <h1 className="text-5xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
                  {user?.goldBalanceGrams?.toFixed(4) || '0.0000'} 
                  <span className="text-2xl text-gold-500 font-bold">gm</span>
                </h1>
             </div>

             <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex-1 border-r border-white/10 pr-4">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Current Value</p>
                   <p className="text-lg font-bold text-white">₹ {((user?.goldBalanceGrams || 0) * MOCK_RATES.sell).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex-1 pl-2 text-right">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">24h Gain</p>
                   <p className={`text-lg font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                      {isProfit ? '+' : '-'}₹540
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => navigate('/buy')} className="bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-white border-none shadow-lg shadow-gold-500/20">
                   Buy Gold
                </Button>
                {/* Updated Sell Gold button to dark grey/black as per screenshot */}
                <Button onClick={() => navigate('/sell')} className="bg-[#333333] hover:bg-[#444] text-white border border-white/10 shadow-lg shadow-black/20">
                   Sell Gold
                </Button>
             </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6">
        <div className="grid grid-cols-4 gap-4">
           <button onClick={() => handleActionClick('/gift')} className="flex flex-col items-center gap-2 group cursor-pointer active:scale-95 transition-transform duration-200">
              <div className="w-[4.5rem] h-[4.5rem] rounded-3xl bg-white flex items-center justify-center border border-slate-100 shadow-soft group-hover:shadow-lg transition-all">
                <Gift className="text-gold-500 w-7 h-7" strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold text-slate-600">Gift</span>
           </button>
           <button onClick={() => handleActionClick('/redeem')} className="flex flex-col items-center gap-2 group cursor-pointer active:scale-95 transition-transform duration-200">
              <div className="w-[4.5rem] h-[4.5rem] rounded-3xl bg-white flex items-center justify-center border border-slate-100 shadow-soft group-hover:shadow-lg transition-all">
                <Wallet className="text-blue-500 w-7 h-7" strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold text-slate-600">Redeem</span>
           </button>
           <button onClick={() => handleActionClick('/kyc-flow')} className="flex flex-col items-center gap-2 group cursor-pointer active:scale-95 transition-transform duration-200">
              <div className="w-[4.5rem] h-[4.5rem] rounded-3xl bg-white flex items-center justify-center border border-slate-100 shadow-soft group-hover:shadow-lg transition-all">
                 <ShieldCheck className="text-green-500 w-7 h-7" strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold text-slate-600">KYC</span>
           </button>
           <button onClick={() => handleActionClick('/sip')} className="flex flex-col items-center gap-2 group cursor-pointer active:scale-95 transition-transform duration-200">
              <div className="w-[4.5rem] h-[4.5rem] rounded-3xl bg-white flex items-center justify-center border border-slate-100 shadow-soft group-hover:shadow-lg transition-all">
                 <CalendarClock className="text-indigo-500 w-7 h-7" strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-bold text-slate-600">SIP</span>
           </button>
        </div>
      </div>

      {/* Live Market Rates */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-sm font-bold text-slate-800 tracking-wide">Live Market Rates</h3>
           <div className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
             </span>
             <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">LIVE</span>
           </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-[1.25rem] p-5 border border-slate-100 shadow-soft">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Buy Price</p>
             <p className="text-xl font-extrabold text-slate-900 tracking-tight">₹{MOCK_RATES.buy.toLocaleString()}<span className="text-xs font-bold text-slate-400 ml-1">/gm</span></p>
             <div className="mt-2 h-1 w-full bg-green-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-3/4"></div>
             </div>
          </div>
          <div className="bg-white rounded-[1.25rem] p-5 border border-slate-100 shadow-soft">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Sell Price</p>
             <p className="text-xl font-extrabold text-slate-900 tracking-tight">₹{MOCK_RATES.sell.toLocaleString()}<span className="text-xs font-bold text-slate-400 ml-1">/gm</span></p>
             <div className="mt-2 h-1 w-full bg-red-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-1/2"></div>
             </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-soft p-5">
           <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={14} className="text-gold-500"/> Price Trend
              </span>
              <div className="flex bg-slate-50 p-1 rounded-lg">
                {(['1D', '1W', '1M', '1Y'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${timeRange === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
           </div>
           
           <div className="h-48 w-full">
             {isMounted && (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                   <defs>
                     <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                       <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Tooltip />
                   <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#f59e0b" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorGold)" 
                   />
                 </AreaChart>
               </ResponsiveContainer>
             )}
           </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-sm font-bold text-slate-800 tracking-wide">Recent Transactions</h3>
           <button onClick={() => navigate('/transactions')} className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1">
             View All <ChevronRight size={12} />
           </button>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((txn) => (
              <div 
                key={txn.id}
                onClick={() => navigate(`/transaction/${txn.id}`, { state: { transaction: txn } })}
                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm active:scale-98 transition-all cursor-pointer hover:border-gold-200 hover:shadow-md"
              >
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                      txn.type === 'BUY' ? 'bg-green-50 border-green-100 text-green-600' :
                      txn.type === 'SELL' ? 'bg-red-50 border-red-100 text-red-600' :
                      txn.type === 'GIFT' ? 'bg-pink-50 border-pink-100 text-pink-600' :
                      txn.type === 'SIP' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                      'bg-blue-50 border-blue-100 text-blue-600'
                    }`}>
                       {txn.type === 'BUY' ? <TrendingUp size={16} /> :
                        txn.type === 'SELL' ? <TrendingDown size={16} /> :
                        txn.type === 'GIFT' ? <Gift size={16} /> :
                        txn.type === 'SIP' ? <CalendarClock size={16} /> :
                        <Wallet size={16} />}
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-900 capitalize leading-tight">
                         {txn.type === 'BUY' ? 'Bought Gold' : 
                          txn.type === 'SELL' ? 'Sold Gold' : 
                          txn.type === 'SIP' ? 'Gold SIP' :
                          txn.type.toLowerCase()}
                       </p>
                       <p className="text-[10px] text-slate-400 font-medium mt-0.5">{new Date(txn.date).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className={`text-sm font-bold ${
                      txn.type === 'BUY' || txn.type === 'SIP' ? 'text-green-600' : 
                      txn.type === 'SELL' ? 'text-slate-900' : 'text-slate-600'
                    }`}>
                      {txn.type === 'BUY' || txn.type === 'SIP' ? '+' : '-'}{Number(txn.grams).toFixed(4)} gm
                    </p>
                    <p className="text-xs text-slate-400 font-medium">₹{Number(txn.amountInr).toLocaleString()}</p>
                 </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 bg-white rounded-2xl border border-slate-100 border-dashed">
               <p className="text-xs text-slate-400 mb-2">No recent transactions</p>
               <Button size="sm" variant="outline" onClick={() => navigate('/buy')}>Start Investing</Button>
            </div>
          )}
        </div>
      </div>

      {/* Padding for bottom nav */}
      <div className="pb-8"></div>
    </div>
  );
};