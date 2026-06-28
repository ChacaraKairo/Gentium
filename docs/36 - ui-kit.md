# UI Kit

**Versão:** 1.0
**Documento:** 36-ui-kit.md
**Autor:** Kairo Chácara

---

# 1. Introdução

Este documento define o UI Kit oficial do Gentium.

O UI Kit reúne os componentes visuais reutilizáveis que serão utilizados em toda a aplicação, garantindo consistência, acessibilidade, manutenção simples e velocidade no desenvolvimento.

Todos os componentes deverão seguir a filosofia visual definida no documento `35-design-system.md`.

---

# 2. Princípios dos Componentes

Todos os componentes deverão ser:

- Reutilizáveis.
- Acessíveis.
- Responsivos.
- Consistentes.
- Simples.
- Personalizáveis quando necessário.
- Compatíveis com tema claro, escuro e AMOLED.

---

# 3. Tokens de Design

Os componentes deverão utilizar tokens centralizados.

Exemplos:

```ts
colors.primary;
colors.background;
colors.surface;
colors.text;
spacing.sm;
spacing.md;
radius.lg;
typography.body;
typography.title;
```

Nenhum componente deverá utilizar valores soltos diretamente no código.

---

# 4. Botões

## PrimaryButton

Usado para ações principais.

Exemplos:

- Continuar leitura.
- Iniciar plano.
- Salvar anotação.
- Apoiar o Gentium.

Estados:

- Normal.
- Pressionado.
- Carregando.
- Desabilitado.

---

## SecondaryButton

Usado para ações secundárias.

Exemplos:

- Cancelar.
- Ver detalhes.
- Editar.

---

## GhostButton

Botão discreto, sem fundo.

Usado em ações leves, links internos e opções secundárias.

---

## IconButton

Botão apenas com ícone.

Usado em:

- Pesquisa.
- Favoritos.
- Configurações.
- Compartilhar.
- Voltar.

---

# 5. Campos de Texto

## TextInput

Campo padrão para entrada de texto.

Usado em:

- Pesquisa.
- Título de anotação.
- Nome de coleção.
- Nome de plano.

Estados:

- Normal.
- Focado.
- Erro.
- Desabilitado.

---

## TextArea

Campo de texto longo.

Usado em:

- Anotações.
- Estudos.
- Reflexões.
- Descrições.

---

## SearchInput

Campo especializado para pesquisa.

Características:

- Ícone de busca.
- Limpar texto.
- Sugestões futuras.
- Histórico de pesquisa.

---

# 6. Cards

## BaseCard

Componente base para cartões.

Usado como estrutura para outros cards.

---

## VerseCard

Exibe um versículo ou trecho bíblico.

Conteúdo:

- Referência.
- Texto.
- Ações rápidas.
- Indicadores de marcação ou anotação.

---

## StudyCard

Exibe um estudo, curso ou lição.

Conteúdo:

- Título.
- Descrição.
- Progresso.
- Categoria.
- Nível.

---

## ReadingPlanCard

Exibe um plano de leitura.

Conteúdo:

- Nome.
- Descrição.
- Duração.
- Progresso.
- Status.

---

## NoteCard

Exibe uma anotação.

Conteúdo:

- Título.
- Trecho do conteúdo.
- Referência vinculada.
- Tags.
- Data.

---

## DonationCard

Exibe opção de apoio ao Gentium.

Conteúdo:

- Valor.
- Tipo.
- Descrição.
- Benefício simbólico.

---

# 7. Listas

## ListItem

Item padrão de lista.

Usado em:

- Configurações.
- Menu Mais.
- Livros da Bíblia.
- Estudos.
- Ferramentas.

---

## BibleBookItem

Item específico para livro bíblico.

Conteúdo:

- Nome do livro.
- Testamento.
- Progresso opcional.

---

## ChapterItem

Item específico para capítulo.

Conteúdo:

- Número do capítulo.
- Status de leitura.
- Indicadores de anotações ou marcações.

---

# 8. Navegação

## AppHeader

Cabeçalho padrão.

Conteúdo:

- Título.
- Botão voltar.
- Ações opcionais.
- Pesquisa opcional.

---

## BottomNavigation

Barra principal inferior.

Itens:

- Início.
- Bíblia.
- Estudos.
- Anotações.
- Mais.

---

## TabBar

Abas internas.

Usada em:

- Estudos.
- Planos.
- Anotações.
- Favoritos.

---

## DrawerMenu

Menu lateral futuro para tablets, web ou desktop.

---

# 9. Modais e Diálogos

## Modal

Usado para conteúdos temporários.

---

## ConfirmDialog

Usado para confirmação de ações importantes.

Exemplos:

- Excluir anotação.
- Remover marcação.
- Cancelar assinatura.
- Limpar dados locais.

---

## BottomSheet

Usado para ações rápidas.

Exemplos:

