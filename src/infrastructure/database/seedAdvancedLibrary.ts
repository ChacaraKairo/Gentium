import { SQLiteDatabase } from 'expo-sqlite';

import advancedLibrarySeed from './seeds/advancedLibrary.json';
import { AdvancedLibrarySeed } from './seeds/types';

const advancedLibrary = advancedLibrarySeed as AdvancedLibrarySeed;
const advancedLibraryPackageMetadataKey = 'advanced_library_seed_package';
const advancedLibraryPackageVersion = 'Gentium-advanced-library-v0.8.0-2026-06-29';

export async function seedAdvancedLibrary(database: SQLiteDatabase) {
  const metadata = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_metadata WHERE key = ? LIMIT 1;',
    [advancedLibraryPackageMetadataKey],
  );

  if (metadata?.value === advancedLibraryPackageVersion) {
    return;
  }

  await database.withTransactionAsync(async () => {
    for (const commentary of advancedLibrary.commentaries) {
      await database.runAsync(
        `
          INSERT INTO bible_commentaries (id, reference, title, author, content, position)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            reference = excluded.reference,
            title = excluded.title,
            author = excluded.author,
            content = excluded.content,
            position = excluded.position,
            updated_at = CURRENT_TIMESTAMP;
        `,
        [
          commentary.id,
          commentary.reference,
          commentary.title,
          commentary.author,
          commentary.content,
          commentary.position,
        ],
      );
    }

    for (const entry of advancedLibrary.dictionaryEntries) {
      await database.runAsync(
        `
          INSERT INTO bible_dictionary_entries
            (id, term, category, definition, references_json, position)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            term = excluded.term,
            category = excluded.category,
            definition = excluded.definition,
            references_json = excluded.references_json,
            position = excluded.position,
            updated_at = CURRENT_TIMESTAMP;
        `,
        [
          entry.id,
          entry.term,
          entry.category,
          entry.definition,
          JSON.stringify(entry.references),
          entry.position,
        ],
      );
    }

    for (const reference of advancedLibrary.crossReferences) {
      await database.runAsync(
        `
          INSERT INTO bible_cross_references
            (id, source_reference, target_reference, title, note, position)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            source_reference = excluded.source_reference,
            target_reference = excluded.target_reference,
            title = excluded.title,
            note = excluded.note,
            position = excluded.position,
            updated_at = CURRENT_TIMESTAMP;
        `,
        [
          reference.id,
          reference.sourceReference,
          reference.targetReference,
          reference.title,
          reference.note,
          reference.position,
        ],
      );
    }

    for (const parallel of advancedLibrary.gospelParallels) {
      await database.runAsync(
        `
          INSERT INTO gospel_parallels (id, title, summary, references_json, position)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            summary = excluded.summary,
            references_json = excluded.references_json,
            position = excluded.position,
            updated_at = CURRENT_TIMESTAMP;
        `,
        [parallel.id, parallel.title, parallel.summary, JSON.stringify(parallel.references), parallel.position],
      );
    }

    for (const map of advancedLibrary.maps) {
      await database.runAsync(
        `
          INSERT INTO bible_maps
            (id, title, region, description, places_json, references_json, position)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            region = excluded.region,
            description = excluded.description,
            places_json = excluded.places_json,
            references_json = excluded.references_json,
            position = excluded.position,
            updated_at = CURRENT_TIMESTAMP;
        `,
        [
          map.id,
          map.title,
          map.region,
          map.description,
          JSON.stringify(map.places),
          JSON.stringify(map.references),
          map.position,
        ],
      );
    }

    for (const timeline of advancedLibrary.timelines) {
      await database.runAsync(
        `
          INSERT INTO bible_timelines
            (id, title, period, summary, events_json, references_json, position)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            period = excluded.period,
            summary = excluded.summary,
            events_json = excluded.events_json,
            references_json = excluded.references_json,
            position = excluded.position,
            updated_at = CURRENT_TIMESTAMP;
        `,
        [
          timeline.id,
          timeline.title,
          timeline.period,
          timeline.summary,
          JSON.stringify(timeline.events),
          JSON.stringify(timeline.references),
          timeline.position,
        ],
      );
    }

    for (const genealogy of advancedLibrary.genealogies) {
      await database.runAsync(
        `
          INSERT INTO bible_genealogies
            (id, title, summary, people_json, references_json, position)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            summary = excluded.summary,
            people_json = excluded.people_json,
            references_json = excluded.references_json,
            position = excluded.position,
            updated_at = CURRENT_TIMESTAMP;
        `,
        [
          genealogy.id,
          genealogy.title,
          genealogy.summary,
          JSON.stringify(genealogy.people),
          JSON.stringify(genealogy.references),
          genealogy.position,
        ],
      );
    }

    await database.runAsync(
      `
        INSERT INTO app_metadata (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = CURRENT_TIMESTAMP;
      `,
      [advancedLibraryPackageMetadataKey, advancedLibraryPackageVersion],
    );
  });
}
