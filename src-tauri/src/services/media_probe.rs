use std::process::Command;
use crate::error::{AppError, AppResult};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct VideoMetadata {
    pub duration_ms: i64,
    pub width: i32,
    pub height: i32,
    pub resolution: String,
    pub codec: String,
    pub fps: f32,
    pub size_bytes: i64,
}

#[derive(Deserialize, Debug)]
struct FfprobeOutput {
    streams: Vec<FfprobeStream>,
    format: FfprobeFormat,
}

#[derive(Deserialize, Debug)]
struct FfprobeStream {
    width: Option<i32>,
    height: Option<i32>,
    codec_name: Option<String>,
    avg_frame_rate: Option<String>,
}

#[derive(Deserialize, Debug)]
struct FfprobeFormat {
    size: Option<String>,
    duration: Option<String>,
}

pub struct MediaProbeService;

impl MediaProbeService {
    pub fn probe(path: &str) -> AppResult<VideoMetadata> {
        let output = Command::new("ffprobe")
            .args([
                "-v", "quiet",
                "-print_format", "json",
                "-show_format",
                "-show_streams",
                path,
            ])
            .output()
            .map_err(|e| AppError::Internal(format!("Failed to run ffprobe: {}", e)))?;

        if !output.status.success() {
            return Err(AppError::Internal("ffprobe failed".into()));
        }

        let ffprobe: FfprobeOutput = serde_json::from_slice(&output.stdout)
            .map_err(|e| AppError::Internal(format!("Failed to parse ffprobe output: {}", e)))?;

        let video_stream = ffprobe.streams.iter()
            .find(|s| s.width.is_some() && s.height.is_some())
            .ok_or_else(|| AppError::Internal("No video stream found".into()))?;

        let duration_ms = ffprobe.format.duration
            .as_ref()
            .and_then(|d| d.parse::<f32>().ok())
            .map(|d| (d * 1000.0) as i64)
            .unwrap_or(0);

        let fps = video_stream.avg_frame_rate
            .as_ref()
            .and_then(|f| Self::parse_fps(f))
            .unwrap_or(0.0);

        let width = video_stream.width.unwrap_or(0);
        let height = video_stream.height.unwrap_or(0);

        Ok(VideoMetadata {
            duration_ms,
            width,
            height,
            resolution: format!("{}x{}", width, height),
            codec: video_stream.codec_name.clone().unwrap_or_else(|| "unknown".into()),
            fps,
            size_bytes: ffprobe.format.size.as_ref().and_then(|s| s.parse::<i64>().ok()).unwrap_or(0),
        })
    }

    pub fn generate_thumbnail(video_path: &str, thumbnail_path: &str, timestamp_ms: i64) -> AppResult<()> {
        let ss = (timestamp_ms as f32 / 1000.0).to_string();
        
        let status = Command::new("ffmpeg")
            .args([
                "-ss", &ss,
                "-i", video_path,
                "-vframes", "1",
                "-q:v", "2",
                "-y",
                thumbnail_path,
            ])
            .status()
            .map_err(|e| AppError::Internal(format!("Failed to run ffmpeg: {}", e)))?;

        if !status.success() {
            return Err(AppError::Internal("ffmpeg thumbnail generation failed".into()));
        }

        Ok(())
    }
    fn parse_fps(avg_frame_rate: &str) -> Option<f32> {
        let parts: Vec<&str> = avg_frame_rate.split('/').collect();
        if parts.len() == 2 {
            let num = parts[0].parse::<f32>().ok()?;
            let den = parts[1].parse::<f32>().ok()?;
            if den == 0.0 { return None; }
            Some(num / den)
        } else {
            avg_frame_rate.parse::<f32>().ok()
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_fps() {
        assert_eq!(MediaProbeService::parse_fps("30/1"), Some(30.0));
        assert_eq!(MediaProbeService::parse_fps("24000/1001"), Some(23.976025));
        assert_eq!(MediaProbeService::parse_fps("60"), Some(60.0));
        assert_eq!(MediaProbeService::parse_fps("invalid"), None);
        assert_eq!(MediaProbeService::parse_fps("30/0"), None);
    }
}
