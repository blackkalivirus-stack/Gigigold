import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ className = "h-12", variant = 'dark' }) => {
  const [imgError, setImgError] = useState(false);

  // If image fails, render this high-fidelity fallback that matches the brand
  if (imgError) {
    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`} style={{ height: 'auto', minHeight: '40px' }}>
        <div className="flex flex-col items-center">
          {/* PMJ Text - Serif Font */}
          <h1 className="text-3xl font-serif font-medium leading-none tracking-wide text-[#C4A46D]" style={{ fontFamily: 'Times New Roman, serif' }}>
            PMJ
          </h1>
          {/* JEWELS Text - Sans Serif */}
          <span className="text-[8px] font-sans font-bold tracking-[0.3em] text-[#C4A46D] mt-0.5">
            JEWELS
          </span>
        </div>
      </div>
    );
  }

  return (
    <img 
      src="https://www.pmjjewels.com/assets/front/images/logo.png" 
      alt="PMJ JEWELS" 
      className={`object-contain transition-opacity duration-300 ${className}`}
      onError={(e) => {
        setImgError(true);
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};