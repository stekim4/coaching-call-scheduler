import { create } from 'zustand';

// Initialize a global state store using Zustand
const useStore = create(set => ({
  user: null, // Holds information about the current user
  setUser: (user) => set({ user }),

  slotsUpdated: false, // Flag to track if slots have been updated
  setSlotsUpdated: (updated) => set({ slotsUpdated: updated }),

  callsUpdated: false, // Flag to track if calls have been updated
  setCallsUpdated: (updated) => set({ callsUpdated: updated }),
}));

export default useStore;