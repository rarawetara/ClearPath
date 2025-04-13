import React, { useState } from "react";
import { useTaskStore, Task } from "../store/useTaskStore";

interface GoalToDoProps {
  goalId: string;
}

export default function GoalToDo({ goalId }: GoalToDoProps) {
  const tasks = useTaskStore((s) => s.tasksByGoal[goalId] || []);
  const add = useTaskStore((s) => s.addTask);
  const toggle = useTaskStore((s) => s.toggleTask);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (!input.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: input.trim(),
      done: false,
      goalId: goalId,
      date: new Date().toISOString(),
    };
    add(newTask);
    setInput("");
  };

  const toggleTask = (id: string) => {
    toggle(goalId, id);
  };

  return (
    <div className="mt-3">
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Добавить задачу"
          className="flex-1 p-1 text-sm border rounded"
        />
        <button
          onClick={addTask}
          className="px-2 py-1 text-xs bg-black text-white rounded"
        >
          +
        </button>
      </div>

      <ul className="space-y-1 text-sm">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`flex items-center gap-2 ${
              task.done ? "line-through text-gray-400" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
            />
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
