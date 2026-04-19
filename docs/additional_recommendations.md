# FastClip — Rekomendasi Tambahan Backend

> Rekomendasi yang belum tercakup di plan utama, tapi penting untuk production-quality desktop app.

---

## 🔴 1. Gunakan Sidecar, BUKAN Shell Spawn untuk FFmpeg & yt-dlp

Plan awal merekomendasikan `tauri-plugin-shell` untuk menjalankan FFmpeg. **Ini kurang optimal.** Tauri v2 punya konsep **Sidecar** yang jauh lebih baik:

### Mengapa Sidecar Lebih Baik?
| Aspek | Shell Spawn | Sidecar |
|---|---|---|
| Bundling | User harus install sendiri | Otomatis dibundel dalam installer |
| Path | Rawan `PATH not found` error | Selalu ditemukan di path yang dikenal |
| Keamanan | Bisa dieksploitasi kalau PATH di-hijack | Binary di-sign bersama app |
| UX | User harus konfigurasi manual | Zero-config, langsung jalan |

### Implementasi di `tauri.conf.json`:
```json
{
  "bundle": {
    "externalBin": [
      "binaries/ffmpeg",
      "binaries/ffprobe",
      "binaries/yt-dlp"
    ]
  }
}
```

### Strukturnya:
```
src-tauri/
├── binaries/
│   ├── ffmpeg-x86_64-pc-windows-msvc.exe     # Windows
│   ├── ffprobe-x86_64-pc-windows-msvc.exe
│   ├── yt-dlp-x86_64-pc-windows-msvc.exe
│   ├── ffmpeg-x86_64-apple-darwin             # macOS (kalau mau)
│   └── ffmpeg-x86_64-unknown-linux-gnu        # Linux (kalau mau)
```

> [!TIP]
> Tauri otomatis memilih binary berdasarkan target triple platform. Cukup taruh file dengan nama yang sesuai.

### Di Rust Code:
```rust
use tauri::Manager;
use tauri_plugin_shell::ShellExt;

// Sidecar dijalankan via shell plugin tapi path-nya otomatis resolved
let sidecar = app.shell().sidecar("ffmpeg").unwrap();
let (mut rx, child) = sidecar
    .args(["-i", input, "-ss", "00:01:00", "-vframes", "1", output])
    .spawn()
    .unwrap();
```

**Rekomendasi: Download ffmpeg-static build (~80MB Windows) dan masukkan ke `binaries/`.**

---

## 🔴 2. Security: CSP Tidak Boleh `null`

Di `tauri.conf.json` kamu saat ini:
```json
"security": {
  "csp": null  // ⚠️ BERBAHAYA - semua script/style/img diizinkan
}
```

Untuk production, CSP (Content Security Policy) harus dikonfigurasi:

```json
"security": {
  "csp": "default-src 'self'; img-src 'self' asset: http://asset.localhost https://images.unsplash.com; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src ipc: http://ipc.localhost https://api.groq.com https://generativelanguage.googleapis.com https://api.mistral.ai"
}
```

### Penjelasan:
- `default-src 'self'` → Hanya load dari app sendiri
- `img-src ... asset:` → Izinkan gambar dari Tauri's `convertFileSrc()` (untuk thumbnails lokal)
- `img-src ... unsplash` → Untuk thumbnails mock (bisa dihapus nanti)
- `connect-src ... api.groq.com` → Izinkan cloud AI API calls
- `style-src 'unsafe-inline'` → Dibutuhkan TailwindCSS

---

## 🟠 3. Tambahkan Plugin: Single Instance

Cegah user membuka 2 window FastClip yang sama (yang bisa corrupt database):

```bash
cargo tauri add single-instance
```

```rust
// lib.rs
tauri::Builder::default()
    .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
        // Fokuskan window yang sudah ada
        if let Some(window) = app.get_webview_window("main") {
            window.set_focus().unwrap();
        }
    }))
```

---

## 🟠 4. System Tray untuk Background Processing

