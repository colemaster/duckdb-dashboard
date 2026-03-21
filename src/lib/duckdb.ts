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
    
    // Add realistic datasets and leverage DuckDB's fast ingestion
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users_log AS
      SELECT * FROM (VALUES
        (1, 'alice@quantum.io', '192.168.1.10', '2026-03-12 08:00:00', 'LOGIN_SUCCESS', 'USA'),
        (2, 'bob@quantum.io', '192.168.1.15', '2026-03-12 08:05:00', 'LOGIN_FAILED', 'UK'),
        (3, 'charlie@quantum.io', '192.168.1.20', '2026-03-12 08:15:00', 'DATA_EXPORT', 'JP'),
        (4, 'diana@quantum.io', '192.168.1.25', '2026-03-12 08:30:00', 'LOGIN_SUCCESS', 'DE'),
        (5, 'eve@quantum.io', '192.168.1.30', '2026-03-12 08:45:00', 'QUERY_RUN', 'USA'),
        (6, 'bob@quantum.io', '192.168.1.15', '2026-03-12 09:00:00', 'LOGIN_SUCCESS', 'UK'),
        (7, 'alice@quantum.io', '192.168.1.10', '2026-03-12 09:10:00', 'LOGOUT', 'USA')
      ) AS t(id, user_email, ip_address, timestamp, event_type, country);
    `);

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

    // Mount the generated parquet dataset as a native view
    try {
      await conn.query(`
        CREATE VIEW telemetry_large AS 
        SELECT * FROM read_parquet('http://localhost:3000/data/telemetry_large.parquet');
      `);
    } catch (e) {
      console.error('Failed to mount parquet view:', e);
    }
    
    await conn.close();

    return db;
  })();

  return initPromise;
}
