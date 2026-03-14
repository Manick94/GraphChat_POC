import fs from 'node:fs';
import path from 'node:path';
import { ConversationGraph } from '@conversation-trainer/types';

export function loadGraph(scenarioId: string): ConversationGraph {
  const scenarioPath = path.join(__dirname, '..', 'scenarios', `${scenarioId}.json`);
  if (!fs.existsSync(scenarioPath)) {
    throw new Error(`Scenario '${scenarioId}' not found.`);
  }

  const raw = fs.readFileSync(scenarioPath, 'utf-8');
  const graph = JSON.parse(raw) as ConversationGraph;

  if (!graph.nodes[graph.entryNode]) {
    throw new Error(`Invalid graph: entry node '${graph.entryNode}' is missing.`);
  }

  return graph;
}
