import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const CognitiveHUD: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // FUI Line Animation Variants
  const drawLine: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { duration: 0.5, ease: "easeInOut" } 
    }
  };

  const slideIn: Variants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-50 group flex items-center justify-center w-10 h-10 rounded-full bg-black/20 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-950/30 backdrop-blur-md transition-all duration-300"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className={`w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors ${isOpen ? 'text-cyan-400' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        
        {/* Button Glow Pulse */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/0 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all duration-300" />
      </motion.button>

      {/* The HUD Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={slideIn}
            className="fixed top-20 right-6 z-40 w-72 bg-black/80 backdrop-blur-xl border-l-2 border-cyan-500/50 shadow-2xl overflow-hidden"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 20px, -20px 0)" }} // Corner Cut visual
          >
            {/* Decorative Top Line */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="h-[1px] bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" 
            />

            <div className="p-5 font-mono text-xs space-y-4 text-cyan-100/80">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <span className="tracking-widest text-cyan-400">SYS.DIAGNOSTICS</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
                  <div className="w-1 h-1 bg-cyan-500/30 rounded-full" />
                </div>
              </div>

              {/* System Status */}
              <div className="space-y-1">
                <span className="block text-[10px] text-gray-500 uppercase">Current Protocol</span>
                <p className="text-cyan-300 typing-effect">ANALYZING COGNITIVE DISSONANCE</p>
              </div>

              {/* Legend */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                  <div>
                    <span className="block font-bold text-white">RED NODE</span>
                    <span className="text-[10px] text-gray-400">High Entropy / Unresolved Conflict. The knot tightens with evasion.</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  <div>
                    <span className="block font-bold text-white">BLUE NODE</span>
                    <span className="text-[10px] text-gray-400">Logic Alignment. The structure stabilizes with honest introspection.</span>
                  </div>
                </div>
              </div>

              {/* Decorative Data Graphics */}
              <div className="pt-2 border-t border-cyan-500/20 flex justify-between items-end opacity-50">
                <div className="space-y-1">
                   <div className="h-0.5 w-12 bg-cyan-500/40" />
                   <div className="h-0.5 w-8 bg-cyan-500/40" />
                </div>
                <span className="text-[9px] text-cyan-500">V.1.04.2</span>
              </div>
            </div>

            {/* Decorative SVG Overlay */}
            <svg className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
               <motion.path 
                 d="M 0 0 L 20 0 L 20 20" 
                 fill="none" 
                 stroke="#06b6d4" 
                 strokeWidth="1"
                 variants={drawLine}
               />
               <motion.path 
                 d="M 288 100 L 288 300" 
                 fill="none" 
                 stroke="#06b6d4" 
                 strokeWidth="1" 
                 variants={drawLine}
               />
            </svg>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CognitiveHUD;