# Arquitetura

Versão: 1.0
Autor: Kairo Chácara

---

# 1. Introdução

Este documento descreve a arquitetura inicial do Gentium.

O Gentium será desenvolvido como uma aplicação mobile em React Native, com foco em funcionamento offline, organização modular, facilidade de manutenção e preparação para crescimento futuro.

A arquitetura deverá permitir que o aplicativo comece simples, com Bíblia offline, anotações, marcações e estudos, mas possa evoluir para sincronização, inteligência artificial, gamificação e cursos estruturados.

---

# 2. Princípios Arquiteturais

A arquitetura do Gentium será guiada pelos seguintes princípios:

- Offline First.
- Modularidade.
- Baixo acoplamento.
- Alta coesão.
- Separação de responsabilidades.
- Escalabilidade gradual.
- Segurança dos dados do usuário.
- Facilidade de testes.
- Preparação para futuras plataformas.

---

# 3. Arquitetura Geral

O Gentium será dividido em camadas principais:

```text
Interface do Usuário
        ↓
Camada de Estado
        ↓
Camada de Serviços
        ↓
Camada de Dados
        ↓
Banco Local / APIs Externas
```

Cada camada terá responsabilidades bem definidas.

---

# 4. Camada de Interface

A camada de interface será responsável por exibir telas, componentes visuais e fluxos de navegação.

Tecnologias previstas:

- React Native.
- Expo.
- React Navigation.
- Componentes reutilizáveis.

Responsabilidades:

- Exibir Bíblia.
- Exibir estudos.
- Exibir anotações.
- Exibir marcações.
- Exibir tela de doações.
- Exibir progresso.
- Exibir configurações.

A interface não deverá acessar diretamente o banco de dados ou APIs externas.

---

# 5. Camada de Estado

A camada de estado será responsável por controlar dados temporários da aplicação.

Tecnologias possíveis:

- Zustand.
- Context API.
- TanStack Query, futuramente.

Responsabilidades:

- Controlar estado da leitura atual.
- Controlar tema.
- Controlar dados carregados.
- Controlar autenticação.
- Controlar preferências do usuário.

---

# 6. Camada de Serviços

A camada de serviços conterá a lógica principal da aplicação.

Exemplos de serviços:

- BibleService.
- NotesService.
- HighlightsService.
- StudyService.
- ReadingPlanService.
- DonationService.
- SyncService.
- AIService.

Responsabilidades:

- Executar regras de negócio.
- Validar dados.
- Coordenar comunicação com banco local.
- Coordenar comunicação com APIs externas.
- Evitar que a interface conheça detalhes técnicos.

---

# 7. Camada de Dados

A camada de dados será responsável pela persistência das informações.

Tecnologia inicial prevista:

- SQLite local.

Responsabilidades:

- Armazenar Bíblia offline.
- Armazenar anotações.
- Armazenar marcações.
- Armazenar favoritos.
- Armazenar planos.
- Armazenar progresso.
- Armazenar configurações.
- Executar migrações.

---

# 8. Banco de Dados Local

O banco local será o núcleo do funcionamento offline.

Dados principais:

- Livros bíblicos.
- Capítulos.
- Versículos.
- Versões da Bíblia.
- Anotações.
- Marcações.
- Favoritos.
- Estudos.
- Planos de leitura.
- Progresso.
- Configurações.

O banco deverá ser preparado para migrações futuras.

---

# 9. Offline First

O Gentium deverá funcionar prioritariamente offline.

Funcionalidades offline obrigatórias:

- Leitura da Bíblia.
- Pesquisa local.
- Anotações.
- Marcações.
- Favoritos.
- Histórico.
- Estudos baixados.
- Planos locais.
- Configurações.

A conexão com a internet será usada apenas para:

- Sincronização.
- Atualizações de conteúdo.
- Doações.
- IA.
- Backup.
- Login.

---

# 10. APIs Externas

O Gentium poderá utilizar APIs externas para funcionalidades específicas.

APIs previstas:

## Asaas

Utilizada para:

- Doações únicas.
- Assinaturas recorrentes.
- Histórico de pagamentos.
- Cancelamento de assinaturas.

## IA

Utilizada futuramente para:

- Explicações.
- Resumos.
- Recomendações.
- Organização de estudos.

## Backend próprio

Utilizado futuramente para:

- Autenticação.
- Sincronização.
- Conteúdos oficiais.
- Backup.
- Administração.

---

# 11. Integração com Asaas

A integração com o Asaas não deverá ficar diretamente no aplicativo mobile quando envolver chaves secretas.

Fluxo recomendado:

```text
Aplicativo Mobile
        ↓
Backend do Gentium
        ↓
API do Asaas
```

O aplicativo deverá solicitar ao backend a criação de cobrança ou assinatura.

O backend será responsável por:

- Guardar chaves da API.
- Criar cobranças.
- Criar assinaturas.
- Receber webhooks.
- Validar pagamentos.
- Registrar histórico.
- Cancelar assinaturas.

---

# 12. Backend Futuro

Embora o MVP possa começar sem backend completo, a arquitetura deverá prever sua existência.

