import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getSettings, saveSettings,
  getRoutineTasks, setRoutineTasks,
  getDailyProgress, setDailyProgress,
  saveHistoryEntry,
} from '../utils/cookies';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [settings, setSettingsState] = useState(() => getSettings());
  const [morningTasks, setMorningTasksState] = useState(() => getRoutineTasks('morning'));
  const [eveningTasks, setEveningTasksState] = useState(() => getRoutineTasks('evening'));
  const [dailyProgress, setDailyProgressState] = useState(() => getDailyProgress());

  // Persist settings
  const updateSettings = useCallback((patch) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  // Persist morning tasks
  const updateMorningTasks = useCallback((tasks) => {
    setMorningTasksState(tasks);
    setRoutineTasks('morning', tasks);
  }, []);

  // Persist evening tasks
  const updateEveningTasks = useCallback((tasks) => {
    setEveningTasksState(tasks);
    setRoutineTasks('evening', tasks);
  }, []);

  // Check-off a task (sequential: only the next unchecked can be checked)
  const checkTask = useCallback((type, taskId) => {
    const tasks = type === 'morning' ? morningTasks : eveningTasks;
    const progress = dailyProgress;
    const checked = progress[type] || [];

    // Find the next unchecked task in order
    const nextUnchecked = tasks.find((t) => !checked.includes(t.id));
    if (!nextUnchecked || nextUnchecked.id !== taskId) return; // not the next one

    const newChecked = [...checked, taskId];
    const newProgress = { ...progress, [type]: newChecked };
    setDailyProgressState(newProgress);
    setDailyProgress(newProgress);

    // Save to history
    const morningChecked = type === 'morning' ? newChecked : progress.morning || [];
    const eveningChecked = type === 'evening' ? newChecked : progress.evening || [];
    saveHistoryEntry({
      morningCompleted: morningChecked.length,
      morningTotal: morningTasks.length,
      eveningCompleted: eveningChecked.length,
      eveningTotal: eveningTasks.length,
    });
  }, [morningTasks, eveningTasks, dailyProgress]);

  // Uncheck last checked (undo last)
  const uncheckLast = useCallback((type) => {
    const progress = dailyProgress;
    const checked = [...(progress[type] || [])];
    if (checked.length === 0) return;
    checked.pop();
    const newProgress = { ...progress, [type]: checked };
    setDailyProgressState(newProgress);
    setDailyProgress(newProgress);
  }, [dailyProgress]);

  const theme = settings.theme;

  return (
    <AppContext.Provider value={{
      settings, updateSettings,
      morningTasks, updateMorningTasks,
      eveningTasks, updateEveningTasks,
      dailyProgress,
      checkTask, uncheckLast,
      theme,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
