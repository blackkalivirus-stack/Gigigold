import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USER } from '../constants';
import { 
  User, ShieldCheck, ChevronRight, FileText, Lock, CheckCircle, 
  Edit2, Mail, MapPin, Phone, Calendar, Banknote, Plus, Trash2, 
  Settings, HelpCircle, LogOut, Info, Eye, X
} from '../components/ui/Icons';
import { Button } from '../components/ui/Button';
import { Header } from '../components/Header';

type ViewState = 'MAIN' | 'PERSONAL' | 'BANKS' | 'SETTINGS' | 'DOCS';

interface DocViewerState {
  title: string;
  url: string;
}

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewState>('MAIN');
  const [loading, setLoading] = useState(false);
  
  // Document Viewer State
  const [viewingDoc, setViewingDoc] = useState<DocViewerState | null>(null);

  // Profile Image State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImg, setProfileImg] = useState('https://picsum.photos/200');

  // Mock State for editable fields
  const [email, setEmail] = useState('arjun.verma@example.com');
  const [address, setAddress] = useState('Flat 402, Krishna Heights, Sector 12');
  const [city, setCity] = useState('Mumbai');
  const [pincode, setPincode] = useState('400050');
  
  // Mock State for Banks
  const [banks, setBanks] = useState([
    { id: 1, bankName: 'HDFC Bank', accountNo: '**** 8822', ifsc: 'HDFC0001234', isVerified: true },
    { id: 2, bankName: 'SBI', accountNo: '**** 1102', ifsc: 'SBIN0004567', isVerified: true }
  ]);
  const [showAddBank, setShowAddBank] = useState(false);

  useEffect(() => {
    const savedImg = localStorage.getItem('profileImage');
    if (savedImg) {
      setProfileImg(savedImg);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Limit size to 5MB to avoid localStorage quota issues
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

  const renderPersonal = () => (
    <div className="animate-fade-in space-y-6">
       <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
             <h3 className="text-sm font-bold text-white">Identity Details</h3>
             <div className="flex items-center gap-1 text-gold-500 bg-gold-500/10 px-2 py-1 rounded-md">
                <Lock size={10} />
                <span className="text-[10px] font-bold uppercase">Locked</span>
             </div>
          </div>
          <div className="grid grid-cols-1 gap-4 opacity-75">
             <div>
                <label className="text-xs text-slate-500 block mb-1">Full Name (As per PAN)</label>
                <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-white/5">
                   <User size={16} className="text-slate-600" />
                   <span className="text-sm font-medium text-slate-300">{MOCK_USER.firstName} {MOCK_USER.lastName}</span>
                </div>
             </div>
             <div>
                <label className="text-xs text-slate-500 block mb-1">Mobile Number</label>
                <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-white/5">
                   <Phone size={16} className="text-slate-600" />
                   <span className="text-sm font-medium text-slate-300">{MOCK_USER.phone}</span>
                </div>
             </div>
          </div>
          <p className="text-[10px] text-slate-500 flex items-start gap-1.5 mt-2 bg-blue-500/5 p-2 rounded-lg border border-blue-500/10">
             <Info size={12} className="text-blue-400 shrink-0 mt-0.5" />
             To change name or mobile, please raise a ticket in Help & Support section.
          </p>
       </div>

       <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
             <h3 className="text-sm font-bold text-white">Contact Information</h3>
          </div>
          
          <div className="space-y-4">
             <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium ml-1">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-3.5 text-slate-500" size={16} />
                   <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all"
                   />
                </div>
             </div>

             <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium ml-1">Date of Birth</label>
                <div className="relative">
                   <Calendar className="absolute left-4 top-3.5 text-slate-500" size={16} />
                   <input 
                      type="date" 
                      defaultValue="1995-08-15"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all [color-scheme:dark]"
                   />
                </div>
             </div>

             <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium ml-1">Address</label>
                <div className="relative">
                   <MapPin className="absolute left-4 top-3.5 text-slate-500" size={16} />
                   <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all resize-none"
                   />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs text-slate-400 block mb-1.5 font-medium ml-1">City</label>
                  <input 
                     type="text" 
                     value={city}
                     onChange={(e) => setCity(e.target.value)}
                     className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:border-gold-500 focus:outline-none"
                  />
               </div>
               <div>
                  <label className="text-xs text-slate-400 block mb-1.5 font-medium ml-1">Pincode</label>
                  <input 
                     type="text" 
                     value={pincode}
                     onChange={(e) => setPincode(e.target.value)}
                     className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-sm text-white focus:border-gold-500 focus:outline-none"
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
           <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-5">
              <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">Add New Bank Account</h3>
              <div className="space-y-4">
                <div>
                   <label className="text-xs text-slate-400 block mb-1.5">Account Number</label>
                   <input type="password" placeholder="Enter Account Number" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                   <label className="text-xs text-slate-400 block mb-1.5">Re-enter Account Number</label>
                   <input type="text" placeholder="Confirm Account Number" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                   <label className="text-xs text-slate-400 block mb-1.5">IFSC Code</label>
                   <input type="text" placeholder="e.g. HDFC0001234" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-gold-500 focus:outline-none uppercase" />
                </div>
                <div className="pt-2">
                   <Button onClick={() => setShowAddBank(false)} fullWidth>Verify & Add Bank</Button>
                </div>
              </div>
           </div>
           <p className="text-xs text-slate-500 text-center">
             We will deposit ₹1 to verify your bank account details.
           </p>
        </div>
      )
    }

    return (
      <div className="animate-fade-in space-y-4">
         {banks.map(bank => (
            <div key={bank.id} className="bg-gradient-to-br from-slate-900 to-navy-900 p-5 rounded-2xl border border-white/5 relative group overflow-hidden">
               <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <Banknote className="text-navy-900" size={20} />
                     </div>
                     <div>
                        <h4 className="text-white font-bold">{bank.bankName}</h4>
                        <p className="text-xs text-slate-400 font-mono tracking-wide">{bank.ifsc}</p>
                     </div>
                  </div>
                  {bank.isVerified && (
                     <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded text-green-500 border border-green-500/20">
                        <CheckCircle size={10} />
                        <span className="text-[10px] font-bold uppercase">Verified</span>
                     </div>
                  )}
               </div>
               <div className="flex items-center justify-between relative z-10">
                  <p className="text-slate-300 font-mono tracking-widest text-lg">{bank.accountNo}</p>
                  <button className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                     <Trash2 size={18} />
                  </button>
               </div>
            </div>
         ))}

         <button 
           onClick={() => setShowAddBank(true)}
           className="w-full py-4 border border-dashed border-slate-600 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:bg-slate-900 hover:text-gold-500 hover:border-gold-500/50 transition-all group"
         >
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-gold-500/20">
              <Plus size={18} />
            </div>
            <span className="font-semibold text-sm">Add New Bank Account</span>
         </button>
      </div>
    );
  };

  const renderDocs = () => (
    <div className="animate-fade-in space-y-6">
       <div className="bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5">
             <h3 className="text-sm font-bold text-white">KYC Documents</h3>
             <p className="text-xs text-slate-500 mt-1">Documents submitted during verification.</p>
          </div>
          <div className="divide-y divide-white/5">
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <FileText size={20} />
                   </div>
                   <div>
                      <p className="text-sm font-medium text-white">PAN Card</p>
                      <p className="text-xs text-slate-500">ABCDE****F</p>
                   </div>
                </div>
                <button 
                  onClick={() => setViewingDoc({
                    title: 'PAN Card',
                    url: 'https://placehold.co/600x400/0f172a/cbd5e1/png?text=PAN+Card+Preview'
                  })}
                  className="p-2 hover:bg-slate-800 rounded-full text-gold-500 transition-colors"
                >
                   <Eye size={18} />
                </button>
             </div>
             <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <FileText size={20} />
                   </div>
                   <div>
                      <p className="text-sm font-medium text-white">Aadhaar Card</p>
                      <p className="text-xs text-slate-500">**** **** 9012</p>
                   </div>
                </div>
                <button 
                  onClick={() => setViewingDoc({
                    title: 'Aadhaar Card',
                    url: 'https://placehold.co/600x400/0f172a/cbd5e1/png?text=Aadhaar+Card+Preview'
                  })}
                  className="p-2 hover:bg-slate-800 rounded-full text-gold-500 transition-colors"
                >
                   <Eye size={18} />
                </button>
             </div>
          </div>
       </div>
    </div>
  );

  const renderMain = () => (
    <div className="animate-fade-in">
       <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-navy-900 shadow-2xl overflow-hidden mb-4 relative ring-2 ring-white/10 group">
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
               className="absolute bottom-0 right-0 left-0 h-8 bg-black/60 flex items-center justify-center backdrop-blur-sm hover:bg-black/80 transition-colors cursor-pointer"
             >
               <Edit2 size={12} className="text-white" />
             </button>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            {MOCK_USER.firstName} {MOCK_USER.lastName}
            <CheckCircle size={18} className="text-blue-500 fill-blue-500/20" />
          </h1>
          <p className="text-sm text-slate-400 font-medium">{MOCK_USER.phone}</p>
       </div>

       {/* KYC Banner */}
       <div 
         onClick={() => navigate('/kyc-flow')}
         className="bg-gradient-to-r from-slate-900 to-navy-900 p-5 rounded-2xl border border-white/5 mb-8 flex items-center justify-between cursor-pointer group shadow-lg hover:border-gold-500/30 transition-all"
       >
         <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${MOCK_USER.kycStatus === 'VERIFIED' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              {MOCK_USER.kycStatus === 'VERIFIED' ? <CheckCircle size={24} /> : <ShieldCheck size={24} />}
            </div>
            <div>
               <p className="text-sm font-bold text-white">KYC Status</p>
               <p className={`text-xs font-medium ${MOCK_USER.kycStatus === 'VERIFIED' ? 'text-green-500' : 'text-red-400'}`}>
                 {MOCK_USER.kycStatus === 'VERIFIED' ? 'Verified Account' : 'Action Required'}
               </p>
            </div>
         </div>
         <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-navy-950 transition-all duration-300">
            <ChevronRight size={16} />
         </div>
       </div>

       <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-2">Account Settings</h3>
            
            <div className="bg-slate-900/40 rounded-2xl overflow-hidden border border-white/5 backdrop-blur-sm divide-y divide-white/5">
               <button onClick={() => setCurrentView('PERSONAL')} className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-gold-500 transition-colors">
                        <User size={16} />
                     </div>
                     <span className="text-sm font-medium text-slate-200">Personal Details</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-white" />
               </button>
               <button onClick={() => setCurrentView('BANKS')} className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-gold-500 transition-colors">
                        <Banknote size={16} />
                     </div>
                     <span className="text-sm font-medium text-slate-200">Bank Accounts</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-white" />
               </button>
               <button onClick={() => setCurrentView('DOCS')} className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-gold-500 transition-colors">
                        <FileText size={16} />
                     </div>
                     <span className="text-sm font-medium text-slate-200">Documents</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-white" />
               </button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-2">Preferences</h3>
            <div className="bg-slate-900/40 rounded-2xl overflow-hidden border border-white/5 backdrop-blur-sm divide-y divide-white/5">
               <button className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-gold-500 transition-colors">
                        <Settings size={16} />
                     </div>
                     <span className="text-sm font-medium text-slate-200">App Settings</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-white" />
               </button>
               <button className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                     <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-gold-500 transition-colors">
                        <HelpCircle size={16} />
                     </div>
                     <span className="text-sm font-medium text-slate-200">Help & Support</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-white" />
               </button>
            </div>
          </div>
       </div>

       <div className="mt-10 mb-4">
          <Button variant="outline" fullWidth className="text-red-400 border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500">
             <LogOut size={16} className="mr-2" /> Sign Out
          </Button>
          <div className="flex flex-col items-center mt-6 gap-1">
             <p className="text-[10px] text-slate-600 font-medium tracking-wide">Aura DigiGold v1.0.2</p>
             <div className="flex items-center gap-1.5 opacity-50">
                <ShieldCheck size={10} className="text-slate-500"/>
                <p className="text-[10px] text-slate-500">RBI Compliant & Secure</p>
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
      case 'SETTINGS': return 'Settings';
      default: return 'My Profile';
    }
  };

  return (
    <div className="min-h-full bg-navy-950 flex flex-col relative">
      <Header 
        title={getTitle()} 
        showBack={currentView !== 'MAIN' || showAddBank} 
        onBack={handleBack}
      />

      <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto no-scrollbar">
         {currentView === 'MAIN' && renderMain()}
         {currentView === 'PERSONAL' && renderPersonal()}
         {currentView === 'BANKS' && renderBanks()}
         {currentView === 'DOCS' && renderDocs()}
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
           <div className="bg-slate-900 w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-slide-up">
              <div className="flex justify-between items-center p-4 border-b border-white/5 bg-navy-950">
                 <h3 className="text-white font-bold">{viewingDoc.title}</h3>
                 <button onClick={() => setViewingDoc(null)} className="p-1 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-4 bg-black/50 flex items-center justify-center min-h-[250px] relative">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                 <img 
                   src={viewingDoc.url} 
                   alt={viewingDoc.title} 
                   className="w-full h-auto rounded-lg shadow-lg border border-white/5" 
                 />
              </div>
              <div className="p-4 bg-navy-950/50">
                <p className="text-[10px] text-slate-500 text-center">
                   This document is encrypted and stored securely.
                </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};