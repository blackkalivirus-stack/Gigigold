import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Wallet, User } from './ui/Icons';
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

  // Hide bottom nav on specific flows for immersive experience
  const hideNavRoutes = ['/buy', '/sell', '/gift', '/redeem', '/kyc-flow', '/login', '/signup', '/terms', '/sip'];
  const showNav = !hideNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-[100dvh] w-full flex justify-center items-start sm:items-center sm:py-8 sm:px-4">
      {/* 
        Responsive Container: 
        - Changed bg-white to bg-slate-50 (Warm Off-White) for less stark contrast
        - Added shadow-2xl with a warmer tone
      */}
      <div className="w-full max-w-md h-[100dvh] sm:h-[85vh] sm:max-h-[850px] bg-slate-50 flex flex-col relative shadow-2xl shadow-slate-900/10 sm:rounded-[2.5rem] overflow-hidden ring-1 ring-white/20">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth w-full">
          <div className={`${showNav ? 'pb-24' : 'pb-6'} min-h-full`}>
            {children}
          </div>
        </main>

        {/* Bottom Navigation - Enhanced Frosted Glass */}
        {showNav && (
          <div className="absolute bottom-0 left-0 right-0 z-40">
            {/* Gradient fade above nav */}
            <div className="h-16 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent pointer-events-none" />
            
            <div className="bg-slate-50/80 backdrop-blur-xl border-t border-white/50 px-6 pb-safe pt-2 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
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
        )}
      </div>
    </div>
  );
};