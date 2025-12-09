import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeuroKnot from './components/NeuroKnot';
import WarningGate from './components/WarningGate';
import CognitiveHUD from './components/CognitiveHUD';
import IntroBriefing from './components/IntroBriefing';
import ResetButton from './components/ResetButton';
import { GeminiService } from './services/geminiService';
import { AppPhase, Question, AnalysisResult } from './types';

function App() {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.GATE);
  const [dilemma, setDilemma] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // UI State for inputs
  const [currentInput, setCurrentInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize Service (no API key needed - using Worker!)
  const getService = () => new GeminiService();

  // Physics Calculation
  // During questions, ratio = answers / total.
  // Before questions = 0.
  // At clarity = 1.
  const getCompletionRatio = () => {
    if (phase === AppPhase.CLARITY) return 1;
    if (phase === AppPhase.QUESTIONS && questions.length > 0) {
      return answers.length / questions.length;
    }
    return 0;
  };

  const handleGateUnlock = () => {
    setPhase(AppPhase.INPUT);
  };

  const handleDilemmaSubmit = async () => {
    if (!currentInput.trim()) return;
    setDilemma(currentInput);
    setLoading(true);
    setPhase(AppPhase.PROCESSING_1);

    try {
      const service = getService();
      const qs = await service.generateQuestions(currentInput);
      setQuestions(qs);
      setCurrentInput('');
      setLoading(false);
      setPhase(AppPhase.QUESTIONS);
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      alert("The void is silent. Please try again. (System Error)");
      setPhase(AppPhase.INPUT);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentInput.trim()) return;

    const newAnswers = [...answers, currentInput];
    setAnswers(newAnswers);
    setCurrentInput('');

    if (newAnswers.length < questions.length) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // All questions answered
      setLoading(true);
      setPhase(AppPhase.PROCESSING_2);

      try {
        const service = getService();
        const qaPairs = questions.map((q, i) => ({ q, a: newAnswers[i] }));
        const result = await service.generateAnalysis(dilemma, qaPairs);
        setAnalysis(result);
        setLoading(false);
        setPhase(AppPhase.CLARITY);
      } catch (error: any) {
        setLoading(false);
        console.error(error);
        alert("Analysis failed. The entropy was too high. Try again.");
        setPhase(AppPhase.QUESTIONS); // Reset to allow retry
        setAnswers(prev => prev.slice(0, -1)); // Remove last answer to retry
      }
    }
  };

  const resetApp = () => {
    setPhase(AppPhase.GATE);
    setDilemma('');
    setQuestions([]);
    setAnswers([]);
    setCurrentQIndex(0);
    setAnalysis(null);
    setCurrentInput('');
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-100 overflow-x-hidden selection:bg-red-500/30 selection:text-white">
      {/* Background Physics Engine */}
      <NeuroKnot phase={phase} completionRatio={getCompletionRatio()} />

      {/* Intro Mission Briefing (Overlays everything on first load) */}
      <IntroBriefing />

      {/* Main Content Overlay */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">

        {/* Header (Hidden on Gate) */}
        {phase !== AppPhase.GATE && (
          <>
            <header className="absolute top-0 w-full p-6 flex justify-start items-center gap-8 z-20 backdrop-blur-sm pointer-events-none">
              <div className="text-xs font-mono tracking-widest text-cyan-500/80 pointer-events-auto">LUMINA v1.0</div>
              <div className="pointer-events-auto">
                <ResetButton onClick={resetApp} />
              </div>
            </header>

            {/* Cognitive HUD (Hidden on Gate) */}
            <CognitiveHUD />
          </>
        )}

        {/* 
            MAIN CONTAINER:
            Changed from justify-center to justify-start to prevent top clipping on mobile.
            Interactive elements now use 'my-auto' to vertically center themselves safely in the available space.
        */}
        <main className="flex-grow flex flex-col items-center justify-start w-full max-w-7xl mx-auto p-4 md:p-8 transition-all duration-500">

          {phase === AppPhase.GATE && (
            <div className="w-full my-auto">
              <WarningGate onUnlock={handleGateUnlock} />
            </div>
          )}

          {/* INPUT PHASE */}
          {phase === AppPhase.INPUT && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl backdrop-blur-xl bg-black/40 border border-white/5 p-8 rounded-3xl shadow-2xl my-auto"
            >
              <h2 className="text-2xl font-light mb-6 text-gray-200">What keeps you awake?</h2>
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Describe your dilemma. Be raw. Don't self-edit."
                className="w-full h-40 bg-gray-950/50 border border-gray-800 rounded-xl p-4 text-lg focus:outline-none focus:border-red-500/50 transition-colors resize-none mb-6"
              />
              <button
                onClick={handleDilemmaSubmit}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm tracking-widest uppercase transition-all hover:scale-[1.01]"
              >
                Initiate Analysis
              </button>
            </motion.div>
          )}

          {/* PROCESSING STATES */}
          {(phase === AppPhase.PROCESSING_1 || phase === AppPhase.PROCESSING_2) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center my-auto"
            >
              <div className="w-16 h-16 border-t-2 border-indigo-500 rounded-full animate-spin mb-8 mx-auto" />
              <p className="font-mono text-indigo-400 animate-pulse">
                {phase === AppPhase.PROCESSING_1 ? "DECONSTRUCTING EGO..." : "SYNTHESIZING TRUTH..."}
              </p>
            </motion.div>
          )}

          {/* QUESTIONS PHASE */}
          {phase === AppPhase.QUESTIONS && questions.length > 0 && (
            <motion.div
              key={currentQIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-2xl backdrop-blur-xl bg-indigo-950/20 border border-indigo-500/20 p-8 rounded-3xl my-auto"
            >
              <div className="flex items-center space-x-2 mb-6 text-indigo-400 font-mono text-xs">
                <span>REFLECTION {currentQIndex + 1} / {questions.length}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-light leading-relaxed mb-8 text-white">
                {questions[currentQIndex]}
              </h3>
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                autoFocus
                placeholder="Type your truth..."
                className="w-full bg-transparent border-b border-indigo-500/30 py-3 text-xl focus:outline-none focus:border-indigo-400 transition-colors"
              />
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleAnswerSubmit}
                  className="flex items-center space-x-2 text-indigo-300 hover:text-white transition-colors"
                >
                  <span>NEXT</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {/* CLARITY PHASE */}
          {/* Note: Not using my-auto here. Using fixed top spacing to ensure headers clear the nav, allowing natural scroll for long results. */}
          {phase === AppPhase.CLARITY && analysis && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 mt-32 md:mt-48"
            >
              {/* Card 1: The Core Truth */}
              <div className="bg-cyan-950/20 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 md:p-8">
                <h4 className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-4 border-b border-cyan-500/20 pb-2 inline-block">Core Truth</h4>
                <p className="text-xl md:text-2xl text-gray-100 font-light leading-relaxed">
                  {analysis.coreTruth}
                </p>
              </div>

              {/* Card 2: Blind Spot */}
              <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                <h4 className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-4 border-b border-gray-700/50 pb-2 inline-block">Blind Spot</h4>
                <p className="text-gray-300 leading-relaxed italic text-lg">
                  "{analysis.blindSpot}"
                </p>
              </div>

              {/* Card 3: Actionable Step (Full Width) */}
              <div className="md:col-span-2 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-8 md:p-10 text-center mt-4">
                <h4 className="text-cyan-300 font-mono text-xs uppercase tracking-widest mb-6">Immediate Directive</h4>
                <p className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
                  {analysis.actionableStep}
                </p>
              </div>
            </motion.div>
          )}

        </main>

        <footer className="w-full p-6 text-center z-20">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            Developed by Asmith — <a href="mailto:asmyth@duck.com" className="hover:text-gray-400 transition-colors border-b border-transparent hover:border-gray-500">asmyth@duck.com</a>
          </p>
          <p className="text-[10px] text-gray-700 mt-2">
            System Error? Contact Asmith — <a href="mailto:asmyth@duck.com" className="hover:text-gray-500">asmyth@duck.com</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;