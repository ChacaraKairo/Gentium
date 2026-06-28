# Navegação

Versão: 1.0

Autor: Kairo Chácara

---

# 1. Introdução

Este documento descreve toda a estrutura de navegação do Gentium.

Seu objetivo é definir como os usuários acessarão as funcionalidades da plataforma, garantindo uma experiência intuitiva, consistente e organizada.

A navegação deverá minimizar o número de toques necessários para executar qualquer ação, priorizando sempre o acesso rápido à leitura da Bíblia e aos estudos.

---

# 2. Objetivos

A navegação deverá:

- Ser intuitiva.
- Reduzir a quantidade de toques.
- Facilitar o retorno às telas anteriores.
- Manter consistência.
- Permitir expansão futura.
- Funcionar da mesma forma em toda a aplicação.

---

# 3. Fluxo Inicial

Ao abrir o aplicativo pela primeira vez:

```text
Splash Screen
      ↓
Boas-vindas
      ↓
Aceite dos Termos
      ↓
Escolha do Tema
      ↓
Download da Bíblia (caso necessário)
      ↓
Tela Inicial
```

Usuários que já utilizaram o aplicativo:

```text
Splash Screen
      ↓
Tela Inicial
```

---

# 4. Tela Inicial (Home)

A Home será o ponto central da aplicação.

Ela deverá apresentar:

- Continuar leitura.
- Apoie o Gentium.
- Bíblia.
- Estudos.
- Planos de leitura.
- Pesquisa.
- Anotações.
- Favoritos.
- Configurações.

Também poderá exibir:

- Sequência diária.
- Progresso semanal.
- Recomendações.
- Novidades.

---

# 5. Navegação Principal

Estrutura sugerida:

```text
Home
│
├── Bíblia
├── Estudos
├── Pesquisa
├── Biblioteca
├── Configurações
```

Essa estrutura poderá evoluir conforme novos módulos forem adicionados.

---

# 6. Fluxo da Bíblia

```text
Home
 ↓
Bíblia
 ↓
Escolha da Versão
 ↓
Livro
 ↓
Capítulo
 ↓
Versículo
```

A partir do versículo:

- Criar anotação.
- Destacar.
- Favoritar.
- Compartilhar.
- Copiar.
- Abrir estudo relacionado.

---

# 7. Fluxo dos Estudos

```text
Home
 ↓
Estudos
 ↓
Categorias
 ↓
Estudo
 ↓
Capítulos
 ↓
Conclusão
```

Ao finalizar:

- Próximo estudo.
- Revisão.
- Exercícios (futuro).
- Registrar progresso.

---

# 8. Fluxo das Anotações

```text
Home
 ↓
Anotações
 ↓
Lista
 ↓
Detalhes
 ↓
Editar
```

Também será possível criar uma anotação diretamente durante a leitura da Bíblia.

---

# 9. Fluxo das Marcações

```text
Versículo
 ↓
Selecionar texto
 ↓
Escolher cor
 ↓
Salvar
```

Posteriormente:

```text
Marcações
 ↓
Lista
 ↓
Filtro
 ↓
Versículo
```

---

# 10. Fluxo dos Favoritos

```text
Versículo
 ↓
Favoritar
 ↓
Escolher coleção
 ↓
Salvar
```

Consulta:

```text
Favoritos
 ↓
Coleções
 ↓
Versículos
```

---

# 11. Fluxo dos Planos de Leitura

```text
Home
 ↓
Planos
 ↓
Escolher Plano
 ↓
Iniciar
 ↓
Leitura Diária
 ↓
Registrar Conclusão
```

---

# 12. Fluxo da Pesquisa

```text
Pesquisa
 ↓
Digite a consulta
 ↓
Resultados
```

Os resultados poderão abrir:

- Livro.
- Capítulo.
- Versículo.
- Estudo.
- Anotação.

---

# 13. Fluxo das Doações

O acesso às doações será possível pela tela inicial e pelas configurações.

Fluxo:

```text
Home
 ↓
Apoie o Gentium
 ↓
Escolha o tipo

├── Doação única
└── Assinatura mensal

      ↓

Escolha do valor

      ↓

Pagamento

      ↓

Confirmação
```

Também será possível:

- Alterar assinatura.
- Cancelar assinatura.
- Consultar histórico.

---

# 14. Fluxo da Conta

```text
Perfil
 ↓
Entrar

ou

Criar Conta
```

Depois:

```text
Perfil
 ↓
Editar Perfil
 ↓
Sincronização
 ↓
Segurança
```

---

# 15. Fluxo das Configurações

```text
Configurações
│
├── Aparência
├── Bíblia
├── Leitura
├── Notificações
├── Idioma
├── Backup
├── Sincronização
├── Doações
├── Sobre
└── Privacidade
```

---

# 16. Fluxo da Inteligência Artificial

```text
Versículo
 ↓
Perguntar à IA
 ↓
Resposta
 ↓
Sugestões relacionadas
```

Também poderá ser acessada por:

```text
Pesquisa
 ↓
Assistente
```

---

# 17. Fluxo da Gamificação

```text
Home
 ↓
Meu Progresso
 ↓
XP
 ↓
Conquistas
 ↓
Sequência
 ↓
Missões
```

---

# 18. Fluxo Offline

Quando não houver internet:

- Bíblia continuará funcionando.
- Estudos baixados permanecerão disponíveis.
- Anotações funcionarão normalmente.
- Marcações continuarão disponíveis.
- Favoritos continuarão disponíveis.

Recursos indisponíveis:

- IA.
- Sincronização.
- Doações.
- Atualizações.

---

# 19. Fluxo Futuro

Novos módulos deverão integrar-se naturalmente à navegação.

Exemplos:

```text
Cursos

Comunidade

Dicionário Bíblico

Léxico

Mapas

Cronologias

Árvore Genealógica

Comentários Bíblicos
```

Nenhum novo módulo deverá quebrar a estrutura principal da navegação.

---

# 20. Regras Gerais

A navegação deverá respeitar as seguintes regras:

- Nunca mais que três níveis de profundidade para funções comuns.
- Sempre permitir retorno fácil.
- Evitar telas sem saída.
- Reduzir número de toques.
- Manter consistência entre Android e iOS.
- Preservar contexto ao alternar entre módulos.

---

# 21. Considerações Finais

A navegação do Gentium deverá ser simples para novos usuários e eficiente para usuários experientes.

Toda nova funcionalidade deverá integrar-se à estrutura existente sem aumentar desnecessariamente a complexidade da aplicação.

O objetivo principal da navegação é permitir que o usuário encontre rapidamente o conteúdo desejado, mantendo o foco no estudo das Escrituras e na continuidade do aprendizado.
