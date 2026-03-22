import { create } from "zustand";

interface Message {
  role: "user" | "bot";
  content: string;
  emotion?: string;
  personaName?: string;
  timestamp: Date;
}

interface CoachingFeedback {
  tip: string;
  expectedResponse?: string;
  scoreChange?: number;
  outcome?: string;
}

interface ChatState {
  conversationId: string | null;
  scenarioId: string | null;
  currentNodeId: string | null;
  visitedNodes: string[];
  messages: Message[];
  options: string[];
  lastCoachingFeedback: CoachingFeedback | null;
  totalScore: number;
  setConversation: (conversationId: string, scenarioId: string) => void;
  addMessage: (message: Message) => void;
  setOptions: (options: string[]) => void;
  setCurrentNode: (nodeId: string) => void;
  addVisitedNode: (nodeId: string) => void;
  setCoachingFeedback: (feedback: CoachingFeedback) => void;
  addScore: (points: number) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversationId: null,
  scenarioId: null,
  currentNodeId: null,
  visitedNodes: [],
  messages: [],
  options: [],
  lastCoachingFeedback: null,
  totalScore: 0,

  setConversation: (conversationId, scenarioId) =>
    set({
      conversationId,
      scenarioId,
      currentNodeId: null,
      visitedNodes: [],
      messages: [],
      options: [],
      lastCoachingFeedback: null,
      totalScore: 0,
    }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setOptions: (options) => set({ options }),

  setCurrentNode: (nodeId) => set({ currentNodeId: nodeId }),

  addVisitedNode: (nodeId) =>
    set((state) => ({
      visitedNodes: state.visitedNodes.includes(nodeId)
        ? state.visitedNodes
        : [...state.visitedNodes, nodeId],
    })),

  setCoachingFeedback: (feedback) => set({ lastCoachingFeedback: feedback }),

  addScore: (points) =>
    set((state) => ({ totalScore: state.totalScore + points })),

  reset: () =>
    set({
      conversationId: null,
      scenarioId: null,
      currentNodeId: null,
      visitedNodes: [],
      messages: [],
      options: [],
      lastCoachingFeedback: null,
      totalScore: 0,
    }),
}));
