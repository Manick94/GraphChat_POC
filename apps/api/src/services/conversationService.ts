import { nanoid } from 'nanoid';
import { ConversationContext } from '@conversation-trainer/types';
import { db } from '../db';
import { GraphEngine } from '../graph/engine';
import { loadGraph } from '../graph/loader';

export function startConversation(scenarioId: string, userId?: string) {
  const graph = loadGraph(scenarioId);
  const engine = new GraphEngine(graph);
  const conversationId = nanoid();
  const context = engine.getInitialContext(conversationId);

  const stmt = db.prepare(`
    INSERT INTO conversations(id, scenario_id, user_id, current_node_id, path_history, context_variables, status)
    VALUES (?, ?, ?, ?, ?, ?, 'active')
  `);

  stmt.run(
    conversationId,
    scenarioId,
    userId ?? null,
    context.currentNodeId,
    JSON.stringify(context.history),
    JSON.stringify(context.variables)
  );

  return {
    conversationId,
    currentNode: graph.nodes[graph.entryNode],
    context
  };
}

export function sendMessage(conversationId: string, message: string) {
  const row = db.prepare('SELECT * FROM conversations WHERE id = ?').get(conversationId) as any;
  if (!row) {
    throw new Error('Conversation not found');
  }

  const graph = loadGraph(row.scenario_id);
  const engine = new GraphEngine(graph);

  const context: ConversationContext = {
    conversationId,
    currentNodeId: row.current_node_id,
    history: JSON.parse(row.path_history),
    variables: JSON.parse(row.context_variables)
  };

  const start = Date.now();
  const result = engine.processInput(context, message);

  db.prepare(
    `UPDATE conversations
     SET current_node_id = ?, path_history = ?, context_variables = ?, status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(
    result.context.currentNodeId,
    JSON.stringify(result.context.history),
    JSON.stringify(result.context.variables),
    result.isComplete ? 'completed' : 'active',
    conversationId
  );

  db.prepare(
    `INSERT INTO interaction_logs(conversation_id, node_id, user_input, selected_edge_id, response_time_ms)
     VALUES (?, ?, ?, ?, ?)`
  ).run(conversationId, context.currentNodeId, message, result.matchedEdgeId ?? null, Date.now() - start);

  return result;
}
