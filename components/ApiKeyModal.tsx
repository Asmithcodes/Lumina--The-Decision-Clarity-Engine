import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSubmit: (key: string) => void;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSubmit, onClose }) => {
  const [inputKey, setInputKey] = useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-gray-900 border border-red-500/30 rounded-2xl p-6 shadow-2xl shadow-red-900/20"
          >
            <div className="flex items-center space-x-3 mb-4 text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <h2 className="text-lg font-bold">Connection Interrupted</h2>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              The neural link to the core system has failed (likely a quota limit or expired key).
              To continue the analysis, please provide your own Gemini API Key.
            </p>

            <input
              type="password"
              placeholder="Paste Google Gemini API Key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-500 hover:text-white transition-colors text-sm"
              >
                Abort
              </button>
              <button
                onClick={() => onSubmit(inputKey)}
                disabled={!inputKey}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-red-600/20"
              >
                Reconnect
              </button>
            </div>

            <p className="text-xs text-gray-600 mt-4 text-center">
              Your key is stored only in your browser's memory for this session.
            </p>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ApiKeyModal;
