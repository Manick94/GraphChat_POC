import { describe, expect, it } from "vitest";
import { GraphEngine } from "./engine";
import { ConversationGraph } from "@conversation-trainer/types";

const graph: ConversationGraph = {
  id: "test",
  name: "Test",
  description: "Test graph",
  version: "1.0.0",
  entryNode: "start",
  nodes: {
    start: {
      id: "start",
      type: "bot",
      content: "start",
      personaId: "test-bot",
      metadata: { emotion: "neutral" },
    },
    next: {
      id: "next",
      type: "bot",
      content: "next",
      personaId: "test-bot",
      metadata: { emotion: "neutral" },
    },
    end: {
      id: "end",
      type: "end",
      content: "done",
      personaId: "test-bot",
      metadata: { emotion: "neutral" },
    },
  },
  edges: [
    {
      id: "a",
      from: "start",
      to: "next",
      trigger: { type: "exact", value: "yes" },
    },
    {
      id: "b",
      from: "next",
      to: "end",
      trigger: { type: "intent", value: ["too expensive", "need discount"] },
      actions: [{ type: "setVariable", target: "discount", value: true }],
    },
  ],
  variables: [{ name: "discount", type: "boolean", default: false }],
  personas: [],
  intents: [],
  metadata: {
    estimatedDuration: 5,
    difficulty: "beginner",
    learningObjectives: ["Test objective"],
    industry: "Testing",
    useCase: "Unit tests",
  },
};

describe("GraphEngine", () => {
  it("should follow exact match edge", () => {
    const engine = new GraphEngine(graph);
    const context = engine.getInitialContext("conversation-1");
    const result = engine.processInput(context, "yes");
    expect(result.context.currentNodeId).toBe("next");
  });

  it("should handle variable action updates", () => {
    const engine = new GraphEngine(graph);
    const context = engine.getInitialContext("conversation-1");
    const mid = engine.processInput(context, "yes");
    const end = engine.processInput(mid.context, "need discount");
    expect(end.context.variables.discount).toBe(true);
  });
});
