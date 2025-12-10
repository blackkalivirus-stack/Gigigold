import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, ShieldCheck, ChevronRight, FileText, Lock, CheckCircle, 
  Edit2, Mail, MapPin, Phone, Banknote, Plus, Trash2, 
  Settings, HelpCircle, LogOut, Info, Eye, X, AlertTriangle, Fingerprint,
  Bell, Crown
} from '../components/ui/Icons';
import { Button } from '../components/ui/Button';
import { Header } from '../components/Header';
import { sandboxApi } from '../utils/sandboxApi';
import { useAuth } from '../context/AuthContext';

type ViewState = 'MAIN' | 'PERSONAL' | 'BANKS' | 'SETTINGS' | 'DOCS';

interface DocViewerState {
  title: string;
  url: string;
}

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [currentView, setCurrentView] = useState<ViewState>('MAIN');
  const [loading, setLoading] = useState(false);
  
  // Document Viewer State
  const [viewingDoc, setViewingDoc] = useState<DocViewerState | null>(null);

  // Profile Image State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImg, setProfileImg] = useState('https://picsum.photos/200');

  // Mock State for editable fields
  const [email, setEmail] = useState('user@example.com');
  const [address, setAddress] = useState('Flat 402, Krishna Heights, Sector 12');
  
  // Bank State
  const [banks, setBanks] = useState<any[]>([]);
  const [showAddBank, setShowAddBank] = useState(false);
  
  // Add Bank Form State
  const [newAccNo, setNewAccNo] = useState('');
  const [newIfsc, setNewIfsc] = useState('');
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);
  const [verifiedBankName, setVerifiedBankName] = useState<string | null>(null);
  const [bankError, setBankError] = useState('');

  // Settings State
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    const savedImg = localStorage.getItem('profileImage');
    if (savedImg) {
      setProfileImg(savedImg);
    }
    if (user?.email) setEmail(user.email);
    
    // Check if biometric is enabled for current user
    const bioUser = localStorage.getItem('biometric_user');
    if (bioUser && user && bioUser === user.phone) {
      setBiometricEnabled(true);
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setProfileImg(result);
          try {
            localStorage.setItem('profileImage', result);
          } catch (err) {
            console.error("Failed to save image to local storage", err);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    if (viewingDoc) {
      setViewingDoc(null);
      return;
    }
    if (showAddBank) {
      setShowAddBank(false);
      // Reset form
      setNewAccNo('');
      setNewIfsc('');
      setVerifiedBankName(null);
      setBankError('');
      return;
    }
    if (currentView === 'MAIN') {
      navigate(-1);
    } else {
      setCurrentView('MAIN');
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleBack();
    }, 1000);
  };

  const toggleBiometric = () => {
    if (!user) return;
    
    const newState = !biometricEnabled;
    setBiometricEnabled(newState);
    
    if (newState) {
      localStorage.setItem('biometric_user', user.phone);
    } else {
      localStorage.removeItem('biometric_user');
    }
  };
  
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      logout();
      // Redirect to Home (Dashboard) in Guest Mode
      navigate('/');
    }
  };

  const verifyBank = async () => {
    if(!newAccNo || !newIfsc) return;
    setIsVerifyingBank(true);
    setBankError('');
    setVerifiedBankName(null);

    try {
      const res = await sandboxApi.verifyBank(newAccNo, newIfsc);
      if (res.success && res.data) {
        setVerifiedBankName(res.data.beneficiaryName);
      } else {
        setBankError(res.message || 'Verification Failed');
      }
    } catch (e) {
      setBankError('Service unavailable');
    } finally {
      setIsVerifyingBank(false);
    }
  };

  const confirmAddBank = () => {
    if (!verifiedBankName) return;
    const newBank = {
      id: Date.now(),
      bankName: 'HDFC BANK',
      accountNo: `**** ${newAccNo.slice(-4)}`,
      ifsc: newIfsc.toUpperCase(),
      isVerified: true
    };
    setBanks([...banks, newBank]);
    handleBack();
  };

  if (!user) return null;

  const renderPersonal = () => (
    <div className="animate-fade-in space-y-6">
       <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
             <h3 className="text-sm font-bold text-slate-900">Identity Details</h3>
             <div className="flex items-center gap-1 text-gold-600 bg-gold-50 px-2 py-1 rounded-md border border-gold-100">
                <Lock size={10} />
                <span className="text-[10px] font-bold uppercase">Locked</span>
             </div>
          </div>
          <div className="grid grid-cols-1 gap-4 opacity-75">
             <div>
                <label className="text-xs text-slate-500 block mb-1">Full Name</label>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <User size={16} className="text-slate-400" />
                   <span className="text-sm font-medium text-slate-900">{user.firstName} {user.lastName}</span>
                </div>
             </div>
             <div>
                <label className="text-xs text-slate-500 block mb-1">Mobile Number</label>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <Phone size={16} className="text-slate-400" />
                   <span className="text-sm font-medium text-slate-900">{user.phone}</span>
                </div>
             </div>
          </div>
          <p className="text-[10px] text-slate-500 flex items-start gap-1.5 mt-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
             <Info size={12} className="text-blue-500 shrink-0 mt-0.5" />
             To change details, please contact support.
          </p>
       </div>

       <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
             <h3 className="text-sm font-bold text-slate-900">Contact Information</h3>
          </div>
          <div className="space-y-4">
             <div>
                <label className="text-xs text-slate-500 block mb-1.5 font-medium ml-1">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-3.5 text-slate-400" size={16} />
                   <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all"
                   />
                </div>
             </div>
             <div>
                <label className="text-xs text-slate-500 block mb-1.5 font-medium ml-1">Address</label>
                <div className="relative">
                   <MapPin className="absolute left-4 top-3.5 text-slate-400" size={16} />
                   <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all resize-none"
                   />
                </div>
             </div>
          </div>
       </div>
       <div className="pb-8">
         <Button onClick={handleSave} isLoading={loading} fullWidth size="lg">Save Changes</Button>
       </div>
    </div>
  );

  const renderBanks = () => {
    if (showAddBank) {
      return (
        <div className="animate-slide-up space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 space-y-5">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Add New Bank Account</h3>
              
              {!verifiedBankName ? (
                <div className="space-y-4">
                  <div>
                     <label className="text-xs text-slate-500 block mb-1.5">Account Number</label>
                     <input 
                       type="text" 
                       value={newAccNo}
                       onChange={(e) => setNewAccNo(e.target.value)}
                       placeholder="Enter Account Number" 
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50" 
                     />
                  </div>
                  <div>
                     <label className="text-xs text-slate-500 block mb-1.5">IFSC Code</label>
                     <input 
                       type="text" 
                       value={newIfsc}
                       onChange={(e) => setNewIfsc(e.target.value.toUpperCase())}
                       placeholder="e.g. HDFC0001234" 
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:border-gold-500 focus:outline-none uppercase" 
                       maxLength={11}
                     />
                  </div>
                  {bankError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-xs text-red-600">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      {bankError}
                    </div>
                  )}
                  <div className="pt-2">
                     <Button 
                       onClick={verifyBank} 
                       isLoading={isVerifyingBank} 
                       fullWidth
                       disabled={!newAccNo || newIfsc.length !== 11}
                     >
                       Verify Bank Account
                     </Button>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">
                    We will deposit ₹1 to verify beneficiary name.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col items-center text-center">
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-green-100 mb-2">
                       <CheckCircle size={20} className="text-green-500" />
                     </div>
                     <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-1">Account Verified</p>
                     <p className="text-sm font-bold text-slate-900">Beneficiary: {verifiedBankName}</p>
                  </div>
                  
                  <div className="space-y-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <div className="flex justify-between">
                       <span>Bank:</span> <span className="text-slate-900 font-medium">HDFC BANK</span>
                     </div>
                     <div className="flex justify-between">
                       <span>Account:</span> <span className="text-slate-900 font-medium">**** {newAccNo.slice(-4)}</span>
                     </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                     <Button variant="secondary" onClick={() => { setVerifiedBankName(null); }} className="flex-1">Back</Button>
                     <Button onClick={confirmAddBank} className="flex-[2]">Confirm & Add</Button>
                  </div>
                </div>
              )}
           </div>
        </div>
      )
    }

    return (
      <div className="animate-fade-in space-y-4">
         {banks.length > 0 ? banks.map(bank => (
            <div key={bank.id} className="bg-white p-5 rounded-2xl border border-slate-100 relative group overflow-hidden shadow-sm hover:shadow-md transition-all">
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                        <Banknote className="text-slate-500" size={20} />
                     </div>
                     <div>
                        <h4 className="text-slate-900 font-bold text-sm">{bank.bankName}</h4>
                        <p className="text-[10px] text-slate-400 font-mono tracking-wide">{bank.ifsc}</p>
                     </div>
                  </div>
                  {bank.isVerified && (
                     <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md text-green-600 border border-green-100">
                        <CheckCircle size={10} />
                        <span className="text-[10px] font-bold uppercase">Verified</span>
                     </div>
                  )}
               </div>
               <div className="flex items-center justify-between relative z-10 border-t border-slate-50 pt-3">
                  <p className="text-slate-700 font-mono tracking-widest text-sm">{bank.accountNo}</p>
                  <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" onClick={() => setBanks(banks.filter(b => b.id !== bank.id))}>
                     <Trash2 size={16} />
                  </button>
               </div>
            </div>
         )) : (
            <p className="text-center text-xs text-slate-400 py-4">No bank accounts added.</p>
         )}

         <button 
           onClick={() => setShowAddBank(true)}
           className="w-full py-4 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:bg-slate-50 hover:text-gold-600 hover:border-gold-300 transition-all group bg-white"
         >
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-gold-50 border border-slate-100 group-hover:border-gold-200">
              <Plus size={18} />
            </div>
            <span className="font-semibold text-sm">Add New Bank Account</span>
         </button>
      </div>
    );
  };
  
  const renderDocs = () => (
    <div className="animate-fade-in space-y-6">
       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
             <h3 className="text-sm font-bold text-slate-900">KYC Documents</h3>
             <p className="text-xs text-slate-500 mt-1">Documents submitted during verification.</p>
          </div>
          <div className="divide-y divide-slate-100">
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <FileText size={20} />
                   </div>
                   <div>
                      <p className="text-sm font-medium text-slate-900">PAN Card</p>
                      <p className="text-xs text-slate-500">Provided</p>
                   </div>
                </div>
                <button 
                  onClick={() => setViewingDoc({
                    title: 'PAN Card',
                    url: 'https://placehold.co/600x400/0f172a/cbd5e1/png?text=PAN+Card+Preview'
                  })}
                  className="p-2 hover:bg-slate-50 rounded-full text-gold-600 transition-colors"
                >
                   <Eye size={18} />
                </button>
             </div>
          </div>
       </div>
    </div>
  );

  const renderSettings = () => (
    <div className="animate-fade-in space-y-6">
       <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
           <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                   <Fingerprint size={20} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-900">Biometric Login</p>
                    <p className="text-xs text-slate-500">Face ID / Fingerprint</p>
                 </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={biometricEnabled} onChange={toggleBiometric} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
              </label>
           </div>
           <div className="p-4">
              <div className="flex items-center gap-3 opacity-60">
                 <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                   <Bell size={20} />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-900">Notifications</p>
                    <p className="text-xs text-slate-500">Push alerts</p>
                 </div>
              </div>
           </div>
       </div>
    </div>
  );

  const renderMain = () => (
    <div className="animate-fade-in">
       <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden mb-4 relative ring-1 ring-slate-200 group">
             <img src={profileImg} className="w-full h-full object-cover" alt="User" />
             
             {/* Hidden File Input */}
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*"
               onChange={handleFileChange}
             />

             <button 
               onClick={() => fileInputRef.current?.click()}
               className="absolute bottom-0 right-0 left-0 h-8 bg-black/40 flex items-center justify-center backdrop-blur-sm hover:bg-black/60 transition-colors cursor-pointer"
             >
               <Edit2 size={12} className="text-white" />
             </button>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
            {user.firstName} {user.lastName}
            <CheckCircle size={18} className="text-blue-500 fill-blue-50" />
          </h1>
          <p className="text-sm text-slate-500 font-medium">{user.phone}</p>
       </div>

       {/* KYC Banner */}
       <div 
         onClick={() => navigate('/kyc-flow')}
         className="bg-white p-5 rounded-2xl border border-slate-100 mb-8 flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-md hover:border-gold-200 transition-all"
       >
         <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${user.kycStatus === 'VERIFIED' ? 'bg-green-50 border-green-100 text-green-500' : 'bg-red-50 border-red-100 text-red-500'}`}>
              {user.kycStatus === 'VERIFIED' ? <CheckCircle size={24} /> : <ShieldCheck size={24} />}
            </div>
            <div>
               <p className="text-sm font-bold text-slate-900">KYC Status</p>
               <p className={`text-xs font-medium ${user.kycStatus === 'VERIFIED' ? 'text-green-600' : 'text-red-500'}`}>
                 {user.kycStatus === 'VERIFIED' ? 'Verified Account' : 'Action Required'}
               </p>
            </div>
         </div>
         <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-white transition-all duration-300 text-slate-400">
            <ChevronRight size={16} />
         </div>
       </div>

       <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Account Settings</h3>
            
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm divide-y divide-slate-100">
               <button onClick={() => setCurrentView('PERSONAL')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-gold-600 transition-colors">
                        <User size={16} />
                     </div>
                     <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Personal Details</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
               </button>
               <button onClick={() => setCurrentView('BANKS')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-gold-600 transition-colors">
                        <Banknote size={16} />
                     </div>
                     <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Bank Accounts</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
               </button>
               <button onClick={() => setCurrentView('DOCS')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-gold-600 transition-colors">
                        <FileText size={16} />
                     </div>
                     <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Documents</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
               </button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Preferences</h3>
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm divide-y divide-slate-100">
               <button onClick={() => setCurrentView('SETTINGS')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-gold-600 transition-colors">
                        <Settings size={16} />
                     </div>
                     <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">App Settings</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
               </button>
               {/* Legal Section */}
               <button onClick={() => navigate('/terms')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-gold-600 transition-colors">
                        <FileText size={16} />
                     </div>
                     <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Legal & Policies</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
               </button>
               <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-gold-600 transition-colors">
                        <HelpCircle size={16} />
                     </div>
                     <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Help & Support</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
               </button>
            </div>
          </div>
       </div>

       <div className="mt-10 mb-4">
          <Button onClick={handleLogout} variant="outline" fullWidth className="text-red-500 border-red-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600">
             <LogOut size={16} className="mr-2" /> Sign Out
          </Button>
          <div className="flex flex-col items-center mt-6 gap-2">
             <div className="w-8 h-8 bg-[#C4A46D]/10 rounded-full flex items-center justify-center">
               <Crown size={16} className="text-[#C4A46D]" strokeWidth={2} />
             </div>
             <p className="text-[10px] text-slate-400 font-medium tracking-wide">PMJ JEWELS - DIGIGOLD v1.0.2</p>
             <div className="flex items-center gap-1.5 opacity-50">
                <ShieldCheck size={10} className="text-slate-400"/>
                <p className="text-[10px] text-slate-400">RBI Compliant & Secure</p>
             </div>
          </div>
       </div>
    </div>
  );

  const getTitle = () => {
    switch(currentView) {
      case 'PERSONAL': return 'Personal Details';
      case 'BANKS': return 'Bank Accounts';
      case 'DOCS': return 'Documents';
      case 'SETTINGS': return 'App Settings';
      default: return 'My Profile';
    }
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col relative">
      <Header 
        title={getTitle()} 
        showBack={currentView !== 'MAIN' || showAddBank} 
        onBack={handleBack}
      />

      <div className="flex-1 px-6 pt-6">
         {currentView === 'MAIN' && renderMain()}
         {currentView === 'PERSONAL' && renderPersonal()}
         {currentView === 'BANKS' && renderBanks()}
         {currentView === 'DOCS' && renderDocs()}
         {currentView === 'SETTINGS' && renderSettings()}
      </div>

      {viewingDoc && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-sm rounded-2xl border border-white shadow-2xl overflow-hidden flex flex-col animate-slide-up">
              <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white">
                 <h3 className="text-slate-900 font-bold">{viewingDoc.title}</h3>
                 <button onClick={() => setViewingDoc(null)} className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-4 bg-slate-50 flex items-center justify-center min-h-[250px] relative">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                 <img 
                   src={viewingDoc.url} 
                   alt={viewingDoc.title} 
                   className="w-full h-auto rounded-lg shadow-sm border border-slate-200" 
                 />
              </div>
              <div className="p-4 bg-white">
                <p className="text-[10px] text-slate-400 text-center">
                   This document is encrypted and stored securely.
                </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};