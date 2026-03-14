import fs from 'node:fs';
import path from 'node:path';
import { Router } from 'express';
import { loadGraph } from '../graph/loader';

const router = Router();
const scenarioDir = path.join(__dirname, '..', 'scenarios');

router.get('/', (_req, res) => {
  const files = fs.readdirSync(scenarioDir).filter((file) => file.endsWith('.json'));
  const scenarios = files.map((file) => {
    const graph = loadGraph(file.replace('.json', ''));
    return { id: graph.id, name: graph.name, description: graph.description, version: graph.version };
  });

  return res.json(scenarios);
});

router.get('/:id/graph', (req, res) => {
  try {
    return res.json(loadGraph(req.params.id));
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
});

router.post('/:id/validate', (req, res) => {
  try {
    const graph = loadGraph(req.params.id);
    const nodeIds = new Set(Object.keys(graph.nodes));
    const invalidEdges = graph.edges.filter((edge) => !nodeIds.has(edge.from) || !nodeIds.has(edge.to));
    return res.json({
      isValid: invalidEdges.length === 0,
      invalidEdges
    });
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
});

export default router;
