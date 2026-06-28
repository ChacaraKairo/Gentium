# Versionamento

**Versão:** 1.0
**Autor:** Kairo Chácara

---

# 1. Introdução

Este documento define a estratégia de versionamento do Gentium.

O objetivo é organizar a evolução do aplicativo, backend, banco de dados, API, conteúdos bíblicos, estudos, planos de leitura e documentação.

---

# 2. Objetivos

O versionamento deverá permitir:

- Controlar mudanças do projeto.
- Organizar releases.
- Evitar quebras entre versões.
- Facilitar manutenção.
- Permitir rollback.
- Registrar histórico de alterações.
- Garantir compatibilidade entre aplicativo, API e banco de dados.

---

# 3. Versionamento Semântico

O Gentium utilizará versionamento semântico:

```text
MAJOR.MINOR.PATCH
```

Exemplo:

```text
1.4.2
```

Significado:

```text
MAJOR → mudanças grandes ou incompatíveis
MINOR → novas funcionalidades compatíveis
PATCH → correções e melhorias pequenas
```

---

# 4. Exemplos

```text
1.0.0 → primeira versão estável

1.1.0 → adiciona novo módulo compatível

1.1.1 → corrige bug

2.0.0 → mudança incompatível importante
```

---

# 5. Versão do Aplicativo Mobile

O aplicativo mobile deverá possuir:

```text
versionName: 1.0.0
versionCode: 1
```

O `versionName` será visível ao usuário.

O `versionCode` será usado pelas lojas, como Google Play e App Store.

---

# 6. Versão da API

A API deverá ser versionada na URL.

Exemplo:

```text
/api/v1
/api/v2
```

Mudanças incompatíveis deverão gerar nova versão da API.

---

# 7. Versão do Banco de Dados

O banco local deverá utilizar migrações versionadas.

Exemplo:

```text
001_create_bible_tables.sql
002_create_notes_tables.sql
003_create_highlights_tables.sql
004_create_reading_plans_tables.sql
```

Cada migração deverá ser executada apenas uma vez.

---

# 8. Versão dos Pacotes Bíblicos

Cada pacote bíblico deverá possuir versão própria.

Exemplo:

```text
arc-1.0.0
naa-1.0.0
greek-text-1.0.0
hebrew-text-1.0.0
strong-1.0.0
```

Isso permitirá atualizar uma Bíblia, léxico ou interlinear sem atualizar o aplicativo inteiro.

---

# 9. Versão dos Estudos

Cada estudo ou curso deverá possuir versão própria.

Exemplo:

```text
introducao-biblia-1.0.0
cartas-paulinas-1.2.0
evangelho-joao-1.1.0
```

---

# 10. Versão da Documentação

A documentação também deverá possuir controle de versão.

Mudanças importantes deverão ser registradas no changelog.

---

# 11. Changelog

O projeto deverá possuir um arquivo:

```text
CHANGELOG.md
```

Ele deverá registrar:

- Novas funcionalidades.
- Correções.
- Mudanças técnicas.
- Migrações.
- Alterações de conteúdo.
- Quebras de compatibilidade.

---

# 12. Tags no Git

Cada release deverá possuir uma tag.

Exemplo:

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

# 13. Branches

Estrutura sugerida:

```text
main        → versão estável
develop     → desenvolvimento
feature/*   → novas funcionalidades
fix/*       → correções
release/*   → preparação de versão
hotfix/*    → correções urgentes
```

---

# 14. Releases

Cada release deverá conter:

- Número da versão.
- Data.
- Funcionalidades incluídas.
- Correções.
- Migrações.
- Observações.
- Instruções de atualização.

---

# 15. Compatibilidade

Antes de publicar uma nova versão, deverá ser verificado:

- Compatibilidade com banco local.
- Compatibilidade com API.
- Compatibilidade com pacotes instalados.
- Preservação dos dados do usuário.

---

# 16. Rollback

Quando possível, o sistema deverá permitir voltar para uma versão anterior em caso de falha grave.

Entretanto, mudanças de banco de dados deverão ser planejadas cuidadosamente, pois nem toda migração poderá ser revertida com segurança.

---

# 17. Versionamento de Ambiente

Ambientes previstos:

```text
development
staging
production
```

Cada ambiente deverá possuir configurações próprias.

---

# 18. Considerações Finais

O versionamento será essencial para manter o Gentium organizado durante sua evolução.

Como o projeto terá aplicativo, backend, banco local, API, pacotes bíblicos, estudos e documentação, cada parte deverá possuir controle claro de versão.

Nenhuma alteração importante deverá ser publicada sem registro, tag, changelog e verificação de compatibilidad
