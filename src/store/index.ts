import { createStore } from "solid-js/store";
import { MOCK_STATS, MOCK_PROJECTS, MOCK_AI_JOBS } from "../mock/data";

interface UIState {
  sidebarOpen: boolean;
  activeAIJobId: string | null;
  notifications: { id: string; type: "success" | "error" | "info"; message: string }[];
  preferences: {
    accentColor: string;
    glassBlur: number;
    showTips: boolean;
  };
}

interface DataState {
  projects: typeof MOCK_PROJECTS;
  stats: typeof MOCK_STATS;
  jobs: typeof MOCK_AI_JOBS;
}

interface AppState {
  ui: UIState;
  data: DataState;
}

const [state, setState] = createStore<AppState>({
  ui: {
    sidebarOpen: true,
    activeAIJobId: null,
    notifications: [],
    preferences: {
      accentColor: "#4f46e5",
      glassBlur: 20,
      showTips: true,
    }
  },
  data: {
    projects: MOCK_PROJECTS,
    stats: MOCK_STATS,
    jobs: MOCK_AI_JOBS,
  }
});

// Selectors
export const uiState = state.ui;
export const dataState = state.data;

// Actions
export const actions = {
  toggleSidebar: () => setState("ui", "sidebarOpen", (prev) => !prev),
  setSidebarOpen: (open: boolean) => setState("ui", "sidebarOpen", open),
  
  // Optimistic AI Processing
  startAIJob: (videoId: string) => {
    setState("ui", "activeAIJobId", videoId);
    // Add optimistic notification
    const id = Math.random().toString(36).substr(2, 9);
    setState("ui", "notifications", (prev) => [...prev, { id, type: "info" as const, message: "AI processing started..." }]);
    
    // Auto-remove notification after 3s
    setTimeout(() => {
      setState("ui", "notifications", (prev) => prev.filter(n => n.id !== id));
    }, 3000);
  },
  
  updateProject: (id: string, updates: Partial<typeof MOCK_PROJECTS[0]>) => {
    setState("data", "projects", (p) => p.id === id, updates);
  },

  addNotification: (type: UIState["notifications"][0]["type"], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setState("ui", "notifications", prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setState("ui", "notifications", prev => prev.filter(n => n.id !== id));
    }, 4000);
  }
};

export default state;
