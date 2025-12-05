import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, History, User } from './ui/Icons';
import { NavItem } from '../types';

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'History', path: '/transactions', icon: History },
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
        - Mobile: Full width/height (h-[100dvh])
        - Tablet/Desktop: Framed (max-w-md), rounded corners, shadow
      */}
      <div className="w-full max-w-md h-[100dvh] sm:h-[85vh] sm:max-h-[850px] bg-white flex flex-col relative shadow-2xl shadow-slate-900/20 sm:rounded-[2.5rem] overflow-hidden ring-1 ring-black/5">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth w-full bg-slate-100/50">
          <div className={`${showNav ? 'pb-24' : 'pb-6'} min-h-full`}>
            {children}
          </div>
        </main>

        {/* Bottom Navigation - Light Frosted Glass */}
        {showNav && (
          <div className="absolute bottom-0 left-0 right-0 z-40">
            {/* Gradient fade above nav */}
            <div className="h-12 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
            
            <div className="bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 pb-safe shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center h-16 sm:h-20">
                {NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="flex-1 flex flex-col items-center justify-center h-full active:scale-95 transition-all duration-200 group"
                    >
                      <div className={`
                        relative p-1.5 rounded-xl transition-all duration-300
                        ${isActive ? 'bg-gold-50 text-gold-600' : 'text-slate-400 group-hover:text-slate-600'}
                      `}>
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        {isActive && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-500" />
                        )}
                      </div>
                      <span className={`text-[10px] mt-1 font-medium transition-all duration-300 ${isActive ? 'text-gold-600 opacity-100' : 'text-slate-400 opacity-0 h-0 overflow-hidden group-hover:h-auto group-hover:opacity-70'}`}>
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