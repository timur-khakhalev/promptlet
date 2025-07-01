import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type { MiniApp };

interface MiniApp {
  id: string;
  name: string;
  systemPrompt?: string;
  model: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppState {
  apiKey: string | null;
  saveApiKey: boolean;
  miniApps: MiniApp[];
  activeMiniAppId: string | null;
  theme: ThemeMode;
}

export interface AppContextProps {
  state: AppState;
  setApiKey: (apiKey: string | null, save?: boolean) => void;
  addMiniApp: (miniApp: Omit<MiniApp, 'id'>) => string;
  updateMiniApp: (miniApp: MiniApp) => void;
  deleteMiniApp: (id: string) => void;
  setActiveMiniAppId: (id: string | null) => void;
  setTheme: (theme: ThemeMode) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Helper function to apply theme
const applyTheme = (theme: ThemeMode) => {
  const html = document.documentElement;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const shouldBeDark = theme === 'dark' || (theme === 'system' && systemPrefersDark);
  
  if (shouldBeDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const savedState = localStorage.getItem('promptletState');
    
    let initialState = {
      apiKey: null,
      saveApiKey: true,
      miniApps: [],
      activeMiniAppId: null,
      theme: 'light' as ThemeMode, // Default to light theme instead of system
    };
    
    if (savedState) {
      const parsed = JSON.parse(savedState);
      initialState = { ...initialState, ...parsed };
    }

    return initialState;
  });

  // Apply theme immediately on state initialization
  useEffect(() => {
    applyTheme(state.theme);
  }, []); // Run only once on mount

  useEffect(() => {
    if (state.saveApiKey) {
      localStorage.setItem('promptletState', JSON.stringify(state));
    } else {
      const { apiKey, ...stateWithoutApiKey } = state;
      localStorage.setItem('promptletState', JSON.stringify(stateWithoutApiKey));
    }
  }, [state]);

  useEffect(() => {
    applyTheme(state.theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (state.theme === 'system') {
        applyTheme(state.theme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.theme]);

  const setApiKey = (apiKey: string | null, save: boolean = true) => {
    setState((prevState) => ({ 
      ...prevState, 
      apiKey, 
      saveApiKey: save 
    }));
  };

  const addMiniApp = (miniApp: Omit<MiniApp, 'id'>) => {
    const newMiniApp = { ...miniApp, id: uuidv4() };
    setState((prevState) => ({
      ...prevState,
      miniApps: [...prevState.miniApps, newMiniApp],
      activeMiniAppId: newMiniApp.id, // Auto-select the newly created app
    }));
    return newMiniApp.id;
  };

  const updateMiniApp = (updatedMiniApp: MiniApp) => {
    setState((prevState) => ({
      ...prevState,
      miniApps: prevState.miniApps.map((app) =>
        app.id === updatedMiniApp.id ? updatedMiniApp : app
      ),
    }));
  };

  const deleteMiniApp = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      miniApps: prevState.miniApps.filter((app) => app.id !== id),
    }));
  };

  const setActiveMiniAppId = (id: string | null) => {
    setState((prevState) => ({ ...prevState, activeMiniAppId: id }));
  };

  const setTheme = (theme: ThemeMode) => {
    setState((prevState) => ({ ...prevState, theme }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setApiKey,
        addMiniApp,
        updateMiniApp,
        deleteMiniApp,
        setActiveMiniAppId,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
