import { createSignal, createRoot } from "solid-js";
import { createStore } from "solid-js/store";

export type AIProcessingStep = "idle" | "transcribing" | "analyzing" | "detecting" | "done" | "error";

export interface AIJob {
  id: string;
  projectId: string;
  videoName: string;
  status: AIProcessingStep;
  progress: number;
  currentStep: string;
  steps: { name: string; status: "pending" | "active" | "done" | "error"; progress: number }[];
  startedAt: string;
  estimatedTimeLeft?: string;
  error?: string;
  modelUsed: string;
  cpuUsage?: number;
  memoryUsage?: number;
}

function createAIStore() {
  const [jobs, setJobs] = createStore<AIJob[]>([]);
  const [isProcessing, setIsProcessing] = createSignal(false);

  const activeJobs = () => jobs.filter(j => j.status !== "done" && j.status !== "error" && j.status !== "idle");
  const completedJobs = () => jobs.filter(j => j.status === "done");

  const addJob = (job: AIJob) => {
    setJobs(prev => [...prev, job]);
    setIsProcessing(true);
  };

  const updateJob = (id: string, updates: Partial<AIJob>) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  };

  const removeJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    if (activeJobs().length === 0) setIsProcessing(false);
  };

  const cancelJob = (id: string) => {
    updateJob(id, { status: "error", error: "Cancelled by user" });
    if (activeJobs().length === 0) setIsProcessing(false);
  };

  return {
    jobs,
    setJobs,
    isProcessing,
    activeJobs,
    completedJobs,
    addJob,
    updateJob,
    removeJob,
    cancelJob,
  };
}

export const aiStore = createRoot(createAIStore);
