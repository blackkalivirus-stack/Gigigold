import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { Home, Wallet, User, Crown } from './ui/Icons';
import { NavItem } from '../types';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Wallet', path: '/wallet', icon: Wallet },
  { label: 'Profile', path: '/profile', icon: User },
];

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    // Check if running on a native device (Android/iOS)
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  // Hide bottom nav on specific flows for immersive experience
  const hideNavRoutes = ['/buy', '/sell', '/gift', '/redeem', '/kyc-flow', '/login', '/signup', '/terms', '/sip'];
  const showNav = !hideNavRoutes.includes(location.pathname);

  // Common styles for the inner content
  const contentStyles = "flex-1 overflow-y-auto no-scrollbar scroll-smooth w-full bg-slate-50";
  const innerWrapperStyles = `${showNav ? 'pb-24' : 'pb-6'} min-h-full`;

  if (isNative) {
    // NATIVE VIEW (APK/IPA): Full screen, no desktop centering, no extra background
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col relative">
        <main className={contentStyles}>
          <div className={innerWrapperStyles}>
            {children}
          </div>
        </main>
        {showNav && <BottomNav navigate={navigate} location={location} />}
      </div>
    );
  }

  // WEB/DESKTOP VIEW: Realistic Phone Simulator
  return (
    <div className="min-h-screen w-full bg-[#E5E0D8] flex justify-center items-center py-8">
      
      {/* Phone Frame */}
      <div className="w-full max-w-[400px] h-[850px] bg-slate-900 rounded-[3rem] border-8 border-slate-900 shadow-2xl relative overflow-hidden ring-4 ring-slate-900/10">
        
        {/* Notch / Dynamic Island */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-16 h-4 bg-black rounded-full flex items-center justify-center gap-2 px-2">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50"></div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="w-full h-full bg-slate-50 flex flex-col relative rounded-[2.5rem] overflow-hidden">
          <main className={contentStyles}>
            <div className={innerWrapperStyles}>
              {children}
            </div>
          </main>
          {showNav && <BottomNav navigate={navigate} location={location} />}
        </div>
        
        {/* Mobile Preview Badge (Only visible on Desktop) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-1 rounded-full z-50 pointer-events-none">
           <span className="text-[10px] text-white font-medium tracking-wide flex items-center gap-1">
             <Crown size={10} className="text-gold-500" /> Mobile Preview
           </span>
        </div>

      </div>

      {/* Helper Text for Desktop User */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-xl shadow-xl max-w-xs border border-slate-200 hidden lg:block">
        <h3 className="font-bold text-slate-900 text-sm mb-1">Developer Note</h3>
        <p className="text-xs text-slate-500">
          This frame simulates the mobile experience. To generate the actual Android app, run: 
          <code className="block bg-slate-100 p-1 mt-1 rounded text-slate-700 font-mono">npm run generate:android</code>
        </p>
      </div>
    </div>
  );
};

// Extracted Navigation Component
const BottomNav: React.FC<{ navigate: any, location: any }> = ({ navigate, location }) => (
  <div className="absolute bottom-0 left-0 right-0 z-40 w-full">
    {/* Gradient fade above nav */}
    <div className="h-16 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent pointer-events-none" />
    
    <div className="bg-slate-50/90 backdrop-blur-xl border-t border-white/50 px-6 pb-6 pt-2 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center h-16 sm:h-20">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex-1 flex flex-col items-center justify-center h-full active:scale-95 transition-all duration-300 group"
            >
              <div className={`
                relative p-2 rounded-2xl transition-all duration-300
                ${isActive ? 'bg-slate-900 text-gold-500 shadow-lg shadow-slate-900/10' : 'text-slate-400 group-hover:text-slate-600 hover:bg-slate-200/50'}
              `}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] mt-1.5 font-semibold transition-all duration-300 ${isActive ? 'text-slate-900 translate-y-0 opacity-100' : 'text-slate-400 opacity-0 translate-y-2 h-0 overflow-hidden'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);