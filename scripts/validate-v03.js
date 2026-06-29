const fs = require('fs');
const path = require('path');

const root = process.cwd();
const seedPath = path.join(root, 'src/infrastructure/database/seeds/PorBLivre.json');
const ptPath = path.join(root, 'src/config/i18n/locales/pt-BR/common.json');
const enPath = path.join(root, 'src/config/i18n/locales/en-US/common.json');

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
const pt = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const books = seed.books || [];
const verses = books.flatMap((book) => book.chapters.flatMap((chapter) => chapter.verses));

if (books.length !== 66) {
  throw new Error(`Expected 66 books in PorBLivre seed, received ${books.length}.`);
}

if (verses.length !== 31104) {
  throw new Error(`Expected 31104 verses in PorBLivre seed, received ${verses.length}.`);
}

for (const key of ['notes.subtitleV03', 'notes.export', 'bible.note', 'settings.bibleLicense']) {
  assertTranslationKey(pt, key, 'pt-BR');
  assertTranslationKey(en, key, 'en-US');
}

function assertTranslationKey(messages, key, locale) {
  const value = key.split('.').reduce((current, part) => current?.[part], messages);

  if (!value) {
    throw new Error(`Missing ${locale} translation key: ${key}`);
  }
}
