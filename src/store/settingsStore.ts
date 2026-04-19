import { createSignal, createRoot } from "solid-js";

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

const ACCENT_COLORS: Record<AccentColor, string> = {
  indigo: "#4F46E5",
  rose: "#F43F5E",
  emerald: "#10B981",
  amber: "#F59E0B",
  cyan: "#06B6D4",
};

function createSettingsStore() {
  const [settings, setSettings] = createSignal<Settings>({
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
  });

  const [showShortcuts, setShowShortcuts] = createSignal(false);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getAccentHex = () => ACCENT_COLORS[settings().accentColor];

  const storageUsed = createSignal<{ used: number; total: number }>({ used: 0, total: 0 });

  return {
    settings,
    setSettings,
    updateSetting,
    getAccentHex,
    showShortcuts,
    setShowShortcuts,
    storageUsed,
    ACCENT_COLORS,
  };
}

export const settingsStore = createRoot(createSettingsStore);
