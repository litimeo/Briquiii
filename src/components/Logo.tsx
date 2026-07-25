import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light';
  showIconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showIconOnly = false,
}) => {
  const isLight = variant === 'light';

  // Sizing definitions
  const dimensions = {
    sm: { iconWidth: 28, iconHeight: 28, text: 'text-lg', gap: 'gap-2' },
    md: { iconWidth: 36, iconHeight: 36, text: 'text-2xl', gap: 'gap-2.5' },
    lg: { iconWidth: 44, iconHeight: 44, text: 'text-3xl', gap: 'gap-3' },
    xl: { iconWidth: 56, iconHeight: 56, text: 'text-4xl', gap: 'gap-3.5' },
  }[size];

  // Unique ID generator for SVG Gradients so multiple logo instances don't clash
  const gradId = React.useId().replace(/:/g, '');

  return (
    <div className={`inline-flex items-center select-none ${dimensions.gap} ${className}`}>
      {/* Signal Immo Vector Hexagon House + Signal Bars Icon */}
      <svg
        width={dimensions.iconWidth}
        height={dimensions.iconHeight}
        viewBox="0 0 100 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Main Blue to Teal Gradient for the Hexagon House */}
          <linearGradient
            id={`signalHouseGrad_${gradId}`}
            x1="10"
            y1="75"
            x2="70"
            y2="15"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#0041E6" />
            <stop offset="45%" stopColor="#0072FF" />
            <stop offset="100%" stopColor="#00C9A7" />
          </linearGradient>

          {/* Teal Gradient for Signal Bars */}
          <linearGradient
            id={`signalBarsGrad_${gradId}`}
            x1="65"
            y1="40"
            x2="95"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#00A8E8" />
            <stop offset="100%" stopColor="#00C9A7" />
          </linearGradient>
        </defs>

        {/* 1. Hexagon House Outer Outline */}
        <path
          d="M 18 68 L 9 40 L 40 14 L 66 29 M 66 42 L 66 68 L 18 68 Z"
          stroke={`url(#signalHouseGrad_${gradId})`}
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2. Inner 2x2 Grid Window Panes inside the House */}
        <g fill={isLight ? '#FFFFFF' : '#0B132B'}>
          <rect x="30" y="38" width="6.5" height="6.5" rx="1.2" />
          <rect x="39" y="38" width="6.5" height="6.5" rx="1.2" />
          <rect x="30" y="47" width="6.5" height="6.5" rx="1.2" />
          <rect x="39" y="47" width="6.5" height="6.5" rx="1.2" />
        </g>

        {/* 3. Ascending 3 Signal Bar Columns (Top-Right) */}
        <rect
          x="66"
          y="32"
          width="6.5"
          height="18"
          rx="3.25"
          fill={`url(#signalBarsGrad_${gradId})`}
        />
        <rect
          x="76"
          y="20"
          width="6.5"
          height="30"
          rx="3.25"
          fill={`url(#signalBarsGrad_${gradId})`}
        />
        <rect
          x="86"
          y="6"
          width="6.5"
          height="44"
          rx="3.25"
          fill={`url(#signalBarsGrad_${gradId})`}
        />
      </svg>

      {/* Brand Text Wordmark */}
      {!showIconOnly && (
        <span
          className={`font-heading tracking-tight ${dimensions.text} flex items-center leading-none`}
        >
          <span
            className={`font-bold ${
              isLight ? 'text-white' : 'text-[#0B132B]'
            }`}
          >
            Signal
          </span>
          <span className="font-medium text-[#00C9A7] ml-1.5">
            Immo
          </span>
        </span>
      )}
    </div>
  );
};
