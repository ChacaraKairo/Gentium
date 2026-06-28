# Bíblia Offline

**Versão:** 1.0
**Autor:** Kairo Chácara

---

# 1. Introdução

A Bíblia é o núcleo do Gentium.

Toda a plataforma foi concebida para que a leitura e o estudo das Escrituras possam ser realizados de forma rápida, organizada e completamente funcional mesmo sem conexão com a internet.

O usuário deverá ser capaz de utilizar praticamente todos os recursos essenciais do aplicativo em modo offline, incluindo leitura, pesquisa, anotações, marcações, estudos baixados e acesso aos idiomas originais.

---

# 2. Objetivos

O módulo Bíblia Offline deverá permitir:

- Leitura completa das Escrituras sem internet.
- Pesquisa rápida em todo o texto bíblico.
- Navegação simples entre livros, capítulos e versículos.
- Utilização de diversas traduções.
- Consulta aos textos originais.
- Comparação entre versões.
- Criação de anotações.
- Marcações coloridas.
- Favoritos.
- Histórico de leitura.
- Integração com estudos.
- Funcionamento rápido mesmo em dispositivos básicos.

---

# 3. Princípios

A Bíblia deverá seguir os seguintes princípios:

- Funcionamento Offline First.
- Fidelidade ao texto bíblico.
- Alto desempenho.
- Facilidade de leitura.
- Respeito aos direitos autorais das traduções.
- Baixo consumo de memória.
- Interface limpa.
- Experiência de leitura confortável.

---

# 4. Estrutura da Bíblia

Cada Bíblia será organizada da seguinte forma:

```text
Versão
    ↓
Testamento
    ↓
Livro
    ↓
Capítulo
    ↓
Versículo
```

Essa estrutura será comum a todas as traduções disponíveis.

---

# 5. Traduções

O Gentium permitirá instalar diversas traduções.

Exemplos:

- Almeida Revista e Corrigida (ARC)
- Almeida Revista e Atualizada (ARA)
- Nova Almeida Atualizada (NAA)
- Nova Versão Internacional (NVI)\*
- King James Version (KJV)
- English Standard Version (ESV)\*
- Outras versões autorizadas

\*Respeitando as licenças e direitos autorais.

Cada tradução poderá ser instalada ou removida individualmente.

---

# 6. Idiomas Originais

Além das traduções, o Gentium oferecerá suporte aos textos bíblicos em seus idiomas originais.

Idiomas previstos:

- Hebraico Bíblico
- Aramaico Bíblico
- Grego Koiné

Os textos serão exibidos utilizando seus caracteres originais (Unicode), preservando a escrita conforme os manuscritos e edições críticas adotadas.

---

# 7. Transliteração

Para facilitar o estudo dos idiomas bíblicos, o usuário poderá visualizar uma transliteração utilizando caracteres do alfabeto latino.

Exemplo:

Texto original:

בְּרֵאשִׁית

Transliteração:

Bereshit

Outro exemplo:

λόγος

Logos

Esse recurso permitirá que qualquer usuário consiga ler e pronunciar os termos originais sem conhecer os alfabetos hebraico ou grego.

---

# 8. Modos de Visualização

O usuário poderá escolher entre diferentes formas de leitura.

## Tradução

Exibe apenas a tradução escolhida.

---

## Texto Original

Exibe apenas os caracteres originais.

---

## Transliteração

Exibe apenas a escrita utilizando caracteres latinos.

---

## Original + Tradução

Exibe o texto original acompanhado da tradução.

---

## Original + Transliteração

Exibe o texto original acompanhado da transliteração.

---

## Interlinear

Exibe simultaneamente:

- Texto original.
- Transliteração.
- Tradução literal.
- Tradução selecionada.

---

# 9. Informações Linguísticas

Ao tocar em qualquer palavra do texto original, o usuário poderá visualizar informações detalhadas.

Entre elas:

- Palavra original.
- Transliteração.
- Pronúncia.
- Tradução literal.
- Número Strong.
- Classe gramatical.
- Raiz da palavra.
- Morfologia.
- Definição resumida.
- Número de ocorrências.
- Primeira ocorrência.
- Última ocorrência.
- Lista completa de ocorrências.

---

# 10. Download de Conteúdo

Todo conteúdo será distribuído em pacotes independentes.

Exemplos:

```text
ARC

ARA

NAA

KJV

Texto Hebraico

Texto Grego

Texto Aramaico

Interlinear

Léxico Grego

Léxico Hebraico

Strong
```

