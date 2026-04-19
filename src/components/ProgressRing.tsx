import { cn } from "../lib/utils";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  class?: string;
}

export default function ProgressRing(props: ProgressRingProps) {
  const size = () => props.size ?? 48;
  const stroke = () => props.strokeWidth ?? 4;
  const radius = () => (size() - stroke()) / 2;
  const circumference = () => 2 * Math.PI * radius();
  const offset = () => circumference() - (props.progress / 100) * circumference();

  return (
    <div class={cn("relative inline-flex items-center justify-center", props.class)}>
      <svg width={size()} height={size()} class="-rotate-90">
        {/* Track */}
        <circle
          cx={size() / 2}
          cy={size() / 2}
          r={radius()}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          stroke-width={stroke()}
        />
        {/* Progress */}
        <circle
          cx={size() / 2}
          cy={size() / 2}
          r={radius()}
          fill="none"
          stroke="url(#ring-gradient)"
          stroke-width={stroke()}
          stroke-linecap="round"
          stroke-dasharray={String(circumference())}
          stroke-dashoffset={offset()}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
        <defs>
          <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--color-primary)" />
            <stop offset="100%" stop-color="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-[9px] font-black text-white">{Math.round(props.progress)}%</span>
      </div>
    </div>
  );
}
