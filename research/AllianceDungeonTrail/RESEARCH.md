# Alliance Dungeon Trail — pesquisa e decisões

Pesquisa em 15/11/2026 (America/Sao_Paulo). Addon original, Alliance, leveling 1–60.

## Fontes, versões e direitos

| Fonte | Versão / evidência | Uso e direitos |
|---|---|---|
| `config/wow-version.json` | Interface 16001, linha 1.60.1; build não preenchida | Contrato do projeto, MIT |
| [Snapshot público de APIs](https://github.com/Thunderz96/forever-addon-kit/blob/8dc297689059dd204bf8663a05aaa36d6a628b76/data/forever_api.json) | Captura enUS 1.60.1, build 69893, interface 16001 | MIT; somente presença de símbolos extraída, sem copiar implementação |
| [Anúncio oficial de dungeons](https://news.blizzard.com/en-us/article/24301455/explore-the-new-dungeons-of-world-of-warcraft-forever) | Faixas publicadas para Forever | Referência factual; não redistribuir texto/artes da Blizzard |
| [Índice de quests Forever](https://www.wowhead.com/forever/guide/dungeons/every-dungeon-quest-location) | Patch 1.60.1, atualização 15/11/2026 | Referência factual de seleção, requisitos e nomes; nenhuma reprodução de guia |
| Method, páginas de [Deadmines](https://www.method.gg/wow-forever/dungeons/the-deadmines), [Stockade](https://www.method.gg/wow-forever/dungeons/the-stockade), [Gnomeregan](https://www.method.gg/wow-forever/dungeons/gnomeregan), [Blackfathom](https://www.method.gg/wow-forever/dungeons/blackfathom-deeps), [Wailing Caverns](https://www.method.gg/wow-forever/dungeons/wailing-caverns), [Razorfen Kraul](https://www.method.gg/wow-forever/dungeons/razorfen-kraul) | Guias autorais Forever; divergências com outros guias existem | Referência factual; sem código, texto de passos ou arte copiados |
| Páginas individuais de quests | URLs por registro em `catalog.json`; IDs obtidos dos links consultados | Descrições originais em português; nomes e relações factuais; nenhuma coordenada inventada |
| Cliente instalado, leitura do executável | `Wow.exe` FileVersion `1.60.1.70938`, flavor `wowf` | Somente metadados locais; não prova execução, interface em memória ou API funcional |

As páginas individuais de quests incluem dados legados e comentários históricos. O domínio `/forever/` não torna cada comentário uma confirmação do cliente atual. Por isso todos os registros comunitários permanecem `COMMUNITY_UNVERIFIED` em relação à build instalada. Faixas do anúncio oficial são `OFFICIAL_DOCUMENTATION`, sem afirmar disponibilidade atual. O catálogo é uma seleção, não uma lista completa de todas as quests.

O primeiro URL oficial em `worldofwarcraft.blizzard.com` retornou 403; foi consultado o mesmo artigo no domínio `news.blizzard.com`. Páginas Method para diversas dungeons tardias estavam inacessíveis; não foram utilizadas como comprovação. Foram consultadas páginas individuais Wowhead de quests em seu lugar. Não foram lidos arquivos proprietários de Zygor/RestedXP, inclusive os instalados no computador.

## Recuperação e memória

Antes da implementação: `npm run init`, `doctor`, `search -- "dungeon quest leveling"`, `search -- "UnitXP C_QuestLog"`, `knowledge -- dungeon dungeon 20`, `capability -- indoor-navigation`; leitura de políticas, gaps e falhas conhecidas. A base inicial tinha dois documentos, cinco entidades sintéticas e nenhum registro real de dungeon. Os fixtures não foram usados como fatos de gameplay.

`scripts/research-dungeon-trail.ts` consulta as ferramentas MCP locais por meio do dispatcher real: os dois domínios RAG, entidades Alliance, capacidades, decisões e falhas. Salva os resultados em `mcp-retrieval.json`, extrai apenas a presença dos símbolos do snapshot licenciado, registra os gaps e adiciona resumos originais ao banco. Não depende de chave de API nem de embeddings pagos.

## ADR-001: sem navegação indoor

Não há prova da disponibilidade de coordenadas navegáveis em todas as instâncias na build atual. A capacidade permanece `UNVERIFIED`; setas indoor não são implementadas. O guia usa NPCs, bosses, alas, objetos, diário e notas pessoais. Não tenta contornar limitações de mapas ou valores secretos.

## ADR-002: previsão empírica, sem XP inventada

São exigidas duas runs marcadas como repetição, com XP positiva, no mesmo dia/build e nível inicial a até dois níveis do atual. Guardam-se no máximo 12 runs por dungeon. Runs com entregas detectadas são excluídas, assim como leituras incompletas e saltos de múltiplos níveis. O primeiro percurso com quests usa o modo padrão `com quests` e não calibra o estimador.

Para o próximo nível: teto da XP restante dividida pela média observada de XP/run. Para a próxima faixa: distância em níveis fracionários dividida pelo ganho fracionário observado por run, exibindo intervalo por melhor/pior amostra. É uma heurística, não uma soma das tabelas futuras de XP. Não se promete atingir a próxima dungeon só repetindo uma instância. O jogador deve descartar runs com deslocamentos, boosts, mudanças relevantes de grupo ou bônus. Uma entrega não detectada, exploração e mudanças de bônus ainda podem contaminar amostras.

## ADR-003: diário por ID e fallback explícito

IDs curados só entram quando extraídos de página individual consultada. Quests sem ID usam correspondência exata do título; ao encontrar, o vínculo é preservado por personagem. Em outros idiomas ou divergências, o jogador vincula um ID presente no próprio diário. A ausência de uma quest não é tratada como concluída: pode ser não obtida, abandonada, bloqueada ou indisponível. `PEGUEI (manual)`, `NO DIÁRIO`, `PRONTA PARA ENTREGAR` e `ENTREGUE` são estados distintos.

## ADR-004: eventos e restrições

Não há `OnUpdate`, combate automatizado, envio de chat, aceite/entrega automática ou reset de instância. O addon esconde sua janela em combate e adia leituras até `PLAYER_REGEN_ENABLED`; a XP acumulada é reconciliada. Valores secretos são recusados, não convertidos ou revelados. Registro de entrada/saída é explícito: mudanças de zona apenas lembram o jogador de conferir a run. Reload/logout descarta a amostra ativa e conserva o checklist.

## Lacunas obrigatórias

- Interface 16001 é alvo de configuração/snapshot, ainda não confirmada com `GetBuildInfo()` executado neste cliente.
- Build instalada 70938 é posterior à captura 69893; assinaturas, retornos, eventos, fontes, arte e restrições atuais exigem jogo real.
- Sem quests curadas para Shadowfang Keep, Alcaz Prison, Blackmaw Hold e Shaper's Terrace. O diário e as notas pessoais funcionam nessas entradas, mas não substituem um guia pesquisado completo.
- Novas dungeons tardias podem estar indisponíveis na fase atual. Estão identificadas como disponibilidade `UNVERIFIED`.
- Excavation Site tem divergência 24–29 versus 26–31; usa-se sugestão conservadora 26–31, sem afirmar nível mínimo de entrada.
- Pré-requisitos e requisitos de classe completos não são resolvidos automaticamente. Apenas a quest curada de paladino é filtrada por classe; outras quests de classe podem ser adicionadas do diário.
- O addon não conhece todas as possíveis quests de cada dungeon, inclusive cadeias locais e segredos.
- UI premium é uma implementação original, com ícone próprio de portal e escadaria; legibilidade e renderização final no WoW ainda exigem inspeção real.
- Nenhum teste em jogo foi realizado nesta entrega.
