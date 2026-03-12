import * as duckdb from '@duckdb/duckdb-wasm';

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: '/duckdb-wasm/duckdb-mvp.wasm',
    mainWorker: '/duckdb-wasm/duckdb-browser-mvp.worker.js',
  },
  eh: {
    mainModule: '/duckdb-wasm/duckdb-eh.wasm',
    mainWorker: '/duckdb-wasm/duckdb-browser-eh.worker.js',
  },
};

let db: duckdb.AsyncDuckDB | null = null;
let initPromise: Promise<duckdb.AsyncDuckDB> | null = null;

export async function getDuckDB(): Promise<duckdb.AsyncDuckDB> {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // Select a bundle based on browser checks
    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);

    // Instantiate the asynchronous version of DuckDB-wasm
    const worker = new Worker(bundle.mainWorker!);
    const logger = new duckdb.ConsoleLogger();
    db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    
    // Create connection and seed some data for the dashboard
    const conn = await db.connect();
    
    // Seed telemetry data
    await conn.query(`
      CREATE TABLE IF NOT EXISTS telemetry AS 
      SELECT * FROM (VALUES 
        (1, 'US-East', 144.6, 240.8, '2026-03-01', 'active'),
        (2, 'EU-West', 121.2, 190.5, '2026-03-02', 'active'),
        (3, 'AP-South', 89.4, 110.2, '2026-03-03', 'warning'),
        (4, 'US-West', 201.8, 310.1, '2026-03-04', 'active'),
        (5, 'SA-East', 45.9, 65.3, '2026-03-05', 'critical'),
        (6, 'US-Central', 180.5, 290.4, '2026-03-06', 'active'),
        (7, 'EU-North', 75.3, 105.8, '2026-03-07', 'active')
      ) AS t(id, region, cost, revenue, date, status);
    `);
    
    // Seed server logs
    await conn.query(`
      CREATE TABLE IF NOT EXISTS server_logs AS
      SELECT * FROM (VALUES
        ('2026-03-12 00:01:00', 'INFO', 'Node initialized', 'core'),
        ('2026-03-12 00:02:15', 'WARN', 'High memory usage', 'auth'),
        ('2026-03-12 00:05:30', 'ERROR', 'Database timeout', 'db_shard_1'),
        ('2026-03-12 00:08:45', 'INFO', 'Scaling up workers', 'core'),
        ('2026-03-12 00:10:00', 'INFO', 'System healthy', 'core')
      ) AS t(timestamp, level, message, service);
    `);
    
    await conn.close();

    return db;
  })();

  return initPromise;
}
