import { createSignal, createRoot } from "solid-js";
import { invoke } from "@tauri-apps/api/core";

export type ThemeMode = "oled-black" | "dark-slate" | "midnight-blue";
export type AccentColor = "indigo" | "rose" | "emerald" | "amber" | "cyan";
export type WhisperModel = "tiny" | "base" | "small" | "medium";

export interface Settings {
  theme: ThemeMode;
  accentColor: AccentColor;
  exportDirectory: string;
  ffmpegPath: string;
  whisperModel: WhisperModel;
  maxConcurrentExports: number;
  gpuAcceleration: boolean;
  autoSaveInterval: number; // minutes
  language: string;
  autoUpdate: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "oled-black",
  accentColor: "indigo",
  exportDirectory: "",
  ffmpegPath: "bundled",
  whisperModel: "tiny",
  maxConcurrentExports: 2,
  gpuAcceleration: true,
  autoSaveInterval: 5,
  language: "en",
  autoUpdate: true,
};

const ACCENT_COLORS: Record<AccentColor, string> = {
  indigo: "#4F46E5",
  rose: "#F43F5E",
  emerald: "#10B981",
  amber: "#F59E0B",
  cyan: "#06B6D4",
};

function createSettingsStore() {
  const [settings, setSettings] = createSignal<Settings>(DEFAULT_SETTINGS);
  const [showShortcuts, setShowShortcuts] = createSignal(false);
  const [isLoaded, setIsLoaded] = createSignal(false);

  const loadSettings = async () => {
    try {
      const saved = await invoke<Settings | null>("get_setting", { key: "settings" });
      if (saved) {
        setSettings({ ...DEFAULT_SETTINGS, ...saved });
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    } finally {
      setIsLoaded(true);
    }
  };

  const updateSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings(), [key]: value };
    setSettings(newSettings);
    try {
      await invoke("save_setting", { key: "settings", value: newSettings });
    } catch (e) {
      console.error("Failed to save setting:", e);
    }
  };

  const getAccentHex = () => ACCENT_COLORS[settings().accentColor];

  const storageUsed = createSignal<{ used: number; total: number }>({ used: 0, total: 0 });

  // Load settings on mount
  loadSettings();

  return {
    settings,
    setSettings,
    updateSetting,
    getAccentHex,
    showShortcuts,
    setShowShortcuts,
    storageUsed,
    ACCENT_COLORS,
    isLoaded,
    loadSettings,
  };
}

export const settingsStore = createRoot(createSettingsStore);
