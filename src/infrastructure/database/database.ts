import * as SQLite from 'expo-sqlite';

import { runMigrations } from './migrations';
import { seedAdvancedLibrary } from './seedAdvancedLibrary';
import { seedReadingPlans } from './seedReadingPlans';
import { seedStudiesLibrary } from './seedStudies';

const databaseName = 'gentium.db';

let databaseInstance: SQLite.SQLiteDatabase | null = null;
let contentSeedPromise: Promise<void> | null = null;

export type AppContentSeedPhase = 'preparing' | 'bible' | 'comparison' | 'original' | 'lexicon' | 'done';

export type AppContentSeedProgress = {
  completed: number;
  phase: AppContentSeedPhase;
  total: number;
};

type AppContentSeedOptions = {
  onProgress?: (progress: AppContentSeedProgress) => void;
};

export async function getDatabase() {
  if (!databaseInstance) {
    databaseInstance = await SQLite.openDatabaseAsync(databaseName);
  }

  return databaseInstance;
}

export async function initializeAppDatabase() {
  const database = await getDatabase();

  await database.execAsync('PRAGMA foreign_keys = ON;');
  await runMigrations(database);
  await seedStudiesLibrary(database);
  await seedReadingPlans(database);
  await seedAdvancedLibrary(database);
}

export function seedAppContentInBackground(options: AppContentSeedOptions = {}) {
  if (!contentSeedPromise) {
    contentSeedPromise = seedAppContent(options)
      .then(() => {
        options.onProgress?.({ completed: 1, phase: 'done', total: 1 });
      })
      .catch((error) => {
        contentSeedPromise = null;
        console.warn('Failed to seed app content', error);
        throw error;
      });
  }

  return contentSeedPromise;
}

async function seedAppContent(options: AppContentSeedOptions) {
  const database = await getDatabase();
  options.onProgress?.({ completed: 0, phase: 'preparing', total: 1 });

  const { seedBiblePackage } = await import('./seedBible');

  await seedBiblePackage(database, options.onProgress);
}
