import React, { useEffect } from 'react';

export const SplashScreen = ({ onFinish, progress = 0 }: { onFinish: () => void, progress?: number }) => {
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => onFinish(), 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, onFinish]);

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#10131a] transition-colors duration-300">
      <h1
        className="text-5xl md:text-6xl font-extrabold mb-8 text-gradient"
        style={{ fontFamily: 'Montserrat, Inter, Poppins, sans-serif', letterSpacing: '0.04em' }}
      >
        Portfolio
      </h1>
      <div className="w-64 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-6 transition-colors duration-300">
        <div
          className="h-full rounded-full text-gradient"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
            transition: 'width 0.1s',
          }}
        />
      </div>
      <div className="text-base text-muted-foreground font-medium tracking-wide dark:text-zinc-200 transition-colors duration-300">
        Loading... {progress}%
      </div>
      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
      `}</style>
    </div>
  );
}; 