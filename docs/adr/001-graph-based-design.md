# ADR 001: Graph-Based Conversation Design

## Status
Accepted

## Context
We needed a conversation system that provides:
- Deterministic, auditable conversation flows
- LLM-like natural responses without API costs or latency
- Easy-to-understand structure for non-technical content creators
- Flexibility for complex branching scenarios

## Decision
We adopted a **finite-state graph traversal** approach where:
- Conversations are directed graphs with nodes and edges
- Nodes represent conversation states (bot messages, user inputs, decisions)
- Edges represent transitions triggered by user input
- Intent recognition determines edge traversal

### Graph Structure
```typescript
interface ConversationGraph {
  nodes: Record<string, ConversationNode>;
  edges: ConversationEdge[];
  personas: Persona[];
  intents: IntentDefinition[];
}
```

### Node Types
- **bot**: System/Bot messages with dialogue variations
- **user-input**: Awaiting user response
- **decision**: Branching points based on user choice
- **end**: Conversation termination
- **redirect**: Jump to another node or graph

## Consequences

### Positive
- ✅ Predictable, testable conversation flows
- ✅ No external API dependencies
- ✅ Sub-100ms response times
- ✅ Content creators can edit JSON directly
- ✅ Full conversation audit trail

### Negative
- ❌ Requires upfront scenario design
- ❌ Less flexible than pure LLM for open-ended conversations
- ❌ JSON files can become large for complex scenarios

### Mitigations
- Dialogue variations reduce repetitiveness
- Intent recognition allows natural language input
- Graph viewer helps visualize complex scenarios

## References
- [Finite State Machines in Dialogue Systems](https://example.com/fsm-dialogue)
- [SCXML Standard](https://www.w3.org/TR/scxml/)
