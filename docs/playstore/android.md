# Gentium Android / Play Store

## Artefatos

- APK de teste interno: `npm run build:android:apk`
- AAB para Play Store: `npm run build:android:playstore`
- Envio pelo EAS Submit: `npm run submit:android:playstore`

## Checklist antes do build

- Entrar na conta Expo: `npx eas login`
- Confirmar acesso ao projeto EAS `4617c171-58c1-4ca4-be89-95c16003d7fa`.
- Rodar `npm run validate:production`.
- Preencher `.env` local com as variaveis publicas do Asaas.
- Manter chaves privadas do Asaas fora do app mobile.
- Conferir que `com.gentium.app` e `versionCode` estao corretos.
- Usar o keystore gerenciado pelo EAS ou configurar credenciais Android pelo EAS.

## Play Console

- Nome do app: Gentium.
- Categoria sugerida: Livros e referencia.
- Idioma padrao: Portugues do Brasil.
- Declaracao de dados: o MVP usa dados locais/offline e doacoes externas; declarar conforme o checkout Asaas configurado.
- Politica de privacidade: publicar uma URL antes do envio para producao.
- Classificacao indicativa: preencher o questionario do Play Console.
- Teste fechado ou interno: recomendado antes da producao aberta.

## Observacoes de assinatura

O AAB de loja deve ser assinado com credenciais de upload gerenciadas pelo EAS/Google Play. Nao versionar keystores privados, `credentials.json` ou senhas no repositorio.
