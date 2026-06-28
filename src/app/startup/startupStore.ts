import { create } from 'zustand';

type StartupState = {
  error: string | null;
  isReady: boolean;
  initialize: (startupTask: () => Promise<void>) => Promise<void>;
};

export const useStartupStore = create<StartupState>((set, get) => ({
  error: null,
  isReady: false,
  initialize: async (startupTask) => {
    if (get().isReady) {
      return;
    }

    try {
      await startupTask();
      set({ error: null, isReady: true });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Startup failed',
        isReady: true,
      });
    }
  },
}));
