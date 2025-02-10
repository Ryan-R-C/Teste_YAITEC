import React, { useEffect, useState } from 'react';

export interface ToastEntity {
  message: string;
  type?: 'success' | 'error';
}

export interface ToastProps extends ToastEntity{
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 3000,
  onClose,
}) => {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setShow(true);
    const autoCloseTimer = setTimeout(() => {
      setClosing(true);
    }, duration);
    return () => clearTimeout(autoCloseTimer);
  }, [duration]);

  useEffect(() => {
    if (closing) {
      const transitionTimer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(transitionTimer);
    }
  }, [closing, onClose]);

  const handleManualClose = () => {
    setClosing(true);
  };

  const animationClasses = closing
    ? 'translate-x-full opacity-0'
    : show
    ? 'translate-x-0 opacity-100'
    : 'translate-x-full opacity-0';

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-xs p-4 rounded shadow-lg text-white transform transition-all duration-300 ${bgColor} ${animationClasses}`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={handleManualClose}
          className="ml-4 font-bold text-xl leading-none hover:text-gray-200 focus:outline-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
