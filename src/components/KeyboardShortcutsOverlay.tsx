import Modal from "./Modal";

interface ShortcutGroup {
  title: string;
  shortcuts: { keys: string[]; description: string }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Playback",
    shortcuts: [
      { keys: ["Space"], description: "Play / Pause" },
      { keys: ["J"], description: "Rewind 5s" },
      { keys: ["L"], description: "Forward 5s" },
      { keys: ["K"], description: "Stop" },
      { keys: ["←"], description: "Previous frame" },
      { keys: ["→"], description: "Next frame" },
    ],
  },
  {
    title: "Editing",
    shortcuts: [
      { keys: ["I"], description: "Set In point" },
      { keys: ["O"], description: "Set Out point" },
      { keys: ["S"], description: "Split at playhead" },
      { keys: ["Ctrl", "Z"], description: "Undo" },
      { keys: ["Ctrl", "Shift", "Z"], description: "Redo" },
      { keys: ["Delete"], description: "Delete selection" },
    ],
  },
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["Ctrl", "1"], description: "Go to Library" },
      { keys: ["Ctrl", "2"], description: "Go to Editor" },
      { keys: ["Ctrl", "3"], description: "Go to Exports" },
      { keys: ["Ctrl", "E"], description: "Export current clip" },
      { keys: ["?"], description: "Show keyboard shortcuts" },
    ],
  },
  {
    title: "Timeline",
    shortcuts: [
      { keys: ["+"], description: "Zoom In" },
      { keys: ["-"], description: "Zoom Out" },
      { keys: ["Home"], description: "Go to start" },
      { keys: ["End"], description: "Go to end" },
    ],
  },
];

interface KeyboardShortcutsOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsOverlay(props: KeyboardShortcutsOverlayProps) {
  return (
    <Modal open={props.open} onClose={props.onClose} title="Keyboard Shortcuts" maxWidth="max-w-2xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto pr-2">
        {shortcutGroups.map((group) => (
          <div>
            <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 border-l-2 border-primary pl-3">
              {group.title}
            </h4>
            <div class="space-y-2.5">
              {group.shortcuts.map((shortcut) => (
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-400">{shortcut.description}</span>
                  <div class="flex items-center gap-1">
                    {shortcut.keys.map((key) => (
                      <kbd class="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono font-bold text-white min-w-[28px] text-center">
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
