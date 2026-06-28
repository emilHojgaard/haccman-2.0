import { create } from "zustand";

export const useGameStore = create((set) => ({
  selectedBotId: null,
  currentTaskId: null,
  sessionId: null,
  messages: [],
  completedTaskIds: [],

  selectBot: (botId, taskId) =>
    set({ selectedBotId: botId, currentTaskId: taskId, messages: [], sessionId: null }),

  setSession: (sessionId) => set({ sessionId }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  markTaskCompleted: (taskId) =>
    set((state) => ({
      completedTaskIds: state.completedTaskIds.includes(taskId)
        ? state.completedTaskIds
        : [...state.completedTaskIds, taskId],
    })),

  reset: () =>
    set({ selectedBotId: null, currentTaskId: null, sessionId: null, messages: [] }),
}));
