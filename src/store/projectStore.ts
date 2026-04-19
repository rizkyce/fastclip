import { createSignal, createRoot } from "solid-js";
import { createStore } from "solid-js/store";

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
  size: string;
  resolution?: string;
  codec?: string;
  status?: "raw" | "processing" | "analyzed" | "exported";
  highlights?: number;
  clips?: number;
}

export interface Highlight {
  id: string;
  videoId: string;
  start: string;
  end: string;
  confidence: number;
  transcript: string;
  status?: "detected" | "approved" | "rejected";
}

export interface Project {
  id: string;
  name: string;
  video: Video;
  highlights: Highlight[];
  createdAt: string;
  updatedAt: string;
}

function createProjectStore() {
  const [projects, setProjects] = createStore<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = createSignal<string | null>(null);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [sortBy, setSortBy] = createSignal<"date" | "name" | "size" | "duration">("date");
  const [viewMode, setViewMode] = createSignal<"grid" | "list">("grid");
  const [filterTab, setFilterTab] = createSignal<"all" | "highlights" | "drafts">("all");

  const currentProject = () => projects.find(p => p.id === currentProjectId());

  const filteredProjects = () => {
    let result = [...projects];

    // Search
    const q = searchQuery().toLowerCase();
    if (q) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.video.title.toLowerCase().includes(q)
      );
    }

    // Filter
    if (filterTab() === "highlights") {
      result = result.filter(p => p.highlights.length > 0);
    } else if (filterTab() === "drafts") {
      result = result.filter(p => p.video.status === "raw" || p.video.status === "processing");
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy()) {
        case "name": return a.name.localeCompare(b.name);
        case "date": return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "size": return a.video.size.localeCompare(b.video.size);
        default: return 0;
      }
    });

    return result;
  };

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProjectId() === id) setCurrentProjectId(null);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return {
    projects,
    setProjects,
    currentProjectId,
    setCurrentProjectId,
    currentProject,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    filterTab,
    setFilterTab,
    filteredProjects,
    addProject,
    removeProject,
    updateProject,
  };
}

export const projectStore = createRoot(createProjectStore);
