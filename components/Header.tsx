import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from './ui/Icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false, onBack, rightAction, className = '' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={`sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-50/80 backdrop-blur-xl border-b border-white/50 transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-4">
        {showBack && (
          <button 
            onClick={handleBack}
            className="group p-2 -ml-2 rounded-full bg-white text-slate-600 border border-slate-100 shadow-sm hover:shadow-md hover:text-slate-900 transition-all active:scale-90"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}
        <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">{title}</h1>
      </div>
      {rightAction && (
        <div className="flex items-center">
          {rightAction}
        </div>
      )}
    </header>
  );
};