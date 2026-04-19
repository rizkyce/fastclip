use tauri::AppHandle;
use tauri_plugin_store::StoreExt;
use crate::error::{AppError, AppResult};
use crate::services::config::KeyringService;
use crate::services::ffmpeg::{FfmpegService, FfmpegInfo};

#[tauri::command]
pub async fn set_api_key(provider: String, key: String) -> AppResult<()> {
    KeyringService::set_api_key(&provider, &key)
}

#[tauri::command]
pub async fn get_api_key_status(provider: String) -> AppResult<bool> {
    Ok(KeyringService::get_api_key(&provider)?.is_some())
}

#[tauri::command]
pub async fn check_ffmpeg_status() -> AppResult<FfmpegInfo> {
    FfmpegService::check_availability()
}

#[tauri::command]
pub async fn save_setting(app: AppHandle, key: String, value: serde_json::Value) -> AppResult<()> {
    let stores = app.store("settings.json").map_err(|e| AppError::Internal(e.to_string()))?;
    stores.set(key, value);
    stores.save().map_err(|e| AppError::Internal(e.to_string()))?;
    Ok(())
}

#[tauri::command]
pub async fn get_setting(app: AppHandle, key: String) -> AppResult<Option<serde_json::Value>> {
    let stores = app.store("settings.json").map_err(|e| AppError::Internal(e.to_string()))?;
    Ok(stores.get(key))
}
