import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import RoutineTab from './components/RoutineTab';
import ProfileTab from './components/ProfileTab';

const TABS = [
  {
    key: 'morning',
    label: 'Morgen',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2.2' : '1.8'}
        strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    key: 'evening',
    label: 'Abend',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2.2' : '1.8'}
        strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ),
  },
  {
    key: 'profile',
    label: 'Profil',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? '2.2' : '1.8'}
        strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function CompletionDot({ type, isRosa }) {
  const { morningTasks, eveningTasks, dailyProgress } = useApp();
  const tasks = type === 'morning' ? morningTasks : eveningTasks;
  const checked = (dailyProgress[type] || []).filter(id => tasks.some(t => t.id === id));
  if (tasks.length === 0) return null;
  const done = checked.length === tasks.length;
  return (
    <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${done ? (isRosa ? 'bg-pink-400' : 'bg-green-400') : 'bg-gray-300'}`} />
  );
}

function AppShell() {
  const [activeTab, setActiveTab] = useState('morning');
  const { theme } = useApp();
  const isRosa = theme === 'rosa';

  const pageBg = isRosa ? 'bg-gradient-to-b from-pink-50 to-rose-50' : 'bg-gray-50';
  const headerBg = isRosa ? 'bg-white/80 border-pink-100' : 'bg-white/80 border-gray-100';
  const tabBg = isRosa ? 'bg-pink-50' : 'bg-gray-100';
  const tabActive = isRosa ? 'bg-white text-pink-600 shadow-sm' : 'bg-white text-indigo-600 shadow-sm';
  const tabInactive = isRosa ? 'text-gray-400 hover:text-pink-400' : 'text-gray-400 hover:text-gray-600';
  const navBg = isRosa ? 'bg-white/90 border-pink-100' : 'bg-white/90 border-gray-100';
  const navActive = isRosa ? 'text-pink-600' : 'text-indigo-600';

  return (
    <div className={`min-h-screen ${pageBg} flex flex-col`}>
      {/* Header */}
      <header className={`sticky top-0 z-20 border-b backdrop-blur-sm ${headerBg}`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{isRosa ? '🌸' : '✨'}</span>
            <h1 className={`text-base font-semibold ${isRosa ? 'text-pink-700' : 'text-gray-800'}`}>
              Routine Check
            </h1>
          </div>
          {/* Tab pills (desktop/tablet) */}
          <div className={`hidden sm:flex items-center gap-1 rounded-full p-1 ${tabBg}`}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${activeTab === tab.key ? tabActive : tabInactive}`}
              >
                {tab.icon(activeTab === tab.key)}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-24 sm:pb-6">
        {activeTab === 'morning' && <RoutineTab type="morning" />}
        {activeTab === 'evening' && <RoutineTab type="evening" />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      {/* Bottom nav (mobile) */}
      <nav className={`sm:hidden fixed bottom-0 left-0 right-0 z-20 border-t backdrop-blur-sm ${navBg}`}>
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors relative ${activeTab === tab.key ? navActive : 'text-gray-400'}`}
            >
              <span className="relative">
                {tab.icon(activeTab === tab.key)}
                {(tab.key === 'morning' || tab.key === 'evening') && (
                  <CompletionDot type={tab.key} isRosa={isRosa} />
                )}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
