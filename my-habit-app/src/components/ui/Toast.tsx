import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  emoji: string;
  onClose: () => void;
}

export function Toast({ message, emoji, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 bg-black text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 z-50">
      <span>{emoji}</span>
      <span>{message}</span>
    </div>
  );
} 