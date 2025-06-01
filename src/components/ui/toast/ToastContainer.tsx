import React from 'react';
import { createPortal } from 'react-dom';
import { Toast, ToastType } from '@/hooks/useToast';
import { XIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react';

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const getIcon = (type: ToastType) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch (type) {
      case 'success':
        return <CheckCircleIcon {...iconProps} className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircleIcon {...iconProps} className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangleIcon {...iconProps} className="w-5 h-5 text-yellow-400" />;
      case 'info':
      default:
        return <InfoIcon {...iconProps} className="w-5 h-5 text-blue-400" />;
    }
  };

  const getColorClasses = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className={`
      flex items-center p-4 mb-3 rounded-lg border shadow-lg max-w-sm w-full
      transform transition-all duration-300 ease-in-out
      ${getColorClasses(toast.type)}
    `}>
      <div className="flex-shrink-0">
        {getIcon(toast.type)}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;