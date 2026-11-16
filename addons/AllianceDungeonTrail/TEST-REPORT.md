# Relatório de testes — Alliance Dungeon Trail 1.0.0

Execução registrada: 2026-11-16T01:15:54.370Z. Status: STATIC_PASSED e MOCK_PASSED. **CLIENT_VERIFIED: não. Nenhum teste dentro do WoW foi realizado.**

## Evidência executada

- Node v24.18.0: 26/26 testes aprovados, incluindo 14 testes existentes da fábrica e 12 específicos do addon.
- Sintaxe de todos os arquivos Lua validada como Lua 5.1 por luaparse. Execução headless por Fengari (semântica Lua 5.3); não é um cliente WoW nem reproduz taint/restrições reais.
- Blueprint, escopo Alliance 1–60, interface 16001, TOC, arquivos referenciados, ícone e scans de APIs protegidas aprovados.
- Cenários headless: avisos sem duplicação; preparação nível 1; duas runs de calibração; descarte; XP zero; passagem de nível sem contagem duplicada; entregas excluídas da previsão; build/dia; combate e retomada; títulos traduzidos por ID; progresso e entrega; checks manuais distintos; notas; reload e separação por personagem; Horde/nível 61 ocultos; API ausente; valores secretos simulados e dados inválidos.
- Todas as 27 dungeons e quatro abas renderizadas pelo mock. Pool de frames estável após eventos repetidos; não há OnUpdate.
- Avaliação interna da fábrica: os 14 testes originais passaram. O campo luaMock do avaliador informa ausência de executável nativo lua; os testes Fengari acima foram executados separadamente e fazem parte de npm test.
- Doctor e jornada determinística executados. O empacotamento é feito exclusivamente por executeJourney/orchestrator e tools/build-addon.ts.
- Checagem HEAD de fontes públicas executada: cinco URLs acessíveis (HTTP 200); CurseForge respondeu HTTP 403. Isso não bloqueia o ZIP local e não é validação de conteúdo dessas páginas.
- ZIP final é descomprimido em memória pelo verificador; todos os conteúdos do blueprint, CRC32, tamanho, nomes de caminhos e metadados são conferidos. Ícone TGA 512×512, 32 bits, e PNG de divulgação gerados pela fábrica.
- Inspeção visual do ícone e de uma prévia PNG da cena real do mock realizada durante o desenvolvimento. Essa prévia usa aproximações de fontes/scroll e está marcada como simulação; não é captura de tela do jogo.

## Correções e revisão

- Leitura e aritmética adiadas durante combate; recuperação de XP em PLAYER_REGEN_ENABLED.
- Vínculo automático por título preservado por ID para não perder o estado após a entrega.
- Entrega de quest também invalida uso da run como repetição quando o evento ocorre em combate.
- Troca de aba/dungeon volta o scroll ao início. Janela ajusta escala ao tamanho do UIParent.
- Histórico limitado a 12 amostras por dungeon e personagem; reload descarta run incompleta.
- Ícone específico de portal substitui o motivo genérico de bússola apenas para este addon.
- Prévia SVG: corrigida a exclusão de textos inteiramente fora da área de recorte para evitar falha do renderizador resvg. Não era uma falha observada no WoW.

## Evidência de cliente e limites

O executável instalado foi lido como **1.60.1.70938**, flavor wowf. Não havia processo WoW em execução na verificação. O snapshot público consultado é **1.60.1.69893 / interface 16001**; os 17 símbolos usados foram encontrados nele, mas presença não prova assinaturas ou suporte na build atual. Nenhuma API foi promovida a CONFIRMED_IN_CLIENT.

O campo client=NOT_RUN_NO_GAME_CLIENT do avaliador original é uma mensagem fixa da ferramenta, não uma detecção de instalação. Nesta máquina há cliente instalado; o estado correto desta entrega é NÃO EXECUTADO NO JOGO.

Faixas são sugestões, não níveis mínimos garantidos. Há 63 quests selecionadas, sem cobertura exaustiva; quatro dungeons não têm quests curadas. Novas dungeons tardias têm disponibilidade não confirmada. Não há coordenadas nem navegação indoor. A previsão usa XP observada e heurística de níveis fracionários, com incerteza sobre XP futura, bônus e composição do grupo.

## Pendente no jogo

Confirmar GetBuildInfo/interface; carregamento do addon; ícone e fontes; drag/escala/scroll em resolução real; quests e NPCs nas instâncias; idioma do diário; XP e eventos reais; passagem para 60; persistência SavedVariables; restrições em combate; erros Lua e taint; disponibilidade e requisitos de todas as dungeons. O roteiro completo está em INSTALL.md.

Logs reproduzíveis: research/AllianceDungeonTrail/node-tests.log, factory-evals.log, doctor.log, journey.json, api-snapshot-evidence.json e package-verification.json no repositório. Sem publicação em CurseForge nem alegação de testes em jogo.
