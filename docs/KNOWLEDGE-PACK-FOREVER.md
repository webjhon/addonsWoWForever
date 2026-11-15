# Pacote de conhecimento Forever/Alliance — 15/11/2026

Esta edição preenche o RAG com resumos autorais de fontes públicas da Blizzard e um catálogo estruturado parcial de entidades relevantes a leveling. Não contém conteúdo proprietário de guias nem uma exportação completa dos dados do cliente.

## O que foi incluído
- `rag/raw-docs/forever/`: 19 documentos temáticos, todos com `.meta.json` de origem e status.
- `knowledge/alliance/forever-official-seed.json`: masmorras, zonas, combinações Alliance, perks Legacy e alguns aprendizados de classe anunciados oficialmente.
- `knowledge/alliance/seed-forever.ts`: importador idempotente para o SQLite.
- `scripts/setup.ts`: chama o importador ao executar o procedimento de inicialização existente.
- `tests/curated-knowledge.test.ts`: teste de regressão do novo seed.
- `knowledge/sources/manifest.json`: entradas revisadas para os resumos oficiais.

## Limites
- **IDs internos de quests/spells/talents, coordenadas, rotas, mapas e listas completas não estão preenchidos**: seria incorreto inventá-los.
- A evidência `OFFICIAL_DOCUMENTATION` significa que a Blizzard anunciou o fato; não que a API esteja comprovada no cliente atual.
- O snapshot de API da build 70790/Interface 16001 é uma referência, não garantia de API compatível após atualização.
- Zygor e RestedXP permanecem fora da indexação e não foram copiados.
- Este pacote não muda `.gitignore`, arquivos locais nem conteúdos particulares adicionados ao repositório pelo usuário.

## Para Work / Codex
Ao assumir o repositório, execute a rotina normal de inicialização em ambiente habilitado, consulte `search_leveling_knowledge` e `query_alliance_records` e registre lacunas antes de gerar addons que dependem de IDs exatos. O usuário não precisa operar um terminal; o agente executa se possuir ambiente de execução.

## Controle de atualização
A documentação principal do Forever foi obtida das URLs listadas em `knowledge/sources/manifest.json`. Novos dados precisam de revisão humana ou de agente com validação de fonte e de build.