Saat AI atau Export sedang berjalan, user mungkin minimize window. System tray memberi visual indicator:

```rust
use tauri::tray::{TrayIconBuilder, MouseButtonState};
use tauri::menu::{MenuBuilder, MenuItem};

// Di setup()
let tray = TrayIconBuilder::new()
    .icon(app.default_window_icon().unwrap().clone())
    .tooltip("FastClip - Processing...")
    .menu(&MenuBuilder::new(app)
        .item(&MenuItem::with_id(app, "show", "Show", true, None::<&str>)?)
        .item(&MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?)
        .build()?)
    .on_menu_event(|app, event| {
        match event.id().as_ref() {
            "show" => {
                if let Some(w) = app.get_webview_window("main") {
                    w.show().unwrap();
                    w.set_focus().unwrap();
                }
            }
            "quit" => app.exit(0),
            _ => {}
        }
    })
    .build(app)?;
```

Tray menu: **Show** | **Pause All** | **Quit**

---

## 🟠 5. Logging Plugin (Bukan Manual `env_logger`)

Tauri punya plugin logging resmi yang menulis ke file DAN console:

```bash
cargo tauri add log
```

```rust
use log::{info, warn, error};
use tauri_plugin_log::{Target, TargetKind};

tauri::Builder::default()
    .plugin(tauri_plugin_log::Builder::new()
        .targets([
            Target::new(TargetKind::Stdout),
            Target::new(TargetKind::LogDir { file_name: None }), // auto ke AppLog dir
        ])
        .level(log::LevelFilter::Info)
        .build())
```

**Benefit**: Log files otomatis tersimpan di `AppLog` directory, bisa diakses untuk debugging user issues.

---

## 🟠 6. Auto-Updater untuk Distribution

Untuk update app tanpa user harus download ulang:

```bash
cargo tauri add updater
cargo tauri add process  # sudah ada di plan
```

Setup backend update server (bisa pakai GitHub Releases):

```json
// tauri.conf.json
{
  "plugins": {
    "updater": {
      "endpoints": [
        "https://github.com/username/fastclip/releases/latest/download/latest.json"
      ],
      "pubkey": "YOUR_PUBLIC_KEY"
    }
  }
}
```

> [!TIP]
> Bisa diimplementasi belakangan (Phase 8+), tapi arsitekturnya perlu disiapkan dari awal.

---

## 🟠 7. Global Shortcuts

Layout sudah punya `KeyboardShortcutsOverlay`. Backend perlu mendukung shortcut global (bahkan saat app tidak fokus):

```bash
cargo tauri add global-shortcut
```

```rust
use tauri_plugin_global_shortcut::ShortcutState;

tauri::Builder::default()
    .plugin(tauri_plugin_global_shortcut::Builder::new()
        .with_shortcut("CmdOrCtrl+Shift+C", |app, shortcut, event| {
            if event.state == ShortcutState::Pressed {
                // Quick clip from clipboard URL
            }
        })
        .build())
```

---

## 🟡 8. Alternatif Database: `tauri-plugin-sql` vs Manual `rusqlite`

### Opsi A: `rusqlite` (Direkomendasikan di Plan Awal)
**Pro**: Full control, type-safe, no overhead, migrations via `rusqlite_migration`
**Con**: Manual setup, harus wrapping `Mutex<Connection>`

### Opsi B: `tauri-plugin-sql` (Official Plugin)
**Pro**: API dari frontend langsung (bisa query dari TS tanpa command), migration built-in
**Con**: Kurang fleksibel, kurang cocok untuk complex business logic di Rust

### ✅ Rekomendasi: Tetap `rusqlite`

Karena FastClip punya business logic berat (AI pipeline, FFmpeg orchestration, export queue), semua logic harus di Rust. `rusqlite` memberi kontrol penuh. `tauri-plugin-sql` lebih cocok untuk app yang simple CRUD-heavy.

**Tapi**, pertimbangkan `sea-query` (query builder) di atas `rusqlite` untuk type-safe SQL:

