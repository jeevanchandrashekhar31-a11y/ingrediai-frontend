import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic } from 'lucide-react';

interface VoiceOverlayProps {
  onCapture: (text: string) => void;
  onClose: () => void;
}

export function VoiceOverlay({ onCapture, onClose }: VoiceOverlayProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Auto-start listening
    setIsListening(true);

    // Simulate voice recognition
    const timer = setTimeout(() => {
      const mockTranscript = 'What is maltodextrin and is it safe?';
      setTranscript(mockTranscript);
      setIsListening(false);

      setTimeout(() => {
        onCapture(mockTranscript);
      }, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-black via-gray-900/95 to-black backdrop-blur-xl"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2.5 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Voice UI */}
      <div className="relative w-full h-full flex flex-col items-center justify-center px-8">
        {/* Animated Voice Circle */}
        <div className="relative mb-12">
          {/* Outer ripple rings */}
          {isListening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-teal-500/20 blur-xl"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              />
            </>
          )}

          {/* Main circle */}
          <motion.div
            className="relative w-40 h-40 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-teal-500/50"
            animate={
              isListening
                ? {
                    scale: [1, 1.1, 1],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: isListening ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <Mic className="w-16 h-16 text-white" />
          </motion.div>
        </div>

        {/* Status Text */}
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <h2 className="text-2xl text-white mb-3">Listening...</h2>
              <p className="text-gray-400 text-sm">Ask about any ingredient</p>

              {/* Animated dots */}
              <div className="flex justify-center gap-2 mt-8">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-teal-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : transcript ? (
            <motion.div
              key="transcript"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center max-w-2xl"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-teal-400 rounded-full" />
                <p className="text-teal-400 text-sm">Captured</p>
              </div>
              <p className="text-white text-xl leading-relaxed">{transcript}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Waveform visualization */}
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-end gap-1.5 h-16"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-teal-400 rounded-full"
                animate={{
                  height: ['20%', '100%', '20%'],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Helper text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-12 text-center text-gray-500 text-xs px-8"
        >
          Speak naturally • Your voice is processed securely
        </motion.p>
      </div>
    </motion.div>
  );
}
