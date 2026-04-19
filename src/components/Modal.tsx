import { JSX } from "solid-js";
import { cn } from "../lib/utils";
import { X } from "lucide-solid";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
  maxWidth?: string;
}

export default function Modal(props: ModalProps) {
  return (
    <>
      {props.open && (
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            class="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => props.onClose()}
          />

          {/* Content */}
          <div
            class={cn(
              "relative glass border-white/10 rounded-3xl p-8 w-full animate-scale-in shadow-2xl",
              props.maxWidth ?? "max-w-lg"
            )}
          >
            {/* Header */}
            {props.title ? (
              <div class="flex items-center justify-between mb-6">
                <h3 class="heading-section">{props.title}</h3>
                <button class="btn-ghost" onClick={() => props.onClose()}>
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button class="absolute top-4 right-4 btn-ghost" onClick={() => props.onClose()}>
                <X size={20} />
              </button>
            )}

            {/* Body */}
            {props.children}
          </div>
        </div>
      )}
    </>
  );
}
