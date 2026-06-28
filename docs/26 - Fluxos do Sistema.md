# Fluxos do Sistema

**Versão:** 1.0
**Autor:** Kairo Chácara

---

# 1. Introdução

Este documento descreve os principais fluxos de uso do Gentium.

Os fluxos representam os caminhos que o usuário seguirá dentro do aplicativo para realizar ações importantes, como ler a Bíblia, criar anotações, fazer marcações, estudar, seguir planos de leitura, doar, sincronizar dados e utilizar recursos de IA.

---

# 2. Fluxo de Primeiro Acesso

```text
Abrir aplicativo
↓
Splash Screen
↓
Tela de boas-vindas
↓
Aceitar termos
↓
Escolher idioma
↓
Escolher tema
↓
Baixar primeira versão bíblica
↓
Tela inicial
```

---

# 3. Fluxo de Abertura Recorrente

```text
Abrir aplicativo
↓
Carregar configurações locais
↓
Verificar última leitura
↓
Verificar conexão
↓
Tela inicial
```

Se houver última leitura:

```text
Tela inicial
↓
Continuar leitura
↓
Último livro/capítulo/versículo
```

---

# 4. Fluxo de Leitura da Bíblia

```text
Tela inicial
↓
Bíblia
↓
Selecionar versão
↓
Selecionar livro
↓
Selecionar capítulo
↓
Ler versículos
```

Ações disponíveis durante a leitura:

- Marcar.
- Anotar.
- Favoritar.
- Compartilhar.
- Copiar.
- Comparar traduções.
- Abrir texto original.
- Abrir interlinear.

---

# 5. Fluxo de Texto Original

```text
Tela de leitura
↓
Selecionar modo de visualização
↓
Texto original
↓
Escolher idioma original
↓
Visualizar caracteres originais
```

Modos disponíveis:

- Original.
- Transliteração.
- Original + tradução.
- Original + transliteração.
- Interlinear.

---

# 6. Fluxo de Palavra Original

```text
Texto original
↓
Tocar em uma palavra
↓
Abrir painel linguístico
↓
Exibir transliteração
↓
Exibir significado
↓
Exibir Strong
↓
Exibir morfologia
↓
Exibir ocorrências
```

---

# 7. Fluxo de Pesquisa Bíblica

```text
Tela inicial
↓
Pesquisa
↓
Digitar palavra, frase ou referência
↓
Exibir resultados
↓
Selecionar resultado
↓
Abrir passagem bíblica
```

Tipos de pesquisa:

- Palavra.
- Frase.
- Referência.
- Livro.
- Capítulo.
- Versículo.
- Strong.
- Palavra original.
- Transliteração.

---

# 8. Fluxo de Anotação

```text
Selecionar versículo
↓
Criar anotação
↓
Escrever conteúdo
↓
Adicionar tags
↓
Salvar
```

Consulta posterior:

```text
Tela inicial
↓
Anotações
↓
Pesquisar ou filtrar
↓
Abrir anotação
↓
Editar ou excluir
```

---

# 9. Fluxo de Marcação

```text
Selecionar versículo
↓
Escolher cor
↓
Adicionar categoria opcional
↓
Adicionar observação opcional
↓
Salvar marcação
```

Consulta posterior:

```text
Tela inicial
↓
Marcações
↓
Filtrar por cor, categoria ou livro
↓
Abrir versículo marcado
```

---

# 10. Fluxo de Favoritos

```text
Selecionar versículo
↓
Favoritar
↓
Escolher coleção
↓
Salvar
```

Consulta posterior:

```text
Tela inicial
↓
Favoritos
↓
Selecionar coleção
↓
Abrir item salvo
```

---

# 11. Fluxo de Estudos

```text
Tela inicial
↓
Estudos
↓
Selecionar área
↓
Selecionar curso
↓
Selecionar módulo
↓
Abrir lição
↓
Concluir lição
↓
Atualizar progresso
```

Durante a lição, o usuário poderá:

- Abrir referências bíblicas.
- Criar anotações.
- Marcar versículos.
- Consultar IA.
- Ver estudos relacionados.

