import { useApp } from '../context/AppContext';

const MESSAGES = {
  start: [
    'Los geht\'s! Du schaffst das! 💪',
    'Ein neuer Tag, eine neue Chance!',
    'Starte stark in den Tag!',
    'Jede Routine beginnt mit dem ersten Schritt.',
  ],
  progress: [
    'Super Fortschritt! Weiter so!',
    'Du bist auf dem richtigen Weg! 🔥',
    'Halbzeit – du machst das toll!',
    'Jeder Schritt zählt – bleib dran!',
  ],
  almost: [
    'Fast geschafft! Nur noch ein bisschen!',
    'Die Ziellinie ist in Sicht! 🏁',
    'Du bist fast fertig – nicht aufgeben!',
    'Letzter Schritt – du kannst das!',
  ],
  complete: [
    '🎉 Perfekt! Routine abgeschlossen!',
    '⭐ Unglaublich! Alles erledigt!',
    '🏆 Champion! 100% heute!',
    '✨ Fantastisch! Du hast es durchgezogen!',
  ],
};

function getMotivation(completed, total) {
  if (total === 0) return null;
  const pct = completed / total;
  if (completed === 0) return { key: 'start', color: 'blue' };
  if (pct < 0.5) return { key: 'progress', color: 'yellow' };
  if (pct < 1) return { key: 'almost', color: 'orange' };
  return { key: 'complete', color: 'green' };
}

const COLOR_CLASSES = {
  blue:   { light: 'bg-blue-50 border-blue-200 text-blue-800',     rosa: 'bg-pink-50 border-pink-200 text-pink-800' },
  yellow: { light: 'bg-yellow-50 border-yellow-200 text-yellow-800', rosa: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-800' },
  orange: { light: 'bg-orange-50 border-orange-200 text-orange-800', rosa: 'bg-rose-50 border-rose-200 text-rose-800' },
  green:  { light: 'bg-green-50 border-green-200 text-green-800',   rosa: 'bg-pink-100 border-pink-300 text-pink-900' },
};

export default function MotivationBanner({ completed, total, seed = 0 }) {
  const { theme } = useApp();
  const info = getMotivation(completed, total);
  if (!info) return null;

  const msgs = MESSAGES[info.key];
  const msg = msgs[seed % msgs.length];
  const colorClass = COLOR_CLASSES[info.color][theme] || COLOR_CLASSES[info.color].light;

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${colorClass} transition-all duration-500`}>
      {msg}
    </div>
  );
}
