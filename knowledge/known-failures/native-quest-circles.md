# Recurso nativo de círculo de quest — AURANPC

Referência: UI Blizzard Forever bebcb6bf309cf41b41bd74f8ca651e6a105b2676, Nameplates.lua e CVarDocumentation.lua. `ShowQuestUnitCircles` permite gerenciar o indicador nativo; não é API de criar aura3D arbitrária. Cor, movimento, seleção de NPC e visibilidade em instâncias precisam de validação no cliente. Não usar screenshot de painel/mock como prova de aura no mundo.

Respeitar flags public/locked/secure/readOnly; nunca registrar CVar faltante. Guardar valor original antes da alteração, confirmar readback, restaurar somente alteração própria e ceder controle a conflito externo. Em combate adiar escrita; no reload preservar proprietário por GUID. Não comparar valores secretos nem inferir todos os NPCs de quests a partir de UnitIsQuestBoss.

Pesquisa/contrato: research/AURANPC/RESEARCH.md e ACCEPTANCE.md. Nenhum teste no jogo realizado nesta candidata.
