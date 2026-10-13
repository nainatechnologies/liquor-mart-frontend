import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', title?: string, duration: number = 2200) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast: ToastItem = { id, message, type, title, duration };
    
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
  }, [dismissToast]);

  const success = useCallback((message: string, title?: string) => showToast(message, 'success', title), [showToast]);
  const error = useCallback((message: string, title?: string) => showToast(message, 'error', title), [showToast]);
  const info = useCallback((message: string, title?: string) => showToast(message, 'info', title), [showToast]);
  const warning = useCallback((message: string, title?: string) => showToast(message, 'warning', title), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, dismissToast }}>
      {children}
      {/* Toast Notification Container */}
      <div 
        aria-live="polite" 
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const bgStyles = {
            success: 'bg-emerald-900/95 text-white border-emerald-500/50 shadow-xl shadow-emerald-950/30 backdrop-blur-md',
            error: 'bg-rose-900/95 text-white border-rose-500/50 shadow-xl shadow-rose-950/30 backdrop-blur-md',
            info: 'bg-slate-900/95 text-white border-slate-700 shadow-xl shadow-slate-950/40 backdrop-blur-md',
            warning: 'bg-amber-900/95 text-white border-amber-500/50 shadow-xl shadow-amber-950/30 backdrop-blur-md',
          }[toast.type];

          const IconComponent = {
            success: CheckCircle2,
            error: AlertCircle,
            info: Info,
            warning: AlertTriangle,
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 py-3 px-4 rounded-2xl border shadow-lg animate-slideUp transition-all duration-300 ${bgStyles}`}
              role="alert"
            >
              <IconComponent className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              <div className="flex-1 text-xs sm:text-sm font-semibold text-white leading-snug">
                {toast.message}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
