# Revisão do pacote público

Origem: AURANPC2.1.1 em main440f974. Preservados associação de NPC/quest, dados numéricos, proteção de valores secretos, eventos, objetivo/item por nome público, estados de entrega, limpeza de loot/bags, configurações, limites e recuperação por personagem.

Mudanças: identidade TonhoQuestGlow1.0.0 (TOC/pasta, frames, assets, SavedVariables), título Tonho QuestGlow, aliases /tqg e /questglow, comandos open/close/abrir/fechar, importação única das preferências legadas disponíveis, ajuda curta sem corte e créditos compartilhados Alliance/Horde. /auranpc continua aceito.

O perfil público do empacotador continua exigindo validadores de autoria, API, facções e interatividade. Allowlist do ZIP: TOC, seis módulos Lua incluindo branding, dois assets e README/LICENSE/THIRD-PARTY/CHANGELOG. Excluídos blueprint, metadados internos de validação, logs, testes, caches, relatórios, referências e caminhos locais. Lua permanece legível. Copyrights e licença MIT preexistentes foram preservados: avisos legais não são resíduos que possam ser apagados.

Nenhum código, roteiro ou arte de Zygor/RestedXP foi incorporado. Dados factuais e avisos de licença já aprovados permanecem no produto. Nenhum código de benchmark, manutenção anti-AFK, combate, coleta automática, comunicação de grupo ou script externo foi adicionado. Os relatórios de engenharia ficam fora do ZIP.

Revisão crítica: os marcadores são muito visíveis, mas podem se sobrepor em aglomerações; alcance/placas acessíveis continuam sendo limites reais. A interface está em português e usa loot/bags padrão. Não se promete aura3D, cobertura universal, teste real Horde/dungeon nem100% de detecção. Essas limitações constam no texto público.

## Revisão dos padrões de referência

| Padrão | Decisão nesta entrega |
|---|---|
| state-authority | Preservado: sinais em Engine/Items, decisão e renderização separados. |
| conditional-steps | Adaptado: facção/nível e objetivo ativo governam destaque; não há roteiro. |
| parallel-objectives | Preservado: múltiplos objetivos de itens/NPCs; nenhuma conclusão manual falsa. |
| event-lifecycle | Preservado: eventos, ticker único e limpeza na saída. |
| recover-next-action | Adaptado: reconcilia quest/inventário atual após reload, sem replay de etapas. |
| guide-choice | Não aplicável: produto não seleciona guia de leveling. |
| navigation-priority | Não aplicável: não introduz navegação/pathfinding neste destaque visual. |
| navigation-confidence | Adaptado: não promete aura3D/alcance além das placas acessíveis. |
| recoverable-ui | Mantido: controles por personagem, abertura/fechamento e aliases explícitos. |
| bounded-views | Mantido: pools limitados e liberação de destaques obsoletos. |
| versioned-data | Mantido: dados e módulo separados, build/interface declarados, evidência parcial. |
| economical-feedback | Mantido: eventos agregados, reutilização de frames; sem aumento de polling por rebranding. |

Análise de padrões não certifica APIs nem autoriza copiar código/guias comerciais. Nenhuma referência proprietária foi incorporada.
