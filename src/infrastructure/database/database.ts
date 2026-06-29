import * as SQLite from 'expo-sqlite';

import { runMigrations } from './migrations';
import { seedBiblePackage } from './seedBible';
import { seedStudiesLibrary } from './seedStudies';

const databaseName = 'gentium.db';

let databaseInstance: SQLite.SQLiteDatabase | null = null;

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
  await seedBiblePackage(database);
  await seedStudiesLibrary(database);
}
