# Testes

**Versão:** 1.0
**Autor:** Kairo Chácara

---

# 1. Introdução

Este documento define a estratégia de testes do Gentium.

Os testes deverão garantir que o aplicativo funcione corretamente, seja confiável, preserve os dados do usuário e mantenha estabilidade durante sua evolução.

---

# 2. Objetivos

Os testes deverão validar:

- Funcionamento da Bíblia offline.
- Pesquisa bíblica.
- Anotações.
- Marcações.
- Favoritos.
- Estudos.
- Planos de leitura.
- Sincronização.
- Doações.
- IA.
- Segurança.
- Acessibilidade.
- Desempenho.

---

# 3. Tipos de Testes

O Gentium utilizará diferentes tipos de testes.

## Testes Unitários

Validam funções isoladas.

Exemplos:

- Formatação de referências bíblicas.
- Validação de campos.
- Cálculo de progresso.
- Cálculo de XP.
- Conversão de datas.

---

## Testes de Integração

Validam a comunicação entre módulos.

Exemplos:

- Serviço de anotações com banco SQLite.
- Serviço de marcações com pesquisa.
- Sincronização com API.
- Doações com backend.

---

## Testes de Interface

Validam telas e componentes.

Exemplos:

- Botões.
- Formulários.
- Navegação.
- Modais.
- Estados de carregamento.
- Estados vazios.
- Mensagens de erro.

---

## Testes End-to-End

Validam fluxos completos do usuário.

Exemplos:

- Abrir Bíblia.
- Criar anotação.
- Marcar versículo.
- Iniciar plano.
- Concluir estudo.
- Fazer doação.
- Sincronizar dados.

---

# 4. Ferramentas

Ferramentas previstas:

- Jest.
- React Native Testing Library.
- Detox.
- ESLint.
- TypeScript.
- Testes manuais guiados por checklist.

---

# 5. Testes da Bíblia Offline

Deverão validar:

- Abertura da Bíblia sem internet.
- Navegação entre livros.
- Navegação entre capítulos.
- Exibição correta dos versículos.
- Alteração de versões.
- Texto original.
- Transliteração.
- Interlinear.
- Pesquisa offline.
- Última leitura.

---

# 6. Testes de Anotações

Deverão validar:

- Criar anotação.
- Editar anotação.
- Excluir anotação.
- Pesquisar anotação.
- Vincular anotação a versículo.
- Exportar anotação.
- Importar anotação.

---

# 7. Testes de Marcações

Deverão validar:

- Criar marcação.
- Editar cor.
- Adicionar categoria.
- Pesquisar por cor.
- Pesquisar por livro.
- Remover marcação.
- Sincronizar marcação.

---

# 8. Testes de Estudos

Deverão validar:

- Abrir curso.
- Abrir módulo.
- Abrir lição.
- Concluir lição.
- Registrar progresso.
- Abrir referência bíblica.
- Criar anotação dentro do estudo.

---

# 9. Testes de Planos de Leitura

Deverão validar:

- Iniciar plano.
- Abrir leitura diária.
- Concluir dia.
- Reagendar leitura.
- Registrar progresso.
- Atualizar estatísticas.
- Funcionamento offline.

---

# 10. Testes de Gamificação

Deverão validar:

- Concessão de XP.
- Atualização de nível.
- Registro de sequência.
- Liberação de conquistas.
- Atualização de estatísticas.
- Não duplicação de recompensas.

---

# 11. Testes de IA

Deverão validar:

- Envio de pergunta.
- Resposta identificada como IA.
- Tratamento de erro.
- Falha de conexão.
- Limitação de uso.
- Proteção de dados enviados.

---

# 12. Testes de Doações

Deverão validar:

- Doação única.
- Assinatura recorrente.
- Cancelamento de assinatura.
- Histórico de doações.
- Falha de pagamento.
- Retorno do Asaas.
- Webhooks.

---

# 13. Testes de Sincronização

Deverão validar:

- Envio de alterações locais.
- Recebimento de alterações remotas.
- Resolução de conflitos.
- Backup.
- Restauração.
- Sincronização após uso offline.

---

# 14. Testes de Segurança

Deverão validar:

- Login.
- Expiração de token.
- Renovação de token.
- Proteção de rotas.
- Armazenamento seguro.
- Falhas de autenticação.
- Permissões.

---

# 15. Testes de Acessibilidade

Deverão validar:

- Tamanho de fonte.
- Alto contraste.
- Modo escuro.
- Leitores de tela.
- Área mínima de toque.
- Navegação clara.
- Informação não dependente apenas de cor.

---

# 16. Testes de Desempenho

Deverão validar:

- Tempo de abertura do aplicativo.
- Tempo de abertura da Bíblia.
- Velocidade da pesquisa.
- Consumo de memória.
- Consumo de bateria.
- Desempenho com milhares de anotações.
- Desempenho com muitas marcações.

---

# 17. Testes Offline

Deverão validar o funcionamento sem internet de:

- Bíblia.
- Pesquisa local.
- Anotações.
- Marcações.
- Favoritos.
- Estudos baixados.
- Planos baixados.
- Gamificação local.

---

# 18. Testes de Regressão

Antes de cada nova versão, deverão ser testadas funcionalidades já existentes para garantir que novas alterações não quebraram recursos anteriores.

---

# 19. Critérios de Aceitação

Uma funcionalidade só poderá ser considerada concluída quando:

- Atender ao requisito funcional.
- Atender aos requisitos não funcionais.
- Passar nos testes definidos.
- Não causar regressões.
- Possuir tratamento de erro.
- Funcionar offline quando aplicável.
- Estar documentada.

---

# 20. Checklist Inicial do MVP

Antes da primeira versão pública, validar:

- Bíblia abre offline.
- Pesquisa funciona offline.
- Anotação é salva corretamente.
- Marcação é salva corretamente.
- Favorito é salvo corretamente.
- Última leitura é preservada.
- Configurações são mantidas.
- Tema claro e escuro funcionam.
- Não há perda de dados ao fechar o app.
- App não trava em uso básico.

---

# 21. Considerações Finais

A estratégia de testes do Gentium deverá garantir estabilidade, segurança e confiança.

Como o aplicativo poderá armazenar anos de estudos, anotações e progresso do usuário, os testes deverão priorizar principalmente a preservação dos dados, o funcionamento offline e a confiabilidade das funcionalidades principais.
