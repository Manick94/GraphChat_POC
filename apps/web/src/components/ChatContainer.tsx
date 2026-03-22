import { useEffect, useState, useRef } from "react";
import { fetchScenarios } from "../lib/api";
import { useConversation } from "../hooks/useConversation";
import { GraphViewer } from "./GraphViewer";
import { CoachingPanel, CoachingFeedback } from "./CoachingPanel";
import { AnalyticsPanel } from "./AnalyticsPanel";

interface Message {
  role: "user" | "bot";
  content: string;
  emotion?: string;
  personaName?: string;
  avatar?: string;
  timestamp: Date;
}

export function ChatContainer() {
  const [input, setInput] = useState("");
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<CoachingFeedback | null>(
    null,
  );
  const convo = useConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const getAvatarForRole = (role: string, personaId?: string) => {
    const avatars: Record<string, string> = {
      customer: "👤",
      manager: "👔",
      agent: "🎧",
      employee: "💼",
      sales_rep: "💼",
      executive: "👨‍💼",
    };
    return avatars[role] || "🤖";
  };

  const getEmotionColor = (emotion?: string) => {
    const colors: Record<string, string> = {
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

  const getEmotionIcon = (emotion?: string) => {
    const icons: Record<string, string> = {
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getUserRoleDisplay = (scenarioId: string | null) => {
    if (!scenarioId) return null;
    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (scenario?.userRole) {
      return scenario.userRole;
    }
    return null;
  };

  const userRole = getUserRoleDisplay(convo.scenarioId);

  return (
    <div className="mx-auto grid max-w-7xl gap-4 p-6 lg:grid-cols-12">
      {/* Left Sidebar - Scenario Selection & Coaching */}
      <div className="lg:col-span-3 space-y-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-slate-800 mb-3">
            Training Scenarios
          </h2>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            onChange={(event) => convo.begin(event.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select a scenario...
            </option>
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>

          {convo.conversationId && (
            <div className="mt-4 space-y-3">
              {/* User Role Badge */}
              {userRole && (
                <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-3 text-white">
                  <div className="text-xs opacity-80 uppercase tracking-wide">
                    Your Role
                  </div>
                  <div className="text-lg font-bold">{userRole.name}</div>
                  <div className="mt-2 text-xs opacity-90">
                    {userRole.objectives?.[0]}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setShowAnalytics(!showAnalytics)}
                >
                  {showAnalytics ? "Hide Analytics" : "View Analytics"}
                </button>
                <button
                  className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    if (scenarios.length > 0) {
                      convo.begin(scenarios[0].id);
                    }
                  }}
                >
                  Restart
                </button>
              </div>

              {convo.scenarioId && (
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Current Scenario
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">
                    {scenarios.find((s) => s.id === convo.scenarioId)?.name ||
                      "Loading..."}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    {convo.messages.length} messages
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Coaching Panel - Real-time Feedback */}
        {convo.conversationId && lastFeedback && (
          <CoachingPanel
            feedback={lastFeedback}
            onClear={() => setLastFeedback(null)}
          />
        )}

        {showAnalytics && convo.conversationId && (
          <AnalyticsPanel conversationId={convo.conversationId} />
        )}
      </div>

      {/* Main Chat Area */}
      <div className="lg:col-span-6">
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">
                  {userRole ? `${userRole.name} Training` : "Conversation"}
                </h3>
                <p className="text-xs text-slate-600">
                  {convo.conversationId
                    ? userRole
                      ? "Practice with AI customer/prospect"
                      : "Active session"
                    : "Select a scenario to begin"}
                </p>
              </div>
              {convo.loading && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="flex gap-1">
                    <span
                      className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                  <span>Typing...</span>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[500px] space-y-4 overflow-y-auto bg-gradient-to-b from-slate-50 to-white p-4">
            {convo.messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <div className="text-4xl mb-3">👋</div>
                  <h4 className="font-medium text-slate-700">
                    Welcome, {userRole?.name || "Trainee"}!
                  </h4>
                  <p className="mt-1 text-sm text-slate-500 max-w-xs">
                    {userRole
                      ? `You'll be playing the role of ${userRole.name}. The AI will act as the customer/prospect/employee. Practice your skills!`
                      : "Select a training scenario from the left to start your conversation practice."}
                  </p>
                  {userRole && (
                    <div className="mt-4 text-xs text-blue-600 bg-blue-50 rounded-lg p-3 max-w-sm">
                      <strong>💡 Tip:</strong> {userRole.objectives?.join(". ")}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {convo.messages.map((message: Message, idx: number) => (
                  <div
                    key={`${message.role}-${idx}`}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[85%] gap-2 ${
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm border border-slate-200">
                        {message.role === "user"
                          ? "👤"
                          : getAvatarForRole(message.role)}
                      </div>

                      {/* Message Bubble */}
                      <div>
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                            message.role === "user"
                              ? "bg-blue-600 text-white rounded-br-md"
                              : `bg-white text-slate-900 border border-slate-200 rounded-bl-md ${getEmotionColor(
                                  message.emotion,
                                )}`
                          }`}
                        >
                          {message.emotion && message.role === "bot" && (
                            <div className="mb-1 flex items-center gap-1 text-xs opacity-75">
                              <span>{getEmotionIcon(message.emotion)}</span>
                              <span className="capitalize">
                                {message.emotion}
                              </span>
                            </div>
                          )}
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
                        <div
                          className={`mt-1 text-xs text-slate-400 ${
                            message.role === "user" ? "text-right" : "text-left"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-4">
            {/* Quick Reply Options */}
            {convo.options.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {convo.options.map((option: string, idx: number) => (
                  <button
                    key={idx}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                    onClick={() => {
                      void convo.send(option);
                    }}
                    disabled={convo.loading}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Text Input */}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && input.trim() && !convo.loading) {
                    void convo.send(input);
                    setInput("");
                  }
                }}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
                placeholder={
                  userRole
                    ? `Respond as ${userRole.name}...`
                    : "Type your response..."
                }
                disabled={!convo.conversationId || convo.loading}
              />
              <button
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (input.trim()) {
                    void convo.send(input);
                    setInput("");
                  }
                }}
                disabled={!convo.conversationId || !input || convo.loading}
              >
                Send
              </button>
            </div>

            <div className="mt-2 text-center text-xs text-slate-400">
              Press Enter to send • Choose quick replies or type naturally
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Graph Viewer */}
      <div className="lg:col-span-3">
        <GraphViewer
          scenarioId={convo.scenarioId}
          highlightedNodeId={convo.currentNodeId}
          visitedNodes={convo.visitedNodes}
        />
      </div>
    </div>
  );
}
