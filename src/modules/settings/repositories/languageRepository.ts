import i18n, { fallbackLanguage, SupportedLanguage, supportedLanguages } from '@/config/i18n';
import { getDatabase } from '@/infrastructure/database/database';

const languagePreferenceKey = 'ui_language';

export async function getSavedLanguage(): Promise<SupportedLanguage> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_metadata WHERE key = ? LIMIT 1;',
    [languagePreferenceKey],
  );

  return normalizeLanguage(row?.value);
}

export async function applySavedLanguage() {
  const language = await getSavedLanguage();
  await i18n.changeLanguage(language);

  return language;
}

export async function saveLanguage(language: SupportedLanguage) {
  const database = await getDatabase();
  const normalizedLanguage = normalizeLanguage(language);

  await database.runAsync(
    `
      INSERT INTO app_metadata (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP;
    `,
    [languagePreferenceKey, normalizedLanguage],
  );

  await i18n.changeLanguage(normalizedLanguage);

  return normalizedLanguage;
}

function normalizeLanguage(language?: string): SupportedLanguage {
  if (supportedLanguages.includes(language as SupportedLanguage)) {
    return language as SupportedLanguage;
  }

  return fallbackLanguage;
}
