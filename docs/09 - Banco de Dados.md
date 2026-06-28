# Banco de Dados

Versão: 1.0
Autor: Kairo Chácara

---

# 1. Introdução

Este documento descreve a estrutura inicial do banco de dados do Gentium.

O Gentium utilizará banco de dados local para garantir funcionamento offline. A primeira versão será baseada em SQLite, permitindo leitura da Bíblia, anotações, marcações, favoritos, histórico e configurações mesmo sem internet.

Futuramente, o projeto poderá utilizar um backend com PostgreSQL para sincronização, conta do usuário, doações, IA e administração de conteúdo.

---

# 2. Estratégia Geral

O banco de dados será dividido em duas partes principais:

```text
Banco Local
Banco Remoto
```

## Banco Local

Utilizado no aplicativo mobile.

Responsável por:

- Bíblia offline.
- Versões bíblicas.
- Livros.
- Capítulos.
- Versículos.
- Anotações.
- Marcações.
- Favoritos.
- Histórico.
- Planos de leitura.
- Configurações locais.

## Banco Remoto

Utilizado futuramente no backend.

Responsável por:

- Usuários.
- Sincronização.
- Backups.
- Doações.
- Assinaturas.
- Conteúdos oficiais.
- IA.
- Administração.

---

# 3. Tecnologia do Banco Local

O banco local utilizará:

```text
SQLite
```

Motivos:

- Funciona offline.
- É leve.
- É confiável.
- Possui excelente desempenho.
- É adequado para aplicativos mobile.
- Permite backup local.
- Suporta migrações.

---

# 4. Tecnologia do Banco Remoto

O banco remoto previsto será:

```text
PostgreSQL
```

Motivos:

- Robusto.
- Escalável.
- Seguro.
- Excelente para aplicações web.
- Compatível com Prisma.
- Adequado para sincronização e relatórios.

---

# 5. Princípios de Modelagem

A modelagem do banco seguirá os seguintes princípios:

- Integridade referencial.
- Normalização quando necessário.
- Baixo acoplamento entre módulos.
- Campos de auditoria.
- Suporte a sincronização futura.
- Suporte a soft delete.
- Identificadores únicos.
- Migrações versionadas.
- Separação entre dados bíblicos e dados do usuário.

---

# 6. Dados Bíblicos

Os dados bíblicos serão tratados como dados base do sistema.

Tabelas principais:

```text
bible_versions
bible_books
bible_chapters
bible_verses
```

Essas tabelas armazenarão o conteúdo das versões bíblicas disponíveis offline.

---

# 7. Tabela bible_versions

Armazena as versões da Bíblia disponíveis.

Campos previstos:

```text
id
name
abbreviation
language
description
copyright
is_offline_available
created_at
updated_at
```

Exemplos:

```text
Almeida Revista e Corrigida
Nova Almeida Atualizada
King James Version
```

---

# 8. Tabela bible_books

Armazena os livros bíblicos.

Campos previstos:

```text
id
name
abbreviation
testament
position
created_at
updated_at
```

Exemplos:

```text
Gênesis
Êxodo
Mateus
Romanos
Apocalipse
```

---

# 9. Tabela bible_chapters

Armazena os capítulos da Bíblia.

Campos previstos:

```text
id
book_id
chapter_number
created_at
updated_at
```

---

# 10. Tabela bible_verses

Armazena os versículos.

Campos previstos:

```text
id
version_id
book_id
chapter_id
verse_number
text
created_at
updated_at
```

---

# 11. Dados do Usuário

Os dados do usuário serão separados dos dados bíblicos.

Tabelas principais:

```text
notes
highlights
favorites
collections
reading_history
settings
```

---

# 12. Tabela notes

Armazena anotações do usuário.

Campos previstos:

```text
id
verse_id
title
content
created_at
updated_at
deleted_at
sync_status
```

Observação:

Uma anotação poderá estar vinculada a um versículo específico ou, futuramente, a um estudo, capítulo, plano ou curso.

---

# 13. Tabela highlights

Armazena marcações de versículos.

Campos previstos:

```text
id
verse_id
color
label
created_at
updated_at
deleted_at
sync_status
```

---

# 14. Tabela favorites

Armazena favoritos.

Campos previstos:

```text
id
verse_id
collection_id
created_at
updated_at
deleted_at
sync_status
```

---

# 15. Tabela collections

Armazena coleções criadas pelo usuário.

Campos previstos:

```text
id
name
description
type
created_at
updated_at
deleted_at
sync_status
```

Exemplos de tipo:

```text
verses
notes
studies
mixed
```

---

# 16. Tabela reading_history

Armazena o histórico de leitura.

Campos previstos:

```text
id
book_id
chapter_id
verse_id
read_at
created_at
```

---

# 17. Tabela settings

