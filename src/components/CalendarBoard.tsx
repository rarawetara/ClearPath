import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

const getMonthDates = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const startDate = new Date(year, month, 1 - startDay);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });
};

export default function CalendarBoard() {
  const tasksByGoal = useTaskStore((s) => s.tasksByGoal);
  const allTasks = Object.values(tasksByGoal).flat();
  const [current, setCurrent] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [taskText, setTaskText] = useState("");
  const [taskTime, setTaskTime] = useState("10:00");
  const add = useTaskStore((s) => s.addTask);

  const changeMonth = (offset: number) => {
    const next = new Date(current.year, current.month + offset);
    setCurrent({ year: next.getFullYear(), month: next.getMonth() });
  };

  const dates = getMonthDates(current.year, current.month);

  const formatDate = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate())
      .toLocaleDateString("sv-SE");
  const title = new Date(current.year, current.month).toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)}>◀️</button>
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={() => changeMonth(1)}>▶️</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-500 mb-2">
        {"Пн Вт Ср Чт Пт Сб Вс".split(" ").map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {dates.map((day) => {
          const key = formatDate(day);
          const tasks = allTasks.filter((t) => t.date.startsWith(key));
          const isToday = key === formatDate(new Date());

          return (
            <div
              key={key}
              onClick={() => setSelectedDate(key)}
              className={`border rounded p-1 min-h-[60px] bg-white ${isToday ? "border-black" : ""}`}
            >
              <div className="text-right font-semibold text-gray-700">
                {day.getDate()}
              </div>
              <ul className="space-y-0.5 mt-1">
                {tasks.slice(0, 3).map((task) => (
                  <li key={task.id} className="truncate">
                    • {task.text}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!taskText.trim()) return;
            const newTask = {
              id: Date.now().toString(),
              text: taskText,
              done: false,
              goalId: "unsorted",
              date: `${selectedDate}T${taskTime}`,
            };
            add(newTask);
            setTaskText("");
            setTaskTime("10:00");
            setSelectedDate(null);
          }}
          className="mt-6 border-t pt-4"
        >
          <h3 className="text-sm mb-2 font-semibold">Добавить задачу на {selectedDate}</h3>
          <div className="flex items-center gap-2">
            <input
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Текст задачи"
              className="border p-1 rounded text-sm flex-1"
            />
            <input
              type="time"
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
              className="border p-1 rounded text-sm w-[100px]"
            />
            <button
              type="submit"
              className="px-2 py-1 text-xs bg-black text-white rounded"
            >
              Добавить
            </button>
          </div>
        </form>
      )}
    </div>
  );
}