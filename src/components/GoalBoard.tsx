import React from "react";
import GoalToDo from "./GoalToDo";
import { useTaskStore } from "../store/useTaskStore";

interface Goal {
  id: string;
  name: string;
  icon: string;
}

const goals: Goal[] = [
  { id: "react", name: "React", icon: "💻" },
  { id: "sport", name: "Спорт", icon: "💪" },
  { id: "blog", name: "Блог", icon: "📸" },
];

const statusLabels = {
  active: "🔥 активен",
  stuck: "😴 застой",
  writing: "✍️ пишется",
};

export default function GoalBoard() {
  const taskStore = useTaskStore();

  return (
    <div className="p-4 min-h-[200px]">
      <h2 className="text-lg font-semibold mb-4">🎯 Твои цели</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const tasks = taskStore.tasksByGoal[goal.id] || [];
          const done = tasks.filter((t) => t.done).length;
          const progress =
            tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

          const status =
            progress === 0
              ? "stuck"
              : progress === 100
              ? "active"
              : "writing";

          return (
            <div
              key={goal.id}
              className="p-4 rounded-xl border bg-white shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{goal.icon}</div>
                <div>
                  <div className="font-medium text-sm text-gray-600">
                    {goal.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {statusLabels[status]}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-400 italic">
                Статус обновляется автоматически на основе активности
              </div>

              <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                  className="h-2 rounded bg-black"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <GoalToDo goalId={goal.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
