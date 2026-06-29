import { create } from "zustand";

export const useGameStore = create((set) => ({
  selectedBotId: null,
  currentTaskId: null,
  sessionId: null,
  messages: [],
  completedTaskIds: [],
  sessionWon: false,

  selectBot: (botId, taskId) =>
    set({ selectedBotId: botId, currentTaskId: taskId, messages: [], sessionId: null, sessionWon: false }),

  setSession: (sessionId) => set({ sessionId }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  markTaskCompleted: (taskId) =>
    set((state) => ({
      completedTaskIds: state.completedTaskIds.includes(taskId)
        ? state.completedTaskIds
        : [...state.completedTaskIds, taskId],
      sessionWon: true,
    })),

  reset: () =>
    set({ selectedBotId: null, currentTaskId: null, sessionId: null, messages: [], sessionWon: false }),
}));
