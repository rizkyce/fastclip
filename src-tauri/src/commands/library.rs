use tauri::{AppHandle, Manager, Runtime};
use crate::state::AppState;
use crate::db::models::Video;
use crate::db::queries::VideoQueries;
use crate::error::{AppError, AppResult};

#[tauri::command]
pub async fn get_all_videos<R: Runtime>(app: AppHandle<R>) -> AppResult<Vec<Video>> {
    let state = app.state::<AppState>();
    let db = state.db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    VideoQueries::get_all(&db)
}

#[tauri::command]
pub async fn delete_video<R: Runtime>(app: AppHandle<R>, id: String) -> AppResult<()> {
    let state = app.state::<AppState>();
    let db = state.db.lock().map_err(|e| AppError::Internal(e.to_string()))?;
    
    // 1. Get video info to find files
    if let Some(video) = VideoQueries::get_by_id(&db, &id)? {
        // 2. Delete files
        if let Some(thumb) = video.thumbnail {
            let _ = std::fs::remove_file(thumb);
        }
        let _ = std::fs::remove_file(video.file_path);
        
        // 3. Delete from DB
        VideoQueries::delete(&db, &id)?;
    }
    
    Ok(())
}

#[tauri::command]
pub async fn search_videos<R: Runtime>(app: AppHandle<R>, query: String, filter: String) -> AppResult<Vec<Video>> {
    // Basic implementation for now
    let videos = get_all_videos(app).await?;
    let lower_query = query.to_lowercase();
    
    Ok(videos.into_iter()
        .filter(|v| {
            let matches_query = v.title.to_lowercase().contains(&lower_query);
            let matches_filter = match filter.as_str() {
                "all" | "" => true,
                _ => v.status == filter
            };
            matches_query && matches_filter
        })
        .collect())
}
