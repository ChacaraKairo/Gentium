const fs = require('fs');
const path = require('path');

const root = process.cwd();
const packageJson = readJson(path.join(root, 'package.json'));
const appJson = readJson(path.join(root, 'app.json'));
const original = readJson(path.join(root, 'src/infrastructure/database/seeds/originalLanguages.json'));
const strong = readJson(path.join(root, 'src/infrastructure/database/seeds/strongLexicon.json'));
const pt = readJson(path.join(root, 'src/config/i18n/locales/pt-BR/common.json'));
const en = readJson(path.join(root, 'src/config/i18n/locales/en-US/common.json'));
const releasePath = path.join(root, 'docs/releases/v1.2.0.md');
const changelogPath = path.join(root, 'CHANGELOG.md');

if (packageJson.version !== '1.2.0') {
  throw new Error(`Expected package.json version 1.2.0, received ${packageJson.version}.`);
}

if (appJson.expo?.version !== '1.2.0') {
  throw new Error(`Expected app.json version 1.2.0, received ${appJson.expo?.version}.`);
}

if (appJson.expo?.android?.versionCode !== 3) {
  throw new Error(`Expected Android versionCode 3, received ${appJson.expo?.android?.versionCode}.`);
}

if (appJson.expo?.ios?.buildNumber !== '3') {
  throw new Error(`Expected iOS buildNumber 3, received ${appJson.expo?.ios?.buildNumber}.`);
}

if (!fs.existsSync(releasePath)) {
  throw new Error('Expected docs/releases/v1.2.0.md.');
}

if (!fs.existsSync(changelogPath)) {
  throw new Error('Expected CHANGELOG.md.');
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

for (const key of [
  'bible.academicTools.title',
  'bible.academicTools.searchAction',
  'bible.academicTools.searching',
  'bible.academicTools.strongTitle',
  'bible.academicTools.occurrencesTitle',
  'bible.academicTools.occurrenceLabel',
  'bible.academicTools.noResults',
  'bible.academicTools.wordPanelTitle',
  'bible.originalLanguages.title',
  'bible.readingModes.original',
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
