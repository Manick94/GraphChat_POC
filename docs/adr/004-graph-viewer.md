# ADR 004: D3.js for Graph Visualization

## Status
Accepted

## Context
We needed an interactive graph visualization for:
- Real-time conversation flow inspection
- Node type and emotion visualization
- Current node highlighting during conversation
- Zoom, pan, and node inspection
- Educational value for understanding graph structure

Requirements:
- Interactive (drag nodes, zoom, pan)
- Real-time updates as conversation progresses
- Custom styling for node types and states
- Reasonable learning curve
- Good TypeScript support

## Decision
We chose **D3.js** with a force-directed graph layout.

### Implementation
```typescript
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).distance(120))
  .force('charge', d3.forceManyBody().strength(-400))
  .force('center', d3.forceCenter(width / 2, height / 2));
```

### Features
- **Force-directed layout**: Natural node positioning
- **Draggable nodes**: Users can rearrange the graph
- **Zoom controls**: Zoom in/out, reset view
- **Color coding**: Different colors for node types
- **Real-time highlighting**: Current node glows orange
- **Visited tracking**: Visited nodes turn green
- **Edge labels**: Show trigger types/intents
- **Legend**: Explains color coding

### Node Colors
```typescript
const nodeColors = {
  bot: '#3b82f6',        // Blue
  'user-input': '#10b981', // Green
  decision: '#f59e0b',     // Amber
  end: '#ef4444',          // Red
  visited: '#22c55e',      // Green (bright)
  current: '#f97316'       // Orange (glowing)
};
```

## Consequences

### Positive
- ✅ Highly interactive and engaging
- ✅ Real-time updates as conversation progresses
- ✅ Educational value for understanding graph structure
- ✅ Professional appearance
- ✅ Full control over styling and behavior

### Negative
- ❌ D3.js has a steep learning curve
- ❌ Bundle size increase (~80KB gzipped)
- ❌ More code than simpler visualization libraries
- ❌ Force simulation can be unpredictable initially

### Mitigations
- Encapsulated D3 logic in single component
- Provided zoom controls and reset button
- Added legend for clarity
- Simulation stabilizes after initial render

## Alternatives Considered

### React Flow
- Rejected due to limited customization for force-directed layouts

### Visx (Airbnb)
- Considered but D3 has more examples and maturity

### Cytoscape.js
- Good alternative but D3 has better React ecosystem fit

### Recharts
- Not suitable for network/graph visualizations

## References
- [D3.js Documentation](https://d3js.org/)
- [Force-Directed Graphs](https://observablehq.com/@d3/force-directed-graph)
