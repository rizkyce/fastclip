use rusqlite::{Connection, params, Row};
use crate::db::models::*;
use crate::error::AppResult;

pub struct VideoQueries;

impl VideoQueries {
    pub fn insert(conn: &Connection, video: &Video) -> AppResult<()> {
        conn.execute(
            "INSERT INTO videos (id, title, file_path, thumbnail, duration_ms, size_bytes, resolution, codec, fps, status, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
            params![
                video.id,
                video.title,
                video.file_path,
                video.thumbnail,
                video.duration_ms,
                video.size_bytes,
                video.resolution,
                video.codec,
                video.fps,
                video.status,
                video.created_at,
                video.updated_at,
            ],
        )?;
        Ok(())
    }

    pub fn get_all(conn: &Connection) -> AppResult<Vec<Video>> {
        let mut stmt = conn.prepare("SELECT * FROM videos ORDER BY created_at DESC")?;
        let video_iter = stmt.query_map([], |row| Self::map_row(row))?;

        let mut videos = Vec::new();
        for video in video_iter {
            videos.push(video?);
        }
        Ok(videos)
    }

    pub fn get_by_id(conn: &Connection, id: &str) -> AppResult<Option<Video>> {
        let mut stmt = conn.prepare("SELECT * FROM videos WHERE id = ?1")?;
        let mut rows = stmt.query(params![id])?;

        if let Some(row) = rows.next()? {
            Ok(Some(Self::map_row(row)?))
        } else {
            Ok(None)
        }
    }

    pub fn delete(conn: &Connection, id: &str) -> AppResult<()> {
        conn.execute("DELETE FROM videos WHERE id = ?1", params![id])?;
        Ok(())
    }

    fn map_row(row: &Row) -> rusqlite::Result<Video> {
        Ok(Video {
            id: row.get(0)?,
            title: row.get(1)?,
            file_path: row.get(2)?,
            thumbnail: row.get(3)?,
            duration_ms: row.get(4)?,
            size_bytes: row.get(5)?,
            resolution: row.get(6)?,
            codec: row.get(7)?,
            fps: row.get(8)?,
            status: row.get(9)?,
            created_at: row.get(10)?,
            updated_at: row.get(11)?,
        })
    }
}

pub struct ProjectQueries;

impl ProjectQueries {
    pub fn insert(conn: &Connection, project: &Project) -> AppResult<()> {
        conn.execute(
            "INSERT INTO projects (id, name, video_id, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5)",
            params![project.id, project.name, project.video_id, project.created_at, project.updated_at],
        )?;
        Ok(())
    }

    pub fn get_all(conn: &Connection) -> AppResult<Vec<Project>> {
        let mut stmt = conn.prepare("SELECT * FROM projects ORDER BY updated_at DESC")?;
        let project_iter = stmt.query_map([], |row| Self::map_row(row))?;

        let mut projects = Vec::new();
        for project in project_iter {
            projects.push(project?);
        }
        Ok(projects)
    }

    pub fn get_recent(conn: &Connection, limit: i32) -> AppResult<Vec<Project>> {
        let mut stmt = conn.prepare("SELECT * FROM projects ORDER BY updated_at DESC LIMIT ?1")?;
        let project_iter = stmt.query_map(params![limit], |row| Self::map_row(row))?;

        let mut projects = Vec::new();
        for project in project_iter {
            projects.push(project?);
        }
        Ok(projects)
    }

    fn map_row(row: &Row) -> rusqlite::Result<Project> {
        Ok(Project {
            id: row.get(0)?,
            name: row.get(1)?,
            video_id: row.get(2)?,
            created_at: row.get(3)?,
            updated_at: row.get(4)?,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rusqlite::Connection;

    fn setup_test_db() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        conn.execute(
            "CREATE TABLE videos (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                file_path TEXT NOT NULL,
                thumbnail TEXT,
                duration_ms INTEGER NOT NULL,
                size_bytes INTEGER NOT NULL,
                resolution TEXT,
                codec TEXT,
                fps REAL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )",
            [],
        ).unwrap();
        
        conn.execute(
            "CREATE TABLE projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                video_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(video_id) REFERENCES videos(id)
            )",
            [],
        ).unwrap();
        
        conn
    }

    #[test]
    fn test_video_crud() {
        let conn = setup_test_db();
        let video = Video {
            id: "test-v1".into(),
            title: "Test Video".into(),
            file_path: "/path/to/test.mp4".into(),
            thumbnail: Some("/path/to/thumb.jpg".into()),
            duration_ms: 10000,
            size_bytes: 5000000,
            resolution: Some("1920x1080".into()),
            codec: Some("h264".into()),
            fps: Some(30.0),
            status: "raw".into(),
            created_at: "2024-01-01T00:00:00Z".into(),
            updated_at: "2024-01-01T00:00:00Z".into(),
        };

        VideoQueries::insert(&conn, &video).expect("Insert failed");
        
        let all = VideoQueries::get_all(&conn).expect("Get all failed");
        assert_eq!(all.len(), 1);
        assert_eq!(all[0].id, "test-v1");
        
        let found = VideoQueries::get_by_id(&conn, "test-v1").expect("Get by id failed");
        assert!(found.is_some());
        assert_eq!(found.unwrap().title, "Test Video");
    }

    #[test]
    fn test_project_crud() {
        let conn = setup_test_db();
        // Need a video first
        let video = Video {
            id: "v1".into(),
            title: "V1".into(),
            file_path: "p".into(),
            thumbnail: None,
            duration_ms: 0,
            size_bytes: 0,
            resolution: None,
            codec: None,
            fps: None,
            status: "raw".into(),
            created_at: "t".into(),
            updated_at: "t".into(),
        };
        VideoQueries::insert(&conn, &video).unwrap();

        let project = Project {
            id: "p1".into(),
            name: "My Project".into(),
            video_id: "v1".into(),
            created_at: "2024-01-01T00:00:00Z".into(),
            updated_at: "2024-01-01T00:00:00Z".into(),
        };

        ProjectQueries::insert(&conn, &project).unwrap();
        
        let recent = ProjectQueries::get_recent(&conn, 5).unwrap();
        assert_eq!(recent.len(), 1);
        assert_eq!(recent[0].id, "p1");
    }
}
