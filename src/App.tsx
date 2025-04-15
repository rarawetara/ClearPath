import { useState, useEffect } from "react";
import PromptForm from "./components/PromptForm";
import GoalBoard from "./components/GoalBoard";
import TaskBoard from "./components/TaskBoard";
import CalendarBoard from "./components/CalendarBoard";
import CoachOverview from "./components/CoachOverview";
import { useStorageSync, useTaskStore } from "./store/useTaskStore";
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error("❌ OpenAI API ключ не найден");
}
interface Message {
  from: "user" | "coach";
  text: string;
}

export default function App() {
  const [contextGoal, setContextGoal] = useState<{
    id: string;
    name: string;
  } | null>(null);
  useStorageSync();
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem("chatMessages");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "chat" | "goals" | "tasks" | "calendar" | "overview"
  >("chat");
  const addTask = useTaskStore((s) => s.addTask);

  const handlePrompt = async (text: string) => {
    setMessages((prev) => [...prev, { from: "user", text }]);

    if (text.toLowerCase().includes("цель:")) {
      const goalPart = text.split("цель:")[1].split("todo:")[0].trim();
      const foundGoal = [
        { id: "react", name: "React" },
        { id: "sport", name: "Спорт" },
        { id: "blog", name: "Блог" },
      ].find((g) => g.name.toLowerCase() === goalPart.toLowerCase());

      if (foundGoal) {
        setContextGoal({ id: foundGoal.id, name: foundGoal.name });
        setMessages((prev) => [
          ...prev,
          { from: "coach", text: `Цель зафиксирована: ${foundGoal.name}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "coach", text: `Цель "${goalPart}" не найдена.` },
        ]);
      }
    }

    if (text.toLowerCase().includes("todo:") && contextGoal) {
      const taskText = text.split("todo:")[1].trim();
      const newTask = {
        id: Date.now().toString(),
        text: taskText,
        done: false,
        date: new Date().toISOString().split("T")[0],
        goalId: contextGoal.id,
      };

      console.log("📌 Добавляю задачу:", newTask);

      addTask(newTask);

      setMessages((prev) => [
        ...prev,
        {
          from: "coach",
          text: `Задача добавлена в цель "${contextGoal.name}": ${taskText}`,
        },
      ]);
      return;
    }

    console.log("🧠 Контекст цели:", contextGoal);

    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "coach",
          text: "Готово! Я получил твой запрос, но GPT сейчас спит. Всё остальное работает 🔧",
        },
      ]);
    }, 500);

    // try {
    //   const res = await fetch("https://api.openai.com/v1/chat/completions", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${apiKey}`,
    //     },
    //     body: JSON.stringify({
    //       model: "gpt-3.5-turbo",
    //       messages: [
    //         {
    //           role: "system",
    //           content:
    //             "Ты коуч, который помогает человеку фокусироваться и действовать. Отвечай строго, но с заботой. Кратко и по делу.",
    //         },
    //         contextGoal ? { role: "user", content: `Текущая цель: ${contextGoal.name}` } : null,
    //         { role: "user", content: text },
    //       ].filter(Boolean),
    //     }),
    //   });

    //   const data = await res.json();
    //   const reply = data.choices?.[0]?.message?.content;

    //   if (reply) {
    //     setMessages((prev) => [...prev, { from: "coach", text: reply }]);
    //   } else {
    //     setMessages((prev) => [
    //       ...prev,
    //       { from: "coach", text: "Извини, я не смог ответить." },
    //     ]);
    //   }
    // } catch (err) {
    //   console.error("Ошибка GPT:", err);
    //   setMessages((prev) => [
    //     ...prev,
    //     { from: "coach", text: "Что-то пошло не так, попробуй позже." },
    //   ]);
    // } finally {
    setLoading(false);
    // }
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

      {contextGoal && (
        <div className="text-xs text-center text-gray-500 mb-2">
          🎯 Текущая цель:{" "}
          <span className="font-medium">{contextGoal.name}</span>
        </div>
      )}

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
