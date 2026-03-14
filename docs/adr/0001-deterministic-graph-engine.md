# ADR 0001: Deterministic Graph Engine for Corporate Training

## Status
Accepted

## Context
Corporate training teams need repeatable role-play simulations that are auditable and editable without prompt engineering or external AI services.

## Decision
Use a finite-state graph traversal engine where each node and edge is represented in JSON scenarios. The runtime resolves transitions by deterministic trigger evaluation with explicit priority (exact, regex, intent similarity, then fuzzy matching).

## Consequences
- Reproducible outcomes.
- Full traversal audit history in SQLite.
- Low latency and offline operation.
- Less open-ended language variation than LLM-based systems.
