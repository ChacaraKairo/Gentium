const fs = require('fs');
const path = require('path');

const root = process.cwd();
const packageJson = readJson('package.json');
const appJson = readJson('app.json');
const easJson = readJson('eas.json');
const androidManifest = readText('android/app/src/main/AndroidManifest.xml');
const androidBuildGradle = readText('android/app/build.gradle');

assert(packageJson.version === '1.4.0', `Expected package.json version 1.4.0, received ${packageJson.version}.`);
assert(appJson.expo?.version === '1.4.0', `Expected app.json version 1.4.0, received ${appJson.expo?.version}.`);
assert(appJson.expo?.name === 'Gentium', 'Expected Expo app name Gentium.');
assert(appJson.expo?.slug === 'gentium', 'Expected Expo slug gentium.');
assert(appJson.expo?.android?.package === 'com.gentium.app', 'Expected Android package com.gentium.app.');
assert(appJson.expo?.android?.allowBackup === false, 'Expected Android allowBackup false.');
assert(appJson.expo?.android?.versionCode >= 5, 'Expected Android versionCode >= 5.');
assert(appJson.expo?.android?.adaptiveIcon?.foregroundImage, 'Expected Android adaptive icon foreground image.');
assert(appJson.expo?.android?.adaptiveIcon?.backgroundColor, 'Expected Android adaptive icon background color.');

for (const permission of [
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.WRITE_EXTERNAL_STORAGE',
]) {
  assert(
    appJson.expo?.android?.blockedPermissions?.includes(permission),
    `Expected Android blockedPermissions to include ${permission}.`,
  );
}

assert(easJson.cli?.appVersionSource === 'remote', 'Expected EAS appVersionSource remote.');
assert(easJson.build?.preview?.android?.buildType === 'apk', 'Expected EAS preview profile to build APK.');
assert(
  easJson.build?.production?.android?.buildType === 'app-bundle',
  'Expected EAS production profile to build Android App Bundle.',
);
assert(Boolean(easJson.submit?.production), 'Expected EAS production submit profile.');
assert(
  androidManifest.includes('android:allowBackup="false"'),
  'Expected AndroidManifest.xml to disable android:allowBackup.',
);

for (const permission of [
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.WRITE_EXTERNAL_STORAGE',
]) {
  assert(!androidManifest.includes(permission), `AndroidManifest.xml must not include ${permission}.`);
}

assert(
  androidBuildGradle.includes('apply from: "./eas-build.gradle"'),
  'Expected android/app/build.gradle to apply EAS signing integration when present.',
);
assert(
  !/release\s*\{[\s\S]*?signingConfig\s+signingConfigs\.debug[\s\S]*?\n\s*\}/.test(androidBuildGradle),
  'Release builds must not be hardcoded to signingConfigs.debug.',
);

for (const script of [
  'build:android:apk',
  'build:android:playstore',
  'submit:android:playstore',
  'validate:production',
]) {
  assert(packageJson.scripts?.[script], `Expected package.json script ${script}.`);
}

for (const relativePath of [
  '.env.example',
  'assets/images/icon.png',
  'docs/releases/v1.4.0.md',
  'docs/playstore/android.md',
]) {
  assert(fs.existsSync(path.join(root, relativePath)), `Expected ${relativePath}.`);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
