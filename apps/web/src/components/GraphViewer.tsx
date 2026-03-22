// ============================================
// Interactive Graph Viewer with D3.js
// ============================================

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { getGraph } from "../lib/api";

interface NodeData {
  id: string;
  type: string;
  personaId?: string;
  emotion?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface LinkData {
  source: string;
  target: string;
  trigger?: string;
  intentId?: string;
}

interface GraphData {
  id: string;
  name: string;
  nodes: Record<string, any>;
  edges: any[];
  personas?: any[];
}

interface Props {
  scenarioId?: string | null;
  highlightedNodeId?: string | null;
  visitedNodes?: string[];
}

export function GraphViewer({
  scenarioId,
  highlightedNodeId,
  visitedNodes = [],
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!scenarioId) return;
    setLoading(true);
    getGraph(scenarioId)
      .then((data) => {
        setGraph(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load graph:", err);
        setLoading(false);
      });
  }, [scenarioId]);

  useEffect(() => {
    if (!graph || !svgRef.current || !containerRef.current) return;

    renderGraph();
  }, [graph, highlightedNodeId, visitedNodes]);

  const renderGraph = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    const g = svg.append("g");

    // Prepare nodes and links
    const nodes: NodeData[] = Object.values(graph!.nodes).map((node: any) => ({
      id: node.id,
      type: node.type,
      personaId: node.personaId,
      emotion: node.metadata?.emotion,
      x: 0,
      y: 0,
    }));

