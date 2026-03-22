// ============================================
// Enhanced Graph Schema Validation
// ============================================

export const conversationGraphSchema = {
  type: "object",
  required: [
    "id",
    "name",
    "entryNode",
    "nodes",
    "edges",
    "version",
    "description",
    "personas",
    "intents",
  ],
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    version: { type: "string" },
    entryNode: { type: "string" },
    personas: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "name", "role", "personality", "goals"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          role: {
            type: "string",
            enum: [
              "customer",
              "manager",
              "agent",
              "employee",
              "sales_rep",
              "executive",
            ],
          },
          avatar: { type: "string" },
          personality: {
            type: "object",
            required: ["tone", "communicationStyle", "emotionalBaseline"],
            properties: {
              tone: {
                type: "string",
                enum: [
                  "formal",
                  "casual",
                  "friendly",
                  "assertive",
                  "empathetic",
                ],
              },
              communicationStyle: {
                type: "string",
                enum: ["direct", "diplomatic", "detailed", "brief"],
              },
              emotionalBaseline: {
                type: "string",
                enum: ["neutral", "positive", "stressed", "optimistic"],
              },
            },
          },
          backstory: { type: "string" },
          goals: { type: "array", items: { type: "string" } },
          painPoints: { type: "array", items: { type: "string" } },
        },
      },
    },
    intents: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "name", "category", "examples", "responseStrategy"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          category: {
            type: "string",
            enum: [
              "greeting",
              "inquiry",
              "complaint",
              "request",
              "confirmation",
              "rejection",
              "negotiation",
              "escalation",
              "clarification",
              "agreement",
              "disagreement",
              "feedback",
              "decision",
              "smalltalk",
              "goodbye",
            ],
          },
          examples: { type: "array", items: { type: "string" } },
          confidenceThreshold: { type: "number", minimum: 0, maximum: 1 },
          responseStrategy: {
            type: "object",
            required: ["type"],
            properties: {
              type: {
                type: "string",
                enum: [
                  "empathetic",
                  "solution",
                  "clarifying",
                  "confirming",
                  "redirecting",
                  "escalating",
                ],
              },
              tone: {
                type: "string",
                enum: [
                  "warm",
                  "professional",
                  "urgent",
                  "casual",
                  "apologetic",
                ],
              },
              includeValidation: { type: "boolean" },
              suggestNextSteps: { type: "boolean" },
            },
          },
        },
      },
    },
    nodes: {
      type: "object",
      additionalProperties: {
        type: "object",
        required: ["id", "type", "personaId", "content"],
        properties: {
          id: { type: "string" },
          type: {
            enum: [
              "bot",
              "user-input",
              "decision",
              "end",
              "redirect",
              "branch",
            ],
          },
          personaId: { type: "string" },
          content: {
            oneOf: [{ type: "string" }, { type: "array" }],
          },
          dialogueVariations: {
            type: "array",
            items: {
              type: "object",
              required: ["id", "text"],
              properties: {
                id: { type: "string" },
                text: { type: "string" },
                weight: { type: "number" },
                emotion: { type: "string" },
              },
            },
          },
          metadata: {
            type: "object",
            properties: {
              emotion: { type: "string" },
              avatar: { type: "string" },
              delayMs: { type: "number" },
              tags: { type: "array", items: { type: "string" } },
              learningObjective: { type: "string" },
              difficulty: {
                type: "string",
                enum: ["beginner", "intermediate", "advanced"],
              },
            },
          },
        },
      },
    },
    edges: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "from", "to", "trigger"],
        properties: {
          id: { type: "string" },
          from: { type: "string" },
          to: { type: "string" },
          trigger: {
            type: "object",
            required: ["type", "value"],
            properties: {
              type: {
                type: "string",
                enum: [
                  "intent",
                  "exact",
                  "regex",
                  "button",
                  "timeout",
                  "condition",
                  "keyword",
                ],
              },
              value: {
                oneOf: [
                  { type: "string" },
                  { type: "array", items: { type: "string" } },
                ],
              },
              confidenceThreshold: { type: "number" },
              keywords: { type: "array", items: { type: "string" } },
            },
          },
          response: { type: "string" },
          responseVariations: { type: "array", items: { type: "string" } },
          intentId: { type: "string" },
          emotion: { type: "string" },
        },
      },
    },
    variables: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "type"],
        properties: {
          name: { type: "string" },
          type: {
            type: "string",
            enum: ["string", "number", "boolean", "array"],
          },
          default: {},
          description: { type: "string" },
        },
      },
    },
    metadata: {
      type: "object",
      properties: {
        estimatedDuration: { type: "number" },
        difficulty: {
          type: "string",
          enum: ["beginner", "intermediate", "advanced"],
        },
        learningObjectives: { type: "array", items: { type: "string" } },
        industry: { type: "string" },
        useCase: { type: "string" },
      },
    },
  },
};
