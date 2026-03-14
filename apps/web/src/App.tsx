import { ChatContainer } from './components/ChatContainer';

export default function App() {
  return (
    <main>
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <h1 className="text-xl font-semibold">Graph-Based Corporate Conversation Trainer</h1>
          <p className="text-sm text-slate-600">Deterministic, auditable, offline training conversations.</p>
        </div>
      </header>
      <ChatContainer />
    </main>
  );
}
