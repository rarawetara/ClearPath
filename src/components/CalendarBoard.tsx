import { useTaskStore } from "../store/useTaskStore";

const getWeekDates = (): Date[] => {
  const start = new Date();
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // понедельник
  const monday = new Date(start.setDate(diff));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

export default function CalendarBoard() {
  const tasksByGoal = useTaskStore((s) => s.tasksByGoal);
  const allTasks = Object.values(tasksByGoal).flat();
  const week = getWeekDates();

  const formatDate = (date: Date) =>
    date.toISOString().split("T")[0]; // YYYY-MM-DD

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">📆 Календарь (неделя)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {week.map((day) => {
          const key = formatDate(day);
          const tasks = allTasks.filter((t) =>
            t.date.startsWith(key)
          );

          return (
            <div key={key} className="border rounded p-2 bg-white shadow-sm">
              <div className="text-sm font-semibold mb-2">
                {day.toLocaleDateString("ru-RU", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
              {tasks.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {tasks.map((task) => (
                    <li key={task.id} className={task.done ? "line-through text-gray-400" : ""}>
                      {task.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-gray-400">Нет задач</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}