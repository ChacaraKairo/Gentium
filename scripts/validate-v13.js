const fs = require('fs');
const path = require('path');

const root = process.cwd();
const packageJson = readJson(path.join(root, 'package.json'));
const appJson = readJson(path.join(root, 'app.json'));
const studies = readJson(path.join(root, 'src/infrastructure/database/seeds/studiesLibrary.json'));
const pt = readJson(path.join(root, 'src/config/i18n/locales/pt-BR/common.json'));
const en = readJson(path.join(root, 'src/config/i18n/locales/en-US/common.json'));
const releasePath = path.join(root, 'docs/releases/v1.3.0.md');
const changelogPath = path.join(root, 'CHANGELOG.md');

if (packageJson.version !== '1.3.0') {
  throw new Error(`Expected package.json version 1.3.0, received ${packageJson.version}.`);
}

if (appJson.expo?.version !== '1.3.0') {
  throw new Error(`Expected app.json version 1.3.0, received ${appJson.expo?.version}.`);
}

if (appJson.expo?.android?.versionCode !== 4) {
  throw new Error(`Expected Android versionCode 4, received ${appJson.expo?.android?.versionCode}.`);
}

if (appJson.expo?.ios?.buildNumber !== '4') {
  throw new Error(`Expected iOS buildNumber 4, received ${appJson.expo?.ios?.buildNumber}.`);
}

if (!fs.existsSync(releasePath)) {
  throw new Error('Expected docs/releases/v1.3.0.md.');
}

if (!fs.existsSync(changelogPath)) {
  throw new Error('Expected CHANGELOG.md.');
}

const areas = studies.areas || [];
const categories = areas.flatMap((area) => area.categories || []);
const courses = categories.flatMap((category) => category.courses || []);
const lessons = courses.flatMap((course) =>
  (course.modules || []).flatMap((module) => module.lessons || []),
);
const references = lessons.flatMap((lesson) => lesson.references || []);

if (areas.length < 3) {
  throw new Error(`Expected at least 3 study areas, received ${areas.length}.`);
}

if (courses.length < 4) {
  throw new Error(`Expected at least 4 study courses, received ${courses.length}.`);
}

if (lessons.length < 13) {
  throw new Error(`Expected at least 13 study lessons, received ${lessons.length}.`);
}

if (!lessons.every((lesson) => lesson.references?.length)) {
  throw new Error('Expected every study lesson to include Bible references.');
}

for (const reference of ['Atos 2:42-47', 'Gênesis 12:1-3', 'Êxodo 20:1-3']) {
  if (!references.includes(reference)) {
    throw new Error(`Expected study references to include ${reference}.`);
  }
}

for (const key of [
  'studies.libraryTitle',
  'studies.statsTitle',
  'studies.statsSummary',
  'studies.nextLesson',
  'studies.continueCourse',
  'studies.completeLesson',
  'settings.betaDiagnostics.title',
  'settings.aboutDescription',
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
