import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'overlay' | 'inline';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Memuat...',
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  // Variant configurations
  const getVariantClasses = () => {
    switch (variant) {
      case 'overlay':
        return 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center';
      case 'inline':
        return 'inline-flex items-center gap-2';
      default:
        return 'flex flex-col items-center justify-center p-8';
    }
  };

  const spinnerElement = (
    <Loader2 
      className={`${sizeClasses[size]} text-brand-600 animate-spin`} 
    />
  );

  const messageElement = message && variant !== 'inline' && (
    <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 mt-3 text-center`}>
      {message}
    </p>
  );

  const inlineMessageElement = message && variant === 'inline' && (
    <span className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400`}>
      {message}
    </span>
  );

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      {variant === 'inline' ? (
        <>
          {spinnerElement}
          {inlineMessageElement}
        </>
      ) : (
        <>
          {spinnerElement}
          {messageElement}
        </>
      )}
    </div>
  );
};

// Alternative spinner designs
export const PulseSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Memuat...',
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'overlay':
        return 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center';
      case 'inline':
        return 'inline-flex items-center gap-2';
      default:
        return 'flex flex-col items-center justify-center p-8';
    }
  };

  const spinnerElement = (
    <div className={`${sizeClasses[size]} bg-brand-600 rounded-full animate-pulse`} />
  );

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      {variant === 'inline' ? (
        <>
          {spinnerElement}
          {message && (
            <span className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400`}>
              {message}
            </span>
          )}
        </>
      ) : (
        <>
          {spinnerElement}
          {message && (
            <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 mt-3 text-center`}>
              {message}
            </p>
          )}
        </>
      )}
    </div>
  );
};

// Dots spinner
export const DotsSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Memuat...',
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-1',
    lg: 'gap-2',
    xl: 'gap-2',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'overlay':
        return 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center';
      case 'inline':
        return 'inline-flex items-center gap-3';
      default:
        return 'flex flex-col items-center justify-center p-8';
    }
  };

  const spinnerElement = (
    <div className={`flex ${gapClasses[size]}`}>
      <div className={`${sizeClasses[size]} bg-brand-600 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
      <div className={`${sizeClasses[size]} bg-brand-600 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
      <div className={`${sizeClasses[size]} bg-brand-600 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
    </div>
  );

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      {variant === 'inline' ? (
        <>
          {spinnerElement}
          {message && (
            <span className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400`}>
              {message}
            </span>
          )}
        </>
      ) : (
        <>
          {spinnerElement}
          {message && (
            <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 mt-3 text-center`}>
              {message}
            </p>
          )}
        </>
      )}
    </div>
  );
};

// Page-level loading component
export const PageLoader: React.FC<{ message?: string }> = ({ 
  message = 'Memuat halaman...' 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {message}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Mohon tunggu sebentar...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;