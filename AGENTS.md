# AI Agents in DuckDB Dashboard

This document outlines the architecture and capabilities of the AI agents integrated into the DuckDB Dashboard.

## 🔮 The Oracle (SQL Assistant Agent)

**The Oracle** is the primary interaction point for natural language data exploration. It acts as a bridge between the user's intent and the structured world of SQL.

### Current Capabilities
- **Text-to-SQL Translation**: Translates natural language questions (e.g., "Show me error logs from last hour") into valid DuckDB SQL syntax.
- **Context Awareness**: Understands basic domain concepts like "telemetry", "revenue", and "server logs" to generate relevant queries.
- **Workbench Integration**: Automatically pushes generated SQL to the SQL Workbench for immediate execution and visualization.

### Architecture
Currently, the agent uses a pattern-matching and simulation layer in `OracleChatbot.tsx`. In production-ready versions, this is intended to connect to a Large Language Model (LLM) backend.

- **Frontend**: React-based UI with `framer-motion` for fluid feedback.
- **State**: Managed via `useChatStore` to persist conversation history and `useQueryStore` to synchronize with the database engine.
- **Engine**: Planned integration with **Google Genkit** for robust prompt engineering and tool-calling (allowing the agent to describe tables or verify SQL before suggesting it).

## 🚀 Future Roadmap for Agents

1. **Schema Discovery Agent**: An autonomous agent that scans the `DuckDB` catalog (`information_schema`) to provide the LLM with up-to-date table definitions and column types.
2. **Auto-Visualization Agent**: A specialized agent that recommends the best chart type (Line, Bar, Pie) based on the shape and data types of the SQL result set.
3. **Anomaly Detection Agent**: A background agent that monitors data streams for statistical outliers and alerts the user via the chat interface.

## 🛠️ Frameworks Used

- **Google Genkit (Planned)**: For structured output and LLM orchestration.
- **DuckDB-Wasm**: For local, high-speed execution of agent-suggested queries.

---

For technical details on the UI implementation, see `src/components/widgets/OracleChatbot.tsx`.
