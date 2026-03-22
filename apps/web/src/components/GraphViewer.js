import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================
// Interactive Graph Viewer with D3.js
// ============================================
import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { getGraph } from "../lib/api";
export function GraphViewer({ scenarioId, highlightedNodeId, visitedNodes = [], }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [graph, setGraph] = useState(null);
    const [loading, setLoading] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [selectedNode, setSelectedNode] = useState(null);
    useEffect(() => {
        if (!scenarioId)
            return;
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
        if (!graph || !svgRef.current || !containerRef.current)
            return;
        renderGraph();
    }, [graph, highlightedNodeId, visitedNodes]);
    const renderGraph = useCallback(() => {
        if (!svgRef.current || !containerRef.current)
            return;
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
            .zoom()
            .scaleExtent([0.2, 3])
            .on("zoom", (event) => {
            g.attr("transform", event.transform);
            setZoomLevel(event.transform.k);
        });
        svg.call(zoom);
        const g = svg.append("g");
        // Prepare nodes and links
        const nodes = Object.values(graph.nodes).map((node) => ({
            id: node.id,
            type: node.type,
            personaId: node.personaId,
            emotion: node.metadata?.emotion,
            x: 0,
            y: 0,
        }));
        const links = graph.edges.map((edge) => ({
            source: edge.from,
            target: edge.to,
            trigger: edge.trigger?.type === "button"
                ? Array.isArray(edge.trigger.value)
                    ? edge.trigger.value[0]
                    : edge.trigger.value
                : edge.intentId || edge.trigger?.type,
            intentId: edge.intentId,
        }));
        // Create force simulation
        const simulation = d3
            .forceSimulation(nodes)
            .force("link", d3
            .forceLink(links)
            .id((d) => d.id)
            .distance(120))
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
            .call(d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
        // Node circles with type-based colors
        const nodeColors = {
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
            if (visitedNodes.includes(d.id))
                return "#22c55e";
            if (d.id === highlightedNodeId)
                return "#f97316";
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
                .attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);
            linkLabel
                .attr("x", (d) => (d.source.x + d.target.x) / 2)
                .attr("y", (d) => (d.source.y + d.target.y) / 2);
            node.attr("transform", (d) => `translate(${d.x},${d.y})`);
        });
        // Drag functions
        function dragstarted(event, d) {
            if (!event.active)
                simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event, d) {
            if (!event.active)
                simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
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
        return (_jsxs("div", { className: "rounded-xl border bg-white p-4 shadow-sm", children: [_jsx("h3", { className: "font-semibold text-slate-800", children: "Graph Viewer" }), _jsx("p", { className: "mt-2 text-sm text-slate-500", children: "Select a scenario to inspect the conversation graph." })] }));
    }
    if (loading) {
        return (_jsxs("div", { className: "rounded-xl border bg-white p-4 shadow-sm", children: [_jsx("h3", { className: "font-semibold text-slate-800", children: "Graph Viewer" }), _jsx("p", { className: "mt-2 text-sm text-slate-500", children: "Loading graph..." })] }));
    }
    return (_jsxs("div", { className: "rounded-xl border bg-white p-4 shadow-sm", ref: containerRef, children: [_jsxs("div", { className: "mb-3 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-slate-800", children: "Graph Viewer" }), _jsx("p", { className: "text-sm text-slate-600", children: graph?.name || "Loading..." })] }), _jsxs("div", { className: "text-xs text-slate-500", children: ["Zoom: ", Math.round(zoomLevel * 100), "%"] })] }), _jsx("div", { className: "relative h-[500px] overflow-hidden rounded-lg bg-slate-50", children: _jsx("svg", { ref: svgRef, className: "h-full w-full" }) }), selectedNode && (_jsxs("div", { className: "mt-3 rounded-md bg-slate-100 p-3 text-sm", children: [_jsxs("div", { className: "font-medium text-slate-700", children: ["Node: ", selectedNode] }), _jsxs("div", { className: "text-slate-600", children: ["Type: ", graph?.nodes[selectedNode]?.type] }), graph?.nodes[selectedNode]?.metadata?.emotion && (_jsxs("div", { className: "text-slate-600", children: ["Emotion: ", graph.nodes[selectedNode].metadata.emotion] })), _jsx("button", { className: "mt-2 text-xs text-blue-600 hover:underline", onClick: () => setSelectedNode(null), children: "Close" })] }))] }));
}
