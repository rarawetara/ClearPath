import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

export default function TaskBoard() {
  const tasksByGoal = useTaskStore((s) => s.tasksByGoal);
  const allTasks = Object.values(tasksByGoal).flat();
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter
    ? allTasks.filter((t) => t.goalId === filter)
    : allTasks;

  const uniqueGoals = Array.from(new Set(allTasks.map((t) => t.goalId)));

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">📋 Все задачи</h2>

      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1 rounded text-sm ${
            !filter ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Все
        </button>
        {uniqueGoals.map((goalId) => (
          <button
            key={goalId}
            onClick={() => setFilter(goalId)}
            className={`px-3 py-1 rounded text-sm ${
              filter === goalId ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {goalId}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filtered.map((task) => (
          <li
            key={task.id}
            className="p-2 border rounded text-sm flex justify-between items-center"
          >
            <div>
              <div className={task.done ? "line-through text-gray-400" : ""}>
                {task.text}
              </div>
              <div className="text-xs text-gray-500">
                🎯 {task.goalId} — 📅 {new Date(task.date).toLocaleDateString()}
              </div>
            </div>
            <div>{task.done ? "✅" : ""}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}