export interface CoachingFeedback {
  tip: string;
  expectedResponse?: string;
  scoreChange?: number;
  outcome?: string;
}

interface CoachingPanelProps {
  feedback: CoachingFeedback;
  onClear: () => void;
}

export function CoachingPanel({ feedback, onClear }: CoachingPanelProps) {
  const getScoreColor = (score?: number) => {
    if (!score) return "text-slate-700";
    if (score > 0) return "text-green-600";
    if (score < 0) return "text-red-600";
    return "text-slate-700";
  };

  const getScoreIcon = (score?: number) => {
    if (!score) return "💡";
    if (score > 0) return "✅";
    if (score < 0) return "⚠️";
    return "💡";
  };

  const getOutcomeColor = (outcome?: string) => {
    if (!outcome) return "bg-slate-50";
    if (outcome.includes("upset")) return "bg-red-50 border-red-200";
    if (outcome.includes("satisfied")) return "bg-green-50 border-green-200";
    return "bg-blue-50 border-blue-200";
  };

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-blue-900 flex items-center gap-2">
          <span className="text-xl">🎯</span>
          Real-Time Coaching
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
        >
          Dismiss
        </button>
      </div>

      {/* Score Change */}
      {feedback.scoreChange !== undefined && feedback.scoreChange !== 0 && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg">{getScoreIcon(feedback.scoreChange)}</span>
          <span
            className={`text-sm font-bold ${getScoreColor(feedback.scoreChange)}`}
          >
            {feedback.scoreChange > 0 ? "+" : ""}
            {feedback.scoreChange} points
          </span>
          <span className="text-xs text-slate-600">
            {feedback.scoreChange > 0
              ? "Great response!"
              : feedback.scoreChange < 0
                ? "Consider a different approach"
                : "Neutral response"}
          </span>
        </div>
      )}

      {/* Coaching Tip */}
      <div className="mb-3 rounded-lg bg-white/80 backdrop-blur p-3 border border-blue-100">
        <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
          💡 Coaching Tip
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{feedback.tip}</p>
      </div>

      {/* Expected Response */}
      {feedback.expectedResponse && (
        <div className="mb-3 rounded-lg bg-blue-100/50 p-2 border border-blue-200">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
            🎯 Try This Approach
          </div>
          <p className="text-xs text-blue-800">{feedback.expectedResponse}</p>
        </div>
      )}

      {/* Outcome Indicator */}
      {feedback.outcome && (
        <div
          className={`rounded-lg p-2 border ${getOutcomeColor(feedback.outcome)}`}
        >
          <div className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-75">
            📊 Customer State
          </div>
          <p className="text-xs text-slate-700">{feedback.outcome}</p>
        </div>
      )}

      {/* Progress Hint */}
      <div className="mt-3 text-center">
        <div className="text-xs text-slate-500">
          Your responses are being evaluated in real-time
        </div>
      </div>
    </div>
  );
}
