import React from 'react';
import { Loader2 } from './Icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-gold-400 to-gold-600 text-white shadow-lg shadow-gold-900/20 hover:shadow-gold-900/40 border border-transparent",
    secondary: "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700",
    outline: "bg-transparent text-slate-300 border border-slate-600 hover:border-slate-400 hover:text-white",
    danger: "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20"
  };

  const sizes = {
    sm: "h-9 px-4 text-xs rounded-lg",
    md: "h-12 px-6 text-sm rounded-xl",
    lg: "h-14 px-8 text-base rounded-2xl"
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
      )}
      {children}
    </button>
  );
};