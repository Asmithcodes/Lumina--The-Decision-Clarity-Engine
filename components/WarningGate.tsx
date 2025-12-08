import React, { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface WarningGateProps {
  onUnlock: () => void;
}

const WarningGate: React.FC<WarningGateProps> = ({ onUnlock }) => {
  const [progress, setProgress] = useState(0);
  const controls = useAnimation();
  const intervalRef = useRef<number | null>(null);

  const handleStart = () => {
    if (intervalRef.current) return;
    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onUnlock();
          return 100;
        }
        return prev + 2; // Speed of fill
      });
    }, 20);
    
    controls.start({ scale: 0.95, opacity: 0.8 });
  };

  const handleEnd = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setProgress(0);
    controls.start({ scale: 1, opacity: 1 });
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-xl space-y-8"
      >
        <h1 className="text-sm tracking-[0.3em] text-red-500 uppercase font-mono">
          Protocol Initiated
        </h1>
        
        <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white tracking-tight">
          Lumina asks what you <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
            fear to answer.
          </span>
        </h2>

        <p className="text-gray-400 leading-relaxed text-lg">
          The analysis may be blunt, personal, and emotionally raw. 
          There is no comforting advice here. Only the reflection you have been avoiding.
        </p>

        <div className="pt-12 flex flex-col items-center justify-center space-y-4">
          <motion.div
            className="relative w-24 h-24 rounded-full border border-gray-700 flex items-center justify-center cursor-pointer select-none overflow-hidden group"
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
            animate={controls}
            whileHover={{ scale: 1.05, borderColor: '#ef4444' }}
          >
            {/* Background Fill */}
            <div 
              className="absolute bottom-0 left-0 w-full bg-red-600/20 transition-all duration-75 ease-linear"
              style={{ height: `${progress}%` }}
            />
            
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-8 h-8 text-white relative z-10"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
            
            {/* Circular Progress SVG */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="48"
                cy="48"
                r="46"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * progress) / 100}
                className="transition-all duration-75 ease-linear"
              />
            </svg>
          </motion.div>
          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest animate-pulse">
            Hold to Accept Truth
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default WarningGate;
