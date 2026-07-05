import { SQLiteDatabase } from 'expo-sqlite';

import comparisonVersionsSeed from './seeds/comparisonVersions.json';
import originalLanguagesSeed from './seeds/originalLanguages.json';
import porBLivreSeed from './seeds/PorBLivre.json';
import strongLexiconSeed from './seeds/strongLexicon.json';
import {
  BibleSeed,
  BibleVersionPackageSeed,
  OriginalLanguagePackageSeed,
  StrongLexiconPackageSeed,
} from './seeds/types';

type SeedBookMetadata = {
  abbreviation: string;
  id: string;
  name: string;
  testament: 'old' | 'new';
};

const porBLivre = porBLivreSeed as BibleSeed;
const comparisonVersions = comparisonVersionsSeed as BibleVersionPackageSeed;
const originalLanguages = originalLanguagesSeed as OriginalLanguagePackageSeed;
const strongLexicon = strongLexiconSeed as StrongLexiconPackageSeed;
const biblePackageMetadataKey = 'bible_seed_package';
const comparisonPackageMetadataKey = 'bible_comparison_seed_package';
const originalLanguagePackageMetadataKey = 'bible_original_language_seed_package';
const strongLexiconPackageMetadataKey = 'bible_strong_lexicon_seed_package';
const porBLivrePackageVersion = 'PorBLivre-scrollmapper-master-a228a19a-2026-06-28';
const comparisonPackageVersion = 'BibleSuperSearch-WEB-6.0-2026-06-28';
const originalLanguagePackageVersion = 'BibleSuperSearch-WLC-TR-6.0-2026-06-28';
const strongLexiconPackageVersion = 'BibleSuperSearch-Strong-6.0-2026-06-29';

