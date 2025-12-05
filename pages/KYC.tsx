
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { CheckCircle, ShieldCheck, Loader2, CloudLightning, ChevronRight, AlertTriangle, Lock, User as UserIcon } from '../components/ui/Icons';
import { KycStatus } from '../types';
import { digilockerService, DigiLockerDoc } from '../utils/digilocker';
import { sandboxApi } from '../utils/sandboxApi';
import { useAuth } from '../context/AuthContext';

export const KYC: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<KycStatus>(KycStatus.NOT_STARTED);
  
  // DigiLocker States
  const [isDigilockerLoading, setIsDigilockerLoading] = useState(false);
  const [digilockerError, setDigilockerError] = useState('');

  // Sandbox Flow States
  // Step 1: PAN
  const [pan, setPan] = useState('');
  const [panLoading, setPanLoading] = useState(false);
  const [panVerifiedData, setPanVerifiedData] = useState<{name: string} | null>(null);
  const [panError, setPanError] = useState('');

  // Step 2: Aadhaar
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarLoading, setAadhaarLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpRefId, setOtpRefId] = useState('');
  const [aadhaarError, setAadhaarError] = useState('');

  // ----------------------------------------------------------------------
  // DigiLocker Flow (Quick)
  // ----------------------------------------------------------------------
  const handleDigilockerConnect = async () => {
    setIsDigilockerLoading(true);
    setDigilockerError('');

    try {
      const auth = await digilockerService.connect();
      if (!auth.success || !auth.token) throw new Error("Authentication failed");

      const docs = await digilockerService.fetchDocuments(auth.token);
      if (docs.success && docs.data) {
        setStatus(KycStatus.VERIFIED);
      } else {
        throw new Error("Could not fetch documents");
      }
    } catch (err) {
      setDigilockerError("Connection failed. Please try again.");
    } finally {
      setIsDigilockerLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // Sandbox API Flow (Step-by-Step)
  // ----------------------------------------------------------------------
  
  // Step 1: Verify PAN
  const verifyPan = async () => {
    if (!pan) return;
    setPanLoading(true);
    setPanError('');
    try {
      const res = await sandboxApi.verifyPan(pan);
      if (res.success && res.data) {
        setPanVerifiedData({ name: res.data.fullName });
      } else {
        setPanError(res.message || 'Invalid PAN');
      }
    } catch (e) {
      setPanError('Verification failed');
    } finally {
      setPanLoading(false);
    }
  };

  // Step 2a: Send Aadhaar OTP
  const sendAadhaarOtp = async () => {
    if (!aadhaar) return;
    setAadhaarLoading(true);
    setAadhaarError('');
    try {
      const res = await sandboxApi.sendAadhaarOtp(aadhaar);
      if (res.success && res.data) {
        setOtpSent(true);
        setOtpRefId(res.data.refId);
      } else {
        setAadhaarError(res.message || 'Failed to send OTP');
      }
    } catch (e) {
      setAadhaarError('Network error');
    } finally {
      setAadhaarLoading(false);
    }
  };

  // Step 2b: Verify Aadhaar OTP
  const verifyAadhaarOtp = async () => {
    if (!otp) return;
    setAadhaarLoading(true);
    setAadhaarError('');
    try {
      const res = await sandboxApi.verifyAadhaarOtp(otpRefId, otp);
      if (res.success && res.data) {
        // Complete KYC
        setStatus(KycStatus.VERIFIED);
      } else {
        setAadhaarError(res.message || 'Invalid OTP');
      }
    } catch (e) {
      setAadhaarError('Verification failed');
    } finally {
      setAadhaarLoading(false);
    }
  };


  // ----------------------------------------------------------------------
  // Helper Components
  // ----------------------------------------------------------------------
  const StatusBadge = () => {
    if (status === KycStatus.VERIFIED) return <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1"><CheckCircle size={12}/> Verified</span>;
    if (status === KycStatus.PENDING) return <span className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold border border-yellow-100">In Progress</span>;
    return <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">Not Started</span>;
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      <Header title="KYC Verification" showBack />

      <div className="flex-1 px-6 pt-6 overflow-y-auto pb-24">
        {/* Header Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 mb-8 text-center shadow-sm">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
             <ShieldCheck size={32} className={status === KycStatus.VERIFIED ? "text-green-500" : "text-slate-400"} />
           </div>
           <h2 className="text-slate-900 font-bold text-lg mb-2">Identity Verification</h2>
           <div className="flex justify-center mb-4"><StatusBadge /></div>
           <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
             Complete verification to unlock full limits.
           </p>
        </div>

        {status === KycStatus.NOT_STARTED && (
          <div className="space-y-8">
            
            {/* Option A: DigiLocker */}
            <div>
              <div className="flex items-center justify-between mb-3">
                 <h3 className="text-sm font-bold text-slate-900">Instant Verification</h3>
                 <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 font-bold uppercase">Fastest</span>
              </div>
              <button 
                onClick={handleDigilockerConnect}
                disabled={isDigilockerLoading}
                className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between group transition-all shadow-sm"
              >
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                      {isDigilockerLoading ? <Loader2 className="animate-spin text-blue-500" /> : <CloudLightning className="text-blue-500" />}
                    </div>
                    <div className="text-left">
                       <p className="text-sm font-bold text-slate-900">Connect DigiLocker</p>
                       <p className="text-xs text-slate-500">Auto-fetch PAN & Aadhaar</p>
                    </div>
                 </div>
                 <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500" />
              </button>
              {digilockerError && <p className="text-xs text-red-500 mt-2 ml-1">{digilockerError}</p>}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-50 px-2 text-slate-400 font-medium">Or verify manually</span>
              </div>
            </div>

            {/* Option B: Manual Sandbox API Flow */}
            <div className="space-y-6">
               
               {/* Step 1: PAN */}
               <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${panVerifiedData ? 'bg-green-50 border-green-100' : 'bg-white border-slate-200'}`}>
                  <div className="p-4 border-b border-slate-100/50 flex justify-between items-center">
                    <h3 className={`text-sm font-bold ${panVerifiedData ? 'text-green-700' : 'text-slate-900'}`}>Step 1: PAN Details</h3>
                    {panVerifiedData && <CheckCircle size={16} className="text-green-500" />}
                  </div>
                  
                  <div className="p-4">
                     {!panVerifiedData ? (
                       <div className="space-y-3">
                         <div>
                           <label className="text-xs text-slate-500 font-medium mb-1.5 block">Permanent Account Number</label>
                           <input 
                              type="text"
                              value={pan}
                              onChange={(e) => setPan(e.target.value.toUpperCase())}
                              placeholder="ABCDE1234F"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-gold-500 uppercase tracking-widest font-medium placeholder:tracking-normal placeholder:normal-case"
                              maxLength={10}
                           />
                         </div>
                         {panError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={12}/> {panError}</p>}
                         <Button 
                           fullWidth 
                           size="md" 
                           onClick={verifyPan} 
                           isLoading={panLoading}
                           disabled={pan.length !== 10}
                         >
                           Verify PAN
                         </Button>
                       </div>
                     ) : (
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-green-100 shadow-sm">
                            <UserIcon size={18} className="text-green-600" />
                         </div>
                         <div>
                            <p className="text-xs text-green-600 font-bold uppercase">Verified Name</p>
                            <p className="text-sm font-bold text-green-900">{panVerifiedData.name}</p>
                         </div>
                       </div>
                     )}
                  </div>
               </div>

               {/* Step 2: Aadhaar */}
               <div className={`rounded-2xl border transition-all duration-300 ${!panVerifiedData ? 'opacity-50 grayscale pointer-events-none bg-slate-100 border-slate-200' : 'bg-white border-slate-200'}`}>
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900">Step 2: Aadhaar Verification</h3>
                    <Lock size={14} className="text-slate-400" />
                  </div>
                  
                  <div className="p-4 space-y-4">
                     {!otpSent ? (
                       <>
                         <div>
                           <label className="text-xs text-slate-500 font-medium mb-1.5 block">Aadhaar Number</label>
                           <input 
                              type="text"
                              value={aadhaar}
                              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g,''))}
                              placeholder="12-digit Aadhaar Number"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-gold-500 tracking-widest font-medium"
                              maxLength={12}
                           />
                         </div>
                         {aadhaarError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle size={12}/> {aadhaarError}</p>}
                         <Button 
                           fullWidth 
                           onClick={sendAadhaarOtp} 
                           isLoading={aadhaarLoading}
                           disabled={aadhaar.length !== 12}
                           variant="secondary"
                         >
                           Send OTP
                         </Button>
                       </>
                     ) : (
                       <div className="space-y-4">
                         <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-700 flex items-start gap-2">
                            <CheckCircle size={14} className="mt-0.5 shrink-0" />
                            <span>OTP sent to mobile linked with Aadhaar ending in <b>{aadhaar.slice(-4)}</b></span>
                         </div>
                         <div>
                           <label className="text-xs text-slate-500 font-medium mb-1.5 block">Enter OTP</label>
                           <input 
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g,''))}
                              placeholder="123456"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-center text-lg tracking-[0.5em] font-bold focus:outline-none focus:border-gold-500"
                              maxLength={6}
                           />
                           <p className="text-[10px] text-slate-400 text-center mt-2">Use 123456 for testing</p>
                         </div>
                         {aadhaarError && <p className="text-xs text-red-500 text-center">{aadhaarError}</p>}
                         <Button 
                           fullWidth 
                           onClick={verifyAadhaarOtp} 
                           isLoading={aadhaarLoading}
                           disabled={otp.length !== 6}
                         >
                           Verify & Complete KYC
                         </Button>
                       </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        )}

        {status === KycStatus.VERIFIED && (
           <div className="space-y-6 animate-fade-in">
             <div className="bg-green-50 p-8 rounded-2xl border border-green-100 shadow-sm flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-green-100 shadow-sm mb-4">
                 <CheckCircle className="text-green-500" size={32} />
               </div>
               <h3 className="text-slate-900 font-bold text-xl mb-2">KYC Verified Successfully</h3>
               <p className="text-sm text-slate-600 max-w-xs">
                 Your identity has been verified against regulatory databases. You can now invest without limits.
               </p>
             </div>
             
             <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Verified Details</h4>
               <div className="space-y-4">
                 <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                       <UserIcon size={18} />
                    </div>
                    <div>
                       <p className="text-xs text-slate-500">Full Name</p>
                       <p className="text-sm font-bold text-slate-900">{panVerifiedData?.name || (user ? `${user.firstName} ${user.lastName}` : 'Guest User')}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                       <ShieldCheck size={18} />
                    </div>
                    <div>
                       <p className="text-xs text-slate-500">KYC Status</p>
                       <p className="text-sm font-bold text-green-600">Compliant</p>
                    </div>
                 </div>
               </div>
             </div>

             <Button fullWidth onClick={() => navigate('/')}>Go to Dashboard</Button>
           </div>
        )}
      </div>
    </div>
  );
};