import { For } from "solid-js";
import { createStore } from "solid-js/store";
import { cn } from "../lib/utils";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-solid";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const [toasts, setToasts] = createStore<Toast[]>([]);

let toastCounter = 0;

export function showToast(message: string, type: ToastType = "info", duration = 4000) {
  const id = `toast-${++toastCounter}`;
  setToasts(prev => [...prev, { id, message, type, duration }]);

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }
}

export function dismissToast(id: string) {
  setToasts(prev => prev.filter(t => t.id !== id));
}

const iconMap = {
  success: CheckCircle2,
  error: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: "border-emerald-500/30 text-emerald-500",
  error: "border-rose-500/30 text-rose-500",
  warning: "border-amber-500/30 text-amber-500",
  info: "border-primary/30 text-primary",
};

export default function ToastContainer() {
  return (
    <div class="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <For each={toasts}>
        {(toast) => {
          const Icon = iconMap[toast.type];
          return (
            <div class={cn(
              "glass border rounded-2xl px-5 py-4 flex items-center gap-4 min-w-[320px] max-w-[420px] animate-slide-up pointer-events-auto shadow-2xl",
              colorMap[toast.type]
            )}>
              <Icon size={18} class="shrink-0" />
              <span class="text-sm text-white font-medium flex-1">{toast.message}</span>
              <button class="btn-ghost p-1 shrink-0" onClick={() => dismissToast(toast.id)}>
                <X size={14} />
              </button>
            </div>
          );
        }}
      </For>
    </div>
  );
}
