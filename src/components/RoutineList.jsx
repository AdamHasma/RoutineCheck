import { useState } from 'react';
import { useApp } from '../context/AppContext';
import MotivationBanner from './MotivationBanner';

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
      <g fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M1.99999 2.7962V21.2037L12.5186 12L1.99999 2.7962Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M12.5 2.7962V21.2037L23.0186 12L12.5 2.7962Z" />
      </g>
    </svg>
  );
}

export default function RoutineList({ type }) {
  const { theme, morningTasks, eveningTasks, updateMorningTasks, updateEveningTasks,
    dailyProgress, checkTask, skipTask, uncheckLast } = useApp();

  const tasks = type === 'morning' ? morningTasks : eveningTasks;
  const updateTasks = type === 'morning' ? updateMorningTasks : updateEveningTasks;
  const checkedIds = dailyProgress[type] || [];
  const skippedIds = dailyProgress[`${type}Skipped`] || [];

  const [editMode, setEditMode] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingLabel, setEditingLabel] = useState('');

  const isChecked = (id) => checkedIds.includes(id);
  const isSkipped = (id) => skippedIds.includes(id);
  const nextUncheckedId = tasks.find((t) => !isChecked(t.id) && !isSkipped(t.id))?.id;

  const completedCount = checkedIds.filter((id) => tasks.some((t) => t.id === id)).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const isRosa = theme === 'rosa';

  const accentBg = isRosa ? 'bg-pink-500' : 'bg-indigo-500';
  const accentHover = isRosa ? 'hover:bg-pink-600' : 'hover:bg-indigo-600';
  const accentText = isRosa ? 'text-pink-600' : 'text-indigo-600';
  const accentBorder = isRosa ? 'border-pink-300' : 'border-indigo-300';
  const accentRing = isRosa ? 'ring-pink-400' : 'ring-indigo-400';
  const checkedBg = isRosa ? 'bg-pink-500' : 'bg-indigo-500';
  const progressBar = isRosa ? 'bg-pink-400' : 'bg-indigo-400';
  const cardBg = isRosa ? 'bg-white border-pink-100' : 'bg-white border-gray-100';
  const nextItemGlow = isRosa
    ? 'ring-2 ring-pink-300 bg-pink-50'
    : 'ring-2 ring-indigo-200 bg-indigo-50';

  function addTask() {
    const label = newLabel.trim();
    if (!label) return;
    const id = Date.now().toString();
    updateTasks([...tasks, { id, label }]);
    setNewLabel('');
  }

  function deleteTask(id) {
    updateTasks(tasks.filter((t) => t.id !== id));
  }

  function commitRename(id) {
    const label = editingLabel.trim();
    if (label) updateTasks(tasks.map((t) => t.id === id ? { ...t, label } : t));
    setEditingId(null);
    setEditingLabel('');
  }

  function moveUp(idx) {
    if (idx === 0) return;
    const t = [...tasks]; [t[idx - 1], t[idx]] = [t[idx], t[idx - 1]]; updateTasks(t);
  }
  function moveDown(idx) {
    if (idx === tasks.length - 1) return;
    const t = [...tasks]; [t[idx], t[idx + 1]] = [t[idx + 1], t[idx]]; updateTasks(t);
  }

  return (
    <div className="space-y-4">

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-500">
            <span>{completedCount} von {totalCount} erledigt</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${progressBar}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Motivation banner */}
      {totalCount > 0 && (
        <MotivationBanner completed={completedCount} total={totalCount} seed={completedCount} />
      )}

      {/* Task list */}
      <div className="space-y-2">
        {tasks.length === 0 && !editMode && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">Noch keine Aufgaben vorhanden.</p>
            <p className="text-gray-300 text-xs mt-1">Tippe auf „Bearbeiten" um zu starten.</p>
          </div>
        )}

        {tasks.map((task, idx) => {
          const checked = isChecked(task.id);
          const skipped = isSkipped(task.id);
          const isNext = task.id === nextUncheckedId;
          const locked = !checked && !skipped && !isNext;

          return (
            <div
              key={task.id}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200
                ${cardBg}
                ${isNext && !editMode ? nextItemGlow : ''}
                ${checked ? 'opacity-55' : ''}
                ${skipped && !editMode ? 'opacity-40' : ''}
                ${locked && !editMode ? 'opacity-35' : ''}
              `}
            >
              {/* Skip button */}
              {!editMode && (
                <button
                  onClick={() => skipTask(type, task.id)}
                  disabled={checked || skipped}
                  className={`flex-shrink-0 p-1 transition-colors ${checked || skipped ? 'text-gray-200 cursor-not-allowed' : `${accentText} hover:opacity-70`}`}
                  title="Aufgabe überspringen"
                >
                  <SkipIcon />
                </button>
              )}

              {/* Checkbox */}
              {!editMode && (
                <button
                  onClick={() => !locked && checkTask(type, task.id)}
                  disabled={locked || checked || skipped}
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    transition-all duration-200
                    ${checked
                      ? `${checkedBg} border-transparent text-white`
                      : skipped
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : locked
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          : `border-current ${accentText} hover:scale-110 active:scale-95 cursor-pointer`
                    }
                  `}
                >
                  {checked && <CheckIcon />}
                  {!checked && isNext && (
                    <span className={`w-2.5 h-2.5 rounded-full ${isRosa ? 'bg-pink-400' : 'bg-indigo-400'}`} />
                  )}
                </button>
              )}

              {/* Order number */}
              <span className={`text-xs font-mono w-5 text-center flex-shrink-0 ${checked ? 'text-gray-300' : 'text-gray-400'}`}>
                {idx + 1}
              </span>

              {/* Label */}
              {editMode && editingId === task.id ? (
                <input
                  autoFocus
                  value={editingLabel}
                  onChange={(e) => setEditingLabel(e.target.value)}
                  onBlur={() => commitRename(task.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename(task.id);
                    if (e.key === 'Escape') { setEditingId(null); setEditingLabel(''); }
                  }}
                  className={`flex-1 text-sm font-medium bg-transparent border-b-2 ${accentBorder} focus:outline-none text-gray-700`}
                />
              ) : (
                <span
                  className={`flex-1 text-sm font-medium ${checked ? 'line-through text-gray-400' : skipped ? 'text-gray-400' : 'text-gray-700'} ${editMode ? 'cursor-text' : ''}`}
                  onClick={() => {
                    if (editMode) { setEditingId(task.id); setEditingLabel(task.label); }
                  }}
                >
                  {task.label}
                </span>
              )}

              {/* Edit controls */}
              {editMode && (
                <div className="flex items-center gap-1">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20">
                    ▲
                  </button>
                  <button onClick={() => moveDown(idx)} disabled={idx === tasks.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20">
                    ▼
                  </button>
                  <button onClick={() => deleteTask(task.id)}
                    className="p-1 text-red-400 hover:text-red-600 ml-1">
                    <TrashIcon />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add task input (edit mode) */}
      {editMode && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Neue Aufgabe hinzufügen…"
            className={`flex-1 px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 ${accentRing} border-gray-200`}
          />
          <button
            onClick={addTask}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl ${accentBg} ${accentHover} transition-colors`}
          >
            +
          </button>
        </div>
      )}

      {/* Undo */}
      {!editMode && checkedIds.length > 0 && (
        <button
          onClick={() => uncheckLast(type)}
          className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
        >
          Letzten Schritt rückgängig
        </button>
      )}

      {/* Edit / Done button */}
      <button
        onClick={() => { setEditMode(!editMode); setEditingId(null); setEditingLabel(''); }}
        className={`w-full py-2 text-sm font-medium rounded-xl border transition-all
          ${editMode
            ? `${accentBg} ${accentHover} text-white border-transparent`
            : `border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50`
          }
        `}
      >
        {editMode ? '✓ Fertig' : 'Bearbeiten'}
      </button>
    </div>
  );
}
