import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Header from './Header';
import Sidebar, { type SidebarRef } from './Sidebar';
import ChatView from './ChatView';
import OnboardingModal from './OnboardingModal';
import { Menu } from 'lucide-react';

const Layout: React.FC = () => {
  const { state } = useAppContext();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<SidebarRef>(null);

  useEffect(() => {
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
      <div className="w-full max-w-6xl h-[85vh] max-h-[900px] min-h-[600px] bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-600 overflow-hidden flex relative">
        <div className={`absolute z-20 top-0 left-0 h-full md:relative md:z-auto md:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <Sidebar ref={sidebarRef} onClose={() => setSidebarOpen(false)} />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <Header>
            <button
              className="md:hidden p-2"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={24} />
            </button>
          </Header>
          <div className="flex-1 min-h-0 bg-gray-50 dark:bg-slate-800">
            <ChatView onCreateApp={handleCreateAppFromCenter} />
          </div>
        </div>
      </div>
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  );
};

export default Layout;
