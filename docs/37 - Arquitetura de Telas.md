# Arquitetura de Telas

**Versão:** 1.0
**Documento:** 37-screen-architecture.md
**Autor:** Kairo Chácara

---

# 1. Introdução

Este documento define todas as telas previstas para o Gentium.

Seu objetivo é servir como referência para o desenvolvimento da interface, garantindo organização, consistência e escalabilidade.

Cada tela possui uma finalidade específica e poderá ser expandida ao longo da evolução do projeto.

---

# 2. Convenções

Cada tela deverá possuir:

- Identificador único.
- Nome.
- Objetivo.
- Módulo.
- Versão prevista.
- Dependências.
- Componentes do UI Kit.

---

# 3. Navegação Principal

A navegação principal será composta por cinco áreas.

| Código  | Tela      | Versão |
| ------- | --------- | ------ |
| SCR-001 | Início    | v0.1   |
| SCR-002 | Bíblia    | v0.2   |
| SCR-003 | Estudos   | v0.6   |
| SCR-004 | Anotações | v0.3   |
| SCR-005 | Mais      | v0.1   |

---

# 4. Inicialização

| Código  | Tela                   | Versão |
| ------- | ---------------------- | ------ |
| SCR-006 | Splash Screen          | v0.1   |
| SCR-007 | Onboarding             | v0.1   |
| SCR-008 | Seleção de Idioma      | v0.1   |
| SCR-009 | Download Inicial       | v0.1   |
| SCR-010 | Atualização de Pacotes | v0.8   |

---

# 5. Home

| Código  | Tela                | Versão |
| ------- | ------------------- | ------ |
| SCR-011 | Página Inicial      | v0.1   |
| SCR-012 | Continuar Leitura   | v0.2   |
| SCR-013 | Versículo do Dia    | v0.2   |
| SCR-014 | Apoie o Gentium     | v2.1   |
| SCR-015 | Atividades Recentes | v0.6   |

---

# 6. Bíblia

| Código  | Tela                    | Versão |
| ------- | ----------------------- | ------ |
| SCR-020 | Livros da Bíblia        | v0.2   |
| SCR-021 | Capítulos               | v0.2   |
| SCR-022 | Leitura Bíblica         | v0.2   |
| SCR-023 | Pesquisa Bíblica        | v0.2   |
| SCR-024 | Comparação de Traduções | v0.4   |
| SCR-025 | Texto Original          | v0.4   |
| SCR-026 | Transliteração          | v0.4   |
| SCR-027 | Interlinear             | v0.5   |
| SCR-028 | Informações Strong      | v0.5   |
| SCR-029 | Léxico                  | v0.5   |

---

# 7. Estudos

| Código  | Tela                  | Versão |
| ------- | --------------------- | ------ |
| SCR-030 | Biblioteca de Estudos | v0.6   |
| SCR-031 | Categorias            | v0.6   |
| SCR-032 | Curso                 | v0.6   |
| SCR-033 | Módulo                | v0.6   |
| SCR-034 | Lição                 | v0.6   |
| SCR-035 | Exercícios            | v2.3   |
| SCR-036 | Resultado             | v2.3   |

---

# 8. Planos de Leitura

| Código  | Tela                 | Versão |
| ------- | -------------------- | ------ |
| SCR-040 | Biblioteca de Planos | v0.7   |
| SCR-041 | Detalhes do Plano    | v0.7   |
| SCR-042 | Leitura do Dia       | v0.7   |
| SCR-043 | Histórico            | v0.7   |
| SCR-044 | Estatísticas         | v0.7   |

---

# 9. Anotações

| Código  | Tela               | Versão |
| ------- | ------------------ | ------ |
| SCR-050 | Lista de Anotações | v0.3   |
| SCR-051 | Editor de Anotação | v0.3   |
| SCR-052 | Categorias         | v0.3   |
| SCR-053 | Tags               | v0.3   |

---

# 10. Marcações

| Código  | Tela           | Versão |
| ------- | -------------- | ------ |
| SCR-060 | Marcações      | v0.3   |
| SCR-061 | Seletor de Cor | v0.3   |
| SCR-062 | Categorias     | v0.3   |

---

# 11. Favoritos

