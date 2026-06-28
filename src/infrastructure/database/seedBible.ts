import { SQLiteDatabase } from 'expo-sqlite';

import porBLivreSeed from './seeds/PorBLivre.json';
import { BibleSeed } from './seeds/types';

type SeedBookMetadata = {
  abbreviation: string;
  id: string;
  name: string;
  testament: 'old' | 'new';
};

const porBLivre = porBLivreSeed as BibleSeed;
const biblePackageMetadataKey = 'bible_seed_package';
const porBLivrePackageVersion = 'PorBLivre-scrollmapper-master-a228a19a-2026-06-28';

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
  { abbreviation: '1Ts', id: '1th', name: '1 Tessalonicenses', testament: 'new' },
  { abbreviation: '2Ts', id: '2th', name: '2 Tessalonicenses', testament: 'new' },
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
  const metadata = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_metadata WHERE key = ? LIMIT 1;',
    [biblePackageMetadataKey],
  );

  if (metadata?.value === porBLivrePackageVersion) {
    return;
  }

  await database.withTransactionAsync(async () => {
    await database.execAsync(`
      DELETE FROM favorites;
      DELETE FROM reading_history;
      DELETE FROM bible_verses;
      DELETE FROM bible_chapters;
      DELETE FROM bible_books;
      DELETE FROM bible_versions;
    `);

    await database.runAsync(
      `
        INSERT INTO bible_versions
          (id, name, abbreviation, language, description, copyright, is_offline_available)
        VALUES (?, ?, ?, ?, ?, ?, 1);
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

      await database.runAsync(
        'INSERT INTO bible_books (id, name, abbreviation, testament, position) VALUES (?, ?, ?, ?, ?);',
        [metadata.id, metadata.name, metadata.abbreviation, metadata.testament, index + 1],
      );

      for (const chapter of sourceBook.chapters) {
        const chapterId = `${metadata.id}-${chapter.chapter}`;
        await database.runAsync(
          'INSERT INTO bible_chapters (id, book_id, chapter_number) VALUES (?, ?, ?);',
          [chapterId, metadata.id, chapter.chapter],
        );

        for (const verse of chapter.verses) {
          await database.runAsync(
            `
              INSERT INTO bible_verses
                (id, version_id, book_id, chapter_id, verse_number, text)
              VALUES (?, ?, ?, ?, ?, ?);
            `,
            [
              `por-blivre-${metadata.id}-${chapter.chapter}-${verse.verse}`,
              'por-blivre',
              metadata.id,
              chapterId,
              verse.verse,
              verse.text,
            ],
          );
        }
      }
    }

    await database.runAsync(
      `
        INSERT INTO app_metadata (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = CURRENT_TIMESTAMP;
      `,
      [biblePackageMetadataKey, porBLivrePackageVersion],
    );
  });
}
