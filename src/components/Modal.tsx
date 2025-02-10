import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Modal({ isOpen, onClose, children, isLoading }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isLoading && 'cursor-progress'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <button
          onClick={onClose}
          disabled={isLoading}
          className={`absolute right-4 top-4 text-gray-500 hover:text-gray-700 ${isLoading && 'cursor-not-allowed'}`}
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}