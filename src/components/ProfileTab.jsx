import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getHistory } from '../utils/cookies';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

const THEME_OPTIONS = [
  { key: 'light', label: 'Light Mode', icon: '☀️', desc: 'Klassisches helles Design' },
  { key: 'rosa', label: 'Rosa Mode', icon: '🌸', desc: 'Pinkes & warmes Design' },
];

export default function ProfileTab() {
  const { settings, updateSettings, theme } = useApp();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const isRosa = theme === 'rosa';
  const accent = isRosa ? 'text-pink-500' : 'text-indigo-500';
  const selectedBorder = isRosa ? 'border-pink-400 bg-pink-50' : 'border-indigo-400 bg-indigo-50';

  const last30 = history.slice(-30);
  const totalDays = last30.length;

  const morningPerfect = last30.filter(
    (d) => d.morningTotal > 0 && d.morningCompleted === d.morningTotal
  ).length;
  const eveningPerfect = last30.filter(
    (d) => d.eveningTotal > 0 && d.eveningCompleted === d.eveningTotal
  ).length;
  const fullPerfect = last30.filter(
    (d) =>
      d.morningTotal > 0 && d.morningCompleted === d.morningTotal &&
      d.eveningTotal > 0 && d.eveningCompleted === d.eveningTotal
  ).length;

  let streak = 0;
  const sorted = [...last30].sort((a, b) => b.date.localeCompare(a.date));
  for (const d of sorted) {
    if (d.morningCompleted === d.morningTotal && d.eveningCompleted === d.eveningTotal && d.morningTotal > 0) {
      streak++;
    } else break;
  }

  const chartData = last30.map((d) => ({
    date: d.date.slice(5),
    Morgen: d.morningTotal > 0 ? Math.round((d.morningCompleted / d.morningTotal) * 100) : 0,
    Abend: d.eveningTotal > 0 ? Math.round((d.eveningCompleted / d.eveningTotal) * 100) : 0,
  }));

  return (
    <div className="space-y-6">

      {/* Theme Selection */}
      <section className="space-y-3">
        <h3 className={`text-sm font-semibold uppercase tracking-wide ${accent}`}>Design</h3>
        <div className="grid grid-cols-2 gap-3">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => updateSettings({ theme: opt.key })}
              className={`
                rounded-xl border-2 p-4 text-left transition-all
                ${settings.theme === opt.key
                  ? selectedBorder + ' shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'}
              `}
            >
              <div className="text-2xl mb-1">{opt.icon}</div>
              <div className="text-sm font-medium text-gray-800">{opt.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="space-y-3">
        <h3 className={`text-sm font-semibold uppercase tracking-wide ${accent}`}>Statistik (letzte 30 Tage)</h3>

        {totalDays === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
            <p className="text-gray-400 text-sm">Noch keine Daten vorhanden.</p>
            <p className="text-gray-300 text-xs mt-1">Hake deine erste Routine ab!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {streak >= 3 && (
              <div className={`rounded-xl p-4 text-center ${isRosa ? 'bg-pink-50 border border-pink-200' : 'bg-indigo-50 border border-indigo-200'}`}>
                <p className="text-2xl mb-1">🔥</p>
                <p className={`text-sm font-semibold ${isRosa ? 'text-pink-700' : 'text-indigo-700'}`}>
                  {streak}-Tage-Streak! Weiter so!
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Aktueller Streak" value={`${streak}d`} sub="in Folge komplett" />
              <StatCard label="Perfekte Tage" value={fullPerfect} sub={`von ${totalDays} Tagen`} />
              <StatCard label="Morgen komplett" value={morningPerfect} sub={`von ${totalDays} Tagen`} />
              <StatCard label="Abend komplett" value={eveningPerfect} sub={`von ${totalDays} Tagen`} />
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="text-xs text-gray-500 mb-3">Abschlussrate in % pro Tag</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Morgen" fill={isRosa ? '#f472b6' : '#818cf8'} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Abend" fill={isRosa ? '#fb7185' : '#6366f1'} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}
