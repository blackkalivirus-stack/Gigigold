import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { UploadCloud, CheckCircle, ShieldCheck, Loader2 } from '../components/ui/Icons';
import { KycStatus } from '../types';

export const KYC: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<KycStatus>(KycStatus.NOT_STARTED);
  const [pan, setPan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStatus(KycStatus.PENDING);
    }, 2000);
  };

  const StatusBadge = () => {
    if (status === KycStatus.VERIFIED) return <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">Verified</span>;
    if (status === KycStatus.PENDING) return <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30">Under Review</span>;
    return <span className="bg-slate-700 text-slate-400 px-3 py-1 rounded-full text-xs font-bold">Not Started</span>;
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      <Header title="KYC Verification" showBack />

      <div className="flex-1 px-6 pt-6">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-8 text-center">
           <div className="w-16 h-16 bg-navy-950 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
             <ShieldCheck size={32} className={status === KycStatus.VERIFIED ? "text-green-500" : "text-slate-400"} />
           </div>
           <h2 className="text-white font-bold text-lg mb-2">Identity Verification</h2>
           <div className="flex justify-center mb-4"><StatusBadge /></div>
           <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
             Complete your KYC to unlock unlimited transactions and withdrawals as per RBI guidelines.
           </p>
        </div>

        {status === KycStatus.NOT_STARTED && (
          <div className="space-y-6">
            <div>
               <label className="block text-xs font-medium text-slate-400 mb-2">PAN Number</label>
               <input 
                 type="text" 
                 className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 uppercase"
                 placeholder="ABCDE1234F"
                 value={pan}
                 onChange={(e) => setPan(e.target.value)}
                 maxLength={10}
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="border border-dashed border-slate-600 rounded-xl h-32 flex flex-col items-center justify-center gap-2 hover:bg-slate-900 transition-colors">
                  <UploadCloud className="text-slate-400" />
                  <span className="text-xs text-slate-500">Front Side</span>
               </button>
               <button className="border border-dashed border-slate-600 rounded-xl h-32 flex flex-col items-center justify-center gap-2 hover:bg-slate-900 transition-colors">
                  <UploadCloud className="text-slate-400" />
                  <span className="text-xs text-slate-500">Back Side</span>
               </button>
            </div>
          </div>
        )}

        {status === KycStatus.PENDING && (
           <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col items-center text-center">
             <Loader2 className="animate-spin text-gold-500 mb-4" size={32} />
             <h3 className="text-white font-medium mb-2">Verification in Progress</h3>
             <p className="text-sm text-slate-400">We are verifying your documents. This usually takes 5-10 minutes.</p>
           </div>
        )}
      </div>

      {status === KycStatus.NOT_STARTED && (
        <div className="p-6 bg-navy-950 border-t border-slate-800">
          <Button fullWidth onClick={handleSubmit} isLoading={loading} disabled={pan.length !== 10}>
            Submit Documents
          </Button>
        </div>
      )}
    </div>
  );
};