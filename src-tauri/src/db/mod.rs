pub mod schema;
pub mod models;
pub mod queries;

use rusqlite::Connection;
use std::path::Path;
use crate::error::AppResult;

pub fn init_db<P: AsRef<Path>>(path: P) -> AppResult<Connection> {
    let mut conn = Connection::open(path)?;
    
    // Enable WAL mode for concurrency and crash protection (Recommendation 13)
    conn.pragma_update(None, "journal_mode", "WAL")?;
    conn.pragma_update(None, "synchronous", "NORMAL")?;
    conn.pragma_update(None, "foreign_keys", "ON")?;

    let migrations = schema::get_migrations();
    migrations.to_latest(&mut conn)?;

    Ok(conn)
}