Responsabilidades futuras do backend:

- Login.
- Sincronização entre dispositivos.
- Doações via Asaas.
- IA.
- Conteúdos oficiais.
- Administração.
- Webhooks.
- Backup em nuvem.

Tecnologias possíveis:

- Node.js com NestJS.
- Python com FastAPI.
- PostgreSQL.
- Redis.
- Docker.

---

# 13. Modularização

O aplicativo será organizado em módulos funcionais.

Exemplo:

```text
src/
├── app/
├── modules/
│   ├── bible/
│   ├── notes/
│   ├── highlights/
│   ├── studies/
│   ├── reading-plans/
│   ├── donations/
│   ├── gamification/
│   ├── ai/
│   └── settings/
├── shared/
└── infrastructure/
```

Cada módulo deverá conter suas próprias telas, serviços, tipos e componentes específicos.

---

# 14. Separação de Responsabilidades

Cada parte do sistema deverá ter uma responsabilidade clara.

```text
screens/       → Telas
components/    → Componentes visuais
services/      → Regras de negócio
repositories/  → Acesso a dados
database/      → Configuração SQLite
types/         → Tipagens
utils/         → Funções auxiliares
```

---

# 15. Fluxo de Dados

Fluxo padrão dentro do aplicativo:

```text
Tela
 ↓
Hook ou Store
 ↓
Service
 ↓
Repository
 ↓
SQLite ou API
```

Exemplo:

```text
BibleScreen
 ↓
useBibleStore
 ↓
BibleService
 ↓
BibleRepository
 ↓
SQLite
```

Esse fluxo evita que as telas acessem diretamente o banco.

---

# 16. Sincronização Futura

A sincronização será adicionada em fase posterior.

Estratégia prevista:

- Dados locais como fonte principal.
- Backend como fonte de backup e sincronização.
- Controle de última alteração.
- Identificadores universais.
- Resolução de conflitos.
- Sincronização incremental.

Dados sincronizáveis:

- Anotações.
- Marcações.
- Favoritos.
- Progresso.
- Planos personalizados.
- Configurações.

---

# 17. Segurança

A arquitetura deverá proteger dados sensíveis.

Diretrizes:

- Não armazenar senhas em texto puro.
- Não expor chaves secretas no aplicativo.
- Usar HTTPS em todas as APIs.
- Utilizar armazenamento seguro para tokens.
- Separar dados públicos de dados privados.
- Permitir exclusão de conta e dados.

---

# 18. Inteligência Artificial

A IA será um módulo opcional e desacoplado.

Ela não deverá ser necessária para o funcionamento principal do aplicativo.

Fluxo previsto:

```text
Aplicativo
 ↓
Backend
 ↓
Serviço de IA
```

A IA poderá auxiliar em:

- Explicação de textos.
- Sugestão de estudos.
- Resumo de anotações.
- Organização de conteúdos.
- Criação de questionários.

---

# 19. Gamificação

A gamificação será adicionada futuramente sem comprometer a base do aplicativo.

Módulos previstos:

- XP.
- Sequência diária.
- Missões.
- Conquistas.
- Revisão espaçada.
- Trilhas de aprendizado.
- Questionários.

A gamificação deverá incentivar aprendizado real, não apenas uso repetitivo.

---

# 20. Arquitetura Offline/Online

O Gentium deverá separar claramente recursos locais e recursos online.

## Recursos locais

- Bíblia.
- Anotações.
- Marcações.
- Favoritos.
- Histórico.
- Planos baixados.

## Recursos online

- Doações.
- Sincronização.
- IA.
- Atualizações de conteúdo.
- Conta do usuário.

A falha de recursos online não poderá impedir o uso da Bíblia offline.

---

# 21. Escalabilidade

A arquitetura deverá permitir crescimento gradual.

Possíveis expansões:

- Web.
- Desktop.
- Painel administrativo.
- API pública.
- Loja de materiais gratuitos.
- Comunidade.
- Sistema de cursos.
- Múltiplas versões bíblicas.
- Conteúdo multilíngue.

---

# 22. Testabilidade

O projeto deverá permitir testes automatizados.

Tipos de testes previstos:

- Testes unitários.
- Testes de serviços.
- Testes de repositórios.
- Testes de componentes.
- Testes de fluxo.
- Testes de migração do banco.

---

# 23. Decisões Iniciais

Para o MVP, recomenda-se:

- React Native com Expo.
- SQLite local.
- Zustand para estado.
- React Navigation para navegação.
- Backend apenas quando necessário para doações, sincronização e IA.
- Asaas integrado via backend, não diretamente no app.

---

# 24. Considerações Finais

A arquitetura do Gentium deverá equilibrar simplicidade inicial e capacidade de expansão.

O projeto deve começar com uma base mobile offline bem estruturada, evitando complexidade desnecessária no MVP, mas mantendo separação suficiente para permitir crescimento futuro.

A prioridade inicial será entregar uma Bíblia offline funcional, rápida e organizada, com anotações, marcações, favoritos e uma base preparada para estudos, doações, sincronização, IA e gamificação.
