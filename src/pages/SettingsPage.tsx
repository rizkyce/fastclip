import { For, Show, createSignal } from "solid-js";
import {
  Package, HardDrive, Cpu, ExternalLink, Palette,
  Monitor, FolderOpen, Bell, Key, Globe, Sparkles
} from "lucide-solid";
import { cn } from "../lib/utils";
import { showToast } from "../components/Toast";
import Dropdown, { type DropdownOption } from "../components/Dropdown";

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

const languageOptions: DropdownOption[] = [
  { label: "Auto Detect", value: "auto" },
  { label: "English", value: "en" },
  { label: "Indonesian", value: "id" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
];

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
  const [selectedAccent, setSelectedAccent] = createSignal("#4F46E5");
  const [selectedModel, setSelectedModel] = createSignal("tiny");
  const [selectedLanguage, setSelectedLanguage] = createSignal("auto");
  const [notifications, setNotifications] = createSignal(true);
  
  // AI Pipeline Signals
  const [transcriptionEngine, setTranscriptionEngine] = createSignal<"local" | "cloud">("local");
  const [intelligenceEngine, setIntelligenceEngine] = createSignal<"local" | "cloud">("cloud");
  const [cloudProvider, setCloudProvider] = createSignal<"gemini" | "mistral">("gemini");

  const handleSave = () => {
    showToast("Settings saved successfully!", "success");
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
                      selectedAccent() === color.value
                        ? "border-white scale-110 shadow-lg"
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ background: color.value, "box-shadow": selectedAccent() === color.value ? `0 4px 20px ${color.value}40` : "none" }}
                    onClick={() => setSelectedAccent(color.value)}
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
            description="OLED Black is active"
            noBorder
            action={
              <span class="tag">
                <div class="w-2 h-2 rounded-full bg-black border border-white/20" />
                OLED Black
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
            description="Where saved clips are stored"
            action={<button class="btn-glass text-[9px] tracking-widest" onClick={() => showToast("File picker opened", "info")}>Browse...</button>}
          />

          <SettingRow
            icon={Package}
            iconColor="bg-amber-500/10 text-amber-500"
            label="FFmpeg Path"
            description="External FFmpeg binary location"
            action={<span class="badge badge-success">Bundled ✓</span>}
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
                  notifications() ? "bg-primary" : "bg-white/10"
                )}
                onClick={() => setNotifications(!notifications())}
              >
                <div class={cn(
                  "absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all",
                  notifications() ? "left-6" : "left-1"
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
          {/* Transcription Strategy */}
          <div class="glass-card-flat space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-white">Transcription Engine</p>
                <p class="text-[10px] text-slate-500 mt-0.5">How audio is converted to searchable text</p>
              </div>
              <div class="flex p-1 bg-black/40 rounded-xl border border-white/5">
                <button 
                  onClick={() => setTranscriptionEngine("local")}
                  class={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all",
                    transcriptionEngine() === "local" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-white"
                  )}
                >LOCAL</button>
                <button 
                  onClick={() => setTranscriptionEngine("cloud")}
                  class={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all",
                    transcriptionEngine() === "cloud" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-white"
                  )}
                >CLOUD</button>
              </div>
            </div>

            <Show when={transcriptionEngine() === "local"}>
              <div class="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] space-y-4 animate-scale-in">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><HardDrive size={14} /></div>
                    <span class="text-xs font-bold text-slate-300">Whisper Local (CPU/GPU)</span>
                  </div>
                  <Dropdown
                    options={whisperOptions}
                    value={selectedModel()}
                    onChange={setSelectedModel}
                  />
                </div>
                <p class="text-[10px] text-slate-500 leading-relaxed italic">Runs entirely on your machine. Privacy-first, no internet required.</p>
              </div>
            </Show>

            <Show when={transcriptionEngine() === "cloud"}>
              <div class="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] space-y-4 animate-scale-in">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Globe size={14} /></div>
                    <span class="text-xs font-bold text-slate-300">Groq Whisper-v3</span>
                  </div>
                  <span class="badge badge-success !px-2 py-0.5 !text-[7px]">Ultra Fast</span>
                </div>
                <p class="text-[10px] text-slate-500 leading-relaxed italic">Near-instant transcription (10x faster). Requires Groq API Key.</p>
              </div>
            </Show>
          </div>

          {/* Analysis Strategy */}
          <div class="glass-card-flat space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-white">Clip Intelligence</p>
                <p class="text-[10px] text-slate-500 mt-0.5">Brain used for finding highlights & scene detection</p>
              </div>
              <div class="flex p-1 bg-black/40 rounded-xl border border-white/5">
                <button 
                  onClick={() => setIntelligenceEngine("local")}
                  class={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all",
                    intelligenceEngine() === "local" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-white"
                  )}
                >LOCAL</button>
                <button 
                  onClick={() => setIntelligenceEngine("cloud")}
                  class={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black transition-all",
                    intelligenceEngine() === "cloud" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-white"
                  )}
                >CLOUD</button>
              </div>
            </div>

            <Show when={intelligenceEngine() === "local"}>
              <div class="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] space-y-4 animate-scale-in">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-violet-500/10 rounded-lg text-violet-400"><Sparkles size={14} /></div>
                  <span class="text-xs font-bold text-slate-300">Gemma-4 Multimodal</span>
                </div>
                <p class="text-[10px] text-slate-500 leading-relaxed italic">Analyzes video frames locally. Requires 8GB VRAM (NVIDIA/Metal).</p>
                <div class="flex items-center gap-2 px-3 py-2 bg-amber-500/5 rounded-lg border border-amber-500/10">
                  <Package size={12} class="text-amber-500" />
                  <span class="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Self-Hosted via mistral.rs</span>
                </div>
              </div>
            </Show>

            <Show when={intelligenceEngine() === "cloud"}>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-scale-in">
                <div 
                  onClick={() => setCloudProvider("gemini")}
                  class={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer group",
                    cloudProvider() === "gemini" ? "bg-primary/10 border-primary/40 shadow-xl" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                  )}
                >
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold text-white group-hover:text-primary transition-colors">Gemini 1.5 Pro</span>
                    <Globe size={12} class="text-slate-600" />
                  </div>
                  <p class="text-[9px] text-slate-500 leading-tight">Best for long-form video context and complex reasoning.</p>
                </div>

                <div 
                  onClick={() => setCloudProvider("mistral")}
                  class={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer group",
                    cloudProvider() === "mistral" ? "bg-primary/10 border-primary/40 shadow-xl" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                  )}
                >
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold text-white group-hover:text-primary transition-colors">Mistral Large</span>
                    <Globe size={12} class="text-slate-600" />
                  </div>
                  <p class="text-[9px] text-slate-500 leading-tight">Superior logic for metadata and transcript analysis.</p>
                </div>
              </div>
            </Show>
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
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <label class="text-sm font-bold text-white">Gemini API Key</label>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-slate-500 hover:text-primary transition-colors">
                    <ExternalLink size={12} />
                  </a>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-600">Google AI Studio</span>
              </div>
              <input
                type="password"
                placeholder="Paste Gemini API Key..."
                class="input-glass"
              />
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <label class="text-sm font-bold text-white">Groq API Key</label>
                  <a href="https://console.groq.com/keys" target="_blank" class="text-slate-500 hover:text-primary transition-colors">
                    <ExternalLink size={12} />
                  </a>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-600">Groq Cloud</span>
              </div>
              <input
                type="password"
                placeholder="Paste Groq API Key..."
                class="input-glass"
              />
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <label class="text-sm font-bold text-white">Mistral API Key</label>
                  <a href="https://console.mistral.ai/api-keys/" target="_blank" class="text-slate-500 hover:text-primary transition-colors">
                    <ExternalLink size={12} />
                  </a>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-600">Mistral La Plateforme</span>
              </div>
              <input
                type="password"
                placeholder="Paste Mistral API Key..."
                class="input-glass"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div class="flex justify-end animate-fade-in stagger-5" style="opacity:0">
        <button class="btn-primary" onClick={handleSave}>
          Save Preferences
        </button>
      </div>

      {/* About */}
      <section class="pt-8 flex items-center justify-between text-slate-500 animate-fade-in stagger-6" style="opacity:0">
        <div class="flex items-center gap-3">
          <div class="text-[10px] font-bold uppercase tracking-[0.2em]">FastClip v0.1.0-beta</div>
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
