import { create } from "zustand";
import { useEffect } from "react";

export type Task = {
  id: string;
  text: string;
  done: boolean;
  goalId: string;
  date: string; // ISO строка
};

type TaskStore = {
  tasksByGoal: Record<string, Task[]>;
  addTask: (task: Task) => void;
  toggleTask: (goalId: string, taskId: string) => void;
  setTasks: (goalId: string, tasks: Task[]) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasksByGoal: {},

  addTask: (task) =>
    set((state) => ({
      tasksByGoal: {
        ...state.tasksByGoal,
        [task.goalId]: [...(state.tasksByGoal[task.goalId] || []), task],
      },
    })),

  toggleTask: (goalId, taskId) =>
    set((state) => ({
      tasksByGoal: {
        ...state.tasksByGoal,
        [goalId]: state.tasksByGoal[goalId].map((t) =>
          t.id === taskId ? { ...t, done: !t.done } : t
        ),
      },
    })),

  setTasks: (goalId, tasks) =>
    set((state) => ({
      tasksByGoal: {
        ...state.tasksByGoal,
        [goalId]: tasks,
      },
    })),
}));

export const useStorageSync = () => {
  const tasksByGoal = useTaskStore((s) => s.tasksByGoal);
  const setTasks = useTaskStore((s) => s.setTasks);
  const STORAGE_KEY = "clearpath-tasks";

  // Загрузка при старте
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          Object.entries(parsed).forEach(([goalId, tasks]) => {
            setTasks(goalId, tasks as Task[]);
          });
        }
      }
    } catch (e) {
      console.error("Ошибка чтения задач из localStorage", e);
    }
  }, []);

  // Сохранение при изменениях
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksByGoal));
    } catch (e) {
      console.error("Ошибка сохранения задач в localStorage", e);
    }
  }, [tasksByGoal]);
};