const books: SeedBookMetadata[] = [
  { abbreviation: 'Gn', id: 'gen', name: 'Gênesis', testament: 'old' },
  { abbreviation: 'Êx', id: 'exo', name: 'Êxodo', testament: 'old' },
  { abbreviation: 'Lv', id: 'lev', name: 'Levítico', testament: 'old' },
  { abbreviation: 'Nm', id: 'num', name: 'Números', testament: 'old' },
  { abbreviation: 'Dt', id: 'deu', name: 'Deuteronômio', testament: 'old' },
  { abbreviation: 'Js', id: 'jos', name: 'Josué', testament: 'old' },
  { abbreviation: 'Jz', id: 'jdg', name: 'Juízes', testament: 'old' },
  { abbreviation: 'Rt', id: 'rut', name: 'Rute', testament: 'old' },
  { abbreviation: '1Sm', id: '1sa', name: '1 Samuel', testament: 'old' },
  { abbreviation: '2Sm', id: '2sa', name: '2 Samuel', testament: 'old' },
  { abbreviation: '1Rs', id: '1ki', name: '1 Reis', testament: 'old' },
  { abbreviation: '2Rs', id: '2ki', name: '2 Reis', testament: 'old' },
  { abbreviation: '1Cr', id: '1ch', name: '1 Crônicas', testament: 'old' },
  { abbreviation: '2Cr', id: '2ch', name: '2 Crônicas', testament: 'old' },
  { abbreviation: 'Ed', id: 'ezr', name: 'Esdras', testament: 'old' },
  { abbreviation: 'Ne', id: 'neh', name: 'Neemias', testament: 'old' },
  { abbreviation: 'Et', id: 'est', name: 'Ester', testament: 'old' },
  { abbreviation: 'Jó', id: 'job', name: 'Jó', testament: 'old' },
  { abbreviation: 'Sl', id: 'psa', name: 'Salmos', testament: 'old' },
  { abbreviation: 'Pv', id: 'pro', name: 'Provérbios', testament: 'old' },
  { abbreviation: 'Ec', id: 'ecc', name: 'Eclesiastes', testament: 'old' },
  { abbreviation: 'Ct', id: 'sng', name: 'Cânticos', testament: 'old' },
  { abbreviation: 'Is', id: 'isa', name: 'Isaías', testament: 'old' },
  { abbreviation: 'Jr', id: 'jer', name: 'Jeremias', testament: 'old' },
  { abbreviation: 'Lm', id: 'lam', name: 'Lamentações', testament: 'old' },
  { abbreviation: 'Ez', id: 'ezk', name: 'Ezequiel', testament: 'old' },
  { abbreviation: 'Dn', id: 'dan', name: 'Daniel', testament: 'old' },
  { abbreviation: 'Os', id: 'hos', name: 'Oseias', testament: 'old' },
  { abbreviation: 'Jl', id: 'jol', name: 'Joel', testament: 'old' },
  { abbreviation: 'Am', id: 'amo', name: 'Amós', testament: 'old' },
  { abbreviation: 'Ob', id: 'oba', name: 'Obadias', testament: 'old' },
  { abbreviation: 'Jn', id: 'jon', name: 'Jonas', testament: 'old' },
  { abbreviation: 'Mq', id: 'mic', name: 'Miqueias', testament: 'old' },
  { abbreviation: 'Na', id: 'nam', name: 'Naum', testament: 'old' },
  { abbreviation: 'Hc', id: 'hab', name: 'Habacuque', testament: 'old' },
  { abbreviation: 'Sf', id: 'zep', name: 'Sofonias', testament: 'old' },
  { abbreviation: 'Ag', id: 'hag', name: 'Ageu', testament: 'old' },
  { abbreviation: 'Zc', id: 'zec', name: 'Zacarias', testament: 'old' },
  { abbreviation: 'Ml', id: 'mal', name: 'Malaquias', testament: 'old' },
  { abbreviation: 'Mt', id: 'mat', name: 'Mateus', testament: 'new' },
  { abbreviation: 'Mc', id: 'mrk', name: 'Marcos', testament: 'new' },
  { abbreviation: 'Lc', id: 'luk', name: 'Lucas', testament: 'new' },
  { abbreviation: 'Jo', id: 'jhn', name: 'João', testament: 'new' },
  { abbreviation: 'At', id: 'act', name: 'Atos', testament: 'new' },
  { abbreviation: 'Rm', id: 'rom', name: 'Romanos', testament: 'new' },
  { abbreviation: '1Co', id: '1co', name: '1 Coríntios', testament: 'new' },
  { abbreviation: '2Co', id: '2co', name: '2 Coríntios', testament: 'new' },
  { abbreviation: 'Gl', id: 'gal', name: 'Gálatas', testament: 'new' },
  { abbreviation: 'Ef', id: 'eph', name: 'Efésios', testament: 'new' },
  { abbreviation: 'Fp', id: 'php', name: 'Filipenses', testament: 'new' },
  { abbreviation: 'Cl', id: 'col', name: 'Colossenses', testament: 'new' },
  {
    abbreviation: '1Ts',
    id: '1th',
    name: '1 Tessalonicenses',
    testament: 'new',
  },
  {
    abbreviation: '2Ts',
    id: '2th',
    name: '2 Tessalonicenses',
    testament: 'new',
  },
  { abbreviation: '1Tm', id: '1ti', name: '1 Timóteo', testament: 'new' },
  { abbreviation: '2Tm', id: '2ti', name: '2 Timóteo', testament: 'new' },
  { abbreviation: 'Tt', id: 'tit', name: 'Tito', testament: 'new' },
  { abbreviation: 'Fm', id: 'phm', name: 'Filemom', testament: 'new' },
  { abbreviation: 'Hb', id: 'heb', name: 'Hebreus', testament: 'new' },
  { abbreviation: 'Tg', id: 'jas', name: 'Tiago', testament: 'new' },
  { abbreviation: '1Pe', id: '1pe', name: '1 Pedro', testament: 'new' },
  { abbreviation: '2Pe', id: '2pe', name: '2 Pedro', testament: 'new' },
  { abbreviation: '1Jo', id: '1jn', name: '1 João', testament: 'new' },
  { abbreviation: '2Jo', id: '2jn', name: '2 João', testament: 'new' },
  { abbreviation: '3Jo', id: '3jn', name: '3 João', testament: 'new' },
  { abbreviation: 'Jd', id: 'jud', name: 'Judas', testament: 'new' },
  { abbreviation: 'Ap', id: 'rev', name: 'Apocalipse', testament: 'new' },
];

