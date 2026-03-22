// ============================================
// Enhanced Graph Engine with Intent Recognition
// ============================================

import {
  ConversationContext,
  ConversationEdge,
  ConversationGraph,
  ConversationNode,
  EdgeOption,
  TraversalResult,
  Persona,
  IntentDefinition,
  EmotionType,
} from "@conversation-trainer/types";
import { IntentEngine } from "./intentEngine";
import { DialogueGenerator } from "./dialogueGenerator";

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const levenshteinDistance = (a: string, b: string) => {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array.from<number>({ length: b.length + 1 }).fill(0),
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[a.length][b.length];
};

export class GraphEngine {
  private intentEngine: IntentEngine;
  private dialogueGenerator: DialogueGenerator;
  private personas: Map<string, Persona>;

  constructor(private readonly graph: ConversationGraph) {
    this.intentEngine = new IntentEngine(graph.intents ?? []);
    this.dialogueGenerator = new DialogueGenerator(graph.personas ?? []);
    this.personas = new Map((graph.personas ?? []).map((p) => [p.id, p]));
  }

  getInitialContext(conversationId: string): ConversationContext {
    const defaultVariables = Object.fromEntries(
      (this.graph.variables ?? []).map((v) => [v.name, v.default ?? null]),
    );

    return {
      conversationId,
      currentNodeId: this.graph.entryNode,
      variables: defaultVariables,
      history: [
        { nodeId: this.graph.entryNode, timestamp: new Date().toISOString() },
      ],
      detectedIntents: [],
      emotionalJourney: [],
    };
  }

  processInput(context: ConversationContext, input: string): TraversalResult {
    const edges = this.graph.edges.filter(
      (edge) => edge.from === context.currentNodeId,
    );
    const matched = this.matchEdge(edges, input);

    if (!matched) {
      const currentNode = this.graph.nodes[context.currentNodeId];
      const persona = this.personas.get(currentNode.personaId);
      const defaultResponse =
        this.dialogueGenerator.generateResponse(currentNode);

      return {
        node: currentNode,
        context,
        message: `I didn't quite catch that. ${persona?.personality.tone === "friendly" ? "No worries!" : "Please"} try one of the available options.`,
        availableOptions: this.getAvailableOptions(context.currentNodeId),
        isComplete: currentNode.type === "end",
        intentDetected: undefined,
        coachingFeedback: {
          tip:
            currentNode.metadata?.coachingTip ||
            "Think about what the customer needs right now.",
          expectedResponse:
            currentNode.metadata?.expectedUserResponse ||
            "Empathy or investigation",
        },
      };
    }

    const nextContext = this.executeActions(context, matched);
    nextContext.currentNodeId = matched.to;

    // Track detected intent
    if (matched.intentId) {
      nextContext.detectedIntents.push(matched.intentId);
    }

    // Track emotional journey
    const nextNode = this.graph.nodes[matched.to];
    const emotion = nextNode.metadata?.emotion ?? matched.emotion ?? "neutral";
    nextContext.emotionalJourney.push(emotion);

    nextContext.history.push({
      nodeId: matched.to,
      timestamp: new Date().toISOString(),
      choice: input,
      intentDetected: matched.intentId ?? undefined,
      confidence: matched.confidence,
    });

    // Generate natural response
    const response = this.dialogueGenerator.generateResponse(
      nextNode,
      nextContext.variables,
    );
    const personalizedText = this.dialogueGenerator.personalizeResponse(
      response.text,
      this.personas.get(nextNode.personaId),
    );

    return {
      node: nextNode,
      context: nextContext,
      matchedEdgeId: matched.id,
      message: personalizedText,
      availableOptions: this.getAvailableOptions(matched.to),
      isComplete: nextNode.type === "end",
      intentDetected: matched.intentId
        ? {
            id: matched.intentId,
            name: matched.intentName ?? "",
            confidence: matched.confidence ?? 0,
          }
        : undefined,
      suggestedResponses: this.generateSuggestedResponses(nextNode, matched),
      coachingFeedback: {
        tip:
          matched.feedback ||
          nextNode.metadata?.coachingTip ||
          "Good response!",
        expectedResponse: nextNode.metadata?.expectedUserResponse,
        scoreChange: this.calculateScoreChange(matched.intentId),
        outcome:
          matched.emotion === "angry" || matched.emotion === "annoyed"
            ? "Customer is upset - consider de-escalation techniques"
            : matched.emotion === "happy" || matched.emotion === "grateful"
              ? "Customer is satisfied - you're on the right track"
              : undefined,
      },
    };
  }

  private calculateScoreChange(intentId: string | undefined): number {
    if (!intentId) return 0;

    // Find the intent in the graph
    const intent = this.graph.intents?.find((i) => i.id === intentId);
    if (!intent) return 0;

    // Get score weight from response strategy or default
    return (intent.responseStrategy as any)?.scoreWeight ?? 0;
  }

