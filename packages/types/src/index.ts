export interface VariableDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean';
  default?: string | number | boolean;
}

export interface ContentBlock {
  type: 'text' | 'markdown';
  value: string;
}

export interface ConversationNode {
  id: string;
  type: 'bot' | 'user-input' | 'decision' | 'end' | 'redirect';
  content: string | ContentBlock[];
  metadata?: {
    emotion?: 'neutral' | 'concerned' | 'happy' | 'frustrated';
    avatar?: string;
    delayMs?: number;
    audioUrl?: string;
  };
  condition?: string;
}

export interface GraphAction {
  type: 'setVariable' | 'increment' | 'log' | 'redirect' | 'callWebhook';
  target?: string;
  value?: string | number | boolean;
}

export interface ConversationEdge {
  id: string;
  from: string;
  to: string;
  trigger: {
    type: 'intent' | 'exact' | 'regex' | 'button' | 'timeout' | 'condition';
    value: string | string[];
    confidenceThreshold?: number;
  };
  response?: string;
  actions?: GraphAction[];
  condition?: string;
  weight?: number;
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
}

export interface PathEntry {
  nodeId: string;
  timestamp: string;
  choice?: string;
}

export interface ConversationContext {
  conversationId: string;
  currentNodeId: string;
  variables: Record<string, unknown>;
  history: PathEntry[];
}

export interface TraversalResult {
  node: ConversationNode;
  context: ConversationContext;
  matchedEdgeId?: string;
  message?: string;
  availableOptions: EdgeOption[];
  isComplete: boolean;
}

export interface EdgeOption {
  id: string;
  label: string;
  to: string;
}
