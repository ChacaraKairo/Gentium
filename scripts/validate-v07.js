const fs = require('fs');
const path = require('path');

const root = process.cwd();
const porBLivrePath = path.join(root, 'src/infrastructure/database/seeds/PorBLivre.json');
const comparisonPath = path.join(root, 'src/infrastructure/database/seeds/comparisonVersions.json');
const originalPath = path.join(root, 'src/infrastructure/database/seeds/originalLanguages.json');
const strongPath = path.join(root, 'src/infrastructure/database/seeds/strongLexicon.json');
const studiesPath = path.join(root, 'src/infrastructure/database/seeds/studiesLibrary.json');
const readingPlansPath = path.join(root, 'src/infrastructure/database/seeds/readingPlans.json');
const manifestPath = path.join(root, 'database/bible/manifest.json');
const ptPath = path.join(root, 'src/config/i18n/locales/pt-BR/common.json');
const enPath = path.join(root, 'src/config/i18n/locales/en-US/common.json');

const porBLivre = readJson(porBLivrePath);
const comparison = readJson(comparisonPath);
const original = readJson(originalPath);
const strong = readJson(strongPath);
const studies = readJson(studiesPath);
const readingPlans = readJson(readingPlansPath);
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

const courses = studies.areas?.flatMap((area) =>
  area.categories.flatMap((category) => category.courses),
) || [];
const lessons = courses.flatMap((course) =>
  course.modules.flatMap((module) => module.lessons),
);

if ((studies.areas?.length ?? 0) < 2) {
  throw new Error('Expected studies seed to include at least 2 areas.');
}

if (courses.length < 2) {
  throw new Error('Expected studies seed to include at least 2 courses.');
}

if (lessons.length < 6) {
  throw new Error('Expected studies seed to include at least 6 lessons.');
}

if (!lessons.every((lesson) => lesson.references?.length)) {
  throw new Error('Expected every study lesson to include Bible references.');
}

const plans = readingPlans.plans || [];
const planDays = plans.flatMap((plan) => plan.days || []);
const planReadings = planDays.flatMap((day) => day.readings || []);

if (plans.length < 2) {
  throw new Error('Expected reading plans seed to include at least 2 plans.');
}

if (planDays.length < 12) {
  throw new Error('Expected reading plans seed to include at least 12 days.');
}

if (!planDays.every((day) => day.readings?.length && day.questions?.length)) {
  throw new Error('Expected every reading plan day to include readings and questions.');
}

if (!planReadings.some((reference) => reference.includes('João'))) {
  throw new Error('Expected reading plan readings to include João references.');
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
  'studies.libraryTitle',
  'studies.startCourse',
  'studies.completeLesson',
  'tabs.readingPlans',
  'readingPlans.libraryTitle',
  'readingPlans.startPlan',
  'readingPlans.completeDay',
  'readingPlans.statsTitle',
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
