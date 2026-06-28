# Casos de Uso

**Versão:** 1.0
**Autor:** Kairo Chácara

---

# 1. Introdução

Este documento descreve os principais casos de uso do Gentium.

Os casos de uso representam as ações que os usuários poderão realizar dentro da plataforma e servem como base para desenvolvimento, testes e validação das funcionalidades.

---

# 2. Atores

## Usuário Visitante

Pessoa que utiliza o aplicativo sem criar conta.

## Usuário Autenticado

Pessoa que possui conta e utiliza sincronização, backup e recursos online.

## Administrador

Responsável por gerenciar conteúdos, estudos, pacotes, versões e configurações da plataforma.

## Sistema

Representa processos automáticos executados pelo Gentium.

---

# 3. UC-001 — Ler Bíblia Offline

**Ator:** Usuário

**Descrição:**
Permite ao usuário ler a Bíblia sem conexão com a internet.

**Fluxo principal:**

1. Usuário abre o aplicativo.
2. Acessa a Bíblia.
3. Seleciona versão, livro e capítulo.
4. O sistema exibe os versículos.

**Resultado esperado:**
Texto bíblico exibido corretamente.

---

# 4. UC-002 — Pesquisar Passagem Bíblica

**Ator:** Usuário

**Descrição:**
Permite pesquisar palavras, frases ou referências bíblicas.

**Fluxo principal:**

1. Usuário acessa Pesquisa.
2. Digita uma palavra, frase ou referência.
3. Sistema exibe resultados.
4. Usuário seleciona um resultado.
5. Sistema abre a passagem correspondente.

---

# 5. UC-003 — Criar Anotação

**Ator:** Usuário

**Descrição:**
Permite criar uma anotação vinculada a um versículo, estudo ou plano.

**Fluxo principal:**

1. Usuário seleciona um conteúdo.
2. Toca em “Criar anotação”.
3. Escreve o conteúdo.
4. Adiciona tags, se desejar.
5. Salva a anotação.

---

# 6. UC-004 — Marcar Versículo

**Ator:** Usuário

**Descrição:**
Permite destacar um versículo com cor, categoria e observação.

**Fluxo principal:**

1. Usuário seleciona um versículo.
2. Escolhe a opção de marcação.
3. Seleciona cor.
4. Adiciona categoria opcional.
5. Salva.

---

# 7. UC-005 — Favoritar Versículo

**Ator:** Usuário

**Descrição:**
Permite salvar versículos favoritos em coleções.

**Fluxo principal:**

1. Usuário seleciona um versículo.
2. Toca em “Favoritar”.
3. Escolhe uma coleção.
4. Sistema salva o favorito.

---

# 8. UC-006 — Consultar Texto Original

**Ator:** Usuário

**Descrição:**
Permite visualizar hebraico, aramaico ou grego koiné com caracteres originais, transliteração e tradução.

**Fluxo principal:**

1. Usuário abre uma passagem.
2. Escolhe modo de visualização.
3. Seleciona texto original.
4. Sistema exibe o texto original.
5. Usuário pode tocar em palavras para ver detalhes linguísticos.

---

# 9. UC-007 — Iniciar Estudo

**Ator:** Usuário

**Descrição:**
Permite iniciar um estudo ou curso bíblico.

**Fluxo principal:**

1. Usuário acessa Estudos.
2. Seleciona área, curso e lição.
3. Lê o conteúdo.
4. Conclui a lição.
5. Sistema registra progresso.

---

# 10. UC-008 — Iniciar Plano de Leitura

**Ator:** Usuário

**Descrição:**
Permite iniciar um plano de leitura bíblica.

**Fluxo principal:**

1. Usuário acessa Planos.
2. Seleciona um plano.
3. Toca em “Iniciar”.
4. Sistema cria o progresso do plano.
5. Usuário acessa a leitura diária.

---

# 11. UC-009 — Concluir Leitura Diária

**Ator:** Usuário

**Descrição:**
Permite registrar a conclusão de uma leitura diária.

**Fluxo principal:**

1. Usuário abre o plano em andamento.
2. Lê as passagens do dia.
3. Toca em “Concluir”.
4. Sistema registra progresso.
5. Sistema atualiza estatísticas e gamificação.

---

# 12. UC-010 — Receber XP e Conquista

**Ator:** Sistema

**Descrição:**
Concede XP e conquistas após atividades válidas.

**Fluxo principal:**

1. Usuário conclui uma atividade.
2. Sistema valida a ação.
3. Sistema concede XP.
4. Sistema verifica conquistas.
5. Sistema atualiza estatísticas.

