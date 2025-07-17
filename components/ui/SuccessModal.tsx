import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from './button';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, message = 'Success!' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 w-full max-w-md relative flex flex-col items-center mx-2">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <div className="bg-green-500 rounded-full p-4 mb-4 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <div className="text-xl font-bold mb-6 text-zinc-900 dark:text-white text-center">{message}</div>
        </div>
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-2" onClick={onClose}>Done</Button>
      </div>
    </div>
  );
};

export default SuccessModal; 