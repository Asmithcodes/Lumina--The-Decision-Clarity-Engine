import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const IntroBriefing: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the briefing in this session
    const hasSeenIntro = sessionStorage.getItem('lumina_intro_seen');
    if (!hasSeenIntro) {
      setIsVisible(true);
    }
  }, []);

  const handleInitialize = () => {
    sessionStorage.setItem('lumina_intro_seen', 'true');
    setIsVisible(false);
  };

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const cardVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.6, ease: "circOut" }
    },
    exit: { scale: 1.1, opacity: 0, filter: "blur(10px)", transition: { duration: 0.5 } }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-overlay"
          initial="hidden"
          animate="visible"
          exit="exit"
          // CHANGE: Allow scrolling on the overlay itself for small screens
          className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md"
        >
          {/* CHANGE: Wrapper to center content but allow scroll */}
          <div className="min-h-full flex items-center justify-center p-4 md:p-8">
            <motion.div
              variants={cardVariants}
              // CHANGE: h-auto instead of h-[85vh]. Remove aspect-video restriction on mobile.
              className="relative w-full max-w-5xl flex flex-col md:flex-row bg-gray-900/40 border border-white/10 rounded-xl overflow-hidden shadow-2xl h-auto"
            >
              {/* FUI Decorative Borders */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 rounded-br-xl pointer-events-none" />

              {/* Left Section: The Origin */}
              <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 bg-gradient-to-br from-gray-900/80 to-black/80 flex flex-col justify-center">
                <motion.div variants={containerVariants} className="space-y-6">
                  <motion.div variants={itemVariants} className="flex items-center space-x-3 text-cyan-500/80">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                    </svg>
                    <span className="font-mono text-xs tracking-[0.2em]">SYSTEM ORIGIN</span>
                  </motion.div>

                  <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-light text-white leading-tight">
                    Confusion is just <span className="text-cyan-400">entropy</span> waiting to be organized.
                  </motion.h2>

                  <motion.p variants={itemVariants} className="text-gray-400 leading-relaxed text-sm md:text-base border-l-2 border-gray-700 pl-4">
                    This tool was forged to visualize the invisible weight of human decisions. 
                    Lumina acts as a Socratic mirror—it does not comfort you, it organizes your reality through rigorous questioning.
                  </motion.p>
                </motion.div>
              </div>

              {/* Right Section: The Directive */}
              <div className="flex-1 p-8 md:p-12 bg-black/60 flex flex-col justify-between relative overflow-hidden min-h-[400px]">
                 {/* Background Grid */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                 <motion.div variants={containerVariants} className="space-y-8 relative z-10">
                   <motion.div variants={itemVariants} className="flex items-center space-x-3 text-red-500/80">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                      <span className="font-mono text-xs tracking-[0.2em]">OPERATIONAL GUIDE</span>
                   </motion.div>

                   <div className="space-y-6">
                     <motion.div variants={itemVariants} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-mono text-white">01</div>
                        <div>
                          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Input Dilemma</h4>
                          <p className="text-gray-500 text-xs mt-1">Provide raw, unfiltered context to generate the chaotic 'Red Knot'.</p>
                        </div>
                     </motion.div>

                     <motion.div variants={itemVariants} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-mono text-white">02</div>
                        <div>
                          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Deconstruct</h4>
                          <p className="text-gray-500 text-xs mt-1">Answer the Socratic inquiries honestly to untangle the nodes.</p>
                        </div>
                     </motion.div>

                     <motion.div variants={itemVariants} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500/50 flex items-center justify-center text-xs font-mono text-cyan-400">03</div>
                        <div>
                          <h4 className="text-white font-medium text-sm uppercase tracking-wide">Align</h4>
                          <p className="text-gray-500 text-xs mt-1">Achieve Blue Alignment to receive the final actionable directive.</p>
                        </div>
                     </motion.div>
                   </div>
                 </motion.div>

                 <motion.button
                   variants={itemVariants}
                   onClick={handleInitialize}
                   className="relative z-10 w-full mt-8 py-4 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-400 font-mono text-sm tracking-[0.2em] uppercase transition-all hover:tracking-[0.3em] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                 >
                   Initialize System
                 </motion.button>
              </div>

            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroBriefing;