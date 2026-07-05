import * as SQLite from 'expo-sqlite';

import { runMigrations } from './migrations';
import { seedAdvancedLibrary } from './seedAdvancedLibrary';
import { seedReadingPlans } from './seedReadingPlans';
import { seedStudiesLibrary } from './seedStudies';

const databaseName = 'gentium.db';

let databaseInstance: SQLite.SQLiteDatabase | null = null;
let contentSeedPromise: Promise<void> | null = null;

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

export function seedAppContentInBackground() {
  if (!contentSeedPromise) {
    contentSeedPromise = seedAppContent().catch((error) => {
      contentSeedPromise = null;
      console.warn('Failed to seed app content', error);
    });
  }

  return contentSeedPromise;
}

async function seedAppContent() {
  const database = await getDatabase();
  const { seedBiblePackage } = await import('./seedBible');

  await seedBiblePackage(database);
}
