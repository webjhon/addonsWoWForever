# Banco factual Wowhead Forever — 15/11/2026

Esta melhoria parte da `main` `80a0738ae386d1a4412f6e4cbda9e88475c7dc24`. Não depende da branch do Alliance Dungeon Trail e não altera os 48 registros editoriais oficiais existentes.

O Wowhead é usado como referência comunitária. **Não é um espelho do site, uma exportação completa ou uma base CLIENT_VERIFIED.** A lista pública de quests informa 6.140 resultados com limite de 1.000 exibidos; isso não estabelece quantas são pertinentes à Alliance. Nenhuma porcentagem de cobertura foi inventada.

## O que está disponível

| Diretório | Registros novos | Conteúdo |
|---|---:|---|
| `knowledge/alliance/quest/wowhead-forever.json` | 72 | IDs de páginas individuais, requisitos de referência, origem, categorias e objetivos pontuais |
| `knowledge/alliance/dungeon/wowhead-forever.json` | 24 | Identidade por nome e associações com quests; IDs internos desconhecidos |
| `knowledge/alliance/zone/wowhead-forever.json` | 38 | Faixas **editoriais** do mapa Wowhead, separadas de requisitos de entrada |
| `knowledge/alliance/npc/wowhead-forever.json` | 8 | IDs e nomes pontuais, sem coordenadas ou inferência de reação amigável/hostil |
| `knowledge/alliance/item/wowhead-forever.json` | 4 | IDs de itens associados a objetivos pesquisados |
| `knowledge/alliance/profession/wowhead-forever.json` | 12 | Taxonomia e categorias de efeitos de camping; sem rotas ou receitas copiadas |
| `knowledge/alliance/pet_family/wowhead-forever.json` | 9 | Famílias e nomes de habilidades; sem IDs, ranks ou spawns presumidos |
| `knowledge/alliance/class/wowhead-forever.json` | 9 | Taxonomia; não é uma matriz completa de raça/classe |
| `knowledge/alliance/relations/wowhead-forever.json` | 124 relações | Associações, NPCs, itens, localização por zona e dois pré-requisitos diretos conhecidos |

São **176 entidades**, com **84 IDs internos pontuais** (72 quests, oito NPCs, quatro itens), 89 referências e fonte por campo conhecido. Os nomes são enUS; localização por ID deve ser feita pelo addon/cliente. O campo `faction` representa acesso à informação pela Alliance, não a reação do NPC nem uma garantia de elegibilidade.

## Fontes e direitos