---

# 13. UC-011 — Fazer Doação Única

**Ator:** Usuário

**Descrição:**
Permite realizar uma doação única para apoiar o Gentium.

**Fluxo principal:**

1. Usuário toca em “Apoie o Gentium”.
2. Escolhe “Doação única”.
3. Seleciona valor.
4. Sistema solicita criação de cobrança ao backend.
5. Backend integra com Asaas.
6. Usuário realiza pagamento.
7. Sistema exibe confirmação.

---

# 14. UC-012 — Criar Assinatura de Doação

**Ator:** Usuário

**Descrição:**
Permite criar uma doação recorrente mensal.

**Fluxo principal:**

1. Usuário acessa Doações.
2. Escolhe “Assinatura mensal”.
3. Seleciona valor.
4. Sistema solicita criação da assinatura ao backend.
5. Backend integra com Asaas.
6. Sistema exibe status da assinatura.

---

# 15. UC-013 — Cancelar Assinatura

**Ator:** Usuário autenticado

**Descrição:**
Permite cancelar uma assinatura de doação.

**Fluxo principal:**

1. Usuário acessa Configurações.
2. Entra em Doações.
3. Seleciona assinatura ativa.
4. Toca em “Cancelar”.
5. Confirma a ação.
6. Sistema solicita cancelamento ao backend.
7. Sistema exibe confirmação.

---

# 16. UC-014 — Sincronizar Dados

**Ator:** Usuário autenticado / Sistema

**Descrição:**
Permite sincronizar dados entre dispositivos.

**Fluxo principal:**

1. Usuário altera dados no aplicativo.
2. Sistema marca registros como pendentes.
3. Quando houver internet, sistema envia alterações.
4. Backend confirma recebimento.
5. Sistema marca dados como sincronizados.

---

# 17. UC-015 — Restaurar Backup

**Ator:** Usuário autenticado

**Descrição:**
Permite restaurar dados em um dispositivo novo.

**Fluxo principal:**

1. Usuário entra em sua conta.
2. Acessa Backup.
3. Seleciona backup disponível.
4. Sistema baixa os dados.
5. Sistema restaura informações locais.

---

# 18. UC-016 — Usar IA para Explicar Versículo

**Ator:** Usuário autenticado

**Descrição:**
Permite solicitar explicação de um versículo à IA.

**Fluxo principal:**

1. Usuário seleciona um versículo.
2. Toca em “Perguntar à IA”.
3. Sistema envia solicitação ao backend.
4. IA gera resposta.
5. Sistema exibe resposta identificada como IA.

---

# 19. UC-017 — Alterar Configurações de Leitura

**Ator:** Usuário

**Descrição:**
Permite personalizar a experiência de leitura.

**Fluxo principal:**

1. Usuário acessa Configurações.
2. Seleciona Leitura.
3. Altera fonte, tamanho, espaçamento ou tema.
4. Sistema salva localmente.
5. Interface atualiza a leitura.

---

# 20. UC-018 — Baixar Pacote Bíblico

**Ator:** Usuário

**Descrição:**
Permite baixar traduções, textos originais, léxicos e recursos de estudo.

**Fluxo principal:**

1. Usuário acessa Configurações.
2. Abre Pacotes.
3. Escolhe um pacote.
4. Sistema baixa o conteúdo.
5. Sistema disponibiliza o pacote offline.

---

# 21. UC-019 — Exportar Anotações

**Ator:** Usuário

**Descrição:**
Permite exportar anotações em formatos como PDF, Markdown, texto ou JSON.

**Fluxo principal:**

1. Usuário acessa Anotações.
2. Seleciona exportar.
3. Escolhe formato.
4. Sistema gera arquivo.
5. Usuário salva ou compartilha.

---

# 22. UC-020 — Excluir Conta

**Ator:** Usuário autenticado

**Descrição:**
Permite excluir conta e dados sincronizados.

**Fluxo principal:**

1. Usuário acessa Configurações.
2. Entra em Privacidade.
3. Escolhe excluir conta.
4. Confirma a ação.
5. Sistema solicita exclusão ao backend.
6. Backend remove dados conforme política definida.

---

# 23. Considerações Finais

Os casos de uso descritos neste documento representam as principais ações do Gentium.

Novos casos de uso deverão ser adicionados conforme a plataforma evoluir.

Cada funcionalidade futura deverá possuir caso de uso documentado antes da implementação, garantindo clareza, testabilidade e alinhamento com os objetivos do projeto.