```rust
// Alih-alih raw SQL string:
conn.execute("SELECT * FROM videos WHERE status = ?1", params!["analyzed"])?;

// Dengan sea-query:
let query = Query::select()
    .columns([Videos::Id, Videos::Title, Videos::Status])
    .from(Videos::Table)
    .and_where(Expr::col(Videos::Status).eq("analyzed"))
    .to_string(SqliteQueryBuilder);
```

---

## 🟡 9. Whisper Inference: `whisper-rs` Crate vs CLI Spawn

### Opsi A: Spawn `whisper-cli` (Sidecar)
**Pro**: Tidak perlu compile GGML dari Rust, mudah update model
**Con**: Tambah ~10MB binary, overhead process spawn

### Opsi B: `whisper-rs` crate (Native Rust binding ke whisper.cpp)
**Pro**: Zero overhead, embedded di app binary, progress callback langsung
**Con**: Perlu build `whisper.cpp` via build.rs, compile time lebih lama

```toml
# Cargo.toml
[dependencies]
whisper-rs = "0.13"
```

```rust
use whisper_rs::{WhisperContext, WhisperContextParameters, FullParams, SamplingStrategy};

let ctx = WhisperContext::new_with_params(
    "models/ggml-tiny.bin",
    WhisperContextParameters::default()
)?;

let mut params = FullParams::new(SamplingStrategy::Greedy { best_of: 1 });
params.set_language(Some("auto"));
params.set_print_progress(false);

let mut state = ctx.create_state()?;
state.full(params, &audio_samples)?;

let num_segments = state.full_n_segments()?;
for i in 0..num_segments {
    let text = state.full_get_segment_text(i)?;
    let start = state.full_get_segment_t0(i)?;
    let end = state.full_get_segment_t1(i)?;
    // Save to DB as highlight candidates
}
```

### ✅ Rekomendasi: Mulai dengan `whisper-rs` (native)
- Lebih clean, tidak perlu bundle binary tambahan
- Progress callback bisa langsung emit Tauri event
- Model file di-download lazy saat pertama kali dipakai

---

## 🟡 10. Video Playback: `convertFileSrc` untuk HTML5 Video

`VideoPreview.tsx` saat ini hanya menampilkan thumbnail image. Untuk playback video asli:

```typescript
import { convertFileSrc } from '@tauri-apps/api/core';

// Konversi path lokal ke URL yang bisa dimakan <video>
const videoSrc = convertFileSrc('D:/Videos/podcast.mp4');

// Di component:
<video src={videoSrc} controls />
```

**Perlu update CSP** untuk mengizinkan `asset:` protocol:
```json
"csp": "... media-src 'self' asset: http://asset.localhost; ..."
```

---

## 🟡 11. Splash Screen Saat Database Init

Karena Phase 1 menjalankan DB migrations saat startup, bisa ada delay 1-2 detik. Tambahkan splash screen:

```json
// tauri.conf.json
{
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "FastClip",
        "width": 1280,
        "height": 800,
        "decorations": false,
        "transparent": true,
        "visible": false  // << Hidden sampai ready
      }
    ]
  }
}
```

```rust
// lib.rs - setup()
.setup(|app| {
    let window = app.get_webview_window("main").unwrap();
    
    // Initialize DB, run migrations...
    init_database(app)?;
    
    // Show window setelah siap
    window.show().unwrap();
    Ok(())
})
```

Frontend bisa tampilkan loading animation (yang sudah ada di `Layout.tsx` Suspense fallback) sampai data pertama kali di-load.

---

## 🟡 12. Tauri Event vs Polling: Kapan Pakai Yang Mana

| Scenario | Mekanisme | Alasan |
|---|---|---|
| AI pipeline progress | **Event** (`app.emit`) | Real-time, fire-and-forget |
| Export progress | **Event** (`app.emit`) | Konstan update per detik |
| System resources (CPU/RAM) | **Polling** (invoke setiap 2s) | Tidak perlu channel terpisah |
| Settings changed | **Command** (invoke) | Request-response |
| File import done | **Event** | One-time notification |
| Project list refresh | **Command** | On-demand fetch |