As 89 URLs individuais revisadas, a data da consulta e o escopo estão em `knowledge/packs/wowhead-forever/manifest.json`. Foram consultados o [índice de quests](https://www.wowhead.com/forever/quests), a [referência de quests de dungeons](https://www.wowhead.com/forever/guide/dungeons/every-dungeon-quest-location), [mapa e faixas editoriais](https://www.wowhead.com/forever/classicplus-world-map-outro), [profissões](https://www.wowhead.com/forever/guide/professions/overview), [famílias de pets](https://www.wowhead.com/forever/guide/classes/hunter/best-pets-and-pet-managment-guide), [taxonomia](https://www.wowhead.com/forever/database) e páginas individuais de entidades.

Os [termos ZAM/Fanbyte](https://corp.fanbyte.com/legal/terms), revisão de 14/05/2025, restringem reprodução e distribuição do serviço/conteúdo. O [robots.txt](https://www.wowhead.com/robots.txt), consultado em 15/11/2026, lista crawlers de IA com `Disallow: /`. Esses documentos não foram interpretados como uma licença de espelhamento. Não há crawler, contorno de acesso, cópia de HTML, guia, comentário, descrição narrativa, imagem, arte ou arquivo de site no pacote.

A revisão cobre **fatos pontuais e notas autorais**, não concede licença sobre o site. A licença MIT do código deste repositório não relicencia materiais do Wowhead/Blizzard. Uma eventual autorização para extração ampla precisa ser documentada separadamente antes de ampliar o conteúdo. O importador só lê JSON local curado e não realiza requisições de rede.

## Campos, confiança e conflitos

- `game_id: null` significa identificador desconhecido. O ID editorial `whf:zone:westfall`, por exemplo, não é um UIMapID.
- `required_level: null` significa requisito desconhecido; o intervalo amplo usado para descoberta não equivale a elegibilidade no nível 1.
- `recommended_range` é separado do requisito e, para zonas, marcado `EDITORIAL_RECOMMENDATION`.
- `field_sources` liga cada campo conhecido às fontes declaradas. IDs precisam corresponder ao tipo e número da URL individual.
- `build` permanece null. `patch: 1.60.1` é contexto do site/guia, não uma execução do jogo.
- Todos os registros desta curadoria são `COMMUNITY_UNVERIFIED` em relação ao cliente. O schema desta via de ingestão não permite promovê-los a `CONFIRMED_IN_CLIENT`.
- Quests 95250 e 92753 mantêm requisitos null devido a divergências. Na quest 456, o nível da quest difere entre metadados/listagem. Não foi selecionado um valor por conveniência.
- Comentários legados e relatos de beta não viram objetivos, coordenadas ou cadeia confirmada. Vínculo a uma dungeon não significa que o objetivo acontece após o portal.
- A origem de uma cadeia não é automaticamente o pré-requisito direto: não foi criada uma aresta falsa entre The Unsent Letter e The Stockade Riots.

## Uso pelos próximos agentes

Execute `npm ci --ignore-scripts` e `npm run init`. A inicialização importa os registros oficiais existentes e este pacote factual para o SQLite, além do TXT autoral em `rag/raw-docs/forever/wowhead/`.

1. Consulte `get_knowledge_coverage` para saber o que existe e quais dados faltam.
2. Use `search_leveling_knowledge` com o nível pertinente e `query_alliance_records` com `kind: quest`, `dungeon`, `npc`, `item`, `zone`, `profession`, `pet_family` ou `class`.
3. Use `get_gameplay_entity` com, por exemplo, `id: whf:quest:92489` e `level: 24`. O retorno inclui campos originais, fontes por campo, relações nas duas direções, `graphComplete: false` e contexto de nível. Isso é descoberta, não validação de disponibilidade.
4. Confirme no cliente os dados críticos para o addon. Registre lacunas; não complete IDs, ranks, coordenadas ou pré-quests por memória do Classic/Retail.

Equivalentes locais:

```powershell
npm run knowledge:validate
npm run knowledge:coverage
npm run knowledge:refresh
npm run search -- "Power Overwhelming" --level 24 --domain leveling
npm run knowledge -- quest "Power Overwhelming" 24
node --experimental-strip-types scripts/factory.ts entity whf:quest:92489 24
npm run knowledge:export
```

`knowledge:export` cria TXT, JSON e cobertura em `.data/knowledge-exports/`. A saída é local, derivada dos mesmos fatos curados. O snapshot de lacunas versionado está em `knowledge/gaps/wowhead-forever.json`.

## Atualização e validação

Edite os JSON por categoria e registre a fonte de cada campo. Adicione a referência revisada ao manifesto e incremente `revision`. Execute validação, testes, inicialização e consultas demonstrativas. Atualizações de conteúdo comunitário não confirmam a build e não apagam a necessidade de pesquisa adicional.

`schemas/knowledge-pack.schema.json` é aplicado por Ajv 2020 com schema estrito. Bloqueia campos arbitrários de texto copiado, coordenadas não verificadas, registros Horde e status de evidência incompatíveis. Verificações adicionais rejeitam IDs/fontes incompatíveis, fonte desconhecida, duplicatas, relações quebradas e ciclos de pré-requisitos.

Somente depois da validação completa é aberta uma transação. O namespace reservado `whf:` é substituído atomicamente; entidades antigas, relações e FTS deste pacote são removidos. Registros oficiais ou de outros namespaces não são substituídos. Uma referência externa que impeça a remoção causa rollback completo, com erro para revisão. Importar um pacote idêntico não duplica linhas nem altera a evidência de importação.

## Limites que continuam abertos

Ainda faltam catálogos exaustivos de quests e cadeias, NPCs/objetos completos, coordenadas, mapas indoor, grafo de voos, tabelas de loot, receitas, ranks de spells, timers, combinações de raça/classe e regras de XP por build. Novas dungeons tardias também exigem confirmação de fase/disponibilidade. O arquivo de cobertura é parte da pesquisa obrigatória, não um selo de completude.

Não foram realizados testes no jogo. Esta alteração melhora pesquisa, ingestão e acesso aos dados da fábrica; não instala nem valida um addon no cliente.