| Código  | Tela      | Versão |
| ------- | --------- | ------ |
| SCR-070 | Favoritos | v0.2   |
| SCR-071 | Coleções  | v0.3   |

---

# 12. Biblioteca Avançada

| Código  | Tela                 | Versão |
| ------- | -------------------- | ------ |
| SCR-080 | Comentários Bíblicos | v0.8   |
| SCR-081 | Dicionário Bíblico   | v0.8   |
| SCR-082 | Mapas Bíblicos       | v0.8   |
| SCR-083 | Cronologias          | v0.8   |
| SCR-084 | Árvores Genealógicas | v0.8   |
| SCR-085 | Referências Cruzadas | v0.8   |

---

# 13. Pesquisa

| Código  | Tela                  | Versão |
| ------- | --------------------- | ------ |
| SCR-090 | Pesquisa Global       | v0.6   |
| SCR-091 | Resultados            | v0.6   |
| SCR-092 | Histórico de Pesquisa | v0.6   |

---

# 14. Configurações

| Código  | Tela          | Versão |
| ------- | ------------- | ------ |
| SCR-100 | Configurações | v0.1   |
| SCR-101 | Aparência     | v0.1   |
| SCR-102 | Leitura       | v0.2   |
| SCR-103 | Idioma        | v0.1   |
| SCR-104 | Downloads     | v0.2   |
| SCR-105 | Backup Local  | v1.0   |
| SCR-106 | Sobre         | v0.1   |

---

# 15. Conta (Futuro)

| Código  | Tela      | Versão |
| ------- | --------- | ------ |
| SCR-110 | Login     | v2.0   |
| SCR-111 | Cadastro  | v2.0   |
| SCR-112 | Perfil    | v2.0   |
| SCR-113 | Segurança | v2.0   |

---

# 16. Sincronização

| Código  | Tela            | Versão |
| ------- | --------------- | ------ |
| SCR-120 | Sincronização   | v2.0   |
| SCR-121 | Backup em Nuvem | v2.0   |
| SCR-122 | Conflitos       | v2.0   |

---

# 17. Doações

| Código  | Tela                 | Versão |
| ------- | -------------------- | ------ |
| SCR-130 | Apoie o Gentium      | v2.1   |
| SCR-131 | Doação Única         | v2.1   |
| SCR-132 | Assinatura           | v2.1   |
| SCR-133 | Histórico de Doações | v2.1   |

---

# 18. Gamificação

| Código  | Tela                   | Versão |
| ------- | ---------------------- | ------ |
| SCR-140 | Perfil de Progresso    | v2.2   |
| SCR-141 | Conquistas             | v2.2   |
| SCR-142 | Missões                | v2.2   |
| SCR-143 | Estatísticas Avançadas | v2.2   |

---

# 19. Inteligência Artificial

| Código  | Tela                   | Versão |
| ------- | ---------------------- | ------ |
| SCR-150 | Assistente IA          | v3.0   |
| SCR-151 | Histórico de Conversas | v3.0   |
| SCR-152 | Configurações da IA    | v3.0   |

---

# 20. Administração (Futuro)

| Código  | Tela                      | Versão |
| ------- | ------------------------- | ------ |
| SCR-160 | Painel Administrativo     | v4.0   |
| SCR-161 | Gerenciamento de Conteúdo | v4.0   |
| SCR-162 | Usuários                  | v4.0   |

---

# 21. Organização das Telas

Todas as telas deverão ser implementadas utilizando exclusivamente os componentes definidos no UI Kit oficial do Gentium.

Nenhuma tela deverá criar componentes próprios quando já existir um equivalente reutilizável.

---

# 22. Evolução

Novas telas poderão ser adicionadas conforme a evolução do projeto.

Toda nova tela deverá:

- Receber um identificador único.
- Ser documentada neste arquivo.
- Informar a versão prevista de implementação.
- Referenciar os componentes do UI Kit utilizados.

---

# 23. Considerações Finais

A Arquitetura de Telas representa o mapa completo da interface do Gentium.

Ela deverá orientar o desenvolvimento da experiência do usuário, garantindo consistência, escalabilidade e alinhamento com a filosofia **Modern Sacred Design**.

Após este documento, cada tela deverá receber uma especificação própria, contendo layout, componentes, estados, regras de negócio e fluxos de navegação.
