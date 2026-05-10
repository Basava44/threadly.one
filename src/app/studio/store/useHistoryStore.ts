import { create } from "zustand";
import { MAX_HISTORY_STATES } from "../constants/defaults";

interface HistoryState {
  past: string[];
  future: string[];
  canUndo: boolean;
  canRedo: boolean;
  pushState: (json: string) => void;
  undo: () => string | null;
  redo: () => string | null;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  pushState: (json) => set((state) => {
    const newPast = [...state.past, json].slice(-MAX_HISTORY_STATES);
    return { past: newPast, future: [], canUndo: newPast.length > 0, canRedo: false };
  }),

  undo: () => {
    const { past } = get();
    if (past.length === 0) return null;
    const newPast = [...past];
    const previous = newPast.pop()!;
    set((state) => ({
      past: newPast,
      future: [previous, ...state.future],
      canUndo: newPast.length > 0,
      canRedo: true,
    }));
    return previous;
  },

  redo: () => {
    const { future } = get();
    if (future.length === 0) return null;
    const newFuture = [...future];
    const next = newFuture.shift()!;
    set((state) => ({
      past: [...state.past, next],
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    }));
    return next;
  },

  clear: () => set({ past: [], future: [], canUndo: false, canRedo: false }),
}));
