import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { fetchScenarios } from "../lib/api";
import { useConversation } from "../hooks/useConversation";
import { GraphViewer } from "./GraphViewer";
import { CoachingPanel } from "./CoachingPanel";
import { AnalyticsPanel } from "./AnalyticsPanel";
export function ChatContainer() {
    const [input, setInput] = useState("");
    const [scenarios, setScenarios] = useState([]);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [lastFeedback, setLastFeedback] = useState(null);
    const convo = useConversation();
    const messagesEndRef = useRef(null);
    useEffect(() => {
        fetchScenarios().then(setScenarios);
    }, []);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [convo.messages]);
    // Update feedback when new messages arrive
    useEffect(() => {
        if (convo.lastCoachingFeedback) {
            setLastFeedback(convo.lastCoachingFeedback);
        }
    }, [convo.messages.length, convo.lastCoachingFeedback]);
    const getAvatarForRole = (role, personaId) => {
        const avatars = {
            customer: "👤",
            manager: "👔",
            agent: "🎧",
            employee: "💼",
            sales_rep: "💼",
            executive: "👨‍💼",
        };
        return avatars[role] || "🤖";
    };
    const getEmotionColor = (emotion) => {
        const colors = {
            neutral: "bg-slate-100",
            happy: "bg-green-100",
            concerned: "bg-yellow-100",
            frustrated: "bg-red-100",
            empathetic: "bg-purple-100",
            confident: "bg-blue-100",
            uncertain: "bg-gray-200",
            grateful: "bg-pink-100",
            disappointed: "bg-orange-100",
            hopeful: "bg-teal-100",
            angry: "bg-red-200",
            skeptical: "bg-yellow-200",
            annoyed: "bg-orange-200",
        };
        return emotion ? colors[emotion] || "bg-slate-100" : "bg-slate-100";
    };
    const getEmotionIcon = (emotion) => {
        const icons = {
            neutral: "😐",
            happy: "😊",
            concerned: "😟",
            frustrated: "😤",
            empathetic: "🤗",
            confident: "😎",
            uncertain: "🤔",
            grateful: "🙏",
            disappointed: "😞",
            hopeful: "🌟",
            angry: "😠",
            skeptical: "🤨",
            annoyed: "😒",
        };
        return emotion ? icons[emotion] || "" : "";
    };
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };
    const getUserRoleDisplay = (scenarioId) => {
        if (!scenarioId)
            return null;
        const scenario = scenarios.find((s) => s.id === scenarioId);
        if (scenario?.userRole) {
            return scenario.userRole;
        }
        return null;
    };
    const userRole = getUserRoleDisplay(convo.scenarioId);
    return (_jsxs("div", { className: "mx-auto grid max-w-7xl gap-4 p-6 lg:grid-cols-12", children: [_jsxs("div", { className: "lg:col-span-3 space-y-4", children: [_jsxs("div", { className: "rounded-xl border bg-white p-4 shadow-sm", children: [_jsx("h2", { className: "font-semibold text-slate-800 mb-3", children: "Training Scenarios" }), _jsxs("select", { className: "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200", onChange: (event) => convo.begin(event.target.value), defaultValue: "", children: [_jsx("option", { value: "", disabled: true, children: "Select a scenario..." }), scenarios.map((scenario) => (_jsx("option", { value: scenario.id, children: scenario.name }, scenario.id)))] }), convo.conversationId && (_jsxs("div", { className: "mt-4 space-y-3", children: [userRole && (_jsxs("div", { className: "rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-3 text-white", children: [_jsx("div", { className: "text-xs opacity-80 uppercase tracking-wide", children: "Your Role" }), _jsx("div", { className: "text-lg font-bold", children: userRole.name }), _jsx("div", { className: "mt-2 text-xs opacity-90", children: userRole.objectives?.[0] })] })), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors", onClick: () => setShowAnalytics(!showAnalytics), children: showAnalytics ? "Hide Analytics" : "View Analytics" }), _jsx("button", { className: "flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors", onClick: () => {
                                                    if (scenarios.length > 0) {
                                                        convo.begin(scenarios[0].id);
                                                    }
                                                }, children: "Restart" })] }), convo.scenarioId && (_jsxs("div", { className: "rounded-lg bg-slate-50 p-3", children: [_jsx("div", { className: "text-xs font-medium text-slate-500 uppercase tracking-wide", children: "Current Scenario" }), _jsx("div", { className: "mt-1 text-sm font-semibold text-slate-800", children: scenarios.find((s) => s.id === convo.scenarioId)?.name ||
                                                    "Loading..." }), _jsxs("div", { className: "mt-2 flex items-center gap-2 text-xs text-slate-600", children: [_jsx("span", { className: "inline-block w-2 h-2 rounded-full bg-green-500" }), convo.messages.length, " messages"] })] }))] }))] }), convo.conversationId && lastFeedback && (_jsx(CoachingPanel, { feedback: lastFeedback, onClear: () => setLastFeedback(null) })), showAnalytics && convo.conversationId && (_jsx(AnalyticsPanel, { conversationId: convo.conversationId }))] }), _jsx("div", { className: "lg:col-span-6", children: _jsxs("div", { className: "rounded-xl border bg-white shadow-sm overflow-hidden", children: [_jsx("div", { className: "border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-slate-800", children: userRole ? `${userRole.name} Training` : "Conversation" }), _jsx("p", { className: "text-xs text-slate-600", children: convo.conversationId
                                                    ? userRole
                                                        ? "Practice with AI customer/prospect"
                                                        : "Active session"
                                                    : "Select a scenario to begin" })] }), convo.loading && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-blue-600", children: [_jsxs("div", { className: "flex gap-1", children: [_jsx("span", { className: "w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce", style: { animationDelay: "0ms" } }), _jsx("span", { className: "w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce", style: { animationDelay: "150ms" } }), _jsx("span", { className: "w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce", style: { animationDelay: "300ms" } })] }), _jsx("span", { children: "Typing..." })] }))] }) }), _jsx("div", { className: "h-[500px] space-y-4 overflow-y-auto bg-gradient-to-b from-slate-50 to-white p-4", children: convo.messages.length === 0 ? (_jsx("div", { className: "flex h-full items-center justify-center text-center", children: _jsxs("div", { children: [_jsx("div", { className: "text-4xl mb-3", children: "\uD83D\uDC4B" }), _jsxs("h4", { className: "font-medium text-slate-700", children: ["Welcome, ", userRole?.name || "Trainee", "!"] }), _jsx("p", { className: "mt-1 text-sm text-slate-500 max-w-xs", children: userRole
                                                ? `You'll be playing the role of ${userRole.name}. The AI will act as the customer/prospect/employee. Practice your skills!`
                                                : "Select a training scenario from the left to start your conversation practice." }), userRole && (_jsxs("div", { className: "mt-4 text-xs text-blue-600 bg-blue-50 rounded-lg p-3 max-w-sm", children: [_jsx("strong", { children: "\uD83D\uDCA1 Tip:" }), " ", userRole.objectives?.join(". ")] }))] }) })) : (_jsxs(_Fragment, { children: [convo.messages.map((message, idx) => (_jsx("div", { className: `flex ${message.role === "user" ? "justify-end" : "justify-start"}`, children: _jsxs("div", { className: `flex max-w-[85%] gap-2 ${message.role === "user"
                                                ? "flex-row-reverse"
                                                : "flex-row"}`, children: [_jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm border border-slate-200", children: message.role === "user"
                                                        ? "👤"
                                                        : getAvatarForRole(message.role) }), _jsxs("div", { children: [_jsxs("div", { className: `rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.role === "user"
                                                                ? "bg-blue-600 text-white rounded-br-md"
                                                                : `bg-white text-slate-900 border border-slate-200 rounded-bl-md ${getEmotionColor(message.emotion)}`}`, children: [message.emotion && message.role === "bot" && (_jsxs("div", { className: "mb-1 flex items-center gap-1 text-xs opacity-75", children: [_jsx("span", { children: getEmotionIcon(message.emotion) }), _jsx("span", { className: "capitalize", children: message.emotion })] })), _jsx("div", { className: "whitespace-pre-wrap", children: message.content })] }), _jsx("div", { className: `mt-1 text-xs text-slate-400 ${message.role === "user" ? "text-right" : "text-left"}`, children: formatTime(message.timestamp) })] })] }) }, `${message.role}-${idx}`))), _jsx("div", { ref: messagesEndRef })] })) }), _jsxs("div", { className: "border-t bg-white p-4", children: [convo.options.length > 0 && (_jsx("div", { className: "mb-3 flex flex-wrap gap-2", children: convo.options.map((option, idx) => (_jsx("button", { className: "rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors", onClick: () => {
                                            void convo.send(option);
                                        }, disabled: convo.loading, children: option }, idx))) })), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: input, onChange: (event) => setInput(event.target.value), onKeyPress: (e) => {
                                                if (e.key === "Enter" && input.trim() && !convo.loading) {
                                                    void convo.send(input);
                                                    setInput("");
                                                }
                                            }, className: "flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100", placeholder: userRole
                                                ? `Respond as ${userRole.name}...`
                                                : "Type your response...", disabled: !convo.conversationId || convo.loading }), _jsx("button", { className: "rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", onClick: () => {
                                                if (input.trim()) {
                                                    void convo.send(input);
                                                    setInput("");
                                                }
                                            }, disabled: !convo.conversationId || !input || convo.loading, children: "Send" })] }), _jsx("div", { className: "mt-2 text-center text-xs text-slate-400", children: "Press Enter to send \u2022 Choose quick replies or type naturally" })] })] }) }), _jsx("div", { className: "lg:col-span-3", children: _jsx(GraphViewer, { scenarioId: convo.scenarioId, highlightedNodeId: convo.currentNodeId, visitedNodes: convo.visitedNodes }) })] }));
}
