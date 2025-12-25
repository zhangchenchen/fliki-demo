import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    // Changed positioning logic: left-0 right-0 mx-auto ensures perfect centering on mobile
    <div className="fixed top-6 left-0 right-0 mx-auto z-[150] w-[90%] max-w-sm animate-slide-up">
      <div className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border ${
        type === 'success' 
          ? 'bg-zinc-900/95 border-green-500/50 text-white' 
          : 'bg-zinc-900/95 border-red-500/50 text-white'
      }`}>
        <div className={`shrink-0 ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
        </div>
        <div className="flex-1 text-sm font-bold">
          {message}
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;