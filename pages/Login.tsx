import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Phone, ArrowRight, Loader2, CheckCircle, ShieldCheck, ScanFace, Fingerprint } from '../components/ui/Icons';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import { Logo } from '../components/Logo'; // Import Logo

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Biometric State
  const [biometricUser, setBiometricUser] = useState<string | null>(null);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  // Destination to redirect after login (e.g. back to Buy Page)
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Check for enabled biometric login
    const bioUser = localStorage.getItem('biometric_user');
    if (bioUser) {
      setBiometricUser(bioUser);
    }
  }, []);

  const handleSendOtp = () => {
    if (mobile.length !== 10) return;
    setLoading(true);
    setError('');
    
    // Simulate API call for OTP
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setError('');

    // Verification Logic (Simulated)
    if (otp === '123456') {
       await performLogin(mobile);
    } else {
      setError("Invalid OTP. Please enter 123456.");
      setLoading(false);
    }
  };

  const performLogin = async (phone: string) => {
    try {
      const { success, isNewUser, error: loginError } = await login(phone);
      
      if (success) {
        if (isNewUser) {
          // Redirect to Signup with mobile number
          navigate('/signup', { state: { mobile: phone } });
        } else {
          // Successful login
          navigate(from, { replace: true });
        }
      } else {
        // Ensure error is a string explicitly using helper
        const safeError = getErrorMessage(loginError || "Login failed. Please try again.");
        setError(safeError);
      }
    } catch (e: any) {
      const msg = getErrorMessage(e);
      setError(msg);
    } finally {
      setLoading(false);
      setIsBiometricScanning(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!biometricUser) return;
    setIsBiometricScanning(true);
    
    // Simulate FaceID/TouchID delay
    setTimeout(async () => {
      await performLogin(biometricUser);
    }, 1500);
  };

  const handleGuestLogin = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col p-6 animate-fade-in relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-gold-500/10 rounded-full blur-[60px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="mb-10 text-center">
           <div className="mx-auto mb-6 flex flex-col items-center justify-center">
             <Logo className="h-20 w-auto mb-2" />
           </div>
           <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
           <p className="text-slate-500">Securely login to your PMJ DigiGold account.</p>
        </div>

        {/* Biometric Option */}
        {biometricUser && !otpSent && (
          <div className="mb-6 animate-slide-up">
            <button 
              onClick={handleBiometricLogin}
              disabled={isBiometricScanning}
              className="w-full bg-white border border-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm hover:border-gold-300 hover:shadow-md transition-all group relative overflow-hidden"
            >
              {isBiometricScanning && (
                 <div className="absolute inset-0 bg-gold-50/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
                    <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                 </div>
              )}
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 group-hover:text-gold-600 group-hover:bg-gold-50 transition-colors">
                <ScanFace size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Login with Face ID</p>
                <p className="text-xs text-slate-500">For user ending in {biometricUser.slice(-4)}</p>
              </div>
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-50 px-2 text-slate-400 font-medium">Or login manually</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
           {!otpSent ? (
             <div className="animate-fade-in space-y-5">
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block ml-1">Mobile Number</label>
                 <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 pr-3">
                     <span className="text-sm font-bold text-slate-900">🇮🇳 +91</span>
                   </div>
                   <input 
                     type="tel" 
                     value={mobile}
                     onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-24 pr-4 text-lg font-bold text-slate-900 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-slate-300"
                     placeholder="98765 43210"
                     maxLength={10}
                     autoFocus={!biometricUser}
                   />
                 </div>
               </div>
               <Button 
                 fullWidth 
                 size="lg" 
                 onClick={handleSendOtp} 
                 isLoading={loading}
                 disabled={mobile.length !== 10}
               >
                 Get OTP <ArrowRight size={18} className="ml-2" />
               </Button>
             </div>
           ) : (
             <div className="animate-slide-up space-y-5">
               <div className="text-center mb-2">
                 <p className="text-sm text-slate-600">Enter verification code sent to</p>
                 <p className="text-base font-bold text-slate-900">+91 {mobile} <button onClick={() => setOtpSent(false)} className="text-gold-600 text-xs font-bold ml-2 hover:underline">Edit</button></p>
               </div>

               <div>
                 <input 
                   type="text" 
                   value={otp}
                   onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 text-center text-2xl tracking-[0.5em] font-bold text-slate-900 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all"
                   placeholder="------"
                   maxLength={6}
                   autoFocus
                 />
                 <p className="text-center text-xs text-slate-400 mt-3">Use 123456 for testing</p>
               </div>

               {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}

               <Button 
                 fullWidth 
                 size="lg" 
                 onClick={handleVerifyOtp} 
                 isLoading={loading}
                 disabled={otp.length !== 6}
               >
                 Verify & Login
               </Button>
               
               <p className="text-center text-xs font-bold text-slate-400 mt-4">
                 Resend OTP in <span className="text-gold-600">00:30</span>
               </p>
             </div>
           )}
        </div>
        
        {/* Continue as Guest */}
        <div className="mt-6 text-center">
           <button 
             onClick={handleGuestLogin}
             className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
           >
             Skip & Continue as Guest
           </button>
        </div>
      </div>

      <div className="py-6 text-center">
        <p className="text-sm text-slate-500">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="text-gold-600 font-bold hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};