Armazena configurações locais.

Campos previstos:

```text
id
key
value
created_at
updated_at
```

Exemplos:

```text
theme = dark
font_size = 18
selected_bible_version = ARC
last_read_chapter = Romanos 8
```

---

# 18. Estudos

O módulo de estudos terá tabelas próprias.

Tabelas previstas:

```text
studies
study_sections
study_references
study_progress
```

---

# 19. Tabela studies

Armazena estudos bíblicos.

Campos previstos:

```text
id
title
description
category
level
author
source
is_offline_available
created_at
updated_at
deleted_at
```

---

# 20. Tabela study_sections

Armazena seções de um estudo.

Campos previstos:

```text
id
study_id
title
content
position
created_at
updated_at
deleted_at
```

---

# 21. Tabela study_references

Relaciona estudos com versículos.

Campos previstos:

```text
id
study_id
section_id
verse_id
created_at
updated_at
```

---

# 22. Tabela study_progress

Armazena o progresso do usuário nos estudos.

Campos previstos:

```text
id
study_id
section_id
status
completed_at
created_at
updated_at
sync_status
```

---

# 23. Planos de Leitura

Tabelas previstas:

```text
reading_plans
reading_plan_days
reading_plan_progress
```

---

# 24. Tabela reading_plans

Armazena planos de leitura.

Campos previstos:

```text
id
title
description
duration_days
level
created_at
updated_at
deleted_at
```

---

# 25. Tabela reading_plan_days

Armazena os dias de cada plano.

Campos previstos:

```text
id
plan_id
day_number
title
description
created_at
updated_at
```

---

# 26. Tabela reading_plan_day_items

Armazena os textos bíblicos de cada dia.

Campos previstos:

```text
id
plan_day_id
book_id
chapter_id
start_verse
end_verse
created_at
updated_at
```

---

# 27. Tabela reading_plan_progress

Armazena o progresso do usuário nos planos.

Campos previstos:

```text
id
plan_id
day_id
status
completed_at
created_at
updated_at
sync_status
```

---

# 28. Gamificação

Tabelas futuras:

```text
user_xp
user_streaks
achievements
user_achievements
missions
mission_progress
review_items
```

Essas tabelas serão detalhadas em documento próprio.

---

# 29. Doações

As doações não deverão depender apenas do banco local.

A maior parte dos dados financeiros ficará no backend.

Tabelas remotas previstas:

```text
donations
subscriptions
payment_events
asaas_webhooks
```

O aplicativo poderá armazenar localmente apenas informações básicas para exibição.

---

# 30. Sincronização

Para preparar o banco local para sincronização futura, tabelas do usuário deverão possuir campos como:

```text
sync_status
created_at
updated_at
deleted_at
remote_id
```

Estados possíveis:

```text
pending
synced
failed
deleted
```

---

# 31. Soft Delete

Dados do usuário não deverão ser apagados imediatamente.

Será utilizado o campo:

```text
deleted_at
```

Quando esse campo estiver preenchido, o registro será considerado excluído.

Isso facilita:

- Recuperação.
- Sincronização.
- Auditoria.
- Resolução de conflitos.

---

# 32. Migrações

Todas as alterações no banco deverão ser feitas por migrações versionadas.

Exemplo:

```text
001_create_bible_tables.sql
002_create_user_notes_tables.sql
003_create_studies_tables.sql
004_create_reading_plans_tables.sql
```

Nunca alterar manualmente a estrutura sem criar uma migração correspondente.

---

# 33. Diagrama Conceitual

```text
bible_versions
      │
      └── bible_verses
              │
bible_books ──┤
              │
bible_chapters

bible_verses
      ├── notes
      ├── highlights
      ├── favorites
      └── study_references
```

---

# 34. Exemplo Inicial de SQL

```sql
CREATE TABLE bible_versions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  language TEXT NOT NULL,
  description TEXT,
  copyright TEXT,
  is_offline_available INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE bible_books (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  testament TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE bible_chapters (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (book_id) REFERENCES bible_books(id)
);

CREATE TABLE bible_verses (
  id TEXT PRIMARY KEY,
  version_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  verse_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (version_id) REFERENCES bible_versions(id),
  FOREIGN KEY (book_id) REFERENCES bible_books(id),
  FOREIGN KEY (chapter_id) REFERENCES bible_chapters(id)
);
```

---

# 35. Considerações Finais

O banco de dados do Gentium deverá ser projetado para ser simples no início, mas preparado para expansão.

A primeira prioridade será garantir leitura bíblica offline rápida e confiável.

Depois, o banco evoluirá para suportar anotações, marcações, estudos, planos de leitura, gamificação, IA, sincronização e doações.

A separação entre dados bíblicos, dados do usuário e dados remotos será essencial para manter o projeto organizado e escalável.
