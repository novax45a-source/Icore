import React from 'react';

interface EnvoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  variant?: 'dark' | 'light' | 'auto';
  className?: string;
  onClick?: () => void;
}

export const EnvoLogo: React.FC<EnvoLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showTagline = true,
  variant = 'auto',
  className = '',
  onClick,
}) => {
  // Dimension tokens based on size
  const iconDimensions = {
    sm: { w: 32, h: 32, icon: 20 },
    md: { w: 40, h: 40, icon: 24 },
    lg: { w: 52, h: 52, icon: 32 },
    xl: { w: 64, h: 64, icon: 40 },
  }[size];

  const textSizeClass = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  const taglineSizeClass = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Official Stylized Electric-Blue E Symbol with Refined Geometric Glow */}
      <div
        style={{ width: iconDimensions.w, height: iconDimensions.h }}
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#1F5BFF] via-[#1746C9] to-[#0A1530] shadow-lg shadow-[#1F5BFF]/30 border border-[#8EC5FF]/40 transition-transform duration-200 group-hover:scale-105"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Ambient Glow filter */}
          <defs>
            <filter id="envoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#8EC5FF" floodOpacity="0.8" />
            </filter>
            <linearGradient id="eGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#8EC5FF" />
              <stop offset="100%" stopColor="#1F5BFF" />
            </linearGradient>
            <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8EC5FF" />
              <stop offset="100%" stopColor="#1F5BFF" />
            </linearGradient>
          </defs>

          {/* Electric-Blue Geometric 'E' Shape */}
          {/* Vertical Spine */}
          <path
            d="M 28 22 C 28 18 31 15 35 15 L 43 15 C 47 15 50 18 50 22 L 50 78 C 50 82 47 85 43 85 L 35 85 C 31 85 28 82 28 78 Z"
            fill="url(#eGrad)"
            filter="url(#envoGlow)"
          />

          {/* Top Bar */}
          <path
            d="M 44 15 L 74 15 C 77 15 80 18 80 22 L 80 24 C 80 28 77 31 74 31 L 44 31 Z"
            fill="url(#barGrad)"
          />

          {/* Middle Dynamic Accent Bar */}
          <path
            d="M 44 42 L 67 42 C 70 42 72 44.5 72 47.5 L 72 48.5 C 72 51.5 70 54 67 54 L 44 54 Z"
            fill="#8EC5FF"
            filter="url(#envoGlow)"
          />

          {/* Bottom Bar */}
          <path
            d="M 44 69 L 76 69 C 79 69 82 72 82 76 L 82 78 C 82 82 79 85 76 85 L 44 85 Z"
            fill="url(#barGrad)"
          />

          {/* Futuristic Spark / Node at apex */}
          <circle cx="77" cy="23" r="3.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Wordmark and Official Tagline */}
      {(showWordmark || showTagline) && (
        <div className="flex flex-col">
          {showWordmark && (
            <div className="flex items-center gap-2">
              <span
                className={`font-black tracking-tight font-sans ${textSizeClass} ${
                  variant === 'dark'
                    ? 'text-white'
                    : variant === 'light'
                    ? 'text-[#050B1A]'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                ENVO
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#1F5BFF]/15 text-[#1F5BFF] dark:text-[#8EC5FF] border border-[#1F5BFF]/30">
                EdTech
              </span>
            </div>
          )}

          {showTagline && (
            <span
              className={`font-medium tracking-wide leading-tight ${taglineSizeClass} ${
                variant === 'dark'
                  ? 'text-[#8EC5FF]/80'
                  : variant === 'light'
                  ? 'text-slate-500'
                  : 'text-slate-500 dark:text-[#8EC5FF]/80'
              }`}
            >
              Learn. Teach. Connect. Grow.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
