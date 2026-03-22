const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
export async function fetchScenarios() {
    const response = await fetch(`${API_URL}/api/scenarios`);
    return response.json();
}
export async function startConversation(scenarioId) {
    const response = await fetch(`${API_URL}/api/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId }),
    });
    return response.json();
}
export async function sendConversationMessage(conversationId, message) {
    const response = await fetch(`${API_URL}/api/conversations/${conversationId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });
    return response.json();
}
export async function getGraph(scenarioId) {
    const response = await fetch(`${API_URL}/api/scenarios/${scenarioId}/graph`);
    return response.json();
}
