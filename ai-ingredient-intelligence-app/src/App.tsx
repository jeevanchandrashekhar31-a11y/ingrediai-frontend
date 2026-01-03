import { useState } from "react";
import { LandingScreen } from "./components/LandingScreen";
import { ActiveChatScreen } from "./components/ActiveChatScreen";
import { CameraOverlay } from "./components/CameraOverlay";
import { VoiceOverlay } from "./components/VoiceOverlay";

/* ---------------- TYPES ---------------- */

export type IngredientReasoning = {
  name: string;
  severity: "low" | "medium" | "high";

  what_it_is: string;
  why_it_is_used: string;
  tradeoffs: string;
  uncertainty: string;
};

export type Message = {
  id: string;
  type: "user" | "ai";
  timestamp: Date;

  content?: string; // user
  greeting?: string;
  ingredients?: IngredientReasoning[];
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
      const res = await fetch(`${API_BASE_URL}/api/reasoning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: content }),
      });

      const data = await res.json();

      /* ---------- NORMALIZE BACKEND → FRONTEND ---------- */

      const normalizedIngredients: IngredientReasoning[] =
        data.ingredients?.map((ing: any) => ({
          name: ing.name,
          severity: ing.severity,
          why_it_matters: ing.what_it_is,
          tradeoffs: ing.tradeoffs,
          who_might_care: ing.why_it_is_used,
          confidence_uncertainty: ing.uncertainty,
          human_conclusion: ing.human_conclusion ?? "",
        })) ?? [];

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        type: "ai",
        timestamp: new Date(),
        greeting: data.greeting,
        ingredients: normalizedIngredients,
        overall_nutrition: data.overall_nutrition_per_100g
          ? Object.entries(data.overall_nutrition_per_100g)
              .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
              .join(" • ")
          : undefined,
        overall_conclusion: data.overall_conclusion,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
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
          isLoading={isLoading}
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
