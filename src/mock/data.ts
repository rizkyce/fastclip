import { Project, Highlight, Video } from "../store/projectStore";
import { ExportItem } from "../store/exportStore";
import { AIJob } from "../store/aiStore";

export const MOCK_VIDEOS: Video[] = [
  {
    id: "v1",
    title: "Project Zero - Podcast Interview",
    thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=400&h=225&auto=format&fit=crop",
    duration: "42:15",
    date: "2024-03-20",
    size: "1.2 GB",
    resolution: "1920x1080",
    codec: "H.264",
    status: "analyzed",
    highlights: 5,
    clips: 3,
  },
  {
    id: "v2",
    title: "Gaming Highlights - Warzone Win",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&h=225&auto=format&fit=crop",
    duration: "15:30",
    date: "2024-03-18",
    size: "450 MB",
    resolution: "2560x1440",
    codec: "H.265",
    status: "exported",
    highlights: 8,
    clips: 6,
  },
  {
    id: "v3",
    title: "Product Launch Keynote",
    thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=400&h=225&auto=format&fit=crop",
    duration: "1:05:22",
    date: "2024-03-15",
    size: "2.8 GB",
    resolution: "3840x2160",
    codec: "H.264",
    status: "analyzed",
    highlights: 12,
    clips: 7,
  },
  {
    id: "v4",
    title: "Morning Vlog - Day in Life",
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400&h=225&auto=format&fit=crop",
    duration: "22:08",
    date: "2024-03-12",
    size: "780 MB",
    resolution: "1920x1080",
    codec: "H.264",
    status: "raw",
    highlights: 0,
    clips: 0,
  },
  {
    id: "v5",
    title: "Tech Review - MacBook Pro M4",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&h=225&auto=format&fit=crop",
    duration: "18:45",
    date: "2024-03-10",
    size: "620 MB",
    resolution: "3840x2160",
    codec: "H.265",
    status: "processing",
    highlights: 0,
    clips: 0,
  },
  {
    id: "v6",
    title: "Cooking Masterclass - Italian Pasta",
    thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=400&h=225&auto=format&fit=crop",
    duration: "35:12",
    date: "2024-03-08",
    size: "1.1 GB",
    resolution: "1920x1080",
    codec: "H.264",
    status: "analyzed",
    highlights: 4,
    clips: 2,
  },
];

export const MOCK_HIGHLIGHTS: Highlight[] = [
  { id: "h1", videoId: "v1", start: "02:15", end: "02:45", confidence: 0.95, transcript: "This was the absolute best moment of the interview...", status: "approved" },
  { id: "h2", videoId: "v1", start: "15:40", end: "16:10", confidence: 0.88, transcript: "Wait, did you really just say that? That's incredible.", status: "detected" },
  { id: "h3", videoId: "v1", start: "28:10", end: "29:05", confidence: 0.92, transcript: "The future of AI is not just about automation, but collaboration.", status: "detected" },
  { id: "h4", videoId: "v1", start: "35:22", end: "36:01", confidence: 0.85, transcript: "That's the question everyone should be asking right now.", status: "detected" },
  { id: "h5", videoId: "v1", start: "40:10", end: "41:30", confidence: 0.97, transcript: "I think this changes everything. This is the moment we've been waiting for.", status: "approved" },
  { id: "h6", videoId: "v2", start: "03:20", end: "03:55", confidence: 0.91, transcript: "No way! Did that just happen?! That was insane!", status: "detected" },
  { id: "h7", videoId: "v2", start: "08:12", end: "08:45", confidence: 0.87, transcript: "Triple kill! Let's gooo!", status: "detected" },
  { id: "h8", videoId: "v3", start: "12:00", end: "13:15", confidence: 0.96, transcript: "Today we're launching something that will redefine how you work.", status: "approved" },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Podcast Interview Edit",
    video: MOCK_VIDEOS[0],
    highlights: MOCK_HIGHLIGHTS.filter(h => h.videoId === "v1"),
    createdAt: "2024-03-20T10:30:00Z",
    updatedAt: "2024-03-20T15:45:00Z",
  },
  {
    id: "p2",
    name: "Warzone Best Moments",
    video: MOCK_VIDEOS[1],
    highlights: MOCK_HIGHLIGHTS.filter(h => h.videoId === "v2"),
    createdAt: "2024-03-18T08:00:00Z",
    updatedAt: "2024-03-19T11:20:00Z",
  },
  {
    id: "p3",
    name: "Keynote Highlights",
    video: MOCK_VIDEOS[2],
    highlights: MOCK_HIGHLIGHTS.filter(h => h.videoId === "v3"),
    createdAt: "2024-03-15T14:00:00Z",
    updatedAt: "2024-03-16T09:30:00Z",
  },
];

