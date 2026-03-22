import { useEffect, useState } from 'react';

interface AnalyticsPanelProps {
  conversationId: string;
}

interface ConversationStats {
  totalMessages: number;
  avgResponseTime: number;
  intentsDetected: number;
  emotionalJourney: string[];
  pathsExplored: number;
  completionPercentage: number;
}

export function AnalyticsPanel({ conversationId }: AnalyticsPanelProps) {
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch from an analytics endpoint
    // For now, we'll calculate from local state or mock data
    setLoading(true);
    
    // Mock analytics - in production, this would come from the backend
    setTimeout(() => {
      setStats({
        totalMessages: Math.floor(Math.random() * 10) + 5,
        avgResponseTime: Math.floor(Math.random() * 2000) + 500,
        intentsDetected: Math.floor(Math.random() * 5) + 2,
        emotionalJourney: ['neutral', 'concerned', 'empathetic', 'confident', 'grateful'],
        pathsExplored: Math.floor(Math.random() * 3) + 1,
        completionPercentage: Math.floor(Math.random() * 40) + 60
      });
      setLoading(false);
    }, 500);
  }, [conversationId]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="font-semibold text-slate-800">Analytics</h3>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-slate-200"></div>
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200"></div>
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-slate-800">Session Analytics</h3>
      
      <div className="mt-4 space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-blue-50 p-3">
            <div className="text-2xl font-bold text-blue-600">{stats.totalMessages}</div>
            <div className="text-xs text-blue-700">Messages</div>
          </div>
          <div className="rounded-lg bg-green-50 p-3">
            <div className="text-2xl font-bold text-green-600">{stats.avgResponseTime}ms</div>
            <div className="text-xs text-green-700">Avg Response</div>
          </div>
        </div>

        {/* Intent Detection */}
        <div className="rounded-lg bg-purple-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-purple-900">Intents Detected</span>
            <span className="text-lg font-bold text-purple-600">{stats.intentsDetected}</span>
          </div>
          <div className="text-xs text-purple-700">
            AI successfully identified conversation intents
          </div>
        </div>

        {/* Emotional Journey */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-2">Emotional Journey</h4>
          <div className="flex flex-wrap gap-1">
            {stats.emotionalJourney.map((emotion, idx) => (
              <span
                key={idx}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-700"
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Scenario Progress</span>
            <span className="text-sm font-bold text-slate-900">{stats.completionPercentage}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${stats.completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Paths Explored */}
        <div className="rounded-lg bg-amber-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-900">Paths Explored</span>
            <span className="text-lg font-bold text-amber-600">{stats.pathsExplored}</span>
          </div>
          <div className="mt-1 text-xs text-amber-700">
            Different conversation branches tried
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 rounded-lg bg-slate-50 p-3">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
          💡 Pro Tip
        </h4>
        <p className="text-xs text-slate-600">
          Try expressing different emotions and intents to explore all conversation paths. The AI adapts to your communication style!
        </p>
      </div>
    </div>
  );
}
