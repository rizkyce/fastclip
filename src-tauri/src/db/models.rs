use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Video {
    pub id: String,
    pub title: String,
    pub file_path: String,
    pub thumbnail: Option<String>,
    pub duration_ms: i64,
    pub size_bytes: i64,
    pub resolution: Option<String>,
    pub codec: Option<String>,
    pub fps: Option<f64>,
    pub status: String, // raw|processing|analyzed|exported
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub video_id: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Highlight {
    pub id: String,
    pub video_id: String,
    pub project_id: Option<String>,
    pub start_ms: i64,
    pub end_ms: i64,
    pub confidence: f64,
    pub transcript: Option<String>,
    pub label: Option<String>,
    pub status: String, // detected|approved|rejected
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExportItem {
    pub id: String,
    pub project_id: String,
    pub highlight_id: Option<String>,
    pub name: String,
    pub status: String, // queued|processing|completed|failed|cancelled
    pub progress: i32,
    pub aspect_ratio: String,
    pub resolution: String,
    pub codec: String,
    pub bitrate: Option<i32>,
    pub estimated_size: Option<String>,
    pub eta: Option<String>,
    pub output_path: Option<String>,
    pub thumbnail: Option<String>,
    pub error: Option<String>,
    pub created_at: String,
    pub completed_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AIJob {
    pub id: String,
    pub project_id: String,
    pub video_name: String,
    pub status: String, // idle|transcribing|analyzing|detecting|done|error
    pub progress: i32,
    pub current_step: Option<String>,
    pub model_used: Option<String>,
    pub error_msg: Option<String>,
    pub cpu_usage: Option<f64>,
    pub memory_usage: Option<f64>,
    pub estimated_left: Option<String>,
    pub started_at: Option<String>,
    pub completed_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AIJobStep {
    pub id: i32,
    pub job_id: String,
    pub name: String,
    pub status: String, // pending|active|done|error
    pub progress: i32,
    pub sort_order: i32,
}
