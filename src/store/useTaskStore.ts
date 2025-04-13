import { create } from "zustand";

export type Task = {
  id: string;
  text: string;
  done: boolean;
};

type TaskStore = {
  tasksByGoal: Record<string, Task[]>;
  addTask: (goalId: string, task: Task) => void;
  toggleTask: (goalId: string, taskId: string) => void;
  setTasks: (goalId: string, tasks: Task[]) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasksByGoal: {},

  addTask: (goalId, task) =>
    set((state) => ({
      tasksByGoal: {
        ...state.tasksByGoal,
        [goalId]: [...(state.tasksByGoal[goalId] || []), task],
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
