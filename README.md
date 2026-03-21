# DuckDB Dashboard

A high-performance, browser-native analytical dashboard powered by **DuckDB-Wasm**. This project provides a comprehensive suite for data exploration, SQL analysis, and AI-driven insights—all running entirely in your browser.

## 🚀 Features

- **DuckDB-Wasm Integration**: Leverage the power of DuckDB directly in the browser for lightning-fast analytical queries on local or remote data.
- **SQL Workbench**: A fully-featured SQL editor with syntax highlighting, query history, and real-time execution.
- **Interactive Data Grid**: View and explore query results with a high-performance data table powered by TanStack Table.
- **Visualizer**: Create instant visualizations (Bar, Line, Pie charts) from your SQL results to identify trends and patterns using Recharts.
- **Oracle AI Chatbot**: An integrated AI assistant that helps you write SQL, debug queries, and interpret your data based on telemetry, server logs, or user logs.
- **Modular Dashboard Layout**: A clean, responsive grid-based interface built with React Grid Layout, Base UI, and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router)
- **Database**: [DuckDB-Wasm](https://duckdb.org/docs/api/wasm/overview)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) & [@base-ui/react](https://base-ui.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Tables**: [TanStack React Table](https://tanstack.com/table/v8)

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/colemaster/duckdb-dash.git
   cd duckdb-dash
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the dashboard in action.

## 📖 Usage

1. **Load Data**: Use the SQL Workbench to run `INSTALL` or `LOAD` commands, or simply query remote Parquet/CSV files. Example tables: `telemetry`, `server_logs`, `users_log`.
2. **Execute SQL**: Write your analytical queries in the editor and hit "Run".
3. **Visualize**: Toggle the Visualizer to transform your result set into a chart.
4. **Ask the Oracle**: Use the Chatbot in the sidebar for help with complex SQL syntax or data interpretation.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by [Colemaster](https://github.com/colemaster)