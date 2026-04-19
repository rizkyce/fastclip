use std::process::Command;
use crate::error::AppResult;

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct FfmpegInfo {
    pub is_available: bool,
    pub path: Option<String>,
    pub version: Option<String>,
}

pub struct FfmpegService;

impl FfmpegService {
    pub fn check_availability() -> AppResult<FfmpegInfo> {
        let output = if cfg!(target_os = "windows") {
            Command::new("where").arg("ffmpeg").output()
        } else {
            Command::new("which").arg("ffmpeg").output()
        };

        match output {
            Ok(output) if output.status.success() => {
                let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
                
                // Get version
                let version_output = Command::new("ffmpeg").arg("-version").output();
                let version = if let Ok(v) = version_output {
                    let full_v = String::from_utf8_lossy(&v.stdout);
                    full_v.lines().next().map(|s| s.to_string())
                } else {
                    None
                };

                Ok(FfmpegInfo {
                    is_available: true,
                    path: Some(path),
                    version,
                })
            }
            _ => Ok(FfmpegInfo {
                is_available: false,
                path: None,
                version: None,
            }),
        }
    }

    pub fn check_ffprobe_availability() -> bool {
        let output = if cfg!(target_os = "windows") {
            Command::new("where").arg("ffprobe").output()
        } else {
            Command::new("which").arg("ffprobe").output()
        };

        output.map(|o| o.status.success()).unwrap_or(false)
    }
}
