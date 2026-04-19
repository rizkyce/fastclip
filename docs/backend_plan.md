# FastClip Backend Implementation Plan — Tauri v2 Rust

## Overview

FastClip is an AI-powered video clipping desktop application built with **Tauri v2 + SolidJS + TailwindCSS v4**. The frontend is fully built with 8 pages, mock data, and comprehensive UI — but the Rust backend is a bare scaffold with only a `greet` command. This plan designs the complete Rust backend to power every feature across all pages.

> [!IMPORTANT]
> **Current State:** Frontend = production-quality UI with MOCK_DATA everywhere. Backend = blank Tauri v2 scaffold.
> **Goal:** Replace all mock data with real Rust-powered backend commands, file I/O, AI pipeline orchestration, and FFmpeg video processing.

---

## Architecture Decision: Pure Rust Backend

### Recommendation: Build everything in `src-tauri/src/` with Tauri Commands + Official Plugins

**Why Rust-native over Node/Python sidecar:**
- **Performance**: Video processing, transcription, and AI inference are CPU/GPU-bound — Rust handles this natively
- **Single Binary**: No external runtime dependencies for end users
- **Tauri v2 IPC**: First-class `#[tauri::command]` system with typed arguments/returns via Serde
- **Security**: Desktop app needs file system access, process spawning — Rust's ownership model prevents memory bugs
- **Plugin Ecosystem**: Tauri v2 official plugins cover dialog, fs, store, notification, clipboard, shell

### Module Architecture

```
src-tauri/src/
├── main.rs                    # Entry point
├── lib.rs                     # Tauri builder, plugin registration, state management
├── db/
│   ├── mod.rs                 # Database module
│   ├── schema.rs              # Table definitions & migrations
│   ├── models.rs              # Rust structs mapped to DB rows
│   └── queries.rs             # All SQL query functions
├── commands/
│   ├── mod.rs                 # Re-exports all command modules
│   ├── project.rs             # Project CRUD commands
│   ├── video.rs               # Video import, metadata extraction
│   ├── library.rs             # Library browsing, filtering, search
│   ├── editor.rs              # Editor state, timeline, captions
│   ├── export.rs              # Export queue, FFmpeg rendering
│   ├── ai.rs                  # AI pipeline orchestration
│   ├── analytics.rs           # Stats aggregation queries
│   └── settings.rs            # Preferences, API keys, paths
├── services/
│   ├── mod.rs
│   ├── ffmpeg.rs              # FFmpeg process wrapper
│   ├── whisper.rs             # Whisper transcription (local/cloud)
│   ├── llm.rs                 # LLM inference (local/cloud)
│   ├── media_probe.rs         # Video metadata extraction (ffprobe)
│   └── url_downloader.rs      # URL video ingestion (yt-dlp)
├── state.rs                   # AppState struct (shared across commands)
└── error.rs                   # Unified error types
```

---

## Recommended Rust Crates & Tauri Plugins

### Core Crates (Cargo.toml)

| Crate | Version | Purpose |
|---|---|---|
| `tauri` | `2` | Framework core |
| `serde` / `serde_json` | `1` | Serialization (already installed) |
| `rusqlite` | `0.32` | SQLite database (bundled) |
| `rusqlite_migration` | `1` | Schema migration framework |
| `tokio` | `1` (features: `full`) | Async runtime for background tasks |
| `uuid` | `1` (features: `v4`, `serde`) | Unique IDs for projects/exports |
| `chrono` | `0.4` (features: `serde`) | Timestamps, date formatting |
| `thiserror` | `2` | Ergonomic error types |
| `reqwest` | `0.12` (features: `json`) | HTTP client for cloud AI APIs |
| `keyring` | `3` | OS-level secure credential storage (API keys) |
| `dirs` | `6` | Standard system directories |
| `walkdir` | `2` | Recursive directory traversal |
| `notify` | `7` | File system watcher |
| `log` + `env_logger` | latest | Structured logging |

### Tauri v2 Official Plugins (via `tauri add`)

