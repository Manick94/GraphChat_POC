import { useState } from "react";
import { sendConversationMessage, startConversation } from "../lib/api";
import { useChatStore } from "../stores/chatStore";
export function useConversation() {
    const [loading, setLoading] = useState(false);
    const store = useChatStore();
    async function begin(scenarioId) {
        setLoading(true);
        try {
            const response = await startConversation(scenarioId);
            store.reset();
            store.setConversation(response.conversationId, scenarioId);
            const currentNode = response.currentNode;
            const personaName = currentNode?.personaId || "bot";
            store.addMessage({
                role: "bot",
                content: String(currentNode.content),
                emotion: currentNode?.metadata?.emotion,
                personaName,
                timestamp: new Date(),
            });
        }
        catch (error) {
            console.error("Failed to start conversation:", error);
        }
        finally {
            setLoading(false);
        }
    }
    async function send(message) {
        if (!store.conversationId)
            return;
        store.addMessage({
            role: "user",
            content: message,
            timestamp: new Date(),
        });
        setLoading(true);
        try {
            const response = await sendConversationMessage(store.conversationId, message);
            const botMessage = response.messages?.[0]?.content ?? "No response.";
            const node = response.messages?.[0];
            store.addMessage({
                role: "bot",
                content: String(botMessage),
                emotion: node?.metadata?.emotion,
                personaName: node?.personaId,
                timestamp: new Date(),
            });
            store.setOptions((response.availableOptions ?? []).map((opt) => opt.label || opt));
            // Track current node and visited nodes
            if (response.context?.currentNodeId) {
                store.setCurrentNode(response.context.currentNodeId);
                store.addVisitedNode(response.context.currentNodeId);
            }
            // Store coaching feedback
            if (response.coachingFeedback) {
                store.setCoachingFeedback(response.coachingFeedback);
            }
        }
        catch (error) {
            console.error("Failed to send message:", error);
            store.addMessage({
                role: "bot",
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
            });
        }
        finally {
            setLoading(false);
        }
    }
    return {
        loading,
        begin,
        send,
        ...store,
    };
}