---

# 12. Fluxo de Plano de Leitura

```text
Tela inicial
↓
Planos de leitura
↓
Escolher plano
↓
Iniciar plano
↓
Abrir leitura do dia
↓
Concluir leitura
↓
Atualizar progresso
```

Caso o usuário atrase:

```text
Plano em andamento
↓
Dia pendente
↓
Reagendar, concluir ou ignorar
```

---

# 13. Fluxo de Gamificação

```text
Usuário realiza atividade
↓
Sistema valida atividade
↓
Concede XP
↓
Atualiza sequência
↓
Verifica conquistas
↓
Atualiza estatísticas
```

Atividades válidas:

- Leitura.
- Estudo.
- Revisão.
- Plano concluído.
- Anotação criada.
- Exercício respondido.

---

# 14. Fluxo de Inteligência Artificial

```text
Usuário seleciona conteúdo
↓
Perguntar à IA
↓
Enviar solicitação ao backend
↓
Processar resposta
↓
Exibir resposta identificada como IA
```

A IA poderá ser usada em:

- Versículos.
- Estudos.
- Anotações.
- Planos.
- Pesquisa.
- Idiomas originais.

---

# 15. Fluxo de Doação Única

```text
Tela inicial
↓
Apoie o Gentium
↓
Doação única
↓
Escolher valor
↓
Informar dados necessários
↓
Gerar cobrança via Asaas
↓
Realizar pagamento
↓
Exibir confirmação
```

---

# 16. Fluxo de Assinatura de Doação

```text
Tela inicial
↓
Apoie o Gentium
↓
Assinatura mensal
↓
Escolher valor
↓
Confirmar assinatura
↓
Criar assinatura via Asaas
↓
Exibir status
```

Cancelamento:

```text
Configurações
↓
Doações
↓
Minha assinatura
↓
Cancelar assinatura
↓
Confirmar cancelamento
```

---

# 17. Fluxo de Sincronização

```text
Usuário altera dado local
↓
Registro marcado como pendente
↓
Conexão disponível
↓
Enviar alteração ao servidor
↓
Receber confirmação
↓
Marcar como sincronizado
```

Em caso de conflito:

```text
Conflito detectado
↓
Exibir opções ao usuário
↓
Manter local, manter remoto ou mesclar
↓
Salvar decisão
```

---

# 18. Fluxo de Backup

```text
Configurações
↓
Backup
↓
Criar backup
↓
Selecionar local
↓
Gerar arquivo
↓
Exibir confirmação
```

Restauração:

```text
Configurações
↓
Backup
↓
Restaurar backup
↓
Selecionar arquivo
↓
Validar dados
↓
Restaurar informações
```

---

# 19. Fluxo Offline

```text
Sem conexão
↓
Manter Bíblia disponível
↓
Manter estudos baixados
↓
Permitir anotações
↓
Permitir marcações
↓
Salvar alterações localmente
↓
Sincronizar quando a conexão voltar
```

Recursos indisponíveis offline:

- IA.
- Doações.
- Sincronização.
- Download de novos pacotes.

---

# 20. Fluxo de Configurações

```text
Tela inicial
↓
Configurações
↓
Selecionar categoria
↓
Alterar preferência
↓
Salvar localmente
```

Categorias:

- Aparência.
- Leitura.
- Bíblia.
- Idioma.
- Notificações.
- Sincronização.
- Backup.
- Doações.
- Privacidade.
- Sobre.

---

# 21. Fluxo de Exclusão de Dados

```text
Configurações
↓
Privacidade
↓
Excluir dados
↓
Confirmar ação
↓
Remover dados locais
↓
Solicitar remoção remota, se houver conta
```

---

# 22. Considerações Finais

Os fluxos do sistema devem manter a experiência do Gentium simples, previsível e organizada.

Todo novo módulo deverá possuir fluxos documentados antes da implementação.

A prioridade será sempre permitir que o usuário chegue rapidamente ao conteúdo bíblico, registre seus estudos e continue sua jornada de aprendizado sem obstáculos desnecessários.
