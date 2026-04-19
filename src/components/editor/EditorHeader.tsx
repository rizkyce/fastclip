import { Download } from "lucide-solid";

interface EditorHeaderProps {
  projectName: string;
}

export default function EditorHeader(props: EditorHeaderProps) {
  return (
    <div class="flex items-center justify-between">
      <div>
        <span class="label-micro-primary block mb-1">Editing</span>
        <h3 class="text-xl font-black text-white tracking-tight">{props.projectName}</h3>
      </div>
      <button class="btn-primary text-[9px]">
        <Download size={14} /> Quick Export
      </button>
    </div>
  );
}
