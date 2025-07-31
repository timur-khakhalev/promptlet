import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/types';
import { X, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { state, setApiKey } = useAppContext();
  const [key, setKey] = useState(state.apiKey || '');
  const [save, setSave] = useState(state.saveApiKey);
  const [showKey, setShowKey] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setIsChanged(key !== (state.apiKey || '') || save !== state.saveApiKey);
  }, [key, save, state.apiKey, state.saveApiKey]);

  const handleSave = () => {
    setApiKey(key.trim() || null, save);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 md:bg-black/20 md:backdrop-blur-sm md:flex md:items-center md:justify-center p-4">
      <div className="bg-white dark:bg-slate-800 md:rounded-xl shadow-2xl w-full h-full md:h-auto md:max-w-md flex flex-col" onKeyDown={handleKeyDown}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-slate-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-50">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6 flex-1 overflow-y-auto">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your Google AI API key..."
                className="w-full p-3 pr-10 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-600 dark:text-slate-400"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400">
              <ExternalLink size={12} />
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
              >
                Get your API key from Google AI Studio
              </a>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                id="saveApiKey"
                type="checkbox"
                checked={save}
                onChange={(e) => setSave(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-indigo-600 dark:text-indigo-400 border-gray-300 dark:border-slate-500 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-slate-700"
              />
              <div>
                <label htmlFor="saveApiKey" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Save API key in browser
                </label>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                  {save 
                    ? 'Your API key will be stored locally and automatically loaded on future visits.'
                    : 'Your API key will only be kept in memory during this session.'
                  }
                </p>
              </div>
            </div>
          </div>

          {!state.apiKey && (
            <div className="bg-indigo-50 dark:bg-slate-700/80 border border-indigo-200 dark:border-slate-600 rounded-lg p-4">
              <p className="text-sm text-indigo-800 dark:text-indigo-200">
                You need to set up your API key to start using Promptlet. Your key is processed locally and never sent to our servers.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 md:p-6 mt-auto border-t border-gray-200 dark:border-slate-600">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isChanged}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors rounded-lg"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;