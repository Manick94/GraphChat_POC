import {
  ConversationContext,
  ConversationEdge,
  ConversationGraph,
  EdgeOption,
  TraversalResult
} from '@conversation-trainer/types';

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const cosineSimilarity = (a: string[], b: string[]) => {
  const aFreq = new Map<string, number>();
  const bFreq = new Map<string, number>();
  a.forEach((token) => aFreq.set(token, (aFreq.get(token) ?? 0) + 1));
  b.forEach((token) => bFreq.set(token, (bFreq.get(token) ?? 0) + 1));

  const keys = new Set([...aFreq.keys(), ...bFreq.keys()]);
  let dot = 0;
  let aMag = 0;
  let bMag = 0;

  keys.forEach((key) => {
    const aValue = aFreq.get(key) ?? 0;
    const bValue = bFreq.get(key) ?? 0;
    dot += aValue * bValue;
    aMag += aValue * aValue;
    bMag += bValue * bValue;
  });

  if (!aMag || !bMag) return 0;
  return dot / (Math.sqrt(aMag) * Math.sqrt(bMag));
};

const levenshteinDistance = (a: string, b: string) => {
  const dp = Array.from({ length: a.length + 1 }, () => Array.from<number>({ length: b.length + 1 }).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
};

export class GraphEngine {
  constructor(private readonly graph: ConversationGraph) {}

  getInitialContext(conversationId: string): ConversationContext {
    const defaultVariables = Object.fromEntries(
      (this.graph.variables ?? []).map((v) => [v.name, v.default ?? null])
    );

    return {
      conversationId,
      currentNodeId: this.graph.entryNode,
      variables: defaultVariables,
      history: [{ nodeId: this.graph.entryNode, timestamp: new Date().toISOString() }]
    };
  }

  processInput(context: ConversationContext, input: string): TraversalResult {
    const edges = this.graph.edges.filter((edge) => edge.from === context.currentNodeId);
    const matched = this.matchEdge(edges, input);

    if (!matched) {
      const currentNode = this.graph.nodes[context.currentNodeId];
      return {
        node: currentNode,
        context,
        message: "I didn't understand that. Try one of the available options.",
        availableOptions: this.getAvailableOptions(context.currentNodeId),
        isComplete: currentNode.type === 'end'
      };
    }

    const nextContext = this.executeActions(context, matched);
    nextContext.currentNodeId = matched.to;
    nextContext.history.push({ nodeId: matched.to, timestamp: new Date().toISOString(), choice: input });

    const node = this.graph.nodes[matched.to];
    return {
      node,
      context: nextContext,
      matchedEdgeId: matched.id,
      message: matched.response,
      availableOptions: this.getAvailableOptions(matched.to),
      isComplete: node.type === 'end'
    };
  }

  getAvailableOptions(nodeId: string): EdgeOption[] {
    return this.graph.edges
      .filter((edge) => edge.from === nodeId)
      .map((edge) => ({ id: edge.id, label: String(edge.trigger.value), to: edge.to }));
  }

  private executeActions(context: ConversationContext, edge: ConversationEdge): ConversationContext {
    const copy: ConversationContext = {
      ...context,
      variables: { ...context.variables },
      history: [...context.history]
    };

    (edge.actions ?? []).forEach((action) => {
      if (!action.target) return;
      if (action.type === 'setVariable') {
        copy.variables[action.target] = action.value ?? null;
      }
      if (action.type === 'increment') {
        copy.variables[action.target] = Number(copy.variables[action.target] ?? 0) + 1;
      }
    });

    return copy;
  }

  private matchEdge(edges: ConversationEdge[], input: string): ConversationEdge | undefined {
    const normalized = input.trim().toLowerCase();
    const exact = edges.find((edge) => {
      if (edge.trigger.type !== 'exact' && edge.trigger.type !== 'button') return false;
      const values = Array.isArray(edge.trigger.value) ? edge.trigger.value : [edge.trigger.value];
      return values.some((v) => String(v).toLowerCase() === normalized);
    });
    if (exact) return exact;

    const regex = edges.find((edge) => {
      if (edge.trigger.type !== 'regex') return false;
      return new RegExp(String(edge.trigger.value), 'i').test(input);
    });
    if (regex) return regex;

    const intents = edges
      .filter((edge) => edge.trigger.type === 'intent')
      .map((edge) => {
        const values = Array.isArray(edge.trigger.value) ? edge.trigger.value : [edge.trigger.value];
        const scores = values.map((value) => this.matchIntent(input, String(value)));
        return { edge, score: Math.max(...scores) };
      })
      .sort((a, b) => b.score - a.score);

    if (intents[0] && intents[0].score >= 0.5) return intents[0].edge;

    const fuzzy = edges.find((edge) => {
      const values = Array.isArray(edge.trigger.value) ? edge.trigger.value : [edge.trigger.value];
      return values.some((value) => {
        const candidate = String(value).toLowerCase();
        const distance = levenshteinDistance(candidate, normalized);
        const ratio = 1 - distance / Math.max(candidate.length, normalized.length, 1);
        return ratio >= 0.8;
      });
    });

    return fuzzy;
  }

  private matchIntent(input: string, pattern: string): number {
    return cosineSimilarity(tokenize(input), tokenize(pattern));
  }
}