export const MOCK_EXPORTS: ExportItem[] = [
  { id: "ex1", projectId: "p1", name: "Podcast_Clip_1.mp4", status: "processing", progress: 65, format: "9:16", resolution: "1080p", codec: "h264", estimatedSize: "45 MB", eta: "2 min", createdAt: "2024-03-20T16:00:00Z", thumbnail: MOCK_VIDEOS[0].thumbnail },
  { id: "ex2", projectId: "p2", name: "Warzone_Epic_Win.mp4", status: "completed", progress: 100, format: "9:16", resolution: "1080p", codec: "h264", estimatedSize: "32 MB", outputPath: "C:/Users/exports/Warzone_Epic_Win.mp4", createdAt: "2024-03-19T12:00:00Z", completedAt: "2024-03-19T12:15:00Z", thumbnail: MOCK_VIDEOS[1].thumbnail },
  { id: "ex3", projectId: "p3", name: "Keynote_Short_1.mp4", status: "queued", progress: 0, format: "1:1", resolution: "1080p", codec: "h264", estimatedSize: "28 MB", eta: "5 min", createdAt: "2024-03-20T16:05:00Z", thumbnail: MOCK_VIDEOS[2].thumbnail },
  { id: "ex4", projectId: "p1", name: "Podcast_Clip_2.mp4", status: "completed", progress: 100, format: "16:9", resolution: "1080p", codec: "h264", estimatedSize: "60 MB", outputPath: "C:/Users/exports/Podcast_Clip_2.mp4", createdAt: "2024-03-20T14:00:00Z", completedAt: "2024-03-20T14:20:00Z", thumbnail: MOCK_VIDEOS[0].thumbnail },
];

export const MOCK_AI_JOBS: AIJob[] = [
  {
    id: "ai1",
    projectId: "p1",
    videoName: "Podcast Interview",
    status: "done",
    progress: 100,
    currentStep: "Complete",
    steps: [
      { name: "Transcribing audio", status: "done", progress: 100 },
      { name: "Analyzing speech patterns", status: "done", progress: 100 },
      { name: "Detecting viral moments", status: "done", progress: 100 },
      { name: "Generating clips", status: "done", progress: 100 },
    ],
    startedAt: "2024-03-20T10:35:00Z",
    modelUsed: "Whisper Tiny",
    cpuUsage: 0,
    memoryUsage: 0,
  },
  {
    id: "ai2",
    projectId: "p5",
    videoName: "Tech Review - MacBook Pro M4",
    status: "analyzing",
    progress: 45,
    currentStep: "Analyzing speech patterns...",
    steps: [
      { name: "Transcribing audio", status: "done", progress: 100 },
      { name: "Analyzing speech patterns", status: "active", progress: 45 },
      { name: "Detecting viral moments", status: "pending", progress: 0 },
      { name: "Generating clips", status: "pending", progress: 0 },
    ],
    startedAt: "2024-03-20T16:10:00Z",
    estimatedTimeLeft: "3 min 20s",
    modelUsed: "Whisper Tiny",
    cpuUsage: 78,
    memoryUsage: 45,
  },
];

// Quick stats for dashboard
export const MOCK_STATS = {
  totalProjects: 6,
  totalClipsGenerated: 18,
  totalExportTimeSaved: "4h 32m",
  storageUsed: "7.2 GB",
  storageTotal: "50 GB",
};
