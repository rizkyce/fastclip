use std::sync::Mutex;
use rusqlite::Connection;

pub struct AppState {
    pub db: Mutex<Connection>,
    pub export_queue: Mutex<Vec<String>>,
    // Tokens used to cancel long-running AI jobs
    // pub ai_cancel_tokens: Mutex<HashMap<String, CancellationToken>>, 
}

impl AppState {
    pub fn new(db: Connection) -> Self {
        Self {
            db: Mutex::new(db),
            export_queue: Mutex::new(Vec::new()),
        }
    }
}
