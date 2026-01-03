import { useState } from "react";
import { LandingScreen } from "./components/LandingScreen";
import { ActiveChatScreen } from "./components/ActiveChatScreen";
import { CameraOverlay } from "./components/CameraOverlay";
import { VoiceOverlay } from "./components/VoiceOverlay";

/* ---------------- TYPES ---------------- */

export type IngredientReasoning = {
  name: string;
  severity: "low" | "medium" | "high";
  why_it_matters: string;
  tradeoffs: string;
  who_might_care: string;
  confidence_uncertainty: string;
  human_conclusion: string;
};

export type Message = {
  id: string;
  type: "user" | "ai";
  timestamp: Date;

  content?: string; // user
  ingredients?: IngredientReasoning[]; // ai
  overall_nutrition?: string;
  overall_conclusion?: string;
};

export type ViewMode = "landing" | "chat" | "camera" | "voice";

/* ---------------- APP ---------------- */

export default function App() {
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [viewMode, setViewMode] = useState<ViewMode>("landing");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* -------- SEND MESSAGE CORE -------- */

  const sendToBackend = async (content: string) => {
    setIsLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const res = await fetch(
  `${API_BASE_URL}/api/reasoning/ingredient`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ingredients: content,
      product_context: "general food product",
    }),
  }
);



      const data = await res.json();

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        type: "ai",
        timestamp: new Date(),
        ingredients: data.ingredients,
        overall_nutrition: data.overall_nutrition,
        overall_conclusion: data.overall_conclusion,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "ai",
          timestamp: new Date(),
          overall_conclusion:
            "I couldn’t analyze this right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------- FIRST MESSAGE -------- */

  const handleFirstMessage = async (content: string) => {
    setIsTransitioning(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages([userMessage]);
    setViewMode("chat");
    setIsTransitioning(false);

    await sendToBackend(content);
  };

  /* -------- FOLLOW-UP -------- */

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    await sendToBackend(content);
  };

  /* -------- CAMERA / VOICE -------- */

  const handleCameraCapture = (text: string) => {
    setViewMode("chat");
    messages.length === 0
      ? handleFirstMessage(text)
      : handleSendMessage(text);
  };

  const handleVoiceCapture = (text: string) => {
    setViewMode("chat");
    messages.length === 0
      ? handleFirstMessage(text)
      : handleSendMessage(text);
  };

  const openCamera = () => setViewMode("camera");
  const openVoice = () => setViewMode("voice");

  const closeOverlay = () =>
    setViewMode(messages.length === 0 ? "landing" : "chat");

  /* -------- RENDER -------- */

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
      {viewMode === "landing" && (
        <LandingScreen
          onSendMessage={handleFirstMessage}
          onOpenCamera={openCamera}
          onOpenVoice={openVoice}
          isTransitioning={isTransitioning}
        />
      )}

      {viewMode === "chat" && (
        <ActiveChatScreen
          messages={messages}
          isLoading={isLoading}   // 🔥 skeletons + shimmer
          onSendMessage={handleSendMessage}
          onOpenCamera={openCamera}
          onOpenVoice={openVoice}
        />
      )}

      {viewMode === "camera" && (
        <CameraOverlay
          onCapture={handleCameraCapture}
          onClose={closeOverlay}
        />
      )}

      {viewMode === "voice" && (
        <VoiceOverlay
          onCapture={handleVoiceCapture}
          onClose={closeOverlay}
        />
      )}
    </div>
  );
}