O usuário instalará apenas os recursos desejados.

---

# 11. Estrutura dos Arquivos

Cada pacote possuirá seu próprio banco de dados.

Exemplo:

```text
database/

bibles/

arc.sqlite

ara.sqlite

naa.sqlite

greek.sqlite

hebrew.sqlite

aramaic.sqlite

strong.sqlite

lexicon.sqlite
```

Isso permitirá atualizar qualquer recurso sem afetar os demais.

---

# 12. Navegação

A navegação deverá permitir:

- Escolha da versão.
- Escolha do livro.
- Escolha do capítulo.
- Escolha do versículo.
- Mudança rápida entre capítulos.
- Mudança rápida entre livros.

Também deverá haver suporte para gestos de navegação.

---

# 13. Pesquisa

A pesquisa deverá funcionar totalmente offline.

Será possível pesquisar:

- Palavra.
- Frase.
- Referência.
- Livro.
- Capítulo.
- Versículo.
- Strong.
- Palavra hebraica.
- Palavra grega.
- Palavra transliterada.

---

# 14. Leitura

Durante a leitura o usuário poderá:

- Alterar fonte.
- Alterar tamanho.
- Alterar espaçamento.
- Alterar tema.
- Alterar brilho interno (futuro).
- Alterar modo de visualização.
- Alterar tradução.

---

# 15. Seleção de Versículos

Ao selecionar um versículo estarão disponíveis ações rápidas.

- Copiar.
- Compartilhar.
- Favoritar.
- Destacar.
- Criar anotação.
- Abrir estudo.
- Perguntar à IA (quando disponível).

---

# 16. Marcações

Cada versículo poderá possuir múltiplas marcações.

Cada marcação poderá conter:

- Cor.
- Nome.
- Categoria.
- Observação.

---

# 17. Favoritos

Os favoritos poderão ser organizados em coleções.

Exemplos:

- Promessas.
- Evangelismo.
- Sermões.
- Escola Bíblica.
- Família.
- Esperança.

---

# 18. Anotações

Cada versículo poderá possuir diversas anotações.

As anotações poderão conter:

- Texto.
- Tags.
- Links internos.
- Referências bíblicas.
- Imagens (futuro).
- Arquivos (futuro).

---

# 19. Referências Cruzadas

O sistema permitirá visualizar:

- Referências cruzadas.
- Profecias e seus cumprimentos.
- Citações entre livros.
- Paralelos entre os Evangelhos.

---

# 20. Recursos de Estudo

O módulo da Bíblia será integrado com:

- Comentários bíblicos.
- Dicionário Bíblico.
- Léxico Grego.
- Léxico Hebraico.
- Mapas.
- Cronologias.
- Árvores genealógicas.
- Estudos temáticos.
- Planos de leitura.

Todos esses recursos serão opcionais e poderão ser baixados separadamente.

---

# 21. Atualizações

As traduções e recursos poderão ser atualizados independentemente.

Nenhuma atualização poderá apagar:

- Marcações.
- Favoritos.
- Anotações.
- Histórico.
- Planos.

---

# 22. Direitos Autorais

O Gentium respeitará integralmente as licenças das traduções bíblicas.

Somente textos autorizados ou de domínio público serão distribuídos.

Quando necessário, o usuário poderá instalar traduções mediante autorização dos respectivos detentores dos direitos.

---

# 23. Desempenho

A Bíblia deverá:

- Abrir em poucos segundos.
- Navegar instantaneamente entre capítulos.
- Realizar pesquisas rápidas.
- Consumir pouca bateria.
- Funcionar em dispositivos intermediários.

---

# 24. Integração

O módulo Bíblia será integrado aos demais módulos do Gentium.

Entre eles:

- Estudos.
- IA.
- Planos de leitura.
- Gamificação.
- Anotações.
- Favoritos.
- Histórico.
- Pesquisa.
- Sincronização.

Todos esses módulos utilizarão a Bíblia como base.

---

# 25. Considerações Finais

A Bíblia Offline representa o núcleo do Gentium.

Ela deverá oferecer uma experiência de leitura e estudo comparável às melhores ferramentas acadêmicas disponíveis, mantendo uma interface simples para iniciantes e recursos avançados para estudantes, professores, líderes e pesquisadores.

O suporte aos idiomas originais, às transliterações, ao modo interlinear e às informações linguísticas permitirá que o Gentium evolua de um aplicativo de leitura para uma plataforma completa de estudo das Escrituras, preservando sempre a fidelidade ao texto bíblico e a autonomia do usuário.
