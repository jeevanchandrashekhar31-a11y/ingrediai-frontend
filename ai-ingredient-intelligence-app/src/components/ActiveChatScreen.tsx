import { useEffect, useRef, useState } from "react";
import { Camera, Mic } from "lucide-react";
import { Message } from "../App";

/* ---------------- TYPES ---------------- */

type Severity = "LOW" | "MODERATE" | "HIGH";

/* ---------------- STYLES ---------------- */

const severityStyles: Record<Severity, string> = {
  LOW: "bg-emerald-500/30 text-emerald-300 border border-emerald-500/40",
  MODERATE: "bg-yellow-500/30 text-yellow-300 border border-yellow-500/40",
  HIGH: "bg-red-500/30 text-red-300 border border-red-500/40",
};

/* ---------------- COMPONENT ---------------- */

interface Props {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onOpenCamera: () => void;
  onOpenVoice: () => void;
}

export function ActiveChatScreen({
  messages,
  isLoading,
  onSendMessage,
  onOpenCamera,
  onOpenVoice,
}: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <h1 className="text-lg text-white">IngrediAI</h1>
        <p className="text-xs text-gray-400">Understand what you eat</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
        {isLoading && (
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {messages.map((msg) => {
          if (msg.type === "user") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-3xl bg-teal-500/15 border border-teal-500/30 px-6 py-4 rounded-2xl text-white text-sm">
                  {msg.content}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="space-y-8">
              {msg.ingredients?.map((ing, i) => {
                const severity = ing.severity?.toUpperCase() as Severity;

                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white capitalize">
                        {ing.name}
                      </h3>

                      {severity && (
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${severityStyles[severity]}`}
                        >
                          {severity}
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-teal-400 text-sm font-medium mb-1">
                        What it is
                      </p>
                      <p className="text-gray-300 text-sm">
                        {ing.what_it_is}
                      </p>
                    </div>

                    <div>
                      <p className="text-teal-400 text-sm font-medium mb-1">
                        Why this is used
                      </p>
                      <p className="text-gray-300 text-sm">
                        {ing.why_it_is_used}
                      </p>
                    </div>

                    <div>
                      <p className="text-teal-400 text-sm font-medium mb-1">
                        Trade-offs
                      </p>
                      <p className="text-gray-300 text-sm">
                        {ing.tradeoffs}
                      </p>
                    </div>

                    <div>
                      <p className="text-teal-400 text-sm font-medium mb-1">
                        Uncertainty
                      </p>
                      <p className="text-gray-300 text-sm">
                        {ing.uncertainty}
                      </p>
                    </div>
                  </div>
                );
              })}

              {msg.overall_nutrition && (
                <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-6">
                  <h3 className="text-teal-400 text-sm font-semibold mb-2">
                    Overall nutrition
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {msg.overall_nutrition}
                  </p>
                </div>
              )}

              {msg.overall_conclusion && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {msg.overall_conclusion}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={submit}
        className="border-t border-white/5 bg-black/70 backdrop-blur-xl"
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 bg-[#0f0f0f] border border-white/10 rounded-2xl px-4 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste ingredients or ask about food…"
              className="flex-1 bg-transparent text-white placeholder:text-gray-500 text-sm outline-none"
            />

            <button
              type="button"
              onClick={onOpenCamera}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-teal-400"
            >
              <Camera size={16} />
            </button>

            <button
              type="button"
              onClick={onOpenVoice}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-teal-400"
            >
              <Mic size={16} />
            </button>

            <button
              type="submit"
              disabled={!input.trim()}
              className="ml-1 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
            >
              Analyze
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4 animate-pulse">
      <div className="h-5 w-1/3 bg-white/10 rounded" />
      <div className="h-3 w-full bg-white/10 rounded" />
      <div className="h-3 w-5/6 bg-white/10 rounded" />
      <div className="h-3 w-4/6 bg-white/10 rounded" />
    </div>
  );
}
