const fs = require('fs');
const path = require('path');

const root = process.cwd();
const porBLivrePath = path.join(root, 'src/infrastructure/database/seeds/PorBLivre.json');
const comparisonPath = path.join(root, 'src/infrastructure/database/seeds/comparisonVersions.json');
const originalPath = path.join(root, 'src/infrastructure/database/seeds/originalLanguages.json');
const strongPath = path.join(root, 'src/infrastructure/database/seeds/strongLexicon.json');
const manifestPath = path.join(root, 'database/bible/manifest.json');
const ptPath = path.join(root, 'src/config/i18n/locales/pt-BR/common.json');
const enPath = path.join(root, 'src/config/i18n/locales/en-US/common.json');

const porBLivre = readJson(porBLivrePath);
const comparison = readJson(comparisonPath);
const original = readJson(originalPath);
const strong = readJson(strongPath);
const manifest = readJson(manifestPath);
const pt = readJson(ptPath);
const en = readJson(enPath);

const books = porBLivre.books || [];
const porBLivreVerses = books.flatMap((book) =>
  book.chapters.flatMap((chapter) => chapter.verses),
);

if (books.length !== 66) {
  throw new Error(`Expected 66 books in PorBLivre seed, received ${books.length}.`);
}

if (porBLivreVerses.length !== 31104) {
  throw new Error(`Expected 31104 verses in PorBLivre seed, received ${porBLivreVerses.length}.`);
}

if (comparison.versions?.[0]?.id !== 'web') {
  throw new Error('Expected WEB comparison version seed.');
}

if (comparison.verses?.length !== 31103) {
  throw new Error(`Expected 31103 WEB verses, received ${comparison.verses?.length}.`);
}

if (original.verses?.length !== 31171) {
  throw new Error(`Expected 31171 original language verses, received ${original.verses?.length}.`);
}

for (const language of ['arc', 'grc', 'he']) {
  if (!original.verses.some((verse) => verse.language === language)) {
    throw new Error(`Expected original language seed to include ${language}.`);
  }
}

if (strong.entries?.length !== 14696) {
  throw new Error(`Expected 14696 Strong entries, received ${strong.entries?.length}.`);
}

for (const strongNumber of ['H1', 'H7225', 'G1', 'G25']) {
  if (!strong.entries.some((entry) => entry.number === strongNumber)) {
    throw new Error(`Expected Strong lexicon seed to include ${strongNumber}.`);
  }
}

if (!manifest.packages?.length || !manifest.resources?.length) {
  throw new Error('Expected database/bible manifest packages and resources.');
}

for (const key of [
  'notes.subtitleV03',
  'notes.export',
  'bible.note',
  'bible.originalLanguages.title',
  'bible.readingModes.comparison',
  'bible.academicTools.title',
  'bible.academicTools.wordPanelTitle',
  'settings.bibleLicense',
]) {
  assertTranslationKey(pt, key, 'pt-BR');
  assertTranslationKey(en, key, 'en-US');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assertTranslationKey(messages, key, locale) {
  const value = key.split('.').reduce((current, part) => current?.[part], messages);

  if (!value) {
    throw new Error(`Missing ${locale} translation key: ${key}`);
  }
}
