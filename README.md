# Gentium

Gentium e um app mobile offline-first para leitura, estudo e organizacao pessoal das Escrituras.

## MVP 1.4.0

- Biblia offline com busca avancada, favoritos, anotacoes e marcadores.
- Estudos, planos de leitura e biblioteca avancada offline.
- Idiomas originais com texto original, transliteracao academica validada, pronuncia simplificada curada e nomes tradicionais quando disponiveis.
- Doacoes voluntarias com valores fixos e valor livre via checkout Asaas configuravel.
- Portugues do Brasil como idioma padrao, com alternancia de idioma no app.

## Requisitos

- Node.js compativel com Expo SDK 54.
- npm.
- Conta Expo/EAS para gerar APK e AAB assinados.

## Ambiente

Copie `.env.example` para `.env` e preencha as variaveis publicas usadas pelo app.

As chaves privadas do Asaas devem ficar em backend seguro. Nao coloque `ASAAS_API_KEY` nem tokens privados no app mobile publicado.

## Comandos

```bash
npm install
npm start
npm test
npm run validate:production
```

## Android

APK para teste interno:

```bash
npm run build:android:apk
```

AAB para Play Store:

```bash
npm run build:android:playstore
```

Envio para Play Console via EAS Submit:

```bash
npm run submit:android:playstore
```

Mais detalhes em `docs/playstore/android.md`.

## Qualidade de release

Antes de publicar:

- Rode `npm run validate:production`.
- Teste o APK em aparelho real.
- Confira Biblia, estudos, notas, planos, doacoes e troca de idioma.
- Confira a politica de privacidade e a declaracao de dados no Play Console.

## Documentacao

A documentacao completa fica em `docs/`.