| Plugin | Purpose | Pages Using It |
|---|---|---|
| `tauri-plugin-dialog` | Native file/folder picker | Library (import), Settings (export dir), Editor |
| `tauri-plugin-fs` | Read/write/watch files | All pages (video files, exports, config) |
| `tauri-plugin-store` | Persistent key-value settings | Settings, Dashboard |
| `tauri-plugin-notification` | Desktop notifications | Export, AI Lab |
| `tauri-plugin-shell` | Spawn FFmpeg/yt-dlp processes | Export, AI Lab |
| `tauri-plugin-clipboard-manager` | Copy export paths | Export page |
| `tauri-plugin-process` | App lifecycle management | Settings (restart) |
| `tauri-plugin-opener` | Open files/folders in OS | Export, Settings |
| `tauri-plugin-os` | Platform detection for FFmpeg | Settings, Export |

---

## Database Schema (SQLite via rusqlite)

```sql
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
    status      TEXT NOT NULL DEFAULT 'raw'  -- raw|processing|analyzed|exported
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
    label       TEXT,  -- 'viral_moment', 'key_insight', 'peak_energy', etc.
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
```

---

## Phase Breakdown

---

## Phase 1 — Core Infrastructure (Priority: CRITICAL)

> Foundation layer: database, state, error handling, Tauri plugins installation. Nothing works without this.

### 1.1 Install Tauri v2 Plugins

```bash
cd src-tauri
cargo tauri add dialog
cargo tauri add fs
cargo tauri add store
cargo tauri add notification
cargo tauri add shell
cargo tauri add clipboard-manager
cargo tauri add opener
cargo tauri add os
cargo tauri add process
```

### 1.2 Create Error Handling Module

#### [NEW] `src-tauri/src/error.rs`
- Define unified `AppError` enum with variants: `Database`, `IO`, `FFmpeg`, `AI`, `Network`, `Validation`, `NotFound`
- Implement `From<rusqlite::Error>`, `From<std::io::Error>`, `From<reqwest::Error>` etc.
- Implement `Into<tauri::InvokeError>` so commands can return `Result<T, AppError>`

### 1.3 Database Module

#### [NEW] `src-tauri/src/db/mod.rs`
- Initialize SQLite connection at app startup
- Store `Connection` wrapped in `Mutex<Connection>` inside Tauri managed state
- Run migrations via `rusqlite_migration`

#### [NEW] `src-tauri/src/db/schema.rs`
- Full schema creation SQL (as above)
- Migration versions array

#### [NEW] `src-tauri/src/db/models.rs`
- Rust structs: `Video`, `Project`, `Highlight`, `ExportItem`, `AIJob`, `AIJobStep`
- All derive `Serialize, Deserialize, Debug, Clone`

#### [NEW] `src-tauri/src/db/queries.rs`
- CRUD functions for all entities
- Parameterized query helpers

### 1.4 Application State

#### [NEW] `src-tauri/src/state.rs`
```rust
pub struct AppState {
    pub db: Mutex<Connection>,
    pub export_queue: Mutex<Vec<String>>,       // active export IDs
    pub ai_cancel_tokens: Mutex<HashMap<String, CancellationToken>>,
}
```

### 1.5 Update `lib.rs`
- Register all plugins
- Initialize database
- Run migrations
- Manage `AppState`
- Register all command handlers

### Backend Commands Delivered in Phase 1:
- `get_app_info` → app version, db path, platform info

### Verification:
- `cargo build` succeeds
- Database file created at `app_data_dir/fastclip.db`
- All tables exist

---

## Phase 2 — Settings & Preferences (Priority: HIGH)

> Users need to configure the app before importing videos. Settings page has the most backend touchpoints.

### Commands for Settings Page

