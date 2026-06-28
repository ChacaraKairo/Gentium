# Tecnologias

Versão: 1.0

Autor: Kairo Chácara

---

# 1. Introdução

Este documento descreve as tecnologias adotadas no desenvolvimento do Gentium.

As escolhas tecnológicas foram realizadas considerando desempenho, escalabilidade, facilidade de manutenção, suporte da comunidade e compatibilidade com a visão de longo prazo do projeto.

Sempre que possível, serão utilizadas tecnologias amplamente adotadas pela comunidade e com documentação consolidada.

---

# 2. Aplicativo Mobile

## React Native

Responsável pelo desenvolvimento da aplicação mobile.

### Motivos da escolha

- Desenvolvimento multiplataforma.
- Alto desempenho.
- Grande comunidade.
- Ecossistema consolidado.
- Compartilhamento de código entre Android e iOS.

---

## Expo

Framework utilizado para acelerar o desenvolvimento.

### Benefícios

- Configuração simplificada.
- Atualizações OTA.
- APIs nativas prontas.
- Excelente experiência de desenvolvimento.
- Facilidade para publicação.

---

# 3. Linguagem

## TypeScript

Todo o projeto será desenvolvido utilizando TypeScript.

### Motivos

- Tipagem estática.
- Maior segurança durante o desenvolvimento.
- Melhor manutenção.
- Melhor suporte das IDEs.
- Redução de erros em tempo de execução.

---

# 4. Navegação

## React Navigation

Responsável pelo gerenciamento das telas.

Utilizado para:

- Stack Navigation.
- Bottom Tabs.
- Drawer Navigation.
- Deep Linking.
- Navegação aninhada.

---

# 5. Gerenciamento de Estado

## Zustand

Biblioteca responsável pelo gerenciamento de estado global.

### Motivos

- Simplicidade.
- Excelente desempenho.
- Pouca configuração.
- Baixo consumo de memória.
- Fácil manutenção.

---

# 6. Banco de Dados Local

## SQLite

Será utilizado como banco principal da aplicação.

### Motivos

- Funcionamento offline.
- Alto desempenho.
- Confiabilidade.
- Compatibilidade com React Native.
- Facilidade de backup.

O SQLite armazenará:

- Bíblia.
- Estudos.
- Anotações.
- Marcações.
- Favoritos.
- Histórico.
- Planos de leitura.
- Configurações.

---

# 7. Banco de Dados do Backend

## PostgreSQL

Banco de dados principal do servidor.

Utilizado para:

- Contas.
- Sincronização.
- Doações.
- Conteúdo oficial.
- Estatísticas.
- Administração.

---

# 8. Backend

O backend será implementado futuramente.

Tecnologias previstas:

- Node.js
- NestJS
- TypeScript

Ou, caso haja necessidade específica:

- Python
- FastAPI

A definição final dependerá das necessidades do projeto no momento da implementação.

---

# 9. API

A comunicação entre aplicativo e servidor utilizará:

- REST API

No futuro poderá ser adicionada:

- GraphQL

caso haja necessidade de otimização das consultas.

---

# 10. Autenticação

Tecnologias previstas:

- JWT
- Refresh Token
- OAuth (futuramente)

---

# 11. Sincronização

A sincronização será realizada através da API própria do Gentium.

Características:

- Incremental.
- Baseada em alterações.
- Resolução de conflitos.
- Compatível com uso offline.

---

# 12. Inteligência Artificial

A IA será integrada futuramente através de APIs especializadas.

Possibilidades:

- OpenAI
- Google Gemini
- Modelos locais

A arquitetura permitirá troca de provedor sem necessidade de alterações significativas na aplicação.

---

# 13. Pagamentos

## Asaas

Responsável por:

- Doações únicas.
- Assinaturas.
- PIX.
- Cartão de crédito.
- Boleto.

Toda comunicação ocorrerá através do backend.

As credenciais da API nunca serão armazenadas no aplicativo.

---

# 14. Armazenamento

Arquivos enviados pelo usuário poderão ser armazenados em:

- Armazenamento local.
- Armazenamento em nuvem (futuro).

---

# 15. Testes

Ferramentas previstas:

- Jest.
- React Native Testing Library.
- Detox.

Tipos de testes:

- Unitários.
- Integração.
- Interface.
- Fluxo completo.

---

# 16. Qualidade de Código

Ferramentas:

- ESLint.
- Prettier.
- Husky.
- lint-staged.

Objetivos:

- Padronização.
- Legibilidade.
- Redução de erros.
- Código consistente.

---

# 17. Controle de Versão

Git será utilizado como sistema de versionamento.

Plataforma:

- GitHub.

Estratégia de desenvolvimento:

- Git Flow simplificado.
- Pull Requests.
- Revisão de código.

---

# 18. Documentação

Toda documentação será escrita em:

- Markdown.

Os documentos farão parte do próprio repositório.

---

# 19. Futuras Tecnologias

Conforme a evolução do Gentium poderão ser incorporadas novas tecnologias.

Entre elas:

- Docker.
- Redis.
- Elasticsearch.
- RabbitMQ.
- Kubernetes.
- Firebase Cloud Messaging.
- Cloudflare.
- CDN para conteúdos.
- MinIO para armazenamento.

Essas tecnologias somente serão adicionadas quando houver necessidade real.

---

# 20. Considerações Finais

A escolha das tecnologias do Gentium prioriza estabilidade, desempenho e facilidade de manutenção.

O projeto será desenvolvido com uma arquitetura moderna e escalável, permitindo crescimento contínuo sem comprometer a simplicidade do MVP.

Todas as tecnologias adotadas deverão seguir boas práticas de desenvolvimento e possuir documentação adequada para facilitar futuras contribuições ao projeto.
