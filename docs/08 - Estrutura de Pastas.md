# Estrutura de Pastas

Versão: 1.0

Autor: Kairo Chácara

---

# 1. Introdução

Este documento define a organização dos diretórios do Gentium.

A estrutura foi planejada para facilitar a manutenção, escalabilidade e organização do projeto ao longo dos anos.

O Gentium utilizará uma arquitetura baseada em módulos (Feature First), onde cada funcionalidade possui seus próprios componentes, serviços, tipos e regras de negócio.

---

# 2. Estrutura Geral

```text
gentium/
│
├── docs/
│
├── assets/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   ├── animations/
│   └── sounds/
│
├── scripts/
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   ├── bible/
│   └── sqlite/
│
├── src/
│
├── tests/
│
├── .github/
│
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

---

# 3. Estrutura da pasta src

```text
src/
│
├── app/
├── modules/
├── shared/
├── infrastructure/
├── hooks/
├── navigation/
├── theme/
├── types/
├── constants/
├── utils/
└── config/
```

---

# 4. app/

Responsável pela inicialização do aplicativo.

```text
app/
│
├── App.tsx
├── providers/
├── routes/
└── startup/
```

Responsabilidades:

- Inicialização.
- Providers.
- Tema.
- Navegação.
- Configuração global.

---

# 5. modules/

Contém todas as funcionalidades do sistema.

Cada módulo é completamente independente.

```text
modules/
│
├── bible/
├── studies/
├── notes/
├── highlights/
├── favorites/
├── readingPlans/
├── ai/
├── donations/
├── authentication/
├── profile/
├── settings/
├── gamification/
└── sync/
```

---

# 6. Estrutura interna de um módulo

Exemplo utilizando o módulo Bíblia.

```text
bible/
│
├── components/
├── screens/
├── hooks/
├── services/
├── repositories/
├── database/
├── models/
├── types/
├── utils/
├── constants/
└── index.ts
```

Cada módulo deverá conter apenas arquivos relacionados à sua funcionalidade.

---

# 7. shared/

Arquivos compartilhados entre todos os módulos.

```text
shared/
│
├── components/
├── layouts/
├── hooks/
├── services/
├── validators/
├── interfaces/
├── types/
├── constants/
└── helpers/
```

Exemplos:

- Botões.
- Inputs.
- Cards.
- Modais.
- Loading.
- Toast.
- Componentes reutilizáveis.

---

# 8. infrastructure/

Responsável pela infraestrutura da aplicação.

```text
infrastructure/
│
├── api/
├── database/
├── storage/
├── authentication/
├── logger/
└── analytics/
```

Aqui ficam implementações técnicas que não pertencem a um módulo específico.

---

# 9. navigation/

Organização das rotas.

```text
navigation/
│
├── RootNavigator.tsx
├── AuthNavigator.tsx
├── MainNavigator.tsx
└── types.ts
```

---

# 10. hooks/

Hooks globais reutilizáveis.

Exemplos:

- useTheme
- useNetwork
- useDebounce
- usePermissions

---

# 11. theme/

Toda configuração visual.

```text
theme/
│
├── colors.ts
├── typography.ts
├── spacing.ts
├── radius.ts
├── shadows.ts
├── light.ts
├── dark.ts
└── index.ts
```

---

# 12. constants/

Constantes globais.

Exemplos:

- nomes dos livros
- idiomas
- cores padrão
- configurações

---

# 13. utils/

Funções utilitárias.

Exemplos:

- formatação
- datas
- validações
- conversões

---

# 14. config/

Configurações da aplicação.

```text
config/
│
├── api.ts
├── environment.ts
├── routes.ts
└── app.ts
```

---

# 15. types/

Tipos globais.

Exemplos:

- User
- Verse
- Book
- Chapter
- Donation
- Study

---

# 16. tests/

Estrutura de testes.

```text
tests/
│
├── unit/
├── integration/
├── e2e/
└── mocks/
```

---

# 17. Organização dos Imports

Sempre utilizar imports absolutos.

Exemplo:

```ts
import Button from '@/shared/components/Button';
```

Evitar:

```ts
../../../components/Button
```

---

# 18. Convenções

Pastas:

- camelCase

Componentes:

- PascalCase

Arquivos de tipos:

- \*.types.ts

Interfaces:

- \*.interface.ts

Serviços:

- \*.service.ts

Repositórios:

- \*.repository.ts

Hooks:

- useNomeDoHook.ts

---

# 19. Crescimento da Estrutura

Novos módulos deverão ser adicionados dentro de `modules`, mantendo a mesma organização interna.

Exemplos futuros:

- courses
- theology
- lexicon
- maps
- chronology
- genealogy
- dictionaries
- commentaries
- community
- notifications

---

# 20. Considerações Finais

A estrutura de pastas do Gentium foi projetada para suportar um projeto de longo prazo.

A organização modular facilita a manutenção, reduz o acoplamento entre funcionalidades e permite que novos módulos sejam adicionados sem impactar a arquitetura existente.

Todo novo desenvolvimento deverá respeitar esta estrutura para garantir consistência em todo o projeto.
