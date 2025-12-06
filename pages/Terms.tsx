import React, { useState } from 'react';
import { Header } from '../components/Header';

export const Terms: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TERMS' | 'PRIVACY'>('TERMS');

  return (
    <div className="min-h-full bg-slate-50 flex flex-col">
      <Header title="Legal & Compliance" showBack />

      <div className="px-6 pt-4 sticky top-[60px] bg-slate-50 z-10 pb-4">
         <div className="bg-white p-1 rounded-xl border border-slate-200 flex shadow-sm">
            <button 
               onClick={() => setActiveTab('TERMS')}
               className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'TERMS' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
               Terms & Conditions
            </button>
            <button 
               onClick={() => setActiveTab('PRIVACY')}
               className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'PRIVACY' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
               Privacy Policy
            </button>
         </div>
      </div>

      <div className="flex-1 px-6 pb-24 overflow-y-auto">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-sm text-slate-600 leading-relaxed space-y-4">
           {activeTab === 'TERMS' ? (
             <>
               <h3 className="font-bold text-slate-900">1. Introduction</h3>
               <p>Welcome to PMJ Jewels - DigiGold. By using our application, you agree to these terms.</p>
               
               <h3 className="font-bold text-slate-900">2. Gold Purchase & Storage</h3>
               <p>Digital Gold purchased is 24K (99.5% purity). It is stored in secured vaults managed by our partner. The buy/sell price is market-linked and includes GST where applicable.</p>
               
               <h3 className="font-bold text-slate-900">3. KYC Requirements</h3>
               <p>As per RBI guidelines, KYC verification (PAN/Aadhaar) is mandatory for transactions exceeding specified limits. You agree to provide accurate information.</p>
               
               <h3 className="font-bold text-slate-900">4. Sell & Redemption</h3>
               <p>Gold can be sold back at the live sell rate. Redemption in physical gold/coins is subject to minting and delivery charges.</p>
             </>
           ) : (
             <>
               <h3 className="font-bold text-slate-900">1. Data Collection</h3>
               <p>We collect personal information including Name, Mobile, Email, PAN, and Aadhaar data solely for compliance and service delivery.</p>
               
               <h3 className="font-bold text-slate-900">2. Data Security</h3>
               <p>Your data is encrypted using industry-standard protocols. We do not sell your personal data to third parties.</p>
               
               <h3 className="font-bold text-slate-900">3. Information Sharing</h3>
               <p>We share necessary data with our vaulting partners and payment gateways to process your transactions and comply with regulations.</p>
             </>
           )}
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-6">
           Last updated: October 2023
        </p>
      </div>
    </div>
  );
};