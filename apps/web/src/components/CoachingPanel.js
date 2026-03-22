import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function CoachingPanel({ feedback, onClear }) {
    const getScoreColor = (score) => {
        if (!score)
            return "text-slate-700";
        if (score > 0)
            return "text-green-600";
        if (score < 0)
            return "text-red-600";
        return "text-slate-700";
    };
    const getScoreIcon = (score) => {
        if (!score)
            return "💡";
        if (score > 0)
            return "✅";
        if (score < 0)
            return "⚠️";
        return "💡";
    };
    const getOutcomeColor = (outcome) => {
        if (!outcome)
            return "bg-slate-50";
        if (outcome.includes("upset"))
            return "bg-red-50 border-red-200";
        if (outcome.includes("satisfied"))
            return "bg-green-50 border-green-200";
        return "bg-blue-50 border-blue-200";
    };
    return (_jsxs("div", { className: "rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("h3", { className: "font-bold text-blue-900 flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: "\uD83C\uDFAF" }), "Real-Time Coaching"] }), _jsx("button", { onClick: onClear, className: "text-xs text-blue-600 hover:text-blue-800 transition-colors", children: "Dismiss" })] }), feedback.scoreChange !== undefined && feedback.scoreChange !== 0 && (_jsxs("div", { className: "mb-3 flex items-center gap-2", children: [_jsx("span", { className: "text-lg", children: getScoreIcon(feedback.scoreChange) }), _jsxs("span", { className: `text-sm font-bold ${getScoreColor(feedback.scoreChange)}`, children: [feedback.scoreChange > 0 ? "+" : "", feedback.scoreChange, " points"] }), _jsx("span", { className: "text-xs text-slate-600", children: feedback.scoreChange > 0
                            ? "Great response!"
                            : feedback.scoreChange < 0
                                ? "Consider a different approach"
                                : "Neutral response" })] })), _jsxs("div", { className: "mb-3 rounded-lg bg-white/80 backdrop-blur p-3 border border-blue-100", children: [_jsx("div", { className: "text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1", children: "\uD83D\uDCA1 Coaching Tip" }), _jsx("p", { className: "text-sm text-slate-700 leading-relaxed", children: feedback.tip })] }), feedback.expectedResponse && (_jsxs("div", { className: "mb-3 rounded-lg bg-blue-100/50 p-2 border border-blue-200", children: [_jsx("div", { className: "text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1", children: "\uD83C\uDFAF Try This Approach" }), _jsx("p", { className: "text-xs text-blue-800", children: feedback.expectedResponse })] })), feedback.outcome && (_jsxs("div", { className: `rounded-lg p-2 border ${getOutcomeColor(feedback.outcome)}`, children: [_jsx("div", { className: "text-xs font-semibold uppercase tracking-wide mb-1 opacity-75", children: "\uD83D\uDCCA Customer State" }), _jsx("p", { className: "text-xs text-slate-700", children: feedback.outcome })] })), _jsx("div", { className: "mt-3 text-center", children: _jsx("div", { className: "text-xs text-slate-500", children: "Your responses are being evaluated in real-time" }) })] }));
}
