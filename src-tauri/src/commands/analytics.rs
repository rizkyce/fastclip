use tauri::{AppHandle, Manager, Runtime};
use crate::state::AppState;
use crate::db::models::Project;
use crate::db::queries::ProjectQueries;
use crate::error::{AppError, AppResult};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct DashboardStats {
    pub total_videos: i64,
    pub total_projects: i64,
    pub total_clips: i64,
    pub time_saved_mins: i64,
    pub storage_used_gb: f64,
}

#[tauri::command]
pub async fn get_dashboard_stats<R: Runtime>(app: AppHandle<R>) -> AppResult<DashboardStats> {
    let state = app.state::<AppState>();
    let db = state.db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    
    let total_videos: i64 = db.query_row("SELECT count(*) FROM videos", [], |r| r.get::<_, i64>(0))?;
    let total_projects: i64 = db.query_row("SELECT count(*) FROM projects", [], |r| r.get::<_, i64>(0))?;
    let total_clips: i64 = db.query_row("SELECT count(*) FROM exports WHERE status = 'completed'", [], |r| r.get::<_, i64>(0))?;
    
    // Hardcoded stats for now until logic is implemented
    Ok(DashboardStats {
        total_videos,
        total_projects,
        total_clips,
        time_saved_mins: 154, // Placeholder
        storage_used_gb: 12.4, // Placeholder
    })
}

#[tauri::command]
pub async fn get_recent_projects<R: Runtime>(app: AppHandle<R>, limit: i32) -> AppResult<Vec<Project>> {
    let state = app.state::<AppState>();
    let db = state.db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    ProjectQueries::get_recent(&db, limit)
}

#[tauri::command]
pub async fn get_active_ai_jobs<R: Runtime>(_app: AppHandle<R>) -> AppResult<Vec<serde_json::Value>> {
    // Placeholder returning empty list for now
    Ok(vec![])
}
