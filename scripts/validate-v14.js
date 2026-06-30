const fs = require('fs');
const path = require('path');

const root = process.cwd();
const packageJson = readJson(path.join(root, 'package.json'));
const appJson = readJson(path.join(root, 'app.json'));
const pt = readJson(path.join(root, 'src/config/i18n/locales/pt-BR/common.json'));
const en = readJson(path.join(root, 'src/config/i18n/locales/en-US/common.json'));
const monetizationPath = path.join(root, 'src/config/monetization.ts');
const releasePath = path.join(root, 'docs/releases/v1.4.0.md');
const envExamplePath = path.join(root, '.env.example');
const changelogPath = path.join(root, 'CHANGELOG.md');

if (packageJson.version !== '1.4.0') {
  throw new Error(`Expected package.json version 1.4.0, received ${packageJson.version}.`);
}

if (appJson.expo?.version !== '1.4.0') {
  throw new Error(`Expected app.json version 1.4.0, received ${appJson.expo?.version}.`);
}

if (appJson.expo?.android?.versionCode !== 5) {
  throw new Error(`Expected Android versionCode 5, received ${appJson.expo?.android?.versionCode}.`);
}

if (appJson.expo?.ios?.buildNumber !== '5') {
  throw new Error(`Expected iOS buildNumber 5, received ${appJson.expo?.ios?.buildNumber}.`);
}

for (const filePath of [releasePath, envExamplePath, changelogPath, monetizationPath]) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Expected ${path.relative(root, filePath)}.`);
  }
}

const monetization = fs.readFileSync(monetizationPath, 'utf8');
const expectedAmounts = '[2, 5, 10, 20, 30, 50, 70, 100, 150, 200]';

if (!monetization.includes(expectedAmounts)) {
  throw new Error(`Expected donation fixed amounts ${expectedAmounts}.`);
}

const envExample = fs.readFileSync(envExamplePath, 'utf8');

for (const key of [
  'EXPO_PUBLIC_ASAAS_ENVIRONMENT',
  'EXPO_PUBLIC_ASAAS_DONATION_CHECKOUT_URL',
  'EXPO_PUBLIC_GENTIUM_SUPPORT_EMAIL',
  'ASAAS_API_KEY',
  'ASAAS_WEBHOOK_TOKEN',
]) {
  if (!envExample.includes(`${key}=`)) {
    throw new Error(`Expected .env.example to include ${key}.`);
  }
}

for (const key of [
  'tabs.donations',
  'home.bibleExperienceTitle',
  'home.bibleVersionsAction',
  'home.originalScripturesAction',
  'home.donationsTitle',
  'home.donationsAction',
  'bible.versionPicker.title',
  'bible.versionPicker.portuguese',
  'bible.versionPicker.english',
  'bible.versionPicker.spanish',
  'bible.versionPicker.original',
  'bible.selection.count',
  'bible.selection.menu',
  'bible.selection.toggleVerse',
  'donations.title',
  'donations.action',
  'donations.amountTitle',
  'donations.customAmountLabel',
  'donations.checkoutNotConfigured',
  'settings.donations',
  'settings.donationsDescription',
  'settings.language',
  'settings.languageDescription',
  'settings.languages.pt-BR',
  'settings.languages.en-US',
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
