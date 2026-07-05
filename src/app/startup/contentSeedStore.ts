import { create } from 'zustand';

import type { AppContentSeedProgress } from '@/infrastructure/database/database';

type ContentSeedStatus = 'idle' | 'running' | 'done' | 'error';

type ContentSeedState = AppContentSeedProgress & {
  error: string | null;
  start: () => void;
  finish: () => void;
  fail: (error: unknown) => void;
  setProgress: (progress: AppContentSeedProgress) => void;
  status: ContentSeedStatus;
};

export const useContentSeedStore = create<ContentSeedState>((set) => ({
  completed: 0,
  error: null,
  phase: 'preparing',
  start: () =>
    set({
      completed: 0,
      error: null,
      phase: 'preparing',
      status: 'running',
      total: 1,
    }),
  finish: () =>
    set((state) => ({
      completed: state.total,
      error: null,
      phase: 'done',
      status: 'done',
    })),
  fail: (error) =>
    set({
      error: error instanceof Error ? error.message : 'Content preparation failed',
      status: 'error',
    }),
  setProgress: (progress) =>
    set({
      ...progress,
      error: null,
      status: progress.phase === 'done' ? 'done' : 'running',
    }),
  status: 'idle',
  total: 1,
}));
