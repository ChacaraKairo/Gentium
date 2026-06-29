# Gentium Bible Databases

Pacotes de Biblia offline organizados por fonte e por idioma.

## Fontes

- `biblesupersearch/`: SQLite extraido de `bibles_sqlite_6.0.zip`, baixado de `https://downloads.biblesupersearch.com/bibles/sqlite/bibles_sqlite_6.0.zip`.
- `scrollmapper/`: SQLite extraido do branch `2025` de `https://github.com/scrollmapper/bible_databases.git`.
- `resources/`: recursos auxiliares do Bible SuperSearch CSV, incluindo definicoes Strong e nomes de livros por idioma.

## Camadas

- Portugues: `biblesupersearch/sqlite/pt`
- Ingles: `biblesupersearch/sqlite/en` e `scrollmapper/sqlite/en`
- Espanhol: `biblesupersearch/sqlite/es`
- Texto original: `biblesupersearch/sqlite/original` e `scrollmapper/sqlite/original`
- Recursos: `resources/strong` e `resources/books`

## Observacoes de licenca

O Bible SuperSearch declara que os arquivos da pagina de downloads sao compartilhaveis para uso nao comercial, e recomenda verificar o copyright interno de cada Biblia. O Scrollmapper inclui a licenca MIT do projeto em `scrollmapper/docs/LICENSE.md`.

Traducoes como NAA, NTLH e Almeida Seculo 21 nao foram incluidas porque nao estavam disponiveis nessas fontes livres verificadas ou exigem validacao/licenca antes de distribuicao.

Veja `manifest.json` para lista de pacotes, caminhos e observacoes.
