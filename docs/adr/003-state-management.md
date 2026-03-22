# ADR 003: State Management with Zustand

## Status
Accepted

## Context
The frontend needed a state management solution for:
- Conversation state (messages, options, current node)
- UI state (loading, selected scenario)
- Graph viewer state (highlighted nodes, zoom level)
- Analytics state (metrics, emotional journey)

Requirements:
- Minimal boilerplate
- TypeScript support
- DevTools integration
- Small bundle size

## Decision
We chose **Zustand** for state management.

### Store Structure
```typescript
interface ChatState {
  conversationId: string | null;
  scenarioId: string | null;
  currentNodeId: string | null;
  visitedNodes: string[];
  messages: Message[];
  options: string[];
  
  // Actions
  setConversation: (id, scenario) => void;
  addMessage: (message) => void;
  setOptions: (options) => void;
  setCurrentNode: (nodeId) => void;
  addVisitedNode: (nodeId) => void;
  reset: () => void;
}
```

### Usage Example
```typescript
const store = useChatStore();
store.addMessage({ role: 'bot', content: 'Hello!' });
```

## Consequences

### Positive
- ✅ Minimal boilerplate (no providers, no actions/reducers)
- ✅ Excellent TypeScript inference
- ✅ Small bundle size (~1KB)
- ✅ DevTools support out of the box
- ✅ Easy to test and mock

### Negative
- ❌ Less structured than Redux for very large apps
- ❌ Global state can become a dumping ground

### Mitigations
- Clear separation between conversation state and UI state
- Modular stores if complexity grows

## Alternatives Considered

### Redux Toolkit
- Rejected due to boilerplate and bundle size

### React Context + useReducer
- Rejected due to performance concerns and complexity

### Jotai
- Considered but Zustand has better DevTools and maturity

## References
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [State Management Comparison](https://example.com/state-comparison)
