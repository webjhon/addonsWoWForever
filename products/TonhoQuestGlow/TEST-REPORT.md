# Testes e limites

## Automação local

188 testes aprovados, zero falhas, zero pulados (Node test runner; research/TonhoQuestGlow/automated-tests.log). Incluem os152 testes existentes e36 verificações adicionais: toda a suíte histórica de NPC/itens executada novamente contra o runtime TonhoQuestGlow, comandos/configuração, migração, Lua5.1, allowlist/CRC/hash do ZIP, ausência de arquivos internos, licenças/ícone400px, roteamento da skill e rejeição de violações dos validadores no perfil público. O build canônico executou seus30 testes de aceitação e resultou STATIC_PASSED/clientVerified:false.

## Observado no jogo nesta entrega

- Pasta nova reconhecida após reload; TonhoQuestGlow carregado sozinho, AURANPC antigo desativado. Preferências migradas e estado reconstruído após reload.
- Painel novo, créditos pixel art, opções e ajuda final legível; abrir por /tqg open e fechar por /tqg close. Selo da bag desligado/ligado com desaparecimento/reaparecimento observado.
- NPC de objetivo marcado durante movimento e combate manual; um lobo morto para obtenção de loot.
- Carne Dura de Lobo destacada na bag e no loot; Garra Lascada/Colete de Couro Roto sem destaque. Coleta alterou objetivo de5/8 para6/8 e limpou o marcador da linha removida.
- Memória medida com a instalação canônica; detalhes e restrições em BENCHMARK.md. Auto-loot e click-to-move restaurados.
- Após ajuste final apenas do texto de ajuda, reinstalado Visuals.lua e README, reload e nova conferência do painel, créditos, marcadores e comandos de abrir/fechar.

## Não realizado / não certificado

Horde no cliente, dungeon nesta sessão, outras línguas, UIs alternativas de bolsas, teste de longa duração, profiling CPU/VRAM/RSS e auditoria exaustiva de taint. Casos simulados não equivalem a esses testes. Resultado real: PARTIAL_CLIENT_TESTED, sem promover clientVerified global.

GitHub Actions e publicação externa têm status separado, registrado no Pull Request e no contexto de entrega.