export async function seedBiblePackage(database: SQLiteDatabase) {
  const bibleMetadata = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_metadata WHERE key = ? LIMIT 1;',
    [biblePackageMetadataKey],
  );
  const comparisonMetadata = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_metadata WHERE key = ? LIMIT 1;',
    [comparisonPackageMetadataKey],
  );
  const originalLanguageMetadata = await database.getFirstAsync<{
    value: string;
  }>('SELECT value FROM app_metadata WHERE key = ? LIMIT 1;', [originalLanguagePackageMetadataKey]);
  const strongLexiconMetadata = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_metadata WHERE key = ? LIMIT 1;',
    [strongLexiconPackageMetadataKey],
  );

  if (
    bibleMetadata?.value === porBLivrePackageVersion &&
    comparisonMetadata?.value === comparisonPackageVersion &&
    originalLanguageMetadata?.value === originalLanguagePackageVersion &&
    strongLexiconMetadata?.value === strongLexiconPackageVersion
  ) {
    return;
  }

  if (bibleMetadata?.value !== porBLivrePackageVersion) {
    await database.withTransactionAsync(async () => {
      const upsertBook = await database.prepareAsync(
        `
          INSERT INTO bible_books (id, name, abbreviation, testament, position)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            abbreviation = excluded.abbreviation,
            testament = excluded.testament,
            position = excluded.position,
            updated_at = CURRENT_TIMESTAMP;
        `,
      );
      const upsertChapter = await database.prepareAsync(
        `
          INSERT INTO bible_chapters (id, book_id, chapter_number)
          VALUES (?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            book_id = excluded.book_id,
            chapter_number = excluded.chapter_number,
            updated_at = CURRENT_TIMESTAMP;
        `,
      );
      const upsertVerse = await database.prepareAsync(
        `
          INSERT INTO bible_verses
            (id, version_id, book_id, chapter_id, verse_number, text)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            version_id = excluded.version_id,
            book_id = excluded.book_id,
            chapter_id = excluded.chapter_id,
            verse_number = excluded.verse_number,
            text = excluded.text,
            updated_at = CURRENT_TIMESTAMP;
        `,
      );

      try {
        await database.runAsync(
          `
            INSERT INTO bible_versions
              (id, name, abbreviation, language, description, copyright, is_offline_available)
            VALUES (?, ?, ?, ?, ?, ?, 1)
            ON CONFLICT(id) DO UPDATE SET
              name = excluded.name,
              abbreviation = excluded.abbreviation,
              language = excluded.language,
              description = excluded.description,
              copyright = excluded.copyright,
              is_offline_available = excluded.is_offline_available,
              updated_at = CURRENT_TIMESTAMP;
          `,
          [
            'por-blivre',
            'Bíblia Livre',
            'PorBLivre',
            'pt-BR',
            'Bíblia Livre importada do projeto scrollmapper/bible_databases.',
            'Creative Commons Attribution 3.0 Brazil. Fonte: scrollmapper/bible_databases.',
          ],
        );

        for (const [index, metadata] of books.entries()) {
          const sourceBook = porBLivre.books[index];

          if (!sourceBook) {
            continue;
          }

          await upsertBook.executeAsync([
            metadata.id,
            metadata.name,
            metadata.abbreviation,
            metadata.testament,
            index + 1,
          ]);

          for (const chapter of sourceBook.chapters) {
            const chapterId = `${metadata.id}-${chapter.chapter}`;
            await upsertChapter.executeAsync([chapterId, metadata.id, chapter.chapter]);

            for (const verse of chapter.verses) {
              await upsertVerse.executeAsync([
                `por-blivre-${metadata.id}-${chapter.chapter}-${verse.verse}`,
                'por-blivre',
                metadata.id,
                chapterId,
                verse.verse,
                verse.text,
              ]);
            }
          }
        }

        await setMetadata(database, biblePackageMetadataKey, porBLivrePackageVersion);
      } finally {
        await upsertBook.finalizeAsync();
        await upsertChapter.finalizeAsync();
        await upsertVerse.finalizeAsync();
      }
    });
  }

  if (comparisonMetadata?.value !== comparisonPackageVersion) {
    await database.withTransactionAsync(async () => {
      await seedComparisonVersions(database);
      await setMetadata(database, comparisonPackageMetadataKey, comparisonPackageVersion);
    });
  }

  if (originalLanguageMetadata?.value !== originalLanguagePackageVersion) {
    await database.withTransactionAsync(async () => {
      await seedOriginalLanguages(database);
      await setMetadata(database, originalLanguagePackageMetadataKey, originalLanguagePackageVersion);
    });
  }

  if (strongLexiconMetadata?.value !== strongLexiconPackageVersion) {
    await database.withTransactionAsync(async () => {
      await seedStrongLexicon(database);
      await setMetadata(database, strongLexiconPackageMetadataKey, strongLexiconPackageVersion);
    });
  }
}

