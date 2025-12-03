import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { MOCK_RATES } from '../constants';
import { Lock, CheckCircle, AlertTriangle } from '../components/ui/Icons';

export const BuyGold: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'INR' | 'GRAMS'>('INR');
  const [amount, setAmount] = useState<string>('');
  const [calculated, setCalculated] = useState<string>('0.0000');
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Compliance States
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentRisk, setConsentRisk] = useState(false);

  const RATE = MOCK_RATES.buy;

  useEffect(() => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setCalculated('0.0000');
      return;
    }

    if (mode === 'INR') {
      const grams = val / RATE;
      setCalculated(grams.toFixed(4));
    } else {
      const inr = val * RATE;
      setCalculated(inr.toFixed(2));
    }
  }, [amount, mode, RATE]);

  const getSummary = () => {
    let baseAmount = 0;
    let gst = 0;
    let total = 0;
    let finalGrams = 0;

    if (mode === 'INR') {
       baseAmount = parseFloat(amount) || 0;
       gst = baseAmount * 0.03;
       total = baseAmount + gst;
       finalGrams = parseFloat(calculated);
    } else {
       finalGrams = parseFloat(amount) || 0;
       baseAmount = parseFloat(calculated);
       gst = baseAmount * 0.03;
       total = baseAmount + gst;
    }
    return { baseAmount, gst, total, finalGrams };
  };

  const { baseAmount, gst, total, finalGrams } = getSummary();

  const handleBuy = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-full bg-navy-950 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/30 ring-4 ring-green-500/10">
          <CheckCircle className="text-white w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Purchase Successful!</h2>
        <p className="text-slate-400 text-center mb-10 max-w-xs mx-auto leading-relaxed">
          You have successfully purchased <br/>
          <span className="text-gold-500 font-bold text-lg">{finalGrams.toFixed(4)} gm</span> of 24K Gold.
        </p>
        
        <div className="w-full bg-slate-900/50 rounded-2xl p-5 mb-8 border border-white/5 backdrop-blur-md">
           <div className="flex justify-between mb-3 border-b border-white/5 pb-3">
             <span className="text-slate-500 text-sm font-medium">Transaction ID</span>
             <span className="text-slate-300 text-sm font-mono tracking-wide">TXN_882910</span>
           </div>
           <div className="flex justify-between">
             <span className="text-slate-500 text-sm font-medium">Total Paid</span>
             <span className="text-white text-base font-bold">₹{total.toFixed(2)}</span>
           </div>
        </div>

        <Button fullWidth size="lg" onClick={() => navigate('/')}>Return to Dashboard</Button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-full bg-navy-950 flex flex-col animate-slide-up">
        <Header title="Confirm Purchase" showBack />
        <div className="flex-1 px-6 pt-6 pb-8 overflow-y-auto">
           <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 mb-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                 <div>
                   <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Gold Quantity</p>
                   <p className="text-3xl font-bold text-gold-500">{finalGrams.toFixed(4)} <span className="text-lg text-gold-500/70">gm</span></p>
                 </div>
                 <div className="text-right">
                   <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Rate / gm</p>
                   <p className="text-base font-semibold text-white">₹{RATE.toLocaleString()}</p>
                 </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Gold Value</span>
                    <span className="text-white font-medium">₹{baseAmount.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-400">GST (3%)</span>
                    <span className="text-white font-medium">₹{gst.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center pt-3 mt-1 border-t border-white/5">
                    <span className="text-white font-semibold">Total Payable</span>
                    <span className="text-xl font-bold text-white">₹{total.toFixed(2)}</span>
                 </div>
              </div>
           </div>

           {/* Payment Methods */}
           <h3 className="text-sm font-semibold text-slate-300 mb-3 ml-1">Payment Method</h3>
           <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 mb-8 flex items-center gap-4 cursor-pointer hover:bg-slate-800/60 transition-colors">
             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                <span className="text-[10px] font-black text-purple-700 tracking-tighter">UPI</span>
             </div>
             <div>
               <p className="text-sm font-bold text-white">Google Pay / PhonePe</p>
               <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-[10px] text-green-400 font-medium uppercase tracking-wide">Recommended</p>
               </div>
             </div>
             <div className="ml-auto w-5 h-5 rounded-full border-2 border-gold-500 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-gold-500"></div>
             </div>
           </div>

           {/* Disclosures */}
           <div className="space-y-4 mb-4">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:bg-slate-900/30 transition-colors cursor-pointer group">
                 <div className="relative flex items-center mt-0.5">
                   <input 
                     type="checkbox" 
                     checked={consentTerms}
                     onChange={(e) => setConsentTerms(e.target.checked)}
                     className="peer appearance-none w-5 h-5 border-2 border-slate-600 rounded-md checked:bg-gold-500 checked:border-gold-500 transition-all"
                   />
                   <CheckCircle size={14} className="absolute inset-0 m-auto text-navy-950 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                 </div>
                 <span className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                   I agree to the <span className="text-gold-500 font-medium hover:underline">Terms & Conditions</span> and verify that I am an Indian resident.
                 </span>
              </label>
              
              <label className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:bg-slate-900/30 transition-colors cursor-pointer group">
                 <div className="relative flex items-center mt-0.5">
                   <input 
                     type="checkbox" 
                     checked={consentRisk}
                     onChange={(e) => setConsentRisk(e.target.checked)}
                     className="peer appearance-none w-5 h-5 border-2 border-slate-600 rounded-md checked:bg-gold-500 checked:border-gold-500 transition-all"
                   />
                   <CheckCircle size={14} className="absolute inset-0 m-auto text-navy-950 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                 </div>
                 <span className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                   I understand digital gold prices are market-linked and can fluctuate.
                 </span>
              </label>
           </div>
        </div>

        <div className="p-6 bg-navy-950/90 backdrop-blur-md border-t border-white/5 sticky bottom-0">
           <Button 
             fullWidth 
             size="lg"
             onClick={handleBuy} 
             isLoading={loading}
             disabled={!consentTerms || !consentRisk}
             className="shadow-xl shadow-gold-500/10"
           >
             Pay ₹{total.toFixed(2)}
           </Button>
        </div>
      </div>
    )
  }

  // STEP 1
  return (
    <div className="min-h-full bg-navy-950 flex flex-col">
      <Header title="Buy 24K Gold" showBack />
      
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        {/* Live Rate Banner */}
        <div className="bg-slate-900/80 rounded-xl p-3 flex justify-between items-center mb-8 border border-white/5 shadow-sm">
          <div className="flex items-center gap-2">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
             </span>
             <span className="text-xs text-slate-400 font-mono">Expires in 04:59</span>
          </div>
          <p className="text-sm font-bold text-gold-500">1 gm = ₹{RATE.toLocaleString()}</p>
        </div>

        {/* Input Card */}
        <div className="flex flex-col items-center justify-center mb-10">
           <div className="bg-slate-900 rounded-full p-1.5 flex mb-8 border border-white/5 shadow-inner">
              <button 
                onClick={() => { setMode('INR'); setAmount(''); }}
                className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${mode === 'INR' ? 'bg-gold-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                In Rupees (₹)
              </button>
              <button 
                onClick={() => { setMode('GRAMS'); setAmount(''); }}
                className={`px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${mode === 'GRAMS' ? 'bg-gold-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                In Grams (g)
              </button>
           </div>

           <div className="w-full relative group">
             <label className="absolute left-1/2 -translate-x-1/2 -top-4 text-xs font-semibold text-slate-500 bg-navy-950 px-3 uppercase tracking-wider group-focus-within:text-gold-500 transition-colors">Enter Amount</label>
             <input
               type="number"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               placeholder="0"
               className="w-full bg-transparent text-center text-5xl sm:text-6xl font-bold text-white focus:outline-none placeholder-slate-800 py-6 caret-gold-500 transition-all"
               autoFocus
             />
             <div className="text-center text-sm font-bold text-slate-500">{mode === 'INR' ? 'INR' : 'Grams'}</div>
           </div>
           
           <div className="mt-8 flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-full border border-white/5 shadow-sm">
             <Lock size={12} className="text-slate-500" />
             <p className="text-xs font-medium text-slate-400">
               {mode === 'INR' ? `You get approx ${calculated} gm` : `You pay approx ₹${calculated}`}
             </p>
           </div>
        </div>

        {/* Quick Amounts */}
        {mode === 'INR' && (
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[100, 500, 1000, 5000].map(amt => (
              <button 
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className="py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:border-gold-500 hover:text-gold-500 hover:bg-slate-800 transition-all active:scale-95"
              >
                ₹{amt}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 bg-navy-950/90 backdrop-blur-md border-t border-white/5 sticky bottom-0">
         <Button 
           fullWidth 
           size="lg"
           onClick={() => setStep(2)} 
           disabled={!amount || parseFloat(amount) <= 0}
           className="shadow-lg shadow-gold-500/10"
         >
           Proceed to Pay
         </Button>
      </div>
    </div>
  );
};