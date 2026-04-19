import { JSX } from "solid-js";
import { cn } from "../lib/utils";

interface EmptyStateProps {
  icon: JSX.Element;
  title: string;
  description: string;
  action?: JSX.Element;
  class?: string;
}

export default function EmptyState(props: EmptyStateProps) {
  return (
    <div class={cn("flex flex-col items-center justify-center py-20 px-8 text-center", props.class)}>
      <div class="relative mb-8">
        <div class="absolute inset-0 bg-primary blur-3xl opacity-10" />
        <div class="relative w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
          {props.icon}
        </div>
      </div>
      <h4 class="text-xl font-black text-white tracking-tight mb-2">{props.title}</h4>
      <p class="text-sm text-slate-500 max-w-sm mb-8">{props.description}</p>
      {props.action}
    </div>
  );
}
