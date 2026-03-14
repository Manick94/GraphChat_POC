import { useEffect, useState } from 'react';
import { fetchScenarios } from '../lib/api';
import { useConversation } from '../hooks/useConversation';
import { GraphViewer } from './GraphViewer';

export function ChatContainer() {
  const [input, setInput] = useState('');
  const [scenarios, setScenarios] = useState<any[]>([]);
  const convo = useConversation();

  useEffect(() => {
    fetchScenarios().then(setScenarios);
  }, []);

  return (
    <div className="mx-auto grid max-w-6xl gap-4 p-6 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-3 flex gap-2">
          <select
            className="rounded-md border px-3 py-2"
            onChange={(event) => convo.begin(event.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select training scenario
            </option>
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
        </div>

        <div className="h-[450px] space-y-3 overflow-auto rounded-md bg-slate-50 p-3">
          {convo.messages.map((message, idx) => (
            <div key={`${message.role}-${idx}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                  message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-900'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="flex-1 rounded-md border px-3 py-2"
            placeholder="Type your response..."
          />
          <button
            className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
            onClick={() => {
              void convo.send(input);
              setInput('');
            }}
            disabled={!convo.conversationId || !input || convo.loading}
          >
            Send
          </button>
        </div>

        {convo.options.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {convo.options.map((option) => (
              <button
                key={option}
                className="rounded-full border px-3 py-1 text-xs"
                onClick={() => {
                  void convo.send(option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <GraphViewer scenarioId={convo.scenarioId} />
    </div>
  );
}
