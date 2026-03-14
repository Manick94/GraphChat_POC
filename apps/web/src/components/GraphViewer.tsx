import { useEffect, useState } from 'react';
import { getGraph } from '../lib/api';

interface Props {
  scenarioId?: string;
}

export function GraphViewer({ scenarioId }: Props) {
  const [graph, setGraph] = useState<any>();

  useEffect(() => {
    if (!scenarioId) return;
    getGraph(scenarioId).then(setGraph);
  }, [scenarioId]);

  if (!scenarioId) return <div className="text-sm text-slate-500">Select a scenario to inspect graph.</div>;
  if (!graph) return <div className="text-sm text-slate-500">Loading graph...</div>;

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="font-semibold">Graph Viewer</h3>
      <p className="mt-1 text-sm text-slate-600">{graph.name}</p>
      <div className="mt-3 space-y-2 text-sm">
        {Object.values(graph.nodes).map((node: any) => (
          <div key={node.id} className="rounded-md border p-2">
            <div className="font-medium">{node.id}</div>
            <div className="text-slate-600">{node.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
