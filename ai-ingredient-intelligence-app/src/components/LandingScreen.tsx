import { useState } from 'react';
import { Camera, Mic, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingScreenProps {
  onSendMessage: (message: string) => void;
  onOpenCamera: () => void;
  onOpenVoice: () => void;
  isTransitioning: boolean;
}

export function LandingScreen({
  onSendMessage,
  onOpenCamera,
  onOpenVoice,
  isTransitioning,
}: LandingScreenProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl mb-3 text-white tracking-tight">
          IngrediAI
        </h1>
        <p className="text-gray-400 text-sm">
          Understand what you eat
        </p>
      </motion.div>

      {/* Centered Chat Input */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          isTransitioning
            ? { opacity: 0, y: 400, scale: 0.9 }
            : { opacity: 1, scale: 1 }
        }
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Scan, ask, or say an ingredient you're unsure about…"
              className="w-full bg-transparent text-white placeholder:text-gray-500 px-6 py-5 pr-32 outline-none"
            />

            {/* Action Icons */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenCamera}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-teal-400 transition-all duration-200"
              >
                <Camera className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onOpenVoice}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-teal-400 transition-all duration-200"
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>

        {/* Subtle hint text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 text-center text-gray-600 text-xs"
        >
          Your AI ingredient co-pilot • Instant analysis • Context-aware insights
        </motion.div>
      </motion.div>
    </div>
  );
}
