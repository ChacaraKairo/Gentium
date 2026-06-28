# Internacionalização (i18n)

**Versão:** 1.0
**Autor:** Kairo Chácara

---

# 1. Introdução

O Gentium foi concebido para ser uma plataforma de estudo bíblico utilizada por pessoas de diferentes países, culturas e idiomas.

Desde o início do desenvolvimento, toda a arquitetura da aplicação deverá ser preparada para suportar múltiplos idiomas, formatos regionais e conteúdos específicos de cada localização, sem necessidade de alterações estruturais no código.

A internacionalização será um dos pilares da escalabilidade do projeto.

---

# 2. Objetivos

O sistema deverá permitir:

- Suporte a múltiplos idiomas.
- Alteração do idioma a qualquer momento.
- Tradução completa da interface.
- Tradução de estudos.
- Distribuição de conteúdos específicos por idioma.
- Suporte a diferentes alfabetos.
- Suporte a idiomas escritos da direita para a esquerda (RTL), quando necessário.

---

# 3. Filosofia

A internacionalização do Gentium não consiste apenas em traduzir palavras.

O objetivo é oferecer uma experiência natural para usuários de diferentes países, respeitando aspectos culturais, linguísticos e regionais.

---

# 4. Idioma da Interface

O idioma da interface será independente da versão da Bíblia utilizada.

Exemplo:

Interface:

Português

Bíblia:

King James Version

Estudos:

Inglês

Essa flexibilidade permitirá combinar diferentes conteúdos conforme a necessidade do usuário.

---

# 5. Idiomas Planejados

Idiomas previstos para a interface:

- Português (Brasil)
- Português (Portugal)
- Inglês
- Espanhol
- Francês
- Alemão
- Italiano
- Japonês
- Coreano
- Chinês Simplificado
- Chinês Tradicional
- Árabe
- Russo

Novos idiomas poderão ser adicionados futuramente.

---

# 6. Idiomas Bíblicos

Além das traduções modernas, o Gentium oferecerá suporte aos idiomas originais das Escrituras.

Idiomas:

- Hebraico Bíblico
- Aramaico Bíblico
- Grego Koiné

Esses idiomas poderão ser exibidos utilizando:

- Caracteres originais.
- Transliteração.
- Tradução.

---

# 7. Estrutura de Traduções

Toda a interface será baseada em arquivos de tradução.

Exemplo:

```text
locales/

pt-BR/

en-US/

es-ES/

fr-FR/

de-DE/
```

Cada idioma possuirá seus próprios arquivos.

---

# 8. Textos da Interface

Nenhum texto deverá ficar diretamente no código.

Exemplo:

Correto:

```ts
t('home.title');
```

Evitar:

```ts
<Text>Início</Text>
```

Isso facilitará a manutenção e a inclusão de novos idiomas.

---

# 9. Conteúdos Traduzidos

Cada módulo poderá possuir conteúdos específicos para diferentes idiomas.

Exemplos:

- Estudos.
- Cursos.
- Planos de leitura.
- Tutoriais.
- Mensagens do sistema.

Nem todos os idiomas precisarão possuir exatamente o mesmo conjunto de materiais.

---

# 10. Formatação Regional

O sistema deverá respeitar a localidade do usuário para exibição de:

- Datas.
- Horários.
- Números.
- Moedas.
- Idiomas.
- Calendários.

---

# 11. Idioma Automático

Na primeira execução, o aplicativo poderá utilizar o idioma configurado no dispositivo.

O usuário poderá alterar essa configuração a qualquer momento.

---

# 12. Fontes

O Gentium deverá utilizar fontes compatíveis com:

- Alfabeto latino.
- Grego.
- Hebraico.
- Árabe.
- Chinês.
- Japonês.
- Coreano.

A escolha da fonte deverá preservar a legibilidade em todos os idiomas.

---

# 13. Idiomas da Direita para a Esquerda

A arquitetura deverá ser preparada para idiomas RTL.

Exemplo:

- Árabe.

A interface deverá adaptar automaticamente:

- Alinhamento.
- Navegação.
- Ícones direcionais.
- Layout.

---

# 14. Traduções da Bíblia

Cada tradução bíblica será tratada como um pacote independente.

Exemplos:

- ARC
- ARA
- NAA
- KJV
- ESV
- Reina-Valera
- Louis Segond

O usuário instalará apenas as versões desejadas.

---

# 15. Conteúdos Oficiais

Os materiais produzidos pelo Gentium poderão possuir traduções oficiais.

Cada tradução deverá informar:

- Idioma.
- Tradutor.
- Versão.
- Data.
- Revisão.

---

# 16. Conteúdo da Comunidade

Futuramente, a comunidade poderá colaborar com traduções.

Essas traduções deverão passar por revisão antes de serem disponibilizadas oficialmente.

---

# 17. Inteligência Artificial

A IA deverá responder preferencialmente no idioma configurado pelo usuário.

Também poderá:

- Traduzir respostas.
- Explicar termos em diferentes idiomas.
- Auxiliar no estudo dos idiomas bíblicos.

---

# 18. Pesquisa

A pesquisa deverá considerar o idioma do conteúdo.

Exemplo:

Pesquisar por:

"Amor"

deverá encontrar conteúdos em português.

Pesquisar por:

"Love"

deverá encontrar conteúdos em inglês.

Os idiomas originais também poderão ser pesquisados.

---

# 19. Desempenho

Os recursos de internacionalização não deverão comprometer o desempenho do aplicativo.

Os idiomas serão carregados de forma eficiente, utilizando apenas os arquivos necessários.

---

# 20. Escalabilidade

Toda nova funcionalidade desenvolvida para o Gentium deverá ser preparada para múltiplos idiomas desde sua criação.

Não será permitido adicionar recursos que dependam de textos fixos no código.

---

# 21. Considerações Finais

A internacionalização permitirá que o Gentium alcance usuários de diferentes países, preservando a mesma qualidade de experiência em qualquer idioma.

A arquitetura deverá garantir que novos idiomas, traduções bíblicas e materiais de estudo possam ser adicionados continuamente, sem necessidade de reestruturar o projeto.

Essa preparação permitirá que o Gentium evolua para uma plataforma global de estudo das Escrituras, respeitando as particularidades linguísticas e culturais de cada comunidade cristã.
