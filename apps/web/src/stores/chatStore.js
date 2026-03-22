import { create } from "zustand";
export const useChatStore = create((set) => ({
    conversationId: null,
    scenarioId: null,
    currentNodeId: null,
    visitedNodes: [],
    messages: [],
    options: [],
    lastCoachingFeedback: null,
    totalScore: 0,
    setConversation: (conversationId, scenarioId) => set({
        conversationId,
        scenarioId,
        currentNodeId: null,
        visitedNodes: [],
        messages: [],
        options: [],
        lastCoachingFeedback: null,
        totalScore: 0,
    }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    setOptions: (options) => set({ options }),
    setCurrentNode: (nodeId) => set({ currentNodeId: nodeId }),
    addVisitedNode: (nodeId) => set((state) => ({
        visitedNodes: state.visitedNodes.includes(nodeId)
            ? state.visitedNodes
            : [...state.visitedNodes, nodeId],
    })),
    setCoachingFeedback: (feedback) => set({ lastCoachingFeedback: feedback }),
    addScore: (points) => set((state) => ({ totalScore: state.totalScore + points })),
    reset: () => set({
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