  private generateSuggestedResponses(
    node: ConversationNode,
    matched: any,
  ): string[] {
    const suggestions: string[] = [];
    const persona = this.personas.get(node.personaId);

    if (node.type === "decision" || node.type === "user-input") {
      const commonResponses = {
        customer: [
          "Can you help me with that?",
          "What are my options?",
          "How long will this take?",
        ],
        manager: [
          "Let me review this.",
          "I'll need more information.",
          "Let's schedule a follow-up.",
        ],
        agent: [
          "I understand your concern.",
          "Let me check that for you.",
          "I'll escalate this if needed.",
        ],
        sales_rep: [
          "What's your budget?",
          "When do you need this by?",
          "Who else is involved in the decision?",
        ],
        employee: [
          "I understand.",
          "I'll work on that.",
          "Can you help me with this?",
        ],
        executive: [
          "Let me review this.",
          "I'll need more data.",
          "Schedule a follow-up.",
        ],
      } as Record<string, string[]>;

      const roleSuggestions = commonResponses[persona?.role ?? "customer"];
      suggestions.push(...roleSuggestions.slice(0, 2));
    }

    return suggestions;
  }

  getAvailableOptions(nodeId: string): EdgeOption[] {
    return this.graph.edges
      .filter((edge) => edge.from === nodeId)
      .map((edge) => ({
        id: edge.id,
        label: this.extractLabelFromTrigger(edge),
        to: edge.to,
        intentId: edge.intentId,
        emotion: edge.emotion,
        isQuickReply: edge.trigger.type === "button",
      }));
  }

  private extractLabelFromTrigger(edge: ConversationEdge): string {
    if (edge.trigger.type === "button") {
      return Array.isArray(edge.trigger.value)
        ? edge.trigger.value[0]
        : String(edge.trigger.value);
    }

    if (edge.intentId) {
      const intent = this.graph.intents?.find((i) => i.id === edge.intentId);
      if (intent) return intent.name;
    }

    if (edge.trigger.type === "intent" && Array.isArray(edge.trigger.value)) {
      return edge.trigger.value[0];
    }

    return "Continue";
  }

  private executeActions(
    context: ConversationContext,
    edge: any,
  ): ConversationContext {
    const copy: ConversationContext = {
      ...context,
      variables: { ...context.variables },
      history: [...context.history],
      detectedIntents: [...context.detectedIntents],
      emotionalJourney: [...context.emotionalJourney],
    };

    (edge.actions ?? []).forEach((action: any) => {
      if (!action.target) return;
      if (action.type === "setVariable") {
        copy.variables[action.target] = action.value ?? null;
      }
      if (action.type === "increment") {
        copy.variables[action.target] =
          Number(copy.variables[action.target] ?? 0) + 1;
      }
      if (action.type === "decrement") {
        copy.variables[action.target] = Math.max(
          0,
          Number(copy.variables[action.target] ?? 0) - 1,
        );
      }
    });

    return copy;
  }

  private matchEdge(edges: ConversationEdge[], input: string): any {
    const normalized = input.trim().toLowerCase();

    // 1. Exact match (including button clicks)
    const exact = edges.find((edge) => {
      if (edge.trigger.type !== "exact" && edge.trigger.type !== "button")
        return false;
      const values = Array.isArray(edge.trigger.value)
        ? edge.trigger.value
        : [edge.trigger.value];
      return values.some((v) => String(v).toLowerCase() === normalized);
    });
    if (exact) return { ...exact, confidence: 1.0 };

    // 2. Intent-based matching (NEW - enhanced)
    const intentMatch = this.intentEngine.matchEdgeByIntent(edges, input);
    if (intentMatch) {
      const intent = this.graph.intents?.find(
        (i) => i.id === intentMatch.edge.intentId,
      );
      return {
        ...intentMatch.edge,
        confidence: intentMatch.confidence,
        intentId: intentMatch.edge.intentId,
        intentName: intent?.name,
      };
    }

    // 3. Regex match
    const regex = edges.find((edge) => {
      if (edge.trigger.type !== "regex") return false;
      try {
        return new RegExp(String(edge.trigger.value), "i").test(input);
      } catch {
        return false;
      }
    });
    if (regex) return { ...regex, confidence: 0.9 };

    // 4. Keyword matching
    const keyword = edges.find((edge) => {
      if (edge.trigger.type !== "keyword" || !edge.trigger.keywords)
        return false;
      return edge.trigger.keywords.some((kw) =>
        input.toLowerCase().includes(kw.toLowerCase()),
      );
    });
    if (keyword) return { ...keyword, confidence: 0.7 };

    // 5. Fuzzy match
    const fuzzy = edges.find((edge) => {
      const values = Array.isArray(edge.trigger.value)
        ? edge.trigger.value
        : [edge.trigger.value];
      return values.some((value) => {
        const candidate = String(value).toLowerCase();
        const distance = levenshteinDistance(candidate, normalized);
        const ratio =
          1 - distance / Math.max(candidate.length, normalized.length, 1);
        return ratio >= 0.75;
      });
    });
    if (fuzzy) return { ...fuzzy, confidence: 0.6 };

    return undefined;
  }
}