async function seedComparisonVersions(database: SQLiteDatabase) {
  const upsertVerse = await database.prepareAsync(bibleVerseUpsertSql);

  try {
    for (const version of comparisonVersions.versions) {
      await database.runAsync(
        `
        INSERT INTO bible_versions
          (id, name, abbreviation, language, description, copyright, is_offline_available)
        VALUES (?, ?, ?, ?, ?, ?, 1)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          abbreviation = excluded.abbreviation,
          language = excluded.language,
          description = excluded.description,
          copyright = excluded.copyright,
          is_offline_available = excluded.is_offline_available,
          updated_at = CURRENT_TIMESTAMP;
      `,
        [
          version.id,
          version.name,
          version.abbreviation,
          version.language,
          version.description,
          'Fonte: Bible SuperSearch Bible Downloads.',
        ],
      );
    }

    for (const verse of comparisonVersions.verses) {
      await seedBibleVerse(upsertVerse, verse.versionId, verse.bookId, verse.chapter, verse.verse, verse.text);
    }
  } finally {
    await upsertVerse.finalizeAsync();
  }
}

async function seedOriginalLanguages(database: SQLiteDatabase) {
  const upsertVerse = await database.prepareAsync(
    `
      INSERT INTO original_language_verses
        (id, version_id, language, book_id, chapter_number, verse_number, text)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        version_id = excluded.version_id,
        language = excluded.language,
        book_id = excluded.book_id,
        chapter_number = excluded.chapter_number,
        verse_number = excluded.verse_number,
        text = excluded.text,
        updated_at = CURRENT_TIMESTAMP;
    `,
  );

  try {
    for (const version of originalLanguages.versions) {
      await database.runAsync(
        `
        INSERT INTO original_language_versions
          (id, name, abbreviation, language, description)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          abbreviation = excluded.abbreviation,
          language = excluded.language,
          description = excluded.description,
          updated_at = CURRENT_TIMESTAMP;
      `,
        [version.id, version.name, version.abbreviation, version.language, version.description],
      );
    }

    for (const verse of originalLanguages.verses) {
      await upsertVerse.executeAsync([
        `${verse.versionId}-${verse.bookId}-${verse.chapter}-${verse.verse}`,
        verse.versionId,
        verse.language,
        verse.bookId,
        verse.chapter,
        verse.verse,
        verse.text,
      ]);
    }
  } finally {
    await upsertVerse.finalizeAsync();
  }
}

async function seedStrongLexicon(database: SQLiteDatabase) {
  const upsertEntry = await database.prepareAsync(
    `
        INSERT INTO strong_lexicon
          (
            number,
            language,
            root_word,
            normalized_root_word,
            transliteration,
            pronunciation,
            morphology,
            definition
          )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(number) DO UPDATE SET
          language = excluded.language,
          root_word = excluded.root_word,
          normalized_root_word = excluded.normalized_root_word,
          transliteration = excluded.transliteration,
          pronunciation = excluded.pronunciation,
          morphology = excluded.morphology,
          definition = excluded.definition,
          updated_at = CURRENT_TIMESTAMP;
      `,
  );

  try {
    for (const entry of strongLexicon.entries) {
      await upsertEntry.executeAsync([
        entry.number,
        entry.language,
        entry.rootWord,
        normalizeOriginalWord(entry.rootWord, entry.language),
        entry.transliteration,
        entry.pronunciation || null,
        entry.morphology || null,
        entry.definition,
      ]);
    }
  } finally {
    await upsertEntry.finalizeAsync();
  }
}

async function seedBibleVerse(
  statement: Awaited<ReturnType<SQLiteDatabase['prepareAsync']>>,
  versionId: string,
  bookId: string,
  chapterNumber: number,
  verseNumber: number,
  text: string,
) {
  const chapterId = `${bookId}-${chapterNumber}`;

  await statement.executeAsync([
    `${versionId}-${bookId}-${chapterNumber}-${verseNumber}`,
    versionId,
    bookId,
    chapterId,
    verseNumber,
    text,
  ]);
}

const bibleVerseUpsertSql = `
  INSERT INTO bible_verses
    (id, version_id, book_id, chapter_id, verse_number, text)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    version_id = excluded.version_id,
    book_id = excluded.book_id,
    chapter_id = excluded.chapter_id,
    verse_number = excluded.verse_number,
    text = excluded.text,
    updated_at = CURRENT_TIMESTAMP;
`;

async function setMetadata(database: SQLiteDatabase, key: string, value: string) {
  await database.runAsync(
    `
      INSERT INTO app_metadata (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP;
    `,
    [key, value],
  );
}

function normalizeOriginalWord(value: string, language: 'grc' | 'he') {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u0591-\u05BD\u05BF\u05C1-\u05C7]/g, '')
    .replace(/[׃׀־.,;:!?()[\]{}"']/g, '')
    .trim()
    .toLocaleLowerCase();

  if (language === 'grc') {
    return normalized.replace(/[᾽ʼ’]/g, '');
  }

  return normalized;
}
