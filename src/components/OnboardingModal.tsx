import React, { useState } from 'react';
import { useAppContext } from '../contexts/types';
import { Sparkles, ExternalLink, ChevronRight, Check } from 'lucide-react';

interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const { setApiKey } = useAppContext();
  const [step, setStep] = useState(1);
  const [apiKey, setApiKeyInput] = useState('');
  const [saveKey, setSaveKey] = useState(true);

  const handleSetupComplete = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim(), saveKey);
      onClose();
    }
  };

  const steps = [
    {
      title: 'Welcome to Promptlet',
      content: (
        <div className="text-center">
          <Sparkles className="mx-auto text-indigo-600 dark:text-indigo-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-slate-50">
            Your AI Prompt Playground
          </h3>
          <p className="text-gray-600 dark:text-slate-400">
            Create custom AI mini-apps with specific prompts and models for different tasks.
          </p>
          
          <div className="space-y-4 mt-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-indigo-600 dark:text-indigo-300 text-sm font-medium">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-slate-50">Create Mini-Apps</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Build custom AI tools with specific prompts and models</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-indigo-600 dark:text-indigo-300 text-sm font-medium">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-slate-50">Stateless Conversations</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Each interaction is independent with no conversation history</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-indigo-600 dark:text-indigo-300 text-sm font-medium">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-slate-50">Privacy First</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">All data stays in your browser, nothing is sent to our servers</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Setup API Key',
      content: (
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-slate-50">
            Connect Your API Key
          </h3>
          <p className="text-gray-600 dark:text-slate-400">
            You'll need a Google AI API key to start using Promptlet with Gemini models.
          </p>
          
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="onboarding-api-key" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                API Key
              </label>
              <input
                id="onboarding-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter your Google AI API key..."
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-50 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <input
                  id="onboarding-save-key"
                  type="checkbox"
                  checked={saveKey}
                  onChange={(e) => setSaveKey(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-indigo-600 dark:text-indigo-400 border-gray-300 dark:border-slate-500 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-slate-700"
                />
                <label htmlFor="onboarding-save-key" className="text-sm text-gray-700 dark:text-slate-300">
                  Save API key in browser for future sessions
                </label>
              </div>
            </div>
            
            <div className="bg-indigo-50 dark:bg-slate-700/80 border border-indigo-200 dark:border-slate-600 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink size={16} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Need an API key?</span>
              </div>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">
                Get your free API key from Google AI Studio. It takes just a minute!
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
              >
                Open Google AI Studio <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg">
        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-slate-400">
              Step {step} of {steps.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-slate-400">
              {Math.round((step / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {steps[step - 1].content}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-slate-600">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            >
              Back
            </button>
          )}
          
          <div className="flex-1" />
          
          {step < steps.length ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSetupComplete}
              disabled={!apiKey.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Check size={16} />
              Complete Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;