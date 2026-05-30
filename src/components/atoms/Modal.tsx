import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0c] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
          <h3 className="font-['Rajdhani'] text-lg font-bold uppercase text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-[var(--dl-muted)] transition hover:text-white"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
