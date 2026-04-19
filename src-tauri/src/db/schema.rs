use rusqlite_migration::{Migrations, M};

pub fn get_migrations() -> Migrations<'static> {
    Migrations::new(vec![
        M::up(
            r#"
            -- Core tables
            CREATE TABLE videos (
                id          TEXT PRIMARY KEY,
                title       TEXT NOT NULL,
                file_path   TEXT NOT NULL,
                thumbnail   TEXT,
                duration_ms INTEGER NOT NULL DEFAULT 0,
                size_bytes  INTEGER NOT NULL DEFAULT 0,
                resolution  TEXT,
                codec       TEXT,
                fps         REAL,
                status      TEXT NOT NULL DEFAULT 'raw'
                            CHECK(status IN ('raw','processing','analyzed','exported')),
                created_at  TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE projects (
                id          TEXT PRIMARY KEY,
                name        TEXT NOT NULL,
                video_id    TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
                created_at  TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE highlights (
                id          TEXT PRIMARY KEY,
                video_id    TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
                project_id  TEXT REFERENCES projects(id) ON DELETE SET NULL,
                start_ms    INTEGER NOT NULL,
                end_ms      INTEGER NOT NULL,
                confidence  REAL NOT NULL DEFAULT 0.0,
                transcript  TEXT,
                label       TEXT,
                status      TEXT NOT NULL DEFAULT 'detected'
                            CHECK(status IN ('detected','approved','rejected')),
                created_at  TEXT NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE exports (
                id             TEXT PRIMARY KEY,
                project_id     TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                highlight_id   TEXT REFERENCES highlights(id) ON DELETE SET NULL,
                name           TEXT NOT NULL,
                status         TEXT NOT NULL DEFAULT 'queued'
                               CHECK(status IN ('queued','processing','completed','failed','cancelled')),
                progress       INTEGER NOT NULL DEFAULT 0,
                aspect_ratio   TEXT NOT NULL DEFAULT '9:16',
                resolution     TEXT NOT NULL DEFAULT '1080p',
                codec          TEXT NOT NULL DEFAULT 'h264',
                bitrate        INTEGER DEFAULT 8000,
                estimated_size TEXT,
                eta            TEXT,
                output_path    TEXT,
                thumbnail      TEXT,
                error          TEXT,
                created_at     TEXT NOT NULL DEFAULT (datetime('now')),
                completed_at   TEXT
            );

            CREATE TABLE ai_jobs (
                id              TEXT PRIMARY KEY,
                project_id      TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                video_name      TEXT NOT NULL,
                status          TEXT NOT NULL DEFAULT 'idle'
                                CHECK(status IN ('idle','transcribing','analyzing','detecting','done','error')),
                progress        INTEGER NOT NULL DEFAULT 0,
                current_step    TEXT,
                model_used      TEXT,
                error_msg       TEXT,
                cpu_usage       REAL DEFAULT 0,
                memory_usage    REAL DEFAULT 0,
                estimated_left  TEXT,
                started_at      TEXT,
                completed_at    TEXT
            );

            CREATE TABLE ai_job_steps (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                job_id      TEXT NOT NULL REFERENCES ai_jobs(id) ON DELETE CASCADE,
                name        TEXT NOT NULL,
                status      TEXT NOT NULL DEFAULT 'pending'
                            CHECK(status IN ('pending','active','done','error')),
                progress    INTEGER NOT NULL DEFAULT 0,
                sort_order  INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE settings (
                key         TEXT PRIMARY KEY,
                value       TEXT NOT NULL,
                updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
            );

            -- Performance indices
            CREATE INDEX idx_videos_status ON videos(status);
            CREATE INDEX idx_projects_video ON projects(video_id);
            CREATE INDEX idx_highlights_video ON highlights(video_id);
            CREATE INDEX idx_exports_project ON exports(project_id);
            CREATE INDEX idx_exports_status ON exports(status);
            CREATE INDEX idx_ai_jobs_project ON ai_jobs(project_id);
            CREATE INDEX idx_ai_jobs_status ON ai_jobs(status);
            "#,
        ),
    ])
}
