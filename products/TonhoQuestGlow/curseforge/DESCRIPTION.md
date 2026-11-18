# Tonho QuestGlow

**Quest NPCs and quest items that stand out while you play.**

Tonho QuestGlow adds its own bold yellow highlights to NPCs associated with your active quest objectives, needed quest items in the loot window, and quest-related items in your bags. It updates automatically as your quest log and inventory change.

## Features

- Large yellow NPC panels with an exclamation mark, a solid outline and optional pulse. They follow accessible nameplates as NPCs move.
- Yellow loot highlights for items tied to pending objectives in accepted quests.
- Exclamation badges on relevant bag items, including items awaiting quest hand-in.
- Independent controls for NPC pulse, private sound, alert banner, loot, bag badges and loot pulse.
- Adjustable NPC marker scale and height; preferences saved per character.
- Automatically clears stale highlights after relevant quest and inventory changes and rebuilds state after reload.

All highlights are local to your client. They do not place raid markers, broadcast to your party, collect loot, move items or perform combat actions.

## Commands

| Command | Action |
|---|---|
| `/tqg` or `/questglow` | Toggle the settings window |
| `/tqg open` / `/tqg close` | Open / close settings explicitly |
| `/tqg status` | Show a short status summary |
| `/tqg items` | Show item highlight diagnostics |
| `/tqg test` | Show a10-second visual preview; this does not simulate quest detection |

Portuguese aliases `/tqg abrir` and `/tqg fechar` are supported. `/auranpc` remains available for existing users.

## Compatibility and installation

Designed for **WoW Forever, interface16001, Alliance and Horde, levels1–60**. Install the `TonhoQuestGlow` folder inside `_forever_/Interface/AddOns/`. Restart the client if the new folder is not listed. Disable the previous AURANPC installation to avoid duplicate highlights.

NPC highlights need accessible nameplates and remain limited by the client's visibility/range. This is a nameplate-attached visual, not a3D world aura. Required item detection uses public relations and exact names from active item objectives; unavailable or secret data is not guessed. Standard loot and bag UI are supported; custom inventory addons need separate testing. Auto-loot can close the window before its highlight is visible.

Live verification is partial: Alliance, Portuguese client, Northshire/open world, build70959. Horde, dungeons, other languages and third-party bag replacements have not received full live certification. No claim of universal or100% detection.

## Português

O Tonho QuestGlow destaca NPCs de objetivos de quests aceitas, itens necessários na janela de loot e itens de missão nas bolsas. Você joga normalmente e o addon atualiza os destaques sozinho.

Use `/tqg` para abrir ou fechar as opções; `/tqg abrir` e `/tqg fechar` também funcionam. Ajuste escala, altura, pulso, som privado, faixa de alerta, loot e selos das bolsas pelo painel. `/tqg status` mostra o resumo e `/tqg items` ajuda no diagnóstico. `/tqg test` mostra apenas uma demonstração visual.

Os efeitos são individuais e não alteram a visão de outros jogadores do grupo. Para ver o destaque no loot, abra a janela com a coleta automática temporariamente desligada ou use o modificador de saque configurado no seu cliente.

Instale a pasta TonhoQuestGlow em `_forever_/Interface/AddOns/` e desative AURANPC para evitar duplicação. A mudança de pasta pode iniciar preferências novas. A implementação atende Alliance e Horde; testes reais disponíveis são parciais em Alliance/ptBR, mundo aberto.

Created by **Tonho Contrabando**, with original pixel-art branding. Free and readable Lua source. Licensed under MIT; required third-party notices are included.
