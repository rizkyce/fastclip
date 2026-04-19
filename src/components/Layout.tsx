import { ParentProps, For, createSignal, onMount, Suspense, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import {
  Home,
  Library,
  Scissors,
  Download,
  Brain,
  BarChart3,
  Settings,
  Zap,
  Menu,
  X,
  Minus,
  Square,
  Maximize2,
  Keyboard,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-solid";
import { cn } from "../lib/utils";
import { getCurrentWindow } from "@tauri-apps/api/window";
import KeyboardShortcutsOverlay from "./KeyboardShortcutsOverlay";
import { uiState } from "../store";

const appWindow = getCurrentWindow();

const navItems = [
  { label: "Dashboard", path: "/", icon: Home },
  { label: "Library", path: "/library", icon: Library },
  { label: "Editor", path: "/editor", icon: Scissors },
  { label: "Exports", path: "/exports", icon: Download },
  { label: "AI Lab", path: "/ai-lab", icon: Brain },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Settings", path: "/settings", icon: Settings },
];

function TitleBar() {
  const [isMaximized, setIsMaximized] = createSignal(false);
  let titleBarRef: HTMLDivElement | undefined;

  onMount(async () => {
    setIsMaximized(await appWindow.isMaximized());
    
    // Manual Dragging Implementation (Robust)
    titleBarRef?.addEventListener("mousedown", (e) => {
      if (e.buttons === 1 && e.target === titleBarRef) {
        if (e.detail === 2) {
          appWindow.toggleMaximize();
        } else {
          appWindow.startDragging();
        }
      }
    });

    const unlisten = await appWindow.onResized(async () => {
      setIsMaximized(await appWindow.isMaximized());
    });

    return () => unlisten();
  });

  return (
    <div 
      ref={titleBarRef}
      class="h-10 w-full bg-[#020617]/95 border-b border-white/[0.03] flex items-center justify-between px-4 select-none cursor-default shrink-0 relative z-[60]"
    >
      <div class="flex items-center gap-2 pointer-events-none relative z-10">
        <div class="w-4 h-4 bg-primary rounded-sm shadow-sm flex items-center justify-center">
          <Zap size={10} class="text-white fill-current" />
        </div>
        <span class="text-[10px] font-logo font-bold text-white/50 tracking-wider">FASTCLIP / ENGINE</span>
      </div>

      <div class="flex items-center h-full relative z-10">
        <button 
          onClick={async (e) => { e.stopPropagation(); await appWindow.minimize(); }}
          class="w-10 h-full flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white transition-all outline-none"
        >
          <Minus size={14} />
        </button>
        <button 
          onClick={async (e) => { e.stopPropagation(); await appWindow.toggleMaximize(); }}
          class="w-10 h-full flex items-center justify-center text-slate-400 hover:bg-white/5 hover:text-white transition-all outline-none"
        >
          {isMaximized() ? <Maximize2 size={12} /> : <Square size={12} />}
        </button>
        <button 
          onClick={async (e) => { e.stopPropagation(); await appWindow.close(); }}
          class="w-12 h-full flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all outline-none"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Layout(props: ParentProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);
  const [showShortcuts, setShowShortcuts] = createSignal(false);

  // Derive label from current path
  const currentLabel = () => {
    // Handle dynamic routes like /editor/p1 or /project/p1
    const pathname = location.pathname;
    if (pathname.startsWith("/editor")) return "Editor";
    if (pathname.startsWith("/project")) return "Project";
    return navItems.find(i => i.path === pathname)?.label || "FastClip";
  };

  return (
    <div class="flex flex-col h-screen w-screen bg-background text-slate-300 overflow-hidden">
      <TitleBar />
      <div class="flex flex-1 flex-col md:flex-row overflow-hidden relative">
        {/* Mobile Top Bar - External (Trigger) */}
        <div class="md:hidden flex items-center justify-between px-6 h-20 glass border-b border-white/5 z-[60] shrink-0">
          <div class="flex items-center gap-2">
             <div class="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <Zap size={14} class="text-white fill-current" />
             </div>
             <span class="text-lg font-logo font-bold text-white tracking-tight lowercase">fast<span class="text-primary font-extrabold">clip</span></span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            class="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 active:scale-95 transition-all shadow-lg"
          >
             <Menu size={22} class="text-white" />
          </button>
      </div>

      {/* Sidebar - Desktop & Mobile Overlay */}
       <aside class={cn(
        "fixed md:relative inset-0 md:inset-auto m-0 md:m-4 w-full md:w-64 bg-white/[0.04] backdrop-blur-3xl md:rounded-2xl flex flex-col transition-all duration-500 z-[70] md:z-[55] overflow-hidden shadow-2xl border-r border-white/10 md:border md:border-white/[0.06]",
        isMobileMenuOpen() ? "translate-x-0 opacity-100" : "-translate-x-full md:translate-x-0 opacity-0 md:opacity-100"
      )} style={{ "transition-property": "transform, opacity", "transform": "translateZ(0)" }}>
        {/* Header inside Sidebar */}
        <div class="flex items-center justify-between p-6 md:p-10 shrink-0">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span class="text-2xl font-logo font-bold text-white tracking-tight lowercase">fast<span class="text-primary font-extrabold">clip</span></span>
            </div>
            <span class="text-[8px] font-black text-slate-500 tracking-[0.4em] uppercase pl-4">Creative AI</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            class="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <nav class="flex-1 px-4 py-4 md:py-0 space-y-1 md:space-y-1.5 overflow-y-auto">
          <For each={navItems}>
            {(item) => (
              <A 
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                class="flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden"
                activeClass="bg-primary text-white shadow-xl shadow-primary/20"
                inactiveClass="hover:bg-white/5 text-slate-500 hover:text-white"
                end={item.path === "/"}
              >
                <div class="relative z-10 w-5 flex justify-center shrink-0">
                  <item.icon size={18} />
                </div>
                <span class="font-bold text-sm relative z-10">{item.label}</span>
                
                {location.pathname === item.path && (
                  <div class="absolute inset-0 bg-gradient-to-r from-primary to-indigo-600 opacity-100" />
                )}
              </A>
            )}
          </For>
        </nav>

        {/* Keyboard shortcut trigger */}
        <div class="px-4 py-3">
          <button
            onClick={() => setShowShortcuts(true)}
            class="w-full flex items-center gap-3 px-5 py-3 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <Keyboard size={16} />
            <span class="text-xs font-bold">Shortcuts</span>
            <kbd class="ml-auto text-[9px] px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono">?</kbd>
          </button>
        </div>

        <div class="p-6 md:p-4 mt-auto border-t border-white/5 md:border-t-0">
          <div class="p-1 rounded-2xl bg-white/5 border border-white/10">
            <div class="p-2 flex items-center gap-3">
              <div class="w-10 h-10 min-w-[40px] rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                <span class="text-xs font-black text-white">PRO</span>
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-xs font-black text-white tracking-wide uppercase truncate">Vibe Creator</p>
                <p class="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate">Ultra License</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main class="flex-1 flex flex-col overflow-hidden relative isolate">
        <header class="hidden md:flex h-20 shrink-0 items-center justify-between px-12 bg-transparent relative z-10">
          <div>
            <span class="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 block">FastClip / Workspace</span>
            <h2 class="text-base md:text-lg font-bold text-white">
              {currentLabel()}
            </h2>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span class="text-[9px] font-black uppercase text-slate-400 tracking-widest">Server: Online</span>
            </div>
            <A href="/library" class="btn-primary">
              New Magic Clip
            </A>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto px-6 py-10 md:p-12 scroll-smooth bg-[#020617] relative">
          <Suspense fallback={
            <div class="flex-1 flex items-center justify-center min-h-[50vh]">
              <div class="flex flex-col items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
                  <Zap size={24} class="text-primary" />
                </div>
                <span class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse">Initializing Engine...</span>
              </div>
            </div>
          }>
            {props.children}
          </Suspense>
        </div>
      </main>
    </div>

    {/* Global AI Progress Bar */}
    <Show when={uiState.activeAIJobId}>
      <div class="fixed top-0 left-0 right-0 h-1 z-[100] bg-white/5 overflow-hidden">
        <div class="h-full bg-gradient-to-r from-primary via-indigo-400 to-primary animate-shimmer" style="background-size: 200% 100%; width: 100%" />
      </div>
    </Show>

    {/* Global Toast Center */}
    <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <For each={uiState.notifications}>
        {(n) => (
          <div class={cn(
            "glass-card-flat !p-4 flex items-center gap-3 animate-scale-in pointer-events-auto min-w-[280px] shadow-2xl border-l-4",
            n.type === "success" ? "border-l-emerald-500" : n.type === "error" ? "border-l-rose-500" : "border-l-primary"
          )}>
            <div class="p-1.5 rounded-lg bg-white/5">
              <Show when={n.type === "success"}><CheckCircle2 size={16} class="text-emerald-500" /></Show>
              <Show when={n.type === "error"}><AlertCircle size={16} class="text-rose-500" /></Show>
              <Show when={n.type === "info"}><Info size={16} class="text-primary" /></Show>
            </div>
            
            <div class="flex-1">
              <p class="text-sm font-bold text-white leading-tight">{n.message}</p>
            </div>
            
            <button 
              onClick={() => {/* Actions to dismiss would go here */}}
              class="p-1 hover:bg-white/5 rounded-md transition-colors text-slate-500 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </For>
    </div>

    {/* Keyboard Shortcuts Overlay */}
    <KeyboardShortcutsOverlay open={showShortcuts()} onClose={() => setShowShortcuts(false)} />
  </div>
);
}