### Pattern untuk Event dari Rust:
```rust
// Backend
app.emit("export:progress", serde_json::json!({
    "id": "ex1",
    "progress": 65,
    "eta": "2 min"
})).unwrap();

// Frontend (SolidJS)
import { listen } from '@tauri-apps/api/event';
import { onCleanup } from 'solid-js';

const unlisten = await listen('export:progress', (event) => {
    const { id, progress, eta } = event.payload;
    updateExportProgress(id, progress, eta);
});

onCleanup(() => unlisten()); // Jangan lupa cleanup!
```

---

## 🟡 13. Error Recovery & Crash Protection

### Database WAL Mode
```rust
conn.pragma_update(None, "journal_mode", "WAL")?;  // Write-Ahead Logging
conn.pragma_update(None, "synchronous", "NORMAL")?;
conn.pragma_update(None, "foreign_keys", "ON")?;
```

**WAL mode** mencegah database corruption kalau app crash saat write.

### Export Cleanup on Crash
Saat app restart, cek apakah ada export yang statusnya `processing`:
```sql
UPDATE exports SET status = 'failed', error = 'App crashed during export'
WHERE status = 'processing';
```

### AI Job Recovery
```sql
UPDATE ai_jobs SET status = 'error', error_msg = 'App terminated unexpectedly'
WHERE status IN ('transcribing', 'analyzing', 'detecting');
```

---

## 🟡 14. `productName` di `tauri.conf.json` Masih Default

```json
"productName": "tauri-app",  // ❌ Harus diganti
"productName": "FastClip",   // ✅
```

Ini mempengaruhi:
- Nama window di taskbar
- Nama folder di AppData
- Nama installer binary
- Nama process di Task Manager

---

## Ringkasan Rekomendasi Tambahan

| # | Rekomendasi | Prioritas | Effort |
|---|---|---|---|
| 1 | **Sidecar** untuk FFmpeg/yt-dlp (bukan shell) | 🔴 Critical | Medium |
| 2 | **CSP configuration** (security fix) | 🔴 Critical | Low |
| 3 | **Single Instance** plugin | 🟠 High | Low |
| 4 | **System Tray** untuk background tasks | 🟠 High | Medium |
| 5 | **Logging Plugin** (file + console) | 🟠 High | Low |
| 6 | **Auto-Updater** setup | 🟠 High | Medium |
| 7 | **Global Shortcuts** | 🟠 High | Low |
| 8 | Tetap `rusqlite` + tambah `sea-query` | 🟡 Medium | Low |
| 9 | `whisper-rs` native (bukan CLI spawn) | 🟡 Medium | Medium |
| 10 | `convertFileSrc` untuk video playback | 🟡 Medium | Low |
| 11 | Splash screen / hidden window | 🟡 Medium | Low |
| 12 | Event vs Polling strategy | 🟡 Medium | - |
| 13 | Crash recovery (WAL + status reset) | 🟡 Medium | Low |
| 14 | Fix `productName` | 🟡 Medium | Trivial |

### Revisi Plugin List (Final):

```
# Original (9 plugins)
dialog, fs, store, notification, shell, clipboard-manager, opener, os, process

# + Tambahan (5 plugins) 
single-instance, log, global-shortcut, updater, deep-link (optional)

# Total: 14 Tauri v2 Plugins
```

### Revisi Crate List (Final):

```toml
# Original
rusqlite, rusqlite_migration, tokio, uuid, chrono, thiserror, reqwest, keyring, dirs, walkdir, notify, log, env_logger

# + Tambahan / Pengganti
whisper-rs = "0.13"          # Native whisper inference (ganti CLI spawn)
sea-query = "0.32"           # Type-safe SQL query builder
sea-query-rusqlite = "0.7"   # Adapter
sysinfo = "0.33"             # CPU/RAM monitoring untuk AI Lab
# Hapus: env_logger (diganti tauri-plugin-log)
```
