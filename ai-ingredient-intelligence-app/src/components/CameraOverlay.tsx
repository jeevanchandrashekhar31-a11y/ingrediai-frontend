import { useState } from "react";
import { X, Camera, Upload } from "lucide-react";
import { motion } from "motion/react";

interface CameraOverlayProps {
  onCapture: (text: string) => void;
  onClose: () => void;
}

export function CameraOverlay({ onCapture, onClose }: CameraOverlayProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await fetch(`${API_BASE_URL}/api/ocr`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.extracted_text && data.extracted_text.length > 3) {
        onCapture(data.extracted_text);
      } else {
        onCapture("Unable to clearly detect ingredients from image");
      }
    } catch (err) {
      onCapture("Image analysis failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full px-6">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-white text-lg font-medium text-center">
            Analyze ingredient label
          </h2>

          {/* Upload */}
          <label className="flex flex-col items-center justify-center gap-3 border border-dashed border-white/20 rounded-xl p-6 cursor-pointer hover:border-teal-400 transition">
            <Upload className="text-teal-400" />
            <span className="text-sm text-gray-400">
              Upload image from device
            </span>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                setSelectedImage(e.target.files?.[0] || null)
              }
            />
          </label>

          {selectedImage && (
            <div className="text-xs text-gray-400 text-center">
              Selected:{" "}
              <span className="text-teal-400">{selectedImage.name}</span>
            </div>
          )}

          {/* Analyze */}
          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || isProcessing}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 disabled:opacity-40 transition"
          >
            <Camera size={16} />
            {isProcessing ? "Analyzing..." : "Analyze image"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Camera capture coming soon
          </p>
        </div>
      </div>
    </motion.div>
  );
}
