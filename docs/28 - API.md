# API

**Versão:** 1.0
**Autor:** Kairo Chácara

---

# 1. Introdução

Este documento descreve a API prevista para o Gentium.

A API será utilizada para funcionalidades online, como autenticação, sincronização, doações via Asaas, inteligência artificial, backup, pacotes de conteúdo e administração.

O aplicativo continuará funcionando offline para as funcionalidades essenciais.

---

# 2. Objetivos

A API deverá permitir:

- Criar e autenticar usuários.
- Sincronizar dados entre dispositivos.
- Realizar backups.
- Restaurar dados.
- Integrar doações com Asaas.
- Processar solicitações de IA.
- Distribuir pacotes de conteúdo.
- Gerenciar estudos oficiais.
- Registrar eventos importantes do sistema.

---

# 3. Arquitetura Geral

Fluxo básico:

```text
Aplicativo Mobile
      ↓
API Gentium
      ↓
Banco de Dados / Serviços Externos
```

Serviços externos previstos:

```text
Asaas
Provedor de IA
Armazenamento de arquivos
Serviço de e-mail
```

---

# 4. Tecnologia Prevista

Stack sugerida:

```text
Backend: NestJS + TypeScript
Banco: PostgreSQL
ORM: Prisma
Cache futuro: Redis
Autenticação: JWT + Refresh Token
Documentação: OpenAPI / Swagger
```

---

# 5. Padrão de Rotas

As rotas seguirão o padrão REST.

Exemplo:

```text
GET    /users/me
POST   /auth/login
POST   /sync/push
POST   /donations/checkout
GET    /content/packages
POST   /ai/ask
```

---

# 6. Autenticação

Rotas principais:

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
```

---

# 7. Usuário

Rotas:

```text
GET    /users/me
PATCH  /users/me
DELETE /users/me
```

Responsabilidades:

- Consultar perfil.
- Editar dados.
- Excluir conta.

---

# 8. Sincronização

Rotas:

```text
POST /sync/push
GET  /sync/pull
POST /sync/resolve-conflict
GET  /sync/status
```

Dados sincronizáveis:

- Anotações.
- Marcações.
- Favoritos.
- Coleções.
- Progresso.
- Configurações.
- Estatísticas.

---

# 9. Backup

Rotas:

```text
POST /backup/create
GET  /backup/list
POST /backup/restore
DELETE /backup/:id
```

---

# 10. Doações

Rotas:

```text
POST /donations/checkout
GET  /donations/history
GET  /donations/subscription
POST /donations/subscription
PATCH /donations/subscription/cancel
```

---

# 11. Webhooks do Asaas

Rotas internas:

```text
POST /webhooks/asaas
```

Responsabilidades:

- Receber eventos de pagamento.
- Confirmar doações.
- Atualizar assinaturas.
- Registrar falhas.
- Registrar cancelamentos.

---

# 12. Inteligência Artificial

Rotas:

```text
POST /ai/ask
POST /ai/explain-verse
POST /ai/summarize
POST /ai/generate-quiz
POST /ai/suggest-studies
```

A IA sempre será acessada pelo backend, nunca diretamente pelo aplicativo.

---

# 13. Pacotes de Conteúdo

Rotas:

```text
GET /content/packages
GET /content/packages/:id
GET /content/packages/:id/download
GET /content/packages/updates
```

Tipos de pacotes:

- Bíblia.
- Texto original.
- Interlinear.
- Léxico.
- Strong.
- Estudos.
- Planos de leitura.
- Comentários.

---

# 14. Estudos

Rotas:

```text
GET /studies
GET /studies/:id
GET /studies/categories
GET /studies/:id/download
```

---

# 15. Planos de Leitura

Rotas:

```text
GET /reading-plans
GET /reading-plans/:id
GET /reading-plans/:id/download
```

---

# 16. Administração

Rotas administrativas:

```text
POST   /admin/content/packages
PATCH  /admin/content/packages/:id
DELETE /admin/content/packages/:id

POST   /admin/studies
PATCH  /admin/studies/:id
DELETE /admin/studies/:id

POST   /admin/reading-plans
PATCH  /admin/reading-plans/:id
DELETE /admin/reading-plans/:id
```

Essas rotas exigirão permissão administrativa.

---

# 17. Permissões

Níveis previstos:

```text
guest
user
supporter
admin
super_admin
```

Observação:

O nível `supporter` poderá identificar doadores, mas não deverá bloquear funcionalidades essenciais para usuários gratuitos.

---

# 18. Respostas da API

Padrão de sucesso:

```json
{
  "success": true,
  "data": {}
}
```

Padrão de erro:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem amigável ao usuário"
  }
}
```

---

# 19. Paginação

Listagens deverão suportar paginação.

Exemplo:

```text
GET /studies?page=1&limit=20
```

Resposta:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

---

# 20. Segurança

A API deverá:

- Usar HTTPS.
- Validar todas as entradas.
- Proteger rotas privadas.
- Registrar eventos críticos.
- Não expor chaves secretas.
- Proteger webhooks.
- Aplicar rate limiting.

---

# 21. Versionamento

A API deverá possuir versionamento.

Exemplo:

```text
/api/v1/auth/login
/api/v1/sync/push
/api/v1/donations/checkout
```

---

# 22. Considerações Finais

A API do Gentium será responsável apenas pelos recursos online.

O aplicativo mobile continuará funcionando offline para leitura bíblica, anotações, marcações, favoritos, estudos baixados e planos locais.

A API deverá ser segura, modular, documentada e preparada para crescimento futuro.
