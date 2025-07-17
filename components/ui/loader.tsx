'use client';

import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 24,
  md: 48,
  lg: 64,
};

export function Loader({ className, size = 'md' }: LoaderProps) {
  const dimension = sizeMap[size] || sizeMap['md'];
  const stroke = size === 'sm' ? 3 : 4;
  return (
    <span className={cn('inline-flex items-center justify-center', className)} role="status" aria-label="Loading">
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        fill="none"
        className="block"
      >
        <defs>
          <linearGradient id="loader-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF3D00" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background ring */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={(dimension - stroke) / 2}
          stroke="#e5e7eb"
          strokeOpacity={0.25}
          strokeWidth={stroke}
          fill="none"
        />
        {/* Animated gradient arc */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={(dimension - stroke) / 2}
          stroke="url(#loader-gradient)"
          strokeWidth={stroke}
          strokeDasharray={Math.PI * (dimension - stroke)}
          strokeDashoffset={Math.PI * (dimension - stroke) * 0.25}
          strokeLinecap="round"
          fill="none"
          className="origin-center animate-loader-spin"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        {/* Glowing dot */}
        <circle
          cx={dimension / 2}
          cy={stroke / 2}
          r={stroke * 0.9}
          fill="#FF3D00"
          filter="url(#glow)"
          className="animate-loader-dot"
        />
      </svg>
      <span className="sr-only">Loading...</span>
      <style jsx>{`
        @keyframes loader-spin {
          100% { transform: rotate(360deg); }
        }
        .animate-loader-spin {
          animation: loader-spin 1.2s linear infinite;
        }
        @keyframes loader-dot {
          0% { transform: rotate(0deg) translateY(-${dimension / 2 - stroke / 2}px) }
          100% { transform: rotate(360deg) translateY(-${dimension / 2 - stroke / 2}px) }
        }
        .animate-loader-dot {
          transform-origin: ${dimension / 2}px ${dimension / 2}px;
          animation: loader-dot 1.2s linear infinite;
        }
        /* Dark mode support */
        :global(html.dark) svg [stroke="#e5e7eb"] {
          stroke: #27272a;
        }
      `}</style>
    </span>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <Loader size="lg" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}