import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { User, Phone, Mail, Calendar, ArrowRight, ShieldCheck, CheckCircle, Info, AlertTriangle } from '../components/ui/Icons';
import { Header } from '../components/Header';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import { Logo } from '../components/Logo'; // Import Logo

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  
  // Pre-fill mobile if coming from Login
  const prefillMobile = location.state?.mobile || '';

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: prefillMobile,
    email: '',
    gender: '',
    dob: '',
    termsAccepted: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (signupError) setSignupError('');
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }));
    if (signupError) setSignupError('');
  };

  const handleSignup = async () => {
    setLoading(true);
    setSignupError('');
    
    try {
      // 1. Insert into Supabase Profiles
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            phone: formData.mobile,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            dob: formData.dob,
            gender: formData.gender,
            kyc_status: 'NOT_STARTED',
            gold_balance: 0,
            wallet_balance: 0
          }
        ]);

      if (error) {
        console.error("Supabase insert error details:", error);
        throw error;
      }

      // 2. Auto Login after signup
      const { success, error: loginError } = await login(formData.mobile);
      if (!success) {
        throw new Error(loginError || "Account created but auto-login failed");
      }
      
      navigate('/');
      
    } catch (error: any) {
      console.error("Signup error:", error);
      const msg = getErrorMessage(error);
      setSignupError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = 
    formData.firstName && 
    formData.lastName && 
    formData.mobile.length === 10 && 
    formData.email && 
    formData.gender && 
    formData.dob && 
    formData.termsAccepted;

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      <Header title="Create Account" showBack onBack={() => navigate('/login')} />

      <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
        <div className="mb-6 flex flex-col items-center text-center">
           <div className="flex flex-col items-center justify-center mb-4">
             <Logo className="h-16 w-auto mb-2" />
           </div>
           <h2 className="text-2xl font-bold text-slate-900 mb-1">Getting Started</h2>
           <p className="text-slate-500 text-sm">Create an account to start your PMJ gold savings journey.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-5 space-y-5">
           
           {/* Name Section */}
           <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                 <h3 className="text-sm font-bold text-slate-900">Personal Details</h3>
                 <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 font-bold uppercase">As per Aadhaar</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-slate-500 font-medium mb-1.5 block">First Name</label>
                    <input 
                       name="firstName"
                       value={formData.firstName}
                       onChange={handleChange}
                       placeholder="Arjun"
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-gold-500 transition-all"
                    />
                 </div>
                 <div>
                    <label className="text-xs text-slate-500 font-medium mb-1.5 block">Last Name</label>
                    <input 
                       name="lastName"
                       value={formData.lastName}
                       onChange={handleChange}
                       placeholder="Verma"
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-gold-500 transition-all"
                    />
                 </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-medium mb-1.5 block">Date of Birth</label>
                <div className="relative">
                   <Calendar className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                   <input 
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-gold-500 transition-all"
                   />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-medium mb-1.5 block">Gender</label>
                <div className="flex gap-3">
                   {['Male', 'Female', 'Other'].map(g => (
                     <label key={g} className={`flex-1 border rounded-xl py-3 text-center text-sm font-medium cursor-pointer transition-all ${formData.gender === g ? 'bg-gold-50 border-gold-500 text-gold-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                        <input 
                           type="radio" 
                           name="gender" 
                           value={g} 
                           checked={formData.gender === g}
                           onChange={handleChange}
                           className="hidden"
                        />
                        {g}
                     </label>
                   ))}
                </div>
              </div>
           </div>

           <div className="w-full h-px bg-slate-100"></div>

           {/* Contact Section */}
           <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Contact Details</h3>
              
              <div>
                 <label className="text-xs text-slate-500 font-medium mb-1.5 block">Mobile Number (Linked to Aadhaar)</label>
                 <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                    <input 
                       type="tel"
                       name="mobile"
                       value={formData.mobile}
                       onChange={(e) => handleChange({ target: { name: 'mobile', value: e.target.value.replace(/\D/g, '') } } as any)}
                       placeholder="98765 43210"
                       maxLength={10}
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-gold-500 transition-all"
                    />
                 </div>
              </div>

              <div>
                 <label className="text-xs text-slate-500 font-medium mb-1.5 block">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                    <input 
                       type="email"
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       placeholder="you@example.com"
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-gold-500 transition-all"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Consent */}
        <div className="mt-6">
           <label className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm cursor-pointer group hover:border-gold-200 transition-colors">
              <div className="relative flex items-center mt-0.5">
                 <input 
                    type="checkbox" 
                    checked={formData.termsAccepted}
                    onChange={handleCheckbox}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-gold-500 checked:border-gold-500 transition-all"
                 />
                 <CheckCircle size={14} className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <span className="text-xs text-slate-500 leading-relaxed">
                 I confirm that the above details are correct and match my Aadhaar. I agree to the <button onClick={(e) => { e.stopPropagation(); navigate('/terms'); }} className="text-gold-600 font-bold hover:underline">Privacy Policy</button> and <button onClick={(e) => { e.stopPropagation(); navigate('/terms'); }} className="text-gold-600 font-bold hover:underline">Terms & Conditions</button>.
              </span>
           </label>
        </div>

        {/* Error Banner */}
        {signupError && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
             <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
             <div>
                <h4 className="text-sm font-bold text-red-700">Registration Failed</h4>
                <p className="text-xs text-red-600 mt-1">{signupError}</p>
             </div>
          </div>
        )}

      </div>

      <div className="p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 sticky bottom-0 z-10">
         <Button 
           fullWidth 
           size="lg" 
           onClick={handleSignup} 
           isLoading={loading}
           disabled={!isFormValid}
         >
           Create Account
         </Button>
      </div>
    </div>
  );
};