'use client'

import React, { useEffect, useState } from 'react'

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: (id: string) => void;
}

export default function Toast({ id, message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Allow fade-out animation
    }, 5000); // Toast visible for 5 seconds

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const bgColor = {
    success: 'bg-primary',
    error: 'bg-destructive',
    info: 'bg-primary',
  }[type];

  const animationClass = isVisible ? 'animate-slideIn' : 'animate-slideOut';

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md text-white shadow-lg ${bgColor} ${animationClass}`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={() => onClose(id)} className="ml-4 text-white font-bold">
          &times;
        </button>
      </div>
    </div>
  );
}
