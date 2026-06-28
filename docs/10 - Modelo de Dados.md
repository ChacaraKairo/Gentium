# Modelo de Dados

Versão: 1.0
Autor: Kairo Chácara

---

# 1. Introdução

Este documento descreve o modelo de dados inicial do Gentium.

O objetivo é representar as principais entidades do sistema, seus relacionamentos e responsabilidades dentro da aplicação.

O modelo de dados servirá como base para a criação das tabelas SQLite no aplicativo mobile e, futuramente, para o banco remoto do backend.

---

# 2. Visão Geral

O Gentium será dividido em grupos de dados:

- Dados bíblicos.
- Dados do usuário.
- Dados de estudo.
- Dados de planos de leitura.
- Dados de gamificação.
- Dados de doações.
- Dados de sincronização.
- Dados de configuração.

---

# 3. Entidades Principais

```text
BibleVersion
Book
Chapter
Verse
User
Note
Highlight
Favorite
Collection
Study
StudySection
ReadingPlan
ReadingPlanDay
Donation
Subscription
Achievement
Setting
```