- Ações do versículo.
- Escolha de cor.
- Opções de leitura.
- Filtros.

---

# 10. Componentes Bíblicos

## BibleReader

Componente principal de leitura bíblica.

Responsável por:

- Exibir capítulos.
- Exibir versículos.
- Controlar seleção.
- Aplicar marcações.
- Abrir anotações.
- Alternar modos de leitura.

---

## VerseText

Renderiza o texto de um versículo.

Deverá suportar:

- Marcação.
- Seleção.
- Anotações.
- Texto original.
- Transliteração.
- Interlinear.

---

## VerseActions

Menu de ações de um versículo.

Ações:

- Copiar.
- Compartilhar.
- Favoritar.
- Marcar.
- Anotar.
- Perguntar à IA.

---

## OriginalWord

Componente para palavra em idioma original.

Deverá permitir toque para abrir detalhes linguísticos.

---

## InterlinearRow

Exibe palavra original, transliteração e tradução literal.

---

# 11. Componentes de Estudo

## CourseCard

Exibe curso completo.

---

## ModuleCard

Exibe módulo de curso.

---

## LessonCard

Exibe lição individual.

---

## ProgressBar

Exibe progresso do usuário.

---

## StudyReference

Exibe referência bíblica clicável.

---

# 12. Componentes de Anotações

## NoteEditor

Editor de anotações.

Deverá suportar:

- Texto.
- Tags.
- Referências.
- Salvamento automático futuro.

---

## TagChip

Chip para etiquetas.

---

## CategorySelector

Selecionador de categorias.

---

# 13. Componentes de Marcações

## ColorPicker

Selecionador de cores.

---

## HighlightLegend

Legenda de cores e significados.

---

## HighlightChip

Representa uma marcação aplicada.

---

# 14. Componentes de Gamificação

## XPBadge

Exibe XP.

---

## StreakIndicator

Exibe sequência diária.

---

## AchievementCard

Exibe conquista.

---

## MissionCard

Exibe missão.

---

# 15. Componentes de Estados

## LoadingState

Estado de carregamento.

---

## EmptyState

Estado vazio.

Exemplos:

- Nenhuma anotação.
- Nenhum favorito.
- Nenhum estudo iniciado.

---

## ErrorState

Estado de erro.

Deverá explicar o problema de forma simples.

---

## OfflineState

Indica que o usuário está offline.

---

# 16. Feedback

## Toast

Mensagem curta.

---

## Snackbar

Mensagem com ação.

Exemplo:

“Anotação excluída” + “Desfazer”.

---

## AlertBanner

Aviso persistente.

Usado para:

- Sem conexão.
- Erro de sincronização.
- Atualização disponível.

---

# 17. Formulários

## FormField

Estrutura padrão para campos.

---

## FormError

Mensagem de erro.

---

## FormLabel

Rótulo do campo.

---

# 18. Componentes de Configuração

## SettingItem

Linha de configuração.

---

## SwitchItem

Configuração com liga/desliga.

---

## SelectItem

Configuração com seleção.

---

## ThemeSelector

Seleciona tema claro, escuro ou AMOLED.

---

# 19. Componentes de Doação

## DonationAmountButton

Botão de valor sugerido.

---

## DonationFrequencySelector

Seleciona:

- Doação única.
- Assinatura mensal.

---

## SupporterBadge

Selo simbólico de apoiador.

---

# 20. Animações

Componentes poderão utilizar animações sutis.

Exemplos:

- Pressionar botão.
- Trocar aba.
- Abrir modal.
- Virar página.
- Favoritar.
- Concluir leitura.

As animações nunca deverão prejudicar desempenho ou acessibilidade.

---

# 21. Acessibilidade

Todos os componentes deverão possuir:

- Área mínima de toque.
- Labels acessíveis.
- Contraste adequado.
- Suporte a leitores de tela.
- Estados visuais claros.

---

# 22. Convenção de Nomes

Componentes deverão utilizar PascalCase.

Exemplos:

```text
PrimaryButton
VerseCard
BibleReader
StudyCard
NoteEditor
ColorPicker
```

Arquivos:

```text
PrimaryButton.tsx
VerseCard.tsx
BibleReader.tsx
```

---

# 23. Estrutura Recomendada

```text
src/
└── shared/
    └── components/
        ├── buttons/
        ├── inputs/
        ├── cards/
        ├── lists/
        ├── navigation/
        ├── modals/
        ├── feedback/
        ├── bible/
        ├── study/
        ├── notes/
        ├── highlights/
        ├── gamification/
        └── settings/
```

---

# 24. Considerações Finais

O UI Kit do Gentium deverá garantir consistência visual e funcional em toda a aplicação.

Todo novo componente deverá ser criado apenas quando não houver um componente existente que atenda à necessidade.

A prioridade será manter a interface simples, elegante, acessível e alinhada ao conceito **Modern Sacred Design**.
