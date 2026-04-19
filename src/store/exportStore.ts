import { createSignal, createRoot } from "solid-js";
import { createStore } from "solid-js/store";

export type ExportStatus = "queued" | "processing" | "completed" | "failed" | "cancelled";
export type AspectRatio = "9:16" | "1:1" | "16:9" | "4:5";
export type ExportCodec = "h264" | "h265" | "vp9";
export type ExportResolution = "720p" | "1080p" | "1440p" | "4k";

export interface ExportPreset {
  id: string;
  name: string;
  icon: string;
  aspectRatio: AspectRatio;
  resolution: ExportResolution;
  codec: ExportCodec;
  bitrate: number;
}

export interface ExportItem {
  id: string;
  projectId: string;
  clipId?: string;
  name: string;
  status: ExportStatus;
  progress: number;
  format: AspectRatio;
  resolution: ExportResolution;
  codec: ExportCodec;
  estimatedSize?: string;
  eta?: string;
  outputPath?: string;
  createdAt: string;
  completedAt?: string;
  thumbnail?: string;
  error?: string;
}

export const EXPORT_PRESETS: ExportPreset[] = [
  { id: "tiktok", name: "TikTok / Reels", icon: "📱", aspectRatio: "9:16", resolution: "1080p", codec: "h264", bitrate: 8000 },
  { id: "instagram", name: "Instagram Feed", icon: "📷", aspectRatio: "4:5", resolution: "1080p", codec: "h264", bitrate: 6000 },
  { id: "youtube-short", name: "YouTube Short", icon: "🎬", aspectRatio: "9:16", resolution: "1080p", codec: "h264", bitrate: 10000 },
  { id: "youtube", name: "YouTube", icon: "📺", aspectRatio: "16:9", resolution: "1080p", codec: "h264", bitrate: 12000 },
  { id: "square", name: "Square Post", icon: "⬜", aspectRatio: "1:1", resolution: "1080p", codec: "h264", bitrate: 6000 },
];

function createExportStore() {
  const [exports, setExports] = createStore<ExportItem[]>([]);
  const [showSettingsModal, setShowSettingsModal] = createSignal(false);
  const [selectedPreset, setSelectedPreset] = createSignal<string>("tiktok");

  const activeExports = () => exports.filter(e => e.status === "processing" || e.status === "queued");
  const completedExports = () => exports.filter(e => e.status === "completed");
  const failedExports = () => exports.filter(e => e.status === "failed");

  const overallProgress = () => {
    const active = activeExports();
    if (active.length === 0) return 100;
    return Math.round(active.reduce((sum, e) => sum + e.progress, 0) / active.length);
  };

  const addExport = (item: ExportItem) => {
    setExports(prev => [...prev, item]);
  };

  const updateExport = (id: string, updates: Partial<ExportItem>) => {
    setExports(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const removeExport = (id: string) => {
    setExports(prev => prev.filter(e => e.id !== id));
  };

  const cancelExport = (id: string) => {
    updateExport(id, { status: "cancelled", progress: 0 });
  };

  return {
    exports,
    setExports,
    showSettingsModal,
    setShowSettingsModal,
    selectedPreset,
    setSelectedPreset,
    activeExports,
    completedExports,
    failedExports,
    overallProgress,
    addExport,
    updateExport,
    removeExport,
    cancelExport,
  };
}

export const exportStore = createRoot(createExportStore);
