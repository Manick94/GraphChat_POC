// ============================================
// Enhanced Conversation Types for GraphChat
// ============================================

export interface Persona {
  id: string;
  name: string;
  role:
    | "customer"
    | "manager"
    | "agent"
    | "employee"
    | "sales_rep"
    | "executive";
  avatar?: string;
  personality: {
    tone: "formal" | "casual" | "friendly" | "assertive" | "empathetic";
    communicationStyle: "direct" | "diplomatic" | "detailed" | "brief";
    emotionalBaseline: "neutral" | "positive" | "stressed" | "optimistic";
  };
  backstory?: string;
  goals: string[];
  painPoints?: string[];
}

export interface IntentDefinition {
  id: string;
  name: string;
  category:
    | "greeting"
    | "inquiry"
    | "complaint"
    | "request"
    | "confirmation"
    | "rejection"
    | "negotiation"
    | "escalation"
    | "clarification"
    | "agreement"
    | "disagreement"
    | "feedback"
    | "decision"
    | "smalltalk"
    | "goodbye";
  examples: string[];
  confidenceThreshold?: number;
  responseStrategy: ResponseStrategy;
}

export interface ResponseStrategy {
  type:
    | "empathetic"
    | "solution"
    | "clarifying"
    | "confirming"
    | "redirecting"
    | "escalating";
  tone?: "warm" | "professional" | "urgent" | "casual" | "apologetic";
  includeValidation?: boolean;
  suggestNextSteps?: boolean;
}

export interface DialogueVariation {
  id: string;
  text: string;
  weight?: number; // For random selection probability
  conditions?: Record<string, any>;
  emotion?: EmotionType;
}

export type EmotionType =
  | "neutral"
  | "happy"
  | "concerned"
  | "frustrated"
  | "empathetic"
  | "confident"
  | "uncertain"
  | "grateful"
  | "disappointed"
  | "hopeful";

export interface ContentBlock {
  type: "text" | "markdown" | "list" | "question" | "statement";
  value: string | string[];
  emotion?: EmotionType;
  emphasis?: string[];
}

export interface ConversationNode {
  id: string;
  type: "bot" | "user-input" | "decision" | "end" | "redirect" | "branch";
  personaId: string;
  content: string | ContentBlock[];
  dialogueVariations?: DialogueVariation[];
  metadata: {
    emotion?: EmotionType;
    avatar?: string;
    delayMs?: number;
    audioUrl?: string;
    tags?: string[];
    learningObjective?: string;
    difficulty?: "beginner" | "intermediate" | "advanced";
    coachingTip?: string;
    expectedUserResponse?: string;
  };
  condition?: string;
  contextRequirements?: string[];
}

export interface GraphAction {
  type:
    | "setVariable"
    | "increment"
    | "decrement"
    | "log"
    | "redirect"
    | "callWebhook"
    | "trackMetric";
  target?: string;
  value?: string | number | boolean;
  metricName?: string;
}

export interface ConversationEdge {
  id: string;
  from: string;
  to: string;
  trigger: {
    type:
      | "intent"
      | "exact"
      | "regex"
      | "button"
      | "timeout"
      | "condition"
      | "keyword";
    value: string | string[];
    confidenceThreshold?: number;
    keywords?: string[];
  };
  response?: string;
  responseVariations?: string[];
  actions?: GraphAction[];
  condition?: string;
  weight?: number;
  intentId?: string;
  emotion?: EmotionType;
}

export interface ConversationGraph {
  id: string;
  name: string;
  description: string;
  version: string;
  entryNode: string;
  nodes: Record<string, ConversationNode>;
  edges: ConversationEdge[];
  variables?: VariableDefinition[];
  personas: Persona[];
  intents: IntentDefinition[];
  metadata: {
    estimatedDuration?: number; // minutes
    difficulty?: "beginner" | "intermediate" | "advanced";
    learningObjectives?: string[];
    industry?: string;
    useCase?: string;
  };
}

export interface VariableDefinition {
  name: string;
  type: "string" | "number" | "boolean" | "array";
  default?: string | number | boolean | any[];
  description?: string;
}

export interface PathEntry {
  nodeId: string;
  timestamp: string;
  choice?: string;
  intentDetected?: string;
  confidence?: number;
  responseTime?: number;
}

export interface ConversationContext {
  conversationId: string;
  currentNodeId: string;
  variables: Record<string, unknown>;
  history: PathEntry[];
  detectedIntents: string[];
  emotionalJourney: EmotionType[];
}

export interface TraversalResult {
  node: ConversationNode;
  context: ConversationContext;
  matchedEdgeId?: string;
  message: string;
  availableOptions: EdgeOption[];
  isComplete: boolean;
  intentDetected?: {
    id: string;
    name: string;
    confidence: number;
  };
  suggestedResponses?: string[];
  coachingFeedback?: {
    tip: string;
    expectedResponse?: string;
    scoreChange?: number;
    outcome?: string;
  };
}

export interface EdgeOption {
  id: string;
  label: string;
  to: string;
  intentId?: string;
  emotion?: EmotionType;
  isQuickReply?: boolean;
}

export interface ConversationMetrics {
  totalTurns: number;
  averageResponseTime: number;
  intentAccuracy: number;
  emotionalProgression: EmotionType[];
  pathsExplored: number;
  objectivesMet: string[];
  completionStatus: "completed" | "abandoned" | "in_progress";
}

export interface SessionAnalytics {
  sessionId: string;
  scenarioId: string;
  startTime: string;
  endTime?: string;
  totalMessages: number;
  userSatisfaction?: number;
  learningProgress?: Record<string, number>;
}
