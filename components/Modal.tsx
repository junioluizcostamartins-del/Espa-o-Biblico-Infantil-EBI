
import React, { useEffect, useState } from 'react';
import { XMarkIcon } from './icons/Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
        document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const onAnimationEnd = () => {
    if (!isOpen) {
      setShouldRender(false);
    }
  };

  if (!shouldRender) return null;

  const animationClass = isOpen 
    ? 'animate-modal-entry' 
    : 'animate-modal-exit';

  const backdropAnimationClass = isOpen
    ? 'animate-backdrop-entry'
    : 'animate-backdrop-exit';

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto overflow-x-hidden"
        role="dialog"
        aria-modal="true"
    >
        {/* Backdrop com Blur e Animação */}
        <div 
            className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity ${backdropAnimationClass}`}
            onClick={onClose}
            aria-hidden="true"
        ></div>

        {/* Painel do Modal */}
        <div 
            className={`relative w-full max-w-lg transform rounded-2xl bg-white dark:bg-dark-card text-left shadow-2xl flex flex-col max-h-[90vh] ${animationClass}`}
            onAnimationEnd={onAnimationEnd}
        >
            {/* Header Fixo */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex-shrink-0">
                <h2 className="text-xl font-bold leading-6 text-gray-900 dark:text-white">
                    {title}
                </h2>
                <button
                    type="button"
                    className="ml-auto inline-flex items-center justify-center rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                    onClick={onClose}
                    aria-label="Fechar modal"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>

            {/* Conteúdo com Scroll Customizado */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </div>

       <style>{`
        @keyframes modal-entry {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes modal-exit {
            from { opacity: 1; transform: scale(1) translateY(0); }
            to { opacity: 0; transform: scale(0.95) translateY(10px); }
        }
        @keyframes backdrop-entry {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes backdrop-exit {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        .animate-modal-entry {
            animation: modal-entry 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-modal-exit {
            animation: modal-exit 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-backdrop-entry {
            animation: backdrop-entry 0.3s ease-out forwards;
        }
        .animate-backdrop-exit {
            animation: backdrop-exit 0.2s ease-in forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5);
            border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(75, 85, 99, 0.5);
        }
    `}</style>
    </div>
  );
};

export default Modal;
