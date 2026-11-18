# Benchmark real — 18/11/2026

Cliente Forever1.60.1, build70959/interface16001, ptBR, Alliance nível2, Vila Norte. AURANPC antigo desativado antes da medição canônica. Método: UpdateAddOnMemoryUsage seguido de GetAddOnMemoryUsage pelo nome da instalação; amostras brutas em BENCHMARK.json.

| Cenário | Amostras / intervalo | Memória atribuída |
|---|---|---|
| AURANPC2.1.1 anterior, sessão aquecida | 6 /10s | 7,49–8,03MiB |
| Tonho QuestGlow1.0.0 após reload | 6 /10s | 1,98–2,41MiB |
| Tonho QuestGlow em uso: painel, bag, movimento e início de combate | 8 /30s | 3,54–9,05MiB |

O custo observado é pequeno e não justifica alterar os algoritmos aprovados. Não houve otimização funcional especulativa. Estados de aquecimento, placas e coleta de lixo variaram: não se afirma redução percentual, ausência de vazamento ou melhora de FPS. O código mantém os pools limitados de40 marcadores NPC/360 marcadores de itens e a reconciliação por eventos/ticker existente.

Esses valores não são RAM total do computador/processo ou VRAM. CPU profiling não foi ligado; FPS da referência anterior é apenas contextual. Não houve benchmark em dungeon/Horde ou teste de longa duração. Antes das amostras finais, o controle do aplicativo desktop CurseForge travou por aproximadamente22 minutos; o personagem foi reencontrado vivo/logado. Não se declara observação contínua nesse intervalo. Preferências temporárias de clique para mover e saque automático foram restauradas e confirmadas (0 e1). Instrumentação temporária não foi incluída no addon.
