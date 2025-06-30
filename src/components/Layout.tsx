import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Header from './Header';
import Sidebar, { type SidebarRef } from './Sidebar';
import ChatView from './ChatView';
import OnboardingModal from './OnboardingModal';

const Layout: React.FC = () => {
  const { state } = useAppContext();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const sidebarRef = useRef<SidebarRef>(null);

  useEffect(() => {
    // Show onboarding if user has no API key and no mini-apps
    const shouldShowOnboarding = !state.apiKey && state.miniApps.length === 0;
    setShowOnboarding(shouldShowOnboarding);
  }, [state.apiKey, state.miniApps.length]);

  const handleCreateAppFromCenter = () => {
    if (sidebarRef.current) {
      sidebarRef.current.openCreateModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[85vh] max-h-[900px] min-h-[600px] bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-600 overflow-hidden flex">
        <Sidebar ref={sidebarRef} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <div className="flex-1 bg-gray-50 dark:bg-slate-800">
            <ChatView onCreateApp={handleCreateAppFromCenter} />
          </div>
        </div>
      </div>
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default Layout;