    const links: LinkData[] = graph!.edges.map((edge: any) => ({
      source: edge.from,
      target: edge.to,
      trigger:
        edge.trigger?.type === "button"
          ? Array.isArray(edge.trigger.value)
            ? edge.trigger.value[0]
            : edge.trigger.value
          : edge.intentId || edge.trigger?.type,
      intentId: edge.intentId,
    }));

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<NodeData, LinkData>(links)
          .id((d: any) => d.id)
          .distance(120),
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50));

    // Draw links
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll("g")
      .data(links)
      .join("g");

    const linkLine = link
      .append("line")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6);

    const linkLabel = link
      .append("text")
      .attr("class", "link-label")
      .attr("font-size", "10px")
      .attr("fill", "#64748b")
      .attr("text-anchor", "middle")
      .text((d) => d.trigger || "");

    // Draw nodes
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(
        d3
          .drag<SVGGElement, NodeData>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any,
      );

    // Node circles with type-based colors
    const nodeColors: Record<string, string> = {
      bot: "#3b82f6",
      "user-input": "#10b981",
      decision: "#f59e0b",
      end: "#ef4444",
      redirect: "#8b5cf6",
      branch: "#ec4899",
    };

    const nodeCircles = node
      .append("circle")
      .attr("r", 30)
      .attr("fill", (d) => {
        if (visitedNodes.includes(d.id)) return "#22c55e";
        if (d.id === highlightedNodeId) return "#f97316";
        return nodeColors[d.type] || "#64748b";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d.id);
      });

    // Add glow effect for highlighted node
    nodeCircles
      .filter((d) => (highlightedNodeId ? d.id === highlightedNodeId : false))
      .attr("filter", "drop-shadow(0 0 8px rgba(249, 115, 22, 0.8))");

    // Node labels
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("font-size", "11px")
      .attr("fill", "#1e293b")
      .attr("font-weight", "600")
      .text((d) => d.id);

    // Node type indicator
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 20)
      .attr("font-size", "9px")
      .attr("fill", "#64748b")
      .text((d) => d.type);

    // Emotion indicator
    node
      .filter((d) => (d.emotion ? true : false))
      .append("title")
      .text((d) => `Emotion: ${d.emotion}`);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      linkLine
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      linkLabel
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: NodeData) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      (d as any).fx = d.x;
      (d as any).fy = d.y;
    }

    function dragged(event: any, d: NodeData) {
      (d as any).fx = event.x;
      (d as any).fy = event.y;
    }

    function dragended(event: any, d: NodeData) {
      if (!event.active) simulation.alphaTarget(0);
      (d as any).fx = null;
      (d as any).fy = null;
    }

    // Add legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(20, ${height - 120})`);

    const legendItems = [
      { color: "#3b82f6", label: "Bot" },
      { color: "#10b981", label: "User Input" },
      { color: "#f59e0b", label: "Decision" },
      { color: "#ef4444", label: "End" },
      { color: "#22c55e", label: "Visited" },
      { color: "#f97316", label: "Current" },
    ];

    legendItems.forEach((item, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow.append("circle").attr("r", 6).attr("fill", item.color);

      legendRow
        .append("text")
        .attr("x", 15)
        .attr("y", 4)
        .attr("font-size", "11px")
        .attr("fill", "#475569")
        .text(item.label);
    });

    // Add zoom controls
    const zoomControls = svg
      .append("g")
      .attr("class", "zoom-controls")
      .attr("transform", `translate(${width - 60}, 20)`);

    zoomControls
      .append("circle")
      .attr("r", 15)
      .attr("fill", "#fff")
      .attr("stroke", "#cbd5e1")
      .attr("cursor", "pointer")
      .on("click", () => {
        svg.transition().call(zoom.scaleBy, 1.3);
      })
      .append("title")
      .text("Zoom In");

    zoomControls
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("font-size", "16px")
      .attr("fill", "#475569")
      .text("+");

    zoomControls
      .append("circle")
      .attr("r", 15)
      .attr("fill", "#fff")
      .attr("stroke", "#cbd5e1")
      .attr("cursor", "pointer")
      .attr("transform", "translate(0, 35)")
      .on("click", () => {
        svg.transition().call(zoom.scaleBy, 0.7);
      })
      .append("title")
      .text("Zoom Out");

    zoomControls
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 39)
      .attr("font-size", "16px")
      .attr("fill", "#475569")
      .text("-");

    // Reset zoom button
    zoomControls
      .append("circle")
      .attr("r", 15)
      .attr("fill", "#fff")
      .attr("stroke", "#cbd5e1")
      .attr("cursor", "pointer")
      .attr("transform", "translate(0, 70)")
      .on("click", () => {
        svg.transition().call(zoom.transform, d3.zoomIdentity);
      })
      .append("title")
      .text("Reset View");

    zoomControls
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 74)
      .attr("font-size", "10px")
      .attr("fill", "#475569")
      .text("Reset");
  }, [graph, highlightedNodeId, visitedNodes]);

  if (!scenarioId) {
    return (
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="font-semibold text-slate-800">Graph Viewer</h3>
        <p className="mt-2 text-sm text-slate-500">
          Select a scenario to inspect the conversation graph.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="font-semibold text-slate-800">Graph Viewer</h3>
        <p className="mt-2 text-sm text-slate-500">Loading graph...</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border bg-white p-4 shadow-sm"
      ref={containerRef}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">Graph Viewer</h3>
          <p className="text-sm text-slate-600">
            {graph?.name || "Loading..."}
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Zoom: {Math.round(zoomLevel * 100)}%
        </div>
      </div>
      <div className="relative h-[500px] overflow-hidden rounded-lg bg-slate-50">
        <svg ref={svgRef} className="h-full w-full" />
      </div>
      {selectedNode && (
        <div className="mt-3 rounded-md bg-slate-100 p-3 text-sm">
          <div className="font-medium text-slate-700">Node: {selectedNode}</div>
          <div className="text-slate-600">
            Type: {graph?.nodes[selectedNode]?.type}
          </div>
          {graph?.nodes[selectedNode]?.metadata?.emotion && (
            <div className="text-slate-600">
              Emotion: {graph.nodes[selectedNode].metadata.emotion}
            </div>
          )}
          <button
            className="mt-2 text-xs text-blue-600 hover:underline"
            onClick={() => setSelectedNode(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
