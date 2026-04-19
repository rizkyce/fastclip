import { For, Show, createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import {
  Package, HardDrive, Cpu, ExternalLink, Palette,
  Monitor, FolderOpen, Bell, Key, Check
} from "lucide-solid";
import { cn } from "../lib/utils";
import { showToast } from "../components/Toast";
import Dropdown, { type DropdownOption } from "../components/Dropdown";
import { settingsStore } from "../store/settingsStore";

const accentColors = [
  { name: "Indigo", value: "#4F46E5" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Emerald", value: "#10B981" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Violet", value: "#8B5CF6" },
];

const whisperModels = [
  { name: "Tiny (75 MB)", value: "tiny", recommended: true },
  { name: "Base (142 MB)", value: "base", recommended: false },
  { name: "Small (466 MB)", value: "small", recommended: false },
  { name: "Medium (1.5 GB)", value: "medium", recommended: false },
];

const whisperOptions: DropdownOption[] = whisperModels.map(m => ({
  label: `${m.name}${m.recommended ? " - Recommended" : ""}`,
  value: m.value
}));


interface SettingRowProps {
  icon: any;
  iconColor: string;
  label: string;
  description: string;
  action: any;
}

function SettingRow(props: SettingRowProps & { noBorder?: boolean }) {
  const Icon = props.icon;
  return (
    <div class={cn(
      "p-5 md:p-6 flex items-center justify-between gap-4 hover:bg-white/[0.04] transition-colors relative z-0",
      !props.noBorder && "border-b border-white/[0.03]"
    )}>
      <div class="flex items-center gap-4">
        <div class={cn("p-2.5 rounded-lg", props.iconColor)}>
          <Icon size={18} />
        </div>
        <div>
          <p class="text-sm font-bold text-white">{props.label}</p>
          <p class="text-xs text-slate-500 mt-0.5">{props.description}</p>
        </div>
      </div>
      {props.action}
    </div>
  );
}

export default function SettingsPage() {
  const { settings, updateSetting } = settingsStore;
  
  const [ffmpegStatus, setFfmpegStatus] = createSignal<{
    is_available: boolean;
    path?: string;
    version?: string;
  }>({ is_available: false });

  const [apiKeysStatus, setApiKeysStatus] = createSignal({
    gemini: false,
    groq: false,
    mistral: false
  });

  const [newKeys, setNewKeys] = createSignal({
    gemini: "",
    groq: "",
    mistral: ""
  });

  const [isSaving, setIsSaving] = createSignal(false);
  const [appVersion, setAppVersion] = createSignal("0.1.0");

  onMount(async () => {
    // Check FFmpeg
    try {
      const status = await invoke<any>("check_ffmpeg_status");
      setFfmpegStatus(status);
    } catch (e) {
      console.error("FFmpeg check failed:", e);
    }

    // Check API Keys status
    const providers = ["gemini", "groq", "mistral"] as const;
    const status: any = {};
    for (const p of providers) {
      status[p] = await invoke("get_api_key_status", { provider: p }).catch(() => false);
    }
    setApiKeysStatus(status);

    // Get App Info
    const info = await invoke<string>("get_app_info").catch(() => "FastClip v0.1.0");
    setAppVersion(info.split(" v")[1] || "0.1.0");
  });

  const handleSaveKeys = async () => {
    setIsSaving(true);
    try {
      if (newKeys().gemini) await invoke("set_api_key", { provider: "gemini", key: newKeys().gemini });
      if (newKeys().groq) await invoke("set_api_key", { provider: "groq", key: newKeys().groq });
      if (newKeys().mistral) await invoke("set_api_key", { provider: "mistral", key: newKeys().mistral });
      
      showToast("API keys stored securely!", "success");
      setNewKeys({ gemini: "", groq: "", mistral: "" });
      
      // Refresh status
      const providers = ["gemini", "groq", "mistral"] as const;
      const status: any = {};
      for (const p of providers) {
        status[p] = await invoke("get_api_key_status", { provider: p }).catch(() => false);
      }
      setApiKeysStatus(status);
    } catch (e) {
      showToast("Failed to save keys: " + e, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSettings = () => {
    showToast("General settings saved!", "success");
  };

  return (
    <div class="max-w-3xl mx-auto space-y-12 py-4">
      {/* Header */}
      <div class="border-b border-white/5 pb-10 animate-fade-in">
        <span class="label-micro-primary">Preferences</span>
        <h3 class="heading-page">Settings</h3>
      </div>

      {/* Appearance */}
      <section class="animate-fade-in stagger-1" style="opacity:0">
        <h4 class="heading-section text-lg mb-6 flex items-center gap-3">
          <Palette size={18} class="text-primary" /> Appearance
        </h4>
        <div class="glass-card-flat !p-0 overflow-hidden isolate">
          <div class="p-5 md:p-6 border-b border-white/[0.03]">
            <p class="text-sm font-bold text-white mb-1">Accent Color</p>
            <p class="text-xs text-slate-500 mb-4">Choose your interface highlight color</p>
            <div class="flex items-center gap-3">
              <For each={accentColors}>
                {(color) => (
                  <button
                    class={cn(
                      "w-9 h-9 rounded-lg transition-all border-2",
                      settings().accentColor === color.name.toLowerCase()
                        ? "border-white scale-110 shadow-lg"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ background: color.value, "box-shadow": settings().accentColor === color.name.toLowerCase() ? `0 4px 20px ${color.value}40` : "none" }}
                    onClick={() => updateSetting("accentColor", color.name.toLowerCase() as any)}
                    title={color.name}
                  />
                )}
              </For>
            </div>
          </div>

          <SettingRow
            icon={Monitor}
            iconColor="bg-cyan-500/10 text-cyan-500"
            label="Theme"
            description={`${settings().theme.replace("-", " ").toUpperCase()} is active`}
            noBorder
            action={
              <span class="tag capitalize">
                <div class="w-2 h-2 rounded-full bg-black border border-white/20" />
                {settings().theme.replace("-", " ")}
              </span>
            }
          />
        </div>
      </section>

      {/* General */}
      <section class="animate-fade-in stagger-2" style="opacity:0">
        <h4 class="heading-section text-lg mb-6 flex items-center gap-3">
          <HardDrive size={18} class="text-amber-500" /> General
        </h4>
        <div class="glass-card-flat !p-0 overflow-hidden isolate">
          <SettingRow
            icon={FolderOpen}
            iconColor="bg-primary/10 text-primary"
            label="Export Directory"
            description={settings().exportDirectory || "No directory selected"}
            action={<button class="btn-glass text-[9px] tracking-widest" onClick={async () => {
              const { open } = await import("@tauri-apps/plugin-dialog");
              const selected = await open({ directory: true });
              if (selected) updateSetting("exportDirectory", selected);
            }}>Browse...</button>}
          />

          <SettingRow
            icon={Package}
            iconColor={ffmpegStatus().is_available ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}
            label="FFmpeg Status"
            description={ffmpegStatus().is_available ? `Found: ${ffmpegStatus().version || "Unknown Version"}` : "FFmpeg not found in PATH"}
            action={
              <Show when={ffmpegStatus().is_available} fallback={<span class="badge badge-error">Missing ✗</span>}>
                <span class="badge badge-success">Detected ✓</span>
              </Show>
            }
          />

          <SettingRow
            icon={Bell}
            iconColor="bg-emerald-500/10 text-emerald-500"
            label="Notifications"
            description="Show desktop notifications for exports"
            noBorder
            action={
              <button
                class={cn(
                  "w-12 h-7 rounded-full transition-all relative",
                  settings().autoUpdate ? "bg-primary" : "bg-white/10"
                )}
                onClick={() => updateSetting("autoUpdate", !settings().autoUpdate)}
              >
                <div class={cn(
                  "absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all",
                  settings().autoUpdate ? "left-6" : "left-1"
                )} />
              </button>
            }
          />
        </div>
      </section>

      {/* AI & Inferences - Pipeline Strategy */}
      <section class="animate-fade-in stagger-3" style="opacity:0">
        <div class="flex items-center justify-between mb-6">
          <h4 class="heading-section text-lg flex items-center gap-3">
            <Cpu size={18} class="text-violet-400" /> Pipeline Configuration
          </h4>
          <span class="badge badge-processing text-[8px] tracking-[0.2em]">Neural Engine v2</span>
        </div>
        
        <div class="space-y-6">
          <div class="glass-card-flat space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-white">Transcription Engine</p>
                <p class="text-[10px] text-slate-500 mt-0.5">How audio is converted to searchable text</p>
              </div>
              <div class="flex p-1 bg-black/40 rounded-xl border border-white/5">
                <button class={cn("px-4 py-1.5 rounded-lg text-[10px] font-black transition-all bg-primary text-white shadow-lg shadow-primary/20")}>LOCAL</button>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] space-y-4 animate-scale-in">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><HardDrive size={14} /></div>
                  <span class="text-xs font-bold text-slate-300">Whisper Local (CPU/GPU)</span>
                </div>
                <Dropdown
                  options={whisperOptions}
                  value={settings().whisperModel}
                  onChange={(v) => updateSetting("whisperModel", v as any)}
                />
              </div>
              <p class="text-[10px] text-slate-500 leading-relaxed italic">Runs entirely on your machine. Privacy-first, no internet required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* API Keys - Cloud Models */}
      <section class="animate-fade-in stagger-4" style="opacity:0">
        <h4 class="heading-section text-lg mb-6 flex items-center gap-3">
          <Key size={18} class="text-emerald-500" /> Cloud AI Keys
        </h4>
        <div class="glass-card-flat !p-0 overflow-hidden isolate">
          <div class="p-6 space-y-6">
            {/* Gemini */}
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <label class="text-sm font-bold text-white">Gemini API Key</label>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-slate-500 hover:text-primary transition-colors">
                    <ExternalLink size={12} />
                  </a>
                  <Show when={apiKeysStatus().gemini}>
                    <Check size={14} class="text-emerald-500" />
                  </Show>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-600">Google AI Studio</span>
              </div>
              <input
                type="password"
                value={newKeys().gemini}
                onInput={(e) => setNewKeys(prev => ({ ...prev, gemini: e.currentTarget.value }))}
                placeholder={apiKeysStatus().gemini ? "••••••••••••••••" : "Paste Gemini API Key..."}
                class="input-glass"
              />
            </div>

            {/* Groq */}
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <label class="text-sm font-bold text-white">Groq API Key</label>
                  <a href="https://console.groq.com/keys" target="_blank" class="text-slate-500 hover:text-primary transition-colors">
                    <ExternalLink size={12} />
                  </a>
                  <Show when={apiKeysStatus().groq}>
                    <Check size={14} class="text-emerald-500" />
                  </Show>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-600">Groq Cloud</span>
              </div>
              <input
                type="password"
                value={newKeys().groq}
                onInput={(e) => setNewKeys(prev => ({ ...prev, groq: e.currentTarget.value }))}
                placeholder={apiKeysStatus().groq ? "••••••••••••••••" : "Paste Groq API Key..."}
                class="input-glass"
              />
            </div>
          </div>
          
          <div class="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end">
             <button 
              class="btn-primary flex items-center gap-2" 
              onClick={handleSaveKeys}
              disabled={isSaving() || (!newKeys().gemini && !newKeys().groq && !newKeys().mistral)}
            >
              <Show when={isSaving()} fallback={<Key size={14} />}>
                <div class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </Show>
              Save Keys to System Wallet
            </button>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div class="flex justify-end animate-fade-in stagger-5" style="opacity:0">
        <button class="btn-primary" onClick={handleSaveSettings}>
          Save Preferences
        </button>
      </div>

      {/* About */}
      <section class="pt-8 flex items-center justify-between text-slate-500 animate-fade-in stagger-6" style="opacity:0">
        <div class="flex items-center gap-3">
          <div class="text-[10px] font-bold uppercase tracking-[0.2em]">FastClip v{appVersion()}</div>
          <span class="badge badge-processing">Beta</span>
        </div>
        <div class="flex items-center gap-6">
          <a href="#" class="text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors flex items-center gap-1">Github <ExternalLink size={10} /></a>
          <a href="#" class="text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors flex items-center gap-1">Docs <ExternalLink size={10} /></a>
        </div>
      </section>
    </div>
  );
}
