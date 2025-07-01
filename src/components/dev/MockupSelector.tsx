import React from 'react';
import { mockupScenarios, type MockupScenario } from '../../utils/mockupData';
import { Settings } from 'lucide-react';

interface MockupSelectorProps {
  selectedMockup: MockupScenario | null;
  onMockupSelect: (mockup: MockupScenario | null) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const MockupSelector: React.FC<MockupSelectorProps> = ({
  selectedMockup,
  onMockupSelect,
  isVisible,
  onToggleVisibility
}) => {
  // Only show in development mode
  const isDevelopment = import.meta.env.DEV;

  if (!isDevelopment) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={onToggleVisibility}
        className="mb-2 p-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
        title="Toggle Mockup Selector"
      >
        <Settings size={18} />
      </button>

      {/* Mockup Selector Panel */}
      {isVisible && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-slate-50">
              Development Mockups
            </h3>
            <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded">
              DEV
            </div>
          </div>
          
          <div className="space-y-2">
            {/* Clear Selection */}
            <button
              onClick={() => onMockupSelect(null)}
              className={`w-full text-left p-2 rounded text-sm transition-colors ${
                !selectedMockup
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700'
                  : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600'
              }`}
            >
              <div className="font-medium">Live Mode</div>
              <div className="text-xs opacity-75">Use real API calls</div>
            </button>

            {/* Mockup Options */}
            {mockupScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => onMockupSelect(scenario)}
                className={`w-full text-left p-2 rounded text-sm transition-colors ${
                  selectedMockup?.id === scenario.id
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700'
                    : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600'
                }`}
              >
                <div className="font-medium">{scenario.name}</div>
                <div className="text-xs opacity-75">{scenario.description}</div>
                {scenario.isLoading && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    ⏳ Loading state
                  </div>
                )}
                {scenario.hasError && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                    ❌ Error state
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
            <p className="text-xs text-gray-500 dark:text-slate-400">
              This panel only appears in development mode
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockupSelector;