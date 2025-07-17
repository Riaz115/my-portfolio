import React from 'react';
import { X, Trash2, Loader2 } from 'lucide-react';
import { Button } from './button';

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  confirmLoading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ open, onClose, onConfirm, title = 'Delete', confirmLoading = false }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 w-full max-w-md relative flex flex-col items-center mx-2">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
          <X className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <div className="bg-red-100 dark:bg-red-900 rounded-full p-4 mb-4">
            <Trash2 className="w-10 h-10 text-red-500" />
          </div>
          <div className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">{title}</div>
          <div className="text-gray-600 dark:text-gray-300 mb-6 text-center text-base font-medium">Are you want to delete this record?</div>
        </div>
        <div className="flex w-full gap-2 mt-2">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={confirmLoading}>Cancel</Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm} disabled={confirmLoading}>
            {confirmLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</>
            ) : (
              'Confirm'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal; 