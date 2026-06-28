# Requisitos Não Funcionais

Versão: 1.0

Autor: Kairo Chácara

---

# 1. Introdução

Este documento descreve os requisitos não funcionais do Gentium.

Os requisitos não funcionais estabelecem as características de qualidade que o sistema deverá possuir, garantindo desempenho, segurança, confiabilidade, acessibilidade e facilidade de manutenção.

Todos os módulos do projeto deverão atender aos requisitos definidos neste documento.

---

# 2. Desempenho

## RNF-001

O aplicativo deverá iniciar em até 3 segundos em dispositivos compatíveis.

## RNF-002

A abertura de livros, capítulos e versículos deverá ocorrer em menos de 500 ms quando os dados estiverem armazenados localmente.

## RNF-003

As pesquisas locais deverão retornar resultados em até 1 segundo.

## RNF-004

As operações de navegação deverão ocorrer sem travamentos perceptíveis.

## RNF-005

O aplicativo deverá permanecer responsivo durante operações em segundo plano.

---

# 3. Disponibilidade

## RNF-006

A leitura da Bíblia deverá funcionar completamente offline.

## RNF-007

Anotações, marcações e favoritos deverão estar disponíveis sem conexão com a internet.

## RNF-008

A sincronização ocorrerá apenas quando houver conexão disponível.

---

# 4. Escalabilidade

## RNF-009

A arquitetura deverá permitir a adição de novos módulos sem necessidade de reestruturação significativa.

## RNF-010

O banco de dados deverá suportar futuras expansões.

## RNF-011

O sistema deverá ser modular.

---

# 5. Segurança

## RNF-012

Todos os dados sincronizados deverão utilizar conexões criptografadas.

## RNF-013

As senhas nunca poderão ser armazenadas em texto puro.

## RNF-014

Os tokens de autenticação deverão possuir prazo de expiração.

## RNF-015

O sistema deverá seguir as boas práticas de segurança recomendadas para aplicações móveis.

---

# 6. Privacidade

## RNF-016

O usuário deverá manter controle sobre seus dados.

## RNF-017

Nenhuma informação pessoal será compartilhada sem autorização.

## RNF-018

As políticas de privacidade deverão estar disponíveis dentro do aplicativo.

---

# 7. Usabilidade

## RNF-019

A interface deverá ser intuitiva para usuários iniciantes.

## RNF-020

As principais funcionalidades deverão ser acessadas em poucos toques.

## RNF-021

Os elementos visuais deverão manter consistência em todas as telas.

---

# 8. Acessibilidade

## RNF-022

O aplicativo deverá permitir ajuste do tamanho da fonte.

## RNF-023

Deverá existir suporte ao modo escuro.

## RNF-024

As cores deverão possuir contraste adequado.

## RNF-025

Os componentes deverão ser compatíveis com leitores de tela sempre que possível.

---

# 9. Compatibilidade

## RNF-026

O Gentium deverá funcionar em dispositivos Android compatíveis.

## RNF-027

O projeto deverá ser preparado para futura compatibilidade com iOS.

## RNF-028

A arquitetura deverá permitir futuras versões Web e Desktop.

---

# 10. Manutenibilidade

## RNF-029

O código deverá seguir padrões de organização e nomenclatura.

## RNF-030

Todos os módulos deverão possuir documentação.

## RNF-031

As funcionalidades deverão ser desacopladas.

## RNF-032

O projeto deverá facilitar testes automatizados.

---

# 11. Banco de Dados

## RNF-033

O banco local deverá garantir integridade dos dados.

## RNF-034

As operações deverão utilizar transações quando necessário.

## RNF-035

O banco deverá suportar migrações de esquema.

---

# 12. Internacionalização

## RNF-036

Todo texto da interface deverá ser preparado para múltiplos idiomas.

## RNF-037

Datas, números e formatos deverão respeitar a localidade do usuário.

---

# 13. Atualizações

## RNF-038

O aplicativo deverá permitir atualização dos conteúdos sem comprometer os dados do usuário.

## RNF-039

As atualizações deverão preservar anotações, favoritos e marcações.

---

# 14. Confiabilidade

## RNF-040

O sistema deverá minimizar perda de dados em caso de encerramento inesperado.

## RNF-041

Erros críticos deverão ser registrados para diagnóstico.

---

# 15. Integrações

## RNF-042

As integrações externas deverão ser desacopladas do núcleo da aplicação.

## RNF-043

Falhas em serviços externos não deverão impedir o funcionamento da Bíblia offline.

---

# 16. Monetização

## RNF-044

O sistema de doações não deverá impedir o acesso às funcionalidades essenciais.

## RNF-045

Falhas no serviço de pagamentos não deverão afetar o funcionamento do aplicativo.

## RNF-046

As integrações com o Asaas deverão ser implementadas por meio de APIs oficiais.

---

# 17. Inteligência Artificial

## RNF-047

Os recursos de IA deverão ser opcionais.

## RNF-048

A indisponibilidade da IA não deverá comprometer as funcionalidades principais do aplicativo.

---

# 18. Código-Fonte

## RNF-049

O projeto deverá seguir uma arquitetura modular.

## RNF-050

Os componentes deverão possuir baixo acoplamento e alta coesão.

## RNF-051

As dependências externas deverão ser mantidas atualizadas sempre que possível.

---

# 19. Qualidade

## RNF-052

Todo novo módulo deverá ser documentado antes de sua implementação.

## RNF-053

As funcionalidades deverão possuir critérios claros de aceitação.

## RNF-054

O desenvolvimento deverá priorizar estabilidade antes da inclusão de novas funcionalidades.

---

# 20. Considerações Finais

Os requisitos não funcionais apresentados neste documento estabelecem os padrões mínimos de qualidade para o Gentium.

Qualquer evolução do sistema deverá preservar estes requisitos, garantindo que o aplicativo permaneça seguro, confiável, acessível, escalável e adequado ao seu propósito de oferecer uma plataforma completa para o estudo das Escrituras.
