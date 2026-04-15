import { useApp } from '../context/AppContext';
import RoutineList from './RoutineList';

const ICONS = {
  morning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
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
  evening: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  ),
};

const LABELS = {
  morning: { title: 'Morgenroutine', subtitle: 'Starte deinen Tag mit Energie' },
  evening: { title: 'Abendroutine', subtitle: 'Beende den Tag entspannt' },
};

export default function RoutineTab({ type }) {
  const { theme, dailyProgress, morningTasks, eveningTasks } = useApp();
  const tasks = type === 'morning' ? morningTasks : eveningTasks;
  const checkedIds = dailyProgress[type] || [];
  const isComplete = tasks.length > 0 && checkedIds.filter(id => tasks.some(t => t.id === id)).length === tasks.length;

  const isRosa = theme === 'rosa';
  const gradientBg = isRosa
    ? 'from-pink-50 to-rose-50'
    : type === 'morning'
      ? 'from-amber-50 to-orange-50'
      : 'from-indigo-50 to-blue-50';

  const iconColor = isRosa
    ? 'text-pink-500'
    : type === 'morning' ? 'text-amber-500' : 'text-indigo-500';

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className={`rounded-2xl bg-gradient-to-br ${gradientBg} px-5 py-5 flex items-center gap-4`}>
        <div className={`${iconColor} flex-shrink-0`}>
          {ICONS[type]}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-800">{LABELS[type].title}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{LABELS[type].subtitle}</p>
        </div>
        {isComplete && (
          <div className="text-2xl animate-bounce flex-shrink-0">🎉</div>
        )}
      </div>

      {/* Routine list */}
      <RoutineList type={type} />
    </div>
  );
}
