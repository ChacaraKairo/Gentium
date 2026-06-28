# Sistema de Sincronização

**Versão:** 1.0
**Autor:** Kairo Chácara

---

# 1. Introdução

O Sistema de Sincronização do Gentium tem como objetivo permitir que o usuário acesse seus dados em diferentes dispositivos, mantendo todas as informações atualizadas e protegidas.

A sincronização será um recurso complementar. O funcionamento principal do aplicativo continuará sendo offline, garantindo acesso à Bíblia e aos recursos essenciais mesmo sem conexão com a internet.

---

# 2. Objetivos

O sistema deverá permitir:

- Sincronizar dados entre dispositivos.
- Realizar backup automático.
- Restaurar informações.
- Resolver conflitos de sincronização.
- Preservar os dados do usuário.
- Funcionar de forma transparente.
- Manter a experiência Offline First.

---

# 3. Filosofia

O dispositivo do usuário será sempre a principal fonte de dados durante o uso offline.

A sincronização deverá atuar como um mecanismo de backup e compartilhamento entre dispositivos, nunca impedindo o funcionamento normal do aplicativo.

O usuário continuará podendo utilizar o Gentium sem criar uma conta.

---

# 4. Dados Sincronizáveis

Poderão ser sincronizados:

- Perfil do usuário.
- Configurações.
- Versão da Bíblia selecionada.
- Histórico de leitura.
- Favoritos.
- Marcações.
- Anotações.
- Coleções.
- Estudos iniciados.
- Progresso dos estudos.
- Planos de leitura.
- Progresso dos planos.
- Gamificação.
- Estatísticas.
- Preferências da IA.

Os textos das Bíblias e os materiais baixados não serão sincronizados, apenas suas referências e configurações.

---

# 5. Conta do Usuário

Para utilizar a sincronização será necessária uma conta.

Métodos previstos:

- E-mail e senha.
- Conta Google.
- Conta Apple (iOS).
- Outros provedores futuramente.

O uso da conta será opcional.

---

# 6. Fluxo de Sincronização

```text
Usuário altera um dado

↓

Alteração salva no banco local

↓

Registro marcado como pendente

↓

Internet disponível

↓

Sincronização com o servidor

↓

Confirmação

↓

Status atualizado para sincronizado
```

---

# 7. Funcionamento Offline

Enquanto estiver offline, o usuário poderá utilizar normalmente:

- Bíblia.
- Estudos.
- Anotações.
- Marcações.
- Favoritos.
- Planos de leitura.
- Gamificação.

Quando a conexão for restabelecida, as alterações serão sincronizadas automaticamente.

---

# 8. Sincronização Automática

O sistema poderá sincronizar automaticamente:

- Ao abrir o aplicativo.
- Ao fechar o aplicativo.
- Em intervalos configuráveis.
- Após alterações importantes.
- Quando houver conexão disponível.

O usuário poderá desativar a sincronização automática.

---

# 9. Sincronização Manual

O usuário poderá iniciar a sincronização manualmente.

Fluxo:

```text
Configurações

↓

Sincronização

↓

Sincronizar Agora
```

---

# 10. Resolução de Conflitos

Quando um mesmo registro for alterado em dispositivos diferentes, o sistema deverá detectar o conflito.

Estratégias possíveis:

- Última alteração.
- Confirmação pelo usuário.
- Mesclagem automática quando possível.

Nenhum dado deverá ser perdido sem confirmação.

---

# 11. Backup

O Gentium oferecerá backup em nuvem.

Também poderá ser realizado backup local.

O backup incluirá:

- Anotações.
- Marcações.
- Favoritos.
- Estudos.
- Progresso.
- Configurações.
- Estatísticas.

---

# 12. Restauração

O usuário poderá restaurar seus dados em um novo dispositivo.

Fluxo:

```text
Entrar na conta

↓

Selecionar backup

↓

Restaurar

↓

Continuar utilizando o aplicativo
```

---

# 13. Histórico de Sincronização

O sistema registrará:

- Última sincronização.
- Quantidade de registros enviados.
- Quantidade de registros recebidos.
- Falhas.
- Conflitos resolvidos.

---

# 14. Segurança

Toda comunicação deverá utilizar conexões criptografadas.

As informações deverão ser transmitidas utilizando HTTPS.

Dados sensíveis deverão ser protegidos tanto em trânsito quanto em armazenamento.

---

# 15. Privacidade

Os dados sincronizados pertencem ao usuário.

O Gentium não utilizará essas informações para publicidade ou venda de dados.

O usuário poderá solicitar a exclusão permanente de sua conta e de seus dados sincronizados.

---

# 16. Estrutura dos Registros

Cada entidade sincronizável deverá possuir:

- Identificador local.
- Identificador remoto.
- Data de criação.
- Data da última atualização.
- Status de sincronização.
- Data da última sincronização.

---

# 17. Integração com Outros Módulos

A sincronização será integrada aos seguintes módulos:

- Bíblia.
- Estudos.
- Anotações.
- Marcações.
- Favoritos.
- Planos de leitura.
- Gamificação.
- Configurações.
- Perfil.

---

# 18. Desempenho

A sincronização deverá ocorrer em segundo plano sempre que possível.

O sistema deverá transmitir apenas os registros alterados, reduzindo o consumo de dados e melhorando a velocidade.

---

# 19. Evolução

O módulo foi projetado para receber novas funcionalidades.

Exemplos:

- Sincronização seletiva.
- Sincronização por Wi-Fi apenas.
- Compartilhamento entre dispositivos do mesmo usuário.
- Histórico de versões.
- Recuperação de alterações excluídas.

---

# 20. Considerações Finais

O Sistema de Sincronização foi projetado para complementar a filosofia Offline First do Gentium.

O usuário poderá utilizar todas as funcionalidades essenciais sem conexão com a internet, mantendo a possibilidade de sincronizar seus dados de forma segura, transparente e confiável quando desejar.

A sincronização deverá preservar a integridade das informações e garantir que anos de estudos, anotações e progresso permaneçam acessíveis em qualquer dispositivo autorizado pelo usuário.
