"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOut } from "aws-amplify/auth";

interface Task {
  id: string;
  text: string;
  createdAt: number;
}

export default function TodoPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { username } = await getCurrentUser();
        setUser(username);
        const storedTasks = localStorage.getItem("taskflow_tasks");
        if (storedTasks) setTasks(JSON.parse(storedTasks));
      } catch {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  const saveTasks = (updated: Task[]) => {
    setTasks(updated);
    // TODO: Replace localStorage with DynamoDB API call once AWS is set up
    localStorage.setItem("taskflow_tasks", JSON.stringify(updated));
  };

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: trimmed,
      createdAt: Date.now(),
    };
    saveTasks([newTask, ...tasks]);
    setInput("");
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTask();
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Sticky Navbar */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-lg font-bold text-gray-900">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden sm:block truncate max-w-45">
            {user}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {tasks.length === 0
              ? "No tasks yet — add one below!"
              : `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Add Task */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task…"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400 bg-white shadow-sm"
          />
          <button
            onClick={addTask}
            disabled={!input.trim()}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-lg font-medium text-gray-500">
                Your task list is empty
              </p>
              <p className="text-sm mt-1">
                Add your first task above to get started
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                <span className="flex-1 text-gray-800 text-sm">{task.text}</span>
                <button
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete task"
                  className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
