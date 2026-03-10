import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-bold text-gray-900">TaskFlow</span>
        </div>
        <Link
          href="/login"
          className="px-5 py-2 text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
          ✨ Simple. Focused. Productive.
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Organize your tasks,
          <br />
          <span className="text-indigo-600">get things done.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          TaskFlow is a clean, minimal todo app that helps you stay focused and
          productive every single day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Get Started — it&apos;s free
          </Link>
          <a
            href="#features"
            className="px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            Learn More
          </a>
        </div>

        {/* App Preview Mock */}
        <div className="mt-20 max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="ml-4 text-xs text-gray-400 font-mono">
                taskflow / my-tasks
              </span>
            </div>
            <div className="text-left">
              <h3 className="text-base font-bold text-gray-800 mb-4">
                My Tasks
              </h3>
              {[
                { text: "Review project proposals", done: true },
                { text: "Schedule team meeting", done: true },
                { text: "Finish quarterly report", done: false },
                { text: "Update design mockups", done: false },
              ].map((task, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                      task.done
                        ? "bg-indigo-600"
                        : "border-2 border-gray-200"
                    }`}
                  >
                    {task.done && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      task.done
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything you need to stay organized
          </h2>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            Simple tools, powerful results. No bloat — just what matters.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Fast & Lightweight",
                desc: "Instantly add and delete tasks. No loading, no waiting.",
              },
              {
                icon: "🔒",
                title: "Secure Login",
                desc: "Powered by AWS Cognito. Your data is safe and private.",
              },
              {
                icon: "☁️",
                title: "Cloud Synced",
                desc: "Access your tasks from anywhere. Always in sync.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-colors"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">T</span>
          </div>
          <span className="text-white font-semibold">TaskFlow</span>
        </div>
        <p className="text-sm">© 2026 TaskFlow. Built with Next.js &amp; AWS.</p>
      </footer>
    </div>
  );
}