| Command | Signature | Description |
|---|---|---|
| `get_settings` | `() → Settings` | Load all settings from DB/Store |
| `update_setting` | `(key: String, value: String) → ()` | Update single setting |
| `save_settings` | `(settings: Settings) → ()` | Batch save all settings |
| `set_export_directory` | `() → String` | Open folder picker, save path |
| `get_export_directory` | `() → String` | Return saved export dir |
| `validate_ffmpeg` | `() → FFmpegInfo` | Check bundled/custom FFmpeg, return version |
| `save_api_key` | `(provider: String, key: String) → ()` | Store key in OS keyring |
| `get_api_key_status` | `(provider: String) → bool` | Check if key exists (don't return it!) |
| `delete_api_key` | `(provider: String) → ()` | Remove key from keyring |
| `get_storage_usage` | `() → StorageInfo` | Scan export dir for total usage |
| `set_accent_color` | `(color: String) → ()` | Persist accent color preference |
| `set_whisper_model` | `(model: String) → ()` | Persist whisper model choice |
| `set_transcription_engine` | `(engine: String) → ()` | local/cloud preference |
| `set_intelligence_engine` | `(engine: String, provider: String) → ()` | local/cloud + gemini/mistral |

### Key Implementation Details:
- API keys → `keyring` crate (OS-level Credential Manager on Windows, Keychain on macOS)
- General settings → `tauri-plugin-store` (JSON file in AppConfig)
- FFmpeg validation → `tauri-plugin-shell` to run `ffmpeg -version`
- Export directory → `tauri-plugin-dialog` for folder picker

### Frontend Integration:
- Replace all `createSignal` local state in `SettingsPage.tsx` with Tauri `invoke()` calls
- Pass Gemini/Groq/Mistral keys to backend securely
- Load settings on mount, save on "Save Preferences" click

---

## Phase 3 — Library & Video Import (Priority: HIGH)

> Core workflow: import videos → extract metadata → create projects. This unlocks Library and Dashboard pages.

### Commands for Library Page

| Command | Signature | Description |
|---|---|---|
| `import_video_file` | `() → Video` | Open file dialog, copy to workspace, probe metadata |
| `import_video_drop` | `(path: String) → Video` | Handle drag-and-drop file path |
| `import_video_url` | `(url: String) → Video` | Download from URL (yt-dlp) |
| `get_all_videos` | `() → Vec<Video>` | List all videos in library |
| `search_videos` | `(query: String, filter: String) → Vec<Video>` | Filter by status, search by title |
| `delete_video` | `(id: String) → ()` | Delete video + associated projects |
| `get_video_metadata` | `(id: String) → VideoMetadata` | Detailed ffprobe output |
| `generate_thumbnail` | `(video_id: String, timestamp_ms: i64) → String` | Extract frame as thumbnail |

### Commands for Dashboard Page

| Command | Signature | Description |
|---|---|---|
| `get_dashboard_stats` | `() → DashboardStats` | Aggregated counts, time saved, storage |
| `get_recent_projects` | `(limit: i32) → Vec<Project>` | Latest N projects |
| `get_active_ai_jobs` | `() → Vec<AIJob>` | Currently processing jobs |

### Media Probe Service (`services/media_probe.rs`)
- Spawn `ffprobe -v quiet -print_format json -show_format -show_streams <file>`
- Parse JSON output → extract duration, resolution, codec, fps, file size
- Generate thumbnail: `ffmpeg -i <file> -ss <time> -vframes 1 -q:v 2 <output.jpg>`

### URL Download Service (`services/url_downloader.rs`)
- Spawn `yt-dlp --print filename --no-download <url>` for validation
- Spawn `yt-dlp -o <output_path> <url>` for download
- Emit progress events to frontend via Tauri event system

### Frontend Integration:
- `LibraryPage.tsx`: Replace `MOCK_VIDEOS` with `invoke('get_all_videos')`
- `ImportSection.tsx`: Wire drag-drop to `invoke('import_video_drop', { path })`
- `DashboardPage.tsx`: Replace `MOCK_STATS`, `MOCK_PROJECTS`, `MOCK_AI_JOBS` with real queries
- File drag-and-drop: Use Tauri's built-in `tauri://drag-drop` event

---

## Phase 4 — Project & Editor (Priority: HIGH)

> Creates the editing workflow: project detail → AI highlights → clip editor. Bridges import → export.

### Commands for Project Detail Page

| Command | Signature | Description |
|---|---|---|
| `create_project` | `(name: String, video_id: String) → Project` | Create from imported video |
| `get_project` | `(id: String) → ProjectWithHighlights` | Full project with highlights |
| `get_all_projects` | `() → Vec<ProjectSummary>` | List all projects |
| `update_project` | `(id: String, name: String) → ()` | Rename project |
| `delete_project` | `(id: String) → ()` | Delete project + cascaded data |
| `get_project_highlights` | `(project_id: String) → Vec<Highlight>` | All highlights for project |
| `approve_highlight` | `(id: String) → ()` | Mark highlight as approved |
| `reject_highlight` | `(id: String) → ()` | Mark highlight as rejected |
| `update_highlight_times` | `(id: String, start_ms: i64, end_ms: i64) → ()` | Adjust clip boundaries |

### Commands for Editor Page

| Command | Signature | Description |
|---|---|---|
| `get_editor_state` | `(project_id: String) → EditorState` | Full state for editor view |
| `generate_captions` | `(highlight_id: String) → Vec<Caption>` | Auto-caption from transcript |
| `get_crop_preview` | `(video_id: String, aspect: String, timestamp_ms: i64) → String` | Preview crop frame |
| `set_clip_crop` | `(highlight_id: String, crop: CropConfig) → ()` | Save crop settings |
| `preview_clip` | `(highlight_id: String) → String` | Generate preview clip path |

### Frontend Integration:
- `ProjectDetailPage.tsx`: Replace `MOCK_PROJECTS`, `MOCK_HIGHLIGHTS` with invoke calls
- `EditorPage.tsx`: Wire all sidebar features (clips list, captions, crop) to backend
- `EditorSidebar.tsx`: "Generate Auto-Captions" button → `invoke('generate_captions')`
- `VideoPreview.tsx`: Eventually play actual video files (HTML5 `<video>` with `convertFileSrc()`)

---

## Phase 5 — AI Pipeline (Priority: HIGH)

> The "brain" of FastClip — transcription + intelligent clip detection. Powers AI Lab and Project pages.

### Commands for AI Lab Page

| Command | Signature | Description |
|---|---|---|
| `start_ai_analysis` | `(project_id: String) → String` | Start full pipeline, returns job ID |
| `get_ai_jobs` | `() → Vec<AIJob>` | All jobs with step details |
| `get_ai_job` | `(job_id: String) → AIJob` | Single job status |
| `pause_ai_job` | `(job_id: String) → ()` | Pause processing |
| `resume_ai_job` | `(job_id: String) → ()` | Resume processing |
| `cancel_ai_job` | `(job_id: String) → ()` | Cancel and cleanup |
| `get_system_resources` | `() → SystemResources` | CPU%, RAM%, GPU% |

### AI Pipeline Steps (services/)

#### Step 1: Transcription (`services/whisper.rs`)
- **Local Mode**: Spawn `whisper-cli` (or integrate `whisper-rs` crate) with selected model size
- **Cloud Mode**: POST to Groq API (`https://api.groq.com/openai/v1/audio/transcriptions`)
- Output: Timestamped transcript segments

#### Step 2: Intelligent Analysis (`services/llm.rs`)
- **Local Mode**: Use `mistral.rs` or `llama-cpp-rs` for local inference
- **Cloud Mode**: 
  - Gemini: `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`
  - Mistral: `POST https://api.mistral.ai/v1/chat/completions`
- Prompt engineering: Send transcript + ask for "viral moment detection", "key insight identification"
- Output: Highlight segments with confidence scores

#### Step 3: Scene Detection
- Process video keyframes to detect scene transitions
- Align with transcription timestamps
- Output: Refined highlight boundaries

#### Step 4: Highlight Generation
- Combine transcript analysis + scene detection
- Create `Highlight` records in database
- Update project status to "analyzed"

### Event System (Real-time Progress Updates):
```rust
// Emit from Rust to frontend
app.emit("ai:progress", AIProgressPayload {
    job_id: "ai1".into(),
    step: "transcribing",
    progress: 45,
    cpu_usage: 78.5,
    memory_usage: 45.2,
    eta: "3 min 20s".into(),
}).unwrap();
```

Frontend listens:
```typescript
import { listen } from '@tauri-apps/api/event';
listen('ai:progress', (event) => { /* update AI Lab UI */ });
```

### Frontend Integration:
- `AILabPage.tsx`: Replace `MOCK_AI_JOBS` with `invoke('get_ai_jobs')` + event listeners
- Real-time progress via Tauri events instead of mock data
- System resource monitoring via periodic polling

---

## Phase 6 — Export & Rendering (Priority: HIGH)

> Final output: render clips to actual video files with FFmpeg. Powers Export page.

### Commands for Export Page

| Command | Signature | Description |
|---|---|---|
| `create_export` | `(config: ExportConfig) → String` | Create export job, returns ID |
| `get_all_exports` | `(filter: Option<String>) → Vec<ExportItem>` | List with status filter |
| `cancel_export` | `(id: String) → ()` | Cancel active export |
| `abort_all_exports` | `() → ()` | Cancel everything in queue |
| `delete_export` | `(id: String) → ()` | Remove export record + file |
| `open_export_folder` | `(id: String) → ()` | Open containing folder in OS |
| `reexport` | `(id: String) → String` | Re-run with same settings |
| `share_export` | `(id: String) → ()` | Copy path to clipboard |

### FFmpeg Rendering Service (`services/ffmpeg.rs`)

```rust
// Core FFmpeg command builder
pub fn build_export_command(config: &ExportConfig) -> Command {
    let mut cmd = Command::new("ffmpeg");
    cmd.args([
        "-i", &config.input_path,
        "-ss", &ms_to_timestamp(config.start_ms),
        "-to", &ms_to_timestamp(config.end_ms),
        "-vf", &build_filter_chain(config),  // crop, scale, etc.
        "-c:v", &config.codec,
        "-b:v", &format!("{}k", config.bitrate),
        "-c:a", "aac",
        "-b:a", "128k",
        "-y",   // overwrite
        &config.output_path,
    ]);
    cmd
}
```

### Export Queue Manager:
- `maxConcurrentExports` from settings (default: 2)
- Queue system with priority ordering
- Parse FFmpeg stderr for progress (`frame=`, `time=`, `speed=`)
- Emit progress events: `export:progress { id, progress, eta }`

### Frontend Integration:
- `ExportPage.tsx`: Replace `MOCK_EXPORTS` with `invoke('get_all_exports')`
- `ExportCard.tsx`: Wire `onCancel`, `onOpenFolder`, `onShare`, `onReexport`, `onDelete`
- Real-time progress via `listen('export:progress')`

---

## Phase 7 — Analytics & Dashboard (Priority: MEDIUM)

> Read-only aggregation layer. All data already exists from phases 3–6.

### Commands for Analytics Page

| Command | Signature | Description |
|---|---|---|
| `get_analytics_overview` | `() → AnalyticsOverview` | Total processed, clips, time saved, export velocity |
| `get_export_format_distribution` | `() → Vec<FormatCount>` | Format breakdown percentages |
| `get_project_activity` | `(period: String) → Vec<ActivityPoint>` | Monthly project creation count |
| `get_performance_summary` | `() → PerformanceSummary` | Avg clips/video, avg confidence, avg duration |

### Frontend Integration:
- `AnalyticsPage.tsx`: Replace all hardcoded values with invoke calls
- Charts and distribusi ons rendered from real database aggregations
- `DashboardPage.tsx` `StatsGrid`: Real counts from `get_dashboard_stats`

---

## Frontend Wiring Strategy

### Recommended Pattern for Every Page

```typescript
// 1. Create a service layer
// src/services/api.ts
import { invoke } from '@tauri-apps/api/core';

export const api = {
  videos: {
    getAll: () => invoke<Video[]>('get_all_videos'),
    import: (path: string) => invoke<Video>('import_video_drop', { path }),
    search: (query: string, filter: string) => invoke<Video[]>('search_videos', { query, filter }),
  },
  projects: {
    get: (id: string) => invoke<Project>('get_project', { id }),
    create: (name: string, videoId: string) => invoke<Project>('create_project', { name, videoId }),
  },
  // ... etc
};

// 2. Use in components with SolidJS resources
import { createResource } from 'solid-js';
import { api } from '../services/api';

const [videos] = createResource(() => api.videos.getAll());
```

---

## Tauri Capabilities Update

The `capabilities/default.json` needs expanding:

```json
{
  "permissions": [
    "core:default",
    "opener:default",
    "dialog:default",
    "fs:default",
    "store:default",
    "notification:default",
    "shell:default",
    "clipboard-manager:default",
    "process:default",
    "os:default",
    "core:window:default",
    "core:event:default",
    "core:window:allow-minimize",
    "core:window:allow-toggle-maximize",
    "core:window:allow-close",
    "core:window:allow-start-dragging"
  ]
}
```

---

## Summary: All Commands by Page

### Dashboard (5 commands)
`get_dashboard_stats`, `get_recent_projects`, `get_active_ai_jobs`, `get_app_info`, `get_storage_usage`

### Library (8 commands)
`import_video_file`, `import_video_drop`, `import_video_url`, `get_all_videos`, `search_videos`, `delete_video`, `get_video_metadata`, `generate_thumbnail`

### Project Detail (7 commands)
`create_project`, `get_project`, `get_all_projects`, `update_project`, `delete_project`, `get_project_highlights`, `approve_highlight`, `reject_highlight`, `update_highlight_times`

### Editor (5 commands)
`get_editor_state`, `generate_captions`, `get_crop_preview`, `set_clip_crop`, `preview_clip`

### AI Lab (7 commands)
`start_ai_analysis`, `get_ai_jobs`, `get_ai_job`, `pause_ai_job`, `resume_ai_job`, `cancel_ai_job`, `get_system_resources`

### Export (8 commands)
`create_export`, `get_all_exports`, `cancel_export`, `abort_all_exports`, `delete_export`, `open_export_folder`, `reexport`, `share_export`

### Analytics (4 commands)
`get_analytics_overview`, `get_export_format_distribution`, `get_project_activity`, `get_performance_summary`

### Settings (14 commands)
`get_settings`, `update_setting`, `save_settings`, `set_export_directory`, `get_export_directory`, `validate_ffmpeg`, `save_api_key`, `get_api_key_status`, `delete_api_key`, `get_storage_usage`, `set_accent_color`, `set_whisper_model`, `set_transcription_engine`, `set_intelligence_engine`

**Total: ~58 Tauri commands across 8 pages**

---

## Open Questions

> [!IMPORTANT]
> **1. FFmpeg Bundling Strategy:**
> Should we bundle FFmpeg with the app installer, or require users to install it separately? Bundling adds ~80MB to the installer but provides zero-config UX. The Settings page already shows "Bundled ✓" — suggesting bundled is the intention.

> [!IMPORTANT]
> **2. Whisper Model Distribution:**
> For local transcription, should we download Whisper models on first use (lazy download) or bundle `tiny` model? Models range from 75MB (tiny) to 1.5GB (medium).

> [!IMPORTANT]
> **3. Video File Storage:**
> Should imported videos be copied into FastClip's app data directory, or just reference the original file path? Copying increases storage but prevents "file not found" issues if user moves the original.

> [!WARNING]
> **4. Local LLM (`mistral.rs` / `llama-cpp-rs`) Feasibility:**
> Running Gemma-4 Multimodal locally requires 8GB VRAM. Should Phase 5 initially focus on cloud-only (Gemini/Mistral API) and defer local LLM to a later release?

> [!IMPORTANT]
> **5. yt-dlp Bundling:**
> For URL import, should we bundle `yt-dlp` or use a Rust HTTP download library? yt-dlp supports YouTube, Twitch, TikTok, etc. but adds another binary dependency.

---

## Verification Plan

### Automated Tests
```bash
# After each phase:
cd src-tauri
cargo build          # Compilation check
cargo test           # Unit tests for DB queries, services
cargo clippy         # Lint check
```

### Phase-Specific Verification:
- **Phase 1**: `cargo build` succeeds, DB file created, tables verified via `sqlite3` CLI
- **Phase 2**: Settings persist across app restart, API keys stored in OS Credential Manager
- **Phase 3**: Import a real .mp4 → metadata extracted → appears in Library
- **Phase 4**: Create project → highlights list → approve/reject works
- **Phase 5**: AI pipeline processes real video → generates real highlights
- **Phase 6**: Export produces actual .mp4 file in export directory
- **Phase 7**: Analytics shows real aggregated data from DB

### Manual Verification:
- Run `npm run tauri dev` and test each page end-to-end
- Test on Windows (primary target based on OS info)
- Verify file dialogs, notifications, clipboard operations
