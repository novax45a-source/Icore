import React from 'react';

interface IcsnLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  subtitle?: string;
}

export const IcsnLogo: React.FC<IcsnLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
  subtitle = 'Your Future. Your Opportunities. Your Path.',
}) => {
  // Dimension definitions
  const dimensions = {
    sm: { icon: 28, text: 'text-base', subtext: 'text-[9px]' },
    md: { icon: 36, text: 'text-lg', subtext: 'text-[10px]' },
    lg: { icon: 44, text: 'text-xl', subtext: 'text-[11px]' },
    xl: { icon: 56, text: 'text-2xl', subtext: 'text-xs' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision Vector Emblem: Compass + Open Knowledge Pathway */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          {/* Subtle Outer Orbital Ring */}
          <circle
            cx="24"
            cy="24"
            r="21.5"
            stroke="url(#icsn_orbit_gradient)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            className="opacity-70"
          />

          {/* Deep Navy Geometric Foundation Shield */}
          <rect
            x="6"
            y="6"
            width="36"
            height="36"
            rx="10"
            fill="url(#icsn_bg_gradient)"
            stroke="#1E293B"
            strokeWidth="1.2"
          />

          {/* Open Pathway / Book Wings (Emerald Green - Education & Opportunity) */}
          <path
            d="M12 32C15.5 29.5 20 29.5 24 31C28 29.5 32.5 29.5 36 32V18.5C32.5 16 28 16 24 17.5C20 16 15.5 16 12 18.5V32Z"
            fill="url(#icsn_emerald_gradient)"
            fillOpacity="0.25"
            stroke="#10B981"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />

          {/* Intelligent Compass Star / Navigator Needle (Electric Blue - Technology & Direction) */}
          <path
            d="M24 10L27.5 21L35 24L27.5 27L24 38L20.5 27L13 24L20.5 21L24 10Z"
            fill="url(#icsn_electric_gradient)"
            stroke="#38BDF8"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Dynamic Core Nexus Point */}
          <circle cx="24" cy="24" r="2.8" fill="#F8FAFC" />
          <circle cx="24" cy="24" r="1.5" fill="#0284C7" />

          {/* Gradients */}
          <defs>
            <linearGradient id="icsn_orbit_gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#10B981" stopOpacity="0.6" />
              <stop offset="1" stopColor="#0284C7" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="icsn_bg_gradient" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0F172A" />
              <stop offset="1" stopColor="#070B14" />
            </linearGradient>

            <linearGradient id="icsn_emerald_gradient" x1="12" y1="16" x2="36" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="icsn_electric_gradient" x1="13" y1="10" x2="35" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Wordmark Typography */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${dimensions.text}`}>
              ICSN
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-500 dark:text-sky-400 font-mono">
              Navigator
            </span>
          </div>
          {subtitle && (
            <span className={`text-slate-500 dark:text-slate-400 font-medium tracking-tight mt-0.5 line-clamp-1 ${dimensions.subtext}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const IcsnSymbolOnly: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => <IcsnLogo size={size} showWordmark={false} className={className} />;
