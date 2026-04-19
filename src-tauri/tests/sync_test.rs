#[cfg(test)]
mod tests {
    use tauri_app_lib::commands::settings;
    use tauri_app_lib::db;

    #[tokio::test]
    async fn test_database_initialization() {
        // Test in-memory DB to verify migrations logic
        let result = db::init_db(":memory:");
        assert!(result.is_ok(), "Database initialization failed");
        
        let conn = result.unwrap();
        // Check if projects table exists (from migrations)
        let table_check: Result<i32, _> = conn.query_row(
            "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='projects'",
            [],
            |row| row.get(0),
        );
        assert_eq!(table_check.unwrap(), 1, "Projects table should exist after migration");
    }

    #[tokio::test]
    async fn test_api_keys_logic() {
        let result = settings::get_api_key_status("test_provider".to_string()).await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_ffmpeg_check() {
        let result = settings::check_ffmpeg_status().await;
        assert!(result.is_ok());
    }
}
