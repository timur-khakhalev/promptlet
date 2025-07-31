import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm">
        <div className="p-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <Trash2 className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                Delete Mini-App
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                Are you sure you want to delete this mini-app? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
