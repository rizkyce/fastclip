pub mod db;
pub mod error;
pub mod state;
pub mod commands;
pub mod services;

use tauri::Manager;
use tauri_plugin_log::{Target, TargetKind};
use crate::state::AppState;

#[tauri::command]
fn get_app_info() -> String {
    format!("FastClip v{}", env!("CARGO_PKG_VERSION"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
            }
        }))
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir { file_name: None }),
                ])
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // 1. Resolve database path
            let app_data_dir = app.path().app_data_dir().expect("Failed to get app data dir");
            if !app_data_dir.exists() {
                std::fs::create_dir_all(&app_data_dir).expect("Failed to create app data dir");
            }
            let db_path = app_data_dir.join("fastclip.db");
            
            // 2. Initialize Database
            let conn = db::init_db(db_path).expect("Failed to initialize database");
            
            // 3. Manage Global State
            app.manage(AppState::new(conn));
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_app_info,
            crate::commands::settings::set_api_key,
            crate::commands::settings::get_api_key_status,
            crate::commands::settings::check_ffmpeg_status,
            crate::commands::settings::save_setting,
            crate::commands::settings::get_setting,
            crate::commands::video::import_video_file,
            crate::commands::video::import_video_drop,
            crate::commands::library::get_all_videos,
            crate::commands::library::delete_video,
            crate::commands::library::search_videos,
            crate::commands::analytics::get_dashboard_stats,
            crate::commands::analytics::get_recent_projects,
            crate::commands::analytics::get_active_ai_jobs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
