# Segurança

**Versão:** 1.0
**Autor:** Kairo Chácara

---

# 1. Introdução

A segurança é um dos pilares do Gentium.

Este documento define as diretrizes para proteger os dados do usuário, garantir a integridade das informações, preservar a privacidade e assegurar que a plataforma opere de maneira confiável.

Todas as funcionalidades do Gentium deverão seguir as diretrizes estabelecidas neste documento.

---

# 2. Objetivos

O sistema deverá:

- Proteger os dados do usuário.
- Garantir a confidencialidade das informações.
- Preservar a integridade dos dados.
- Garantir disponibilidade.
- Evitar perda de informações.
- Proteger a comunicação entre cliente e servidor.
- Reduzir riscos de ataques.

---

# 3. Princípios

A segurança do Gentium será baseada nos seguintes princípios:

- Menor privilégio.
- Defesa em profundidade.
- Segurança por padrão.
- Privacidade desde a concepção (Privacy by Design).
- Segurança desde a concepção (Security by Design).
- Transparência.
- Atualização contínua.

---

# 4. Autenticação

Quando o usuário optar por utilizar uma conta, o sistema deverá oferecer autenticação segura.

Métodos previstos:

- E-mail e senha.
- Google.
- Apple.
- Outros provedores futuramente.

As senhas nunca serão armazenadas em texto puro.

---

# 5. Armazenamento de Senhas

No servidor:

- Utilizar algoritmos modernos para hash de senhas.
- Utilizar salt individual.
- Nunca armazenar senhas em texto simples.

O aplicativo nunca deverá conhecer a senha original do usuário após o envio ao servidor.

---

# 6. Comunicação

Toda comunicação entre o aplicativo e os servidores deverá utilizar:

- HTTPS.
- TLS atualizado.

Conexões inseguras deverão ser rejeitadas.

---

# 7. Tokens

O sistema utilizará autenticação baseada em tokens.

Características:

- Expiração automática.
- Renovação segura.
- Revogação quando necessário.

Tokens deverão ser armazenados em armazenamento seguro do dispositivo.

---

# 8. Dados Locais

As informações armazenadas no dispositivo deverão ser protegidas.

Dados como:

- Conta.
- Tokens.
- Configurações sensíveis.

deverão utilizar armazenamento seguro fornecido pelo sistema operacional.

---

# 9. Dados Sincronizados

Todos os dados enviados ao servidor deverão ser transmitidos de forma criptografada.

Durante a sincronização, deverão ser enviados apenas os registros necessários.

---

# 10. Proteção contra Perda de Dados

O sistema deverá possuir mecanismos para:

- Backup.
- Recuperação.
- Sincronização.
- Controle de conflitos.

Nenhuma atualização deverá apagar informações do usuário sem confirmação.

---

# 11. Exclusão de Dados

O usuário poderá:

- Excluir uma anotação.
- Excluir um estudo.
- Excluir sua conta.
- Solicitar a remoção definitiva dos dados sincronizados.

A exclusão deverá seguir a legislação aplicável sobre proteção de dados.

---

# 12. Privacidade

O Gentium compromete-se a:

- Não vender dados.
- Não compartilhar informações pessoais sem autorização.
- Coletar apenas os dados necessários para o funcionamento da plataforma.
- Informar claramente quais dados são coletados e por quê.

---

# 13. Permissões

O aplicativo solicitará apenas permissões realmente necessárias.

Exemplos:

- Armazenamento (quando necessário).
- Notificações.
- Câmera (para recursos futuros).
- Microfone (para recursos futuros).

Cada permissão deverá possuir uma justificativa clara para o usuário.

---

# 14. Inteligência Artificial

A IA somente terá acesso às informações necessárias para responder à solicitação do usuário.

Sempre que possível:

- Dados pessoais deverão ser removidos antes do envio.
- O usuário deverá saber quando seus dados forem utilizados pela IA.

---

# 15. Integração com Asaas

As integrações financeiras deverão ocorrer exclusivamente através do backend do Gentium.

O aplicativo nunca armazenará:

- Chaves da API.
- Credenciais administrativas.
- Tokens privados.

As operações financeiras deverão utilizar apenas as APIs oficiais do Asaas.

---

# 16. Auditoria

O sistema poderá registrar eventos importantes para diagnóstico e segurança.

Exemplos:

- Login.
- Alteração de senha.
- Início de sincronização.
- Falhas de autenticação.
- Erros críticos.

Esses registros não deverão conter informações sensíveis desnecessárias.

---

# 17. Atualizações

O Gentium deverá receber atualizações periódicas para:

- Correção de vulnerabilidades.
- Atualização de dependências.
- Melhorias de segurança.
- Adequação a novas exigências legais.

---

# 18. Dependências

Bibliotecas utilizadas no projeto deverão:

- Ser mantidas atualizadas.
- Possuir boa reputação.
- Ter manutenção ativa.
- Ser revisadas periodicamente.

Dependências abandonadas deverão ser substituídas.

---

# 19. Recuperação de Conta

O usuário poderá recuperar sua conta utilizando mecanismos seguros.

Exemplos:

- Link enviado por e-mail.
- Login social.

As etapas deverão impedir acesso não autorizado.

---

# 20. Boas Práticas

Durante o desenvolvimento deverão ser adotadas práticas como:

- Validação de entradas.
- Sanitização de dados.
- Tratamento de erros.
- Controle de acesso.
- Proteção contra ataques comuns.
- Revisão de código.
- Testes de segurança.

---

# 21. Conformidade

O Gentium buscará conformidade com legislações e boas práticas relacionadas à proteção de dados, incluindo:

- LGPD (Brasil).
- GDPR (quando aplicável).
- OWASP Mobile Application Security.

---

# 22. Responsabilidade do Usuário

O usuário será orientado a:

- Utilizar senhas fortes.
- Manter seu dispositivo protegido.
- Não compartilhar suas credenciais.
- Atualizar regularmente o aplicativo.

---

# 23. Evolução

Novas funcionalidades deverão ser avaliadas sob a perspectiva de segurança antes de sua implementação.

Nenhum recurso poderá comprometer a integridade, a privacidade ou a disponibilidade da plataforma.

---

# 24. Considerações Finais

A segurança do Gentium deverá estar presente em todas as etapas do desenvolvimento.

A proteção dos dados dos usuários, a privacidade das informações e a confiabilidade da plataforma são requisitos fundamentais para que o Gentium possa cumprir sua missão de servir como uma ferramenta segura e duradoura para o estudo das Escrituras.

Todas as decisões técnicas deverão considerar a segurança como requisito essencial, e não como um recurso opcional.
