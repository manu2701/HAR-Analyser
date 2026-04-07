import { create } from 'zustand';

const useHarStore = create((set, get) => ({
  // ── Core Data ──
  harData: null,
  entries: [],
  summary: {
    total: 0,
    errors: 0,
    redirects: 0,
    avgTime: 0,
    totalSize: 0,
  },
  issues: [],
  domains: [],
  metrics: {
    totalRequests: 0,
    errorRate: 0,
    avgLatency: 0,
    slowestRequests: [],
    statusDistribution: {},
  },
  identityFlow: [],
  aiMessages: [],

  // ── UI State ──
  selectedRequest: null,
  activeTab: 'upload',
  isLoaded: false,

  // ── Actions ──
  setHarData: (data) => set({ harData: data }),

  setEntries: (entries) => set({ entries }),

  setSummary: (summary) => set({ summary }),

  setIssues: (issues) => set({ issues }),

  setDomains: (domains) => set({ domains }),

  setMetrics: (metrics) => set({ metrics }),

  setIdentityFlow: (identityFlow) => set({ identityFlow }),

  setSelectedRequest: (request) => set({ selectedRequest: request }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  addAiMessage: (message) =>
    set((state) => ({
      aiMessages: [...state.aiMessages, message],
    })),

  loadMockData: (mockData) => {
    set({
      harData: mockData.raw,
      entries: mockData.entries,
      summary: mockData.summary,
      issues: mockData.issues,
      domains: mockData.domains,
      metrics: mockData.metrics,
      identityFlow: mockData.identityFlow,
      isLoaded: true,
      activeTab: 'requests',
    });
  },

  reset: () =>
    set({
      harData: null,
      entries: [],
      summary: { total: 0, errors: 0, redirects: 0, avgTime: 0, totalSize: 0 },
      issues: [],
      domains: [],
      metrics: {
        totalRequests: 0,
        errorRate: 0,
        avgLatency: 0,
        slowestRequests: [],
        statusDistribution: {},
      },
      identityFlow: [],
      aiMessages: [],
      selectedRequest: null,
      activeTab: 'upload',
      isLoaded: false,
    }),
}));

export default useHarStore;
