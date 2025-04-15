import { useTaskStore } from "../store/useTaskStore";

const MOTIVATION = [
  "Ты двигаешься. Даже по чуть-чуть — это уже движение.",
  "Сделай одну вещь сегодня. Потом станет легче.",
  "Ничего страшного, если было сложно. Главное — не стоять.",
  "Твоя энергия не пропала. Она просто ждёт конкретики.",
];

const getToday = () => new Date().toISOString().split("T")[0];

export default function CoachOverview() {
  const tasksByGoal = useTaskStore((s) => s.tasksByGoal);
  const allTasks = Object.values(tasksByGoal).flat();
  const today = getToday();
  const motivation = MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)];

  const goalStats = Object.entries(tasksByGoal).map(([goalId, tasks]) => {
    const done = tasks.filter((t) => t.done).length;
    const progress =
      tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
    return { goalId, progress };
  });

  const tasksToday = allTasks.filter((t) => t.date.startsWith(today));

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">🧠 Обзор от коуча</h2>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          🎯 Прогресс по целям:
        </h3>
        <ul className="space-y-1 text-sm">
          {goalStats.map(({ goalId, progress }) => (
            <li key={goalId}>
              {goalId}:{" "}
              {progress === 0
                ? "😴 застой"
                : progress === 100
                ? "✅ завершено"
                : `✍️ в процессе (${progress}%)`}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          📅 Задачи на сегодня:
        </h3>
        {tasksToday.length > 0 ? (
          <ul className="text-sm list-disc list-inside">
            {tasksToday.map((task) => (
              <li key={task.id}>{task.text} ({task.goalId})</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Нет задач на сегодня</p>
        )}
      </div>

      <div className="text-sm italic text-gray-700">
        💬 {motivation}
      </div>
    </div>
  );
}