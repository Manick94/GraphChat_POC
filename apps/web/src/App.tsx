import { ChatContainer } from "./components/ChatContainer";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GraphChat
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Advanced Conversational AI Training Platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-slate-700">
                  Enterprise Edition
                </div>
                <div className="text-xs text-slate-500">v2.0.0</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                GC
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span>Intent Recognition</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">😊</span>
              <span>Emotion Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👥</span>
              <span>Multi-Persona</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🕸️</span>
              <span>Visual Graph</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ChatContainer />

      {/* Footer */}
      <footer className="mt-8 border-t bg-white/50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
            <div>© 2024 GraphChat. Open-source conversational AI training.</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                API Reference
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
