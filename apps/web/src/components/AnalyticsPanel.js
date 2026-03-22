import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
export function AnalyticsPanel({ conversationId }) {
    const [stats, setStats] = useState(null);
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
        return (_jsxs("div", { className: "rounded-xl border bg-white p-4 shadow-sm", children: [_jsx("h3", { className: "font-semibold text-slate-800", children: "Analytics" }), _jsxs("div", { className: "mt-4 space-y-2", children: [_jsx("div", { className: "h-4 w-full animate-pulse rounded bg-slate-200" }), _jsx("div", { className: "h-4 w-3/4 animate-pulse rounded bg-slate-200" }), _jsx("div", { className: "h-4 w-5/6 animate-pulse rounded bg-slate-200" })] })] }));
    }
    if (!stats) {
        return null;
    }
    return (_jsxs("div", { className: "rounded-xl border bg-white p-4 shadow-sm", children: [_jsx("h3", { className: "font-semibold text-slate-800", children: "Session Analytics" }), _jsxs("div", { className: "mt-4 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "rounded-lg bg-blue-50 p-3", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: stats.totalMessages }), _jsx("div", { className: "text-xs text-blue-700", children: "Messages" })] }), _jsxs("div", { className: "rounded-lg bg-green-50 p-3", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [stats.avgResponseTime, "ms"] }), _jsx("div", { className: "text-xs text-green-700", children: "Avg Response" })] })] }), _jsxs("div", { className: "rounded-lg bg-purple-50 p-3", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-purple-900", children: "Intents Detected" }), _jsx("span", { className: "text-lg font-bold text-purple-600", children: stats.intentsDetected })] }), _jsx("div", { className: "text-xs text-purple-700", children: "AI successfully identified conversation intents" })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-slate-700 mb-2", children: "Emotional Journey" }), _jsx("div", { className: "flex flex-wrap gap-1", children: stats.emotionalJourney.map((emotion, idx) => (_jsx("span", { className: "rounded-full bg-slate-100 px-2 py-1 text-xs capitalize text-slate-700", children: emotion }, idx))) })] }), _jsxs("div", { children: [_jsxs("div", { className: "mb-1 flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-slate-700", children: "Scenario Progress" }), _jsxs("span", { className: "text-sm font-bold text-slate-900", children: [stats.completionPercentage, "%"] })] }), _jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-slate-200", children: _jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500", style: { width: `${stats.completionPercentage}%` } }) })] }), _jsxs("div", { className: "rounded-lg bg-amber-50 p-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium text-amber-900", children: "Paths Explored" }), _jsx("span", { className: "text-lg font-bold text-amber-600", children: stats.pathsExplored })] }), _jsx("div", { className: "mt-1 text-xs text-amber-700", children: "Different conversation branches tried" })] })] }), _jsxs("div", { className: "mt-4 rounded-lg bg-slate-50 p-3", children: [_jsx("h4", { className: "text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2", children: "\uD83D\uDCA1 Pro Tip" }), _jsx("p", { className: "text-xs text-slate-600", children: "Try expressing different emotions and intents to explore all conversation paths. The AI adapts to your communication style!" })] })] }));
}
