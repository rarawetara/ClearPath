import { useState } from "react";
import PromptForm from "./components/PromptForm";
import GoalBoard from "./components/GoalBoard";
import TaskBoard from "./components/TaskBoard";
import CalendarBoard from "./components/CalendarBoard";
import CoachOverview from "./components/CoachOverview";
interface Message {
  from: "user" | "coach";
  text: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "goals" | "tasks" | "calendar" | "overview">("chat");

  const handlePrompt = async (text: string) => {
    setMessages((prev) => [...prev, { from: "user", text }]);
    setLoading(true);

    const fakeResponse = `Окей. Сфокусируйся на одном действии. Сделай шаг, потом думай дальше.`;
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "coach", text: fakeResponse }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 max-w-xl mx-auto min-h-screen flex flex-col">
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-3 py-1 rounded text-sm ${
            activeTab === "chat" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          💬 Коуч
        </button>
        <button
          onClick={() => setActiveTab("goals")}
          className={`px-3 py-1 rounded text-sm ${
            activeTab === "goals" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          🎯 Цели
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-3 py-1 rounded text-sm ${
            activeTab === "tasks" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          📋 Задачи
        </button>
        <button
  onClick={() => setActiveTab("calendar")}
  className={`px-3 py-1 rounded text-sm ${
    activeTab === "calendar" ? "bg-black text-white" : "bg-gray-200"
  }`}
>
  📆 Календарь
</button>
<button
  onClick={() => setActiveTab("overview")}
  className={`px-3 py-1 rounded text-sm ${
    activeTab === "overview" ? "bg-black text-white" : "bg-gray-200"
  }`}
>
  🧠 Обзор
</button>
      </div>

      {activeTab === "chat" && (
        <>
          <div className="flex-1 overflow-auto space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] whitespace-pre-line text-sm ${
                  msg.from === "user"
                    ? "bg-gray-200 self-end ml-auto"
                    : "bg-black text-white self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-sm text-gray-500 italic">Коуч думает...</div>
            )}
          </div>
          <PromptForm onSubmit={handlePrompt} />
        </>
      )}
{activeTab === "calendar" && <CalendarBoard />}
      {activeTab === "goals" && <GoalBoard />}
      {activeTab === "tasks" && <TaskBoard />}
      {activeTab === "overview" && <CoachOverview />}
    </div>
  );
}
