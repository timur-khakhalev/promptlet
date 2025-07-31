import React, { useState, type ReactNode } from 'react';
import { Settings as SettingsIcon, Sparkles, Sun, Moon, Monitor } from 'lucide-react';
import { useAppContext, type ThemeMode } from '../contexts/types';
import Settings from './Settings';

interface HeaderProps {
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { state, setTheme } = useAppContext();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getThemeIcon = (theme: ThemeMode) => {
    switch (theme) {
      case 'light': return <Sun size={18} />;
      case 'dark': return <Moon size={18} />;
      case 'system': return <Monitor size={18} />;
    }
  };

  const cycleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(state.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <>
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-600">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            {children}
            <div className="flex items-center gap-2">
              <Sparkles className="text-indigo-600 dark:text-indigo-400" size={24} />
              <h1 className="text-xl font-bold text-gray-900 dark:text-slate-50">
                Promptlet
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                AI Prompt Playground
              </span>
              <span className="text-xs text-gray-400 dark:text-slate-500">
                by <a href="https://timurai.tech" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">timurai.tech</a>
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!state.apiKey && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                API key required
              </div>
            )}
            <button 
              onClick={cycleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-300"
              title={`Theme: ${state.theme}`}
            >
              {getThemeIcon(state.theme)}
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)} 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-600 dark:text-slate-300"
              title="Settings"
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </div>
      </header>
      {isSettingsOpen && <Settings onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
};

export default Header